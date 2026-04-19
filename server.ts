import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import cors from 'cors';
import fs from 'fs/promises';
import { ImapFlow } from 'imapflow';
import { simpleParser } from 'mailparser';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const DB_PATH = path.join(process.cwd(), 'emails.json');

// Helper to interact with JSON DB
async function getAccounts(): Promise<any[]> {
  try {
    const data = await fs.readFile(DB_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    if ((err as any).code === 'ENOENT') {
      return [];
    }
    throw err;
  }
}

async function saveAccounts(accounts: any[]) {
  await fs.writeFile(DB_PATH, JSON.stringify(accounts, null, 2), 'utf-8');
}

// API Routes
app.get('/api/accounts', async (req, res) => {
  try {
    const accounts = await getAccounts();
    const safeAccounts = accounts.map(acc => ({
      id: acc.id,
      email: acc.email,
      host: acc.host,
      port: acc.port,
      secure: acc.secure,
      folder_name: acc.folder_name
    }));
    res.json(safeAccounts);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/accounts', async (req, res) => {
  try {
    const { email, password, host, port, secure, folder_name } = req.body;
    const accounts = await getAccounts();
    
    // Auto-increment ID simply by finding max ID
    const nextId = accounts.length > 0 ? Math.max(...accounts.map(a => a.id)) + 1 : 1;
    
    accounts.push({
      id: nextId,
      email,
      password,
      host,
      port,
      secure: secure ? 1 : 0,
      folder_name
    });
    
    await saveAccounts(accounts);
    res.json({ id: nextId });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/accounts/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const accounts = await getAccounts();
    const newAccounts = accounts.filter(acc => acc.id !== id);
    
    await saveAccounts(newAccounts);
    res.json({ message: 'Deleted', changes: accounts.length - newAccounts.length });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Fetch emails for a specific account or all
app.get('/api/emails', async (req, res) => {
  try {
    const accountId = req.query.accountId ? parseInt(req.query.accountId as string, 10) : null;
    let accounts = await getAccounts();

    if (accountId) {
      accounts = accounts.filter(acc => acc.id === accountId);
    }

    const allEmails: any[] = [];

    for (const account of accounts) {
      try {
        const client = new ImapFlow({
          host: account.host,
          port: account.port,
          secure: account.secure === 1 || account.secure === true,
          auth: {
            user: account.email,
            pass: account.password
          },
          logger: false
        });

        await client.connect();

        let lock = await client.getMailboxLock('INBOX');
        try {
          const status = await client.status('INBOX', { messages: true });
          const totalMessages = status.messages || 0;
          const start = Math.max(1, totalMessages - 19);

          // Fetch last 20 emails
          const messages = await client.fetch(`${start}:*`, {
            envelope: true,
            source: false,
            uid: true,
            flags: true,
            internalDate: true,
            size: true
          });

          for await (let message of messages) {
            allEmails.push({
              uid: message.uid,
              id: `${account.id}-${message.uid}`,
              accountId: account.id,
              folderName: account.folder_name,
              accountEmail: account.email,
              subject: message.envelope.subject,
              from: message.envelope.from[0]?.address || 'Unknown',
              fromName: message.envelope.from[0]?.name || '',
              date: message.internalDate,
              seen: message.flags.has('\\Seen'),
              snippet: '' 
            });
          }
        } finally {
          lock.release();
        }
        await client.logout();
      } catch (e: any) {
        console.error(`Failed to fetch for ${account.email}:`, e.message);
      }
    }

    // Sort by date descending
    allEmails.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    res.json(allEmails);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Fetch detailed email content
app.get('/api/emails/:accountId/:uid', async (req, res) => {
  try {
    const accountId = parseInt(req.params.accountId, 10);
    const uid = req.params.uid;

    const accounts = await getAccounts();
    const account = accounts.find(acc => acc.id === accountId);

    if (!account) {
      res.status(500).json({ error: 'Account not found' });
      return;
    }

    const client = new ImapFlow({
      host: account.host,
      port: account.port,
      secure: account.secure === 1 || account.secure === true,
      auth: {
        user: account.email,
        pass: account.password
      },
      logger: false
    });

    await client.connect();
    let lock = await client.getMailboxLock('INBOX');
    try {
      const message = await client.fetchOne(uid, { source: true }, { uid: true });
      if (message && message.source) {
        const parsed = await simpleParser(message.source);
        res.json({
          subject: parsed.subject,
          from: parsed.from?.text,
          date: parsed.date,
          html: parsed.html || parsed.textAsHtml,
          text: parsed.text
        });
      } else {
        res.status(404).json({ error: 'Email not found' });
      }
    } finally {
      lock.release();
    }
    await client.logout();
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// Vite middleware
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
