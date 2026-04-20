/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import EmailList from './components/EmailList';
import EmailView from './components/EmailView';
import AccountManager from './components/AccountManager';
import Login from './components/Login';
import { Account, Email, EmailDetail } from './types';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [accessKey, setAccessKey] = useState<string>(() => localStorage.getItem('accessKey') || '');
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [emails, setEmails] = useState<Email[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<number | 'all' | 'settings'>('all');
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [emailDetail, setEmailDetail] = useState<EmailDetail | null>(null);
  const [isLoadingEmails, setIsLoadingEmails] = useState(false);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  const [isAddingAccount, setIsAddingAccount] = useState(false);

  const fetchAccounts = useCallback(async () => {
    if (!accessKey) return;
    try {
      const res = await fetch('/api/accounts', {
        headers: { 'x-access-key': accessKey }
      });
      if (!res.ok) {
        if (res.status === 401) {
          setAccessKey('');
          localStorage.removeItem('accessKey');
        }
        throw new Error('Unauthorized');
      }
      const data = await res.json();
      setAccounts(data);
    } catch (err) {
      console.error('Failed to fetch accounts', err);
    }
  }, [accessKey]);

  const fetchEmails = useCallback(async (folder: number | 'all') => {
    if (!accessKey) return;
    setIsLoadingEmails(true);
    try {
      const url = folder === 'all' ? '/api/emails' : `/api/emails?accountId=${folder}`;
      const res = await fetch(url, {
        headers: { 'x-access-key': accessKey }
      });
      if (!res.ok) throw new Error('Failed');
      const data = await res.json();
      setEmails(data);
    } catch (err) {
      console.error('Failed to fetch emails', err);
    } finally {
      setIsLoadingEmails(false);
    }
  }, [accessKey]);

  const fetchEmailDetail = async (email: Email) => {
    if (!accessKey) return;
    setSelectedEmail(email);
    setIsLoadingDetail(true);
    
    // Optimistically mark as seen
    if (!email.seen) {
      setEmails(prev => prev.map(e => e.id === email.id ? { ...e, seen: true } : e));
      handleEmailAction(email, 'markRead');
    }

    try {
      const res = await fetch(`/api/emails/${email.accountId}/${email.uid}`, {
        headers: { 'x-access-key': accessKey }
      });
      if (!res.ok) throw new Error('Failed');
      const data = await res.json();
      setEmailDetail(data);
    } catch (err) {
      console.error('Failed to fetch email detail', err);
    } finally {
      setIsLoadingDetail(false);
    }
  };

  const handleEmailAction = async (email: Email, action: 'markRead' | 'markUnread' | 'delete') => {
    if (!accessKey) return;
    try {
      const res = await fetch(`/api/emails/${email.accountId}/${email.uid}/action`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-access-key': accessKey
        },
        body: JSON.stringify({ action })
      });
      if (res.ok) {
        if (action === 'delete') {
          setEmails(prev => prev.filter(e => e.id !== email.id));
          if (selectedEmail?.id === email.id) setSelectedEmail(null);
        } else if (action === 'markUnread') {
          setEmails(prev => prev.map(e => e.id === email.id ? { ...e, seen: false } : e));
        }
      }
    } catch (err) {
      console.error('Action failed', err);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  useEffect(() => {
    if (selectedFolder !== 'settings') {
      fetchEmails(selectedFolder as any);
    }
  }, [selectedFolder, fetchEmails]);

  const handleAddAccount = async (accountData: Omit<Account, 'id'>) => {
    if (!accessKey) return;
    try {
      const res = await fetch('/api/accounts', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-access-key': accessKey
        },
        body: JSON.stringify(accountData),
      });
      if (res.ok) {
        setIsAddingAccount(false);
        fetchAccounts();
      }
    } catch (err) {
      console.error('Failed to add account', err);
    }
  };

  const handleUpdateAccount = async (id: number, accountData: Omit<Account, 'id'>) => {
    if (!accessKey) return;
    try {
      const res = await fetch(`/api/accounts/${id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'x-access-key': accessKey
        },
        body: JSON.stringify(accountData),
      });
      if (res.ok) {
        fetchAccounts();
      }
    } catch (err) {
      console.error('Failed to update account', err);
    }
  };

  const handleDeleteAccount = async (id: number) => {
    if (!accessKey) return;
    try {
      await fetch(`/api/accounts/${id}`, { 
        method: 'DELETE',
        headers: { 'x-access-key': accessKey }
      });
      fetchAccounts();
      if (selectedFolder === id) setSelectedFolder('all');
    } catch (err) {
      console.error('Failed to delete account', err);
    }
  };

  const handleLogin = (key: string) => {
    localStorage.setItem('accessKey', key);
    setAccessKey(key);
  };

  if (!accessKey) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="flex h-screen w-full bg-white overflow-hidden selection:bg-blue-100 selection:text-blue-900">
      <Sidebar
        accounts={accounts}
        selectedFolder={selectedFolder}
        onSelectFolder={(folder) => {
          setSelectedFolder(folder);
          setIsAddingAccount(false);
          setSelectedEmail(null);
        }}
        onAddAccount={() => setIsAddingAccount(true)}
      />

      <main className="flex-1 flex flex-col overflow-hidden bg-white">
        <div className="flex-1 flex overflow-hidden">
          <AnimatePresence mode="wait">
            {isAddingAccount || selectedFolder === 'settings' ? (
              <motion.div 
                key="account-manager"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex-1 overflow-hidden bg-zinc-50/50"
              >
                <AccountManager 
                  accounts={accounts}
                  onAdd={handleAddAccount} 
                  onUpdate={handleUpdateAccount}
                  onDelete={handleDeleteAccount}
                  onCancel={() => {
                    setIsAddingAccount(false);
                    setSelectedFolder('all');
                  }} 
                />
              </motion.div>
            ) : (
              <>
                <EmailList
                  emails={emails}
                  selectedEmailId={selectedEmail?.id || null}
                  onSelectEmail={fetchEmailDetail}
                  isLoading={isLoadingEmails}
                  onRefresh={() => fetchEmails(selectedFolder as any)}
                />
                <EmailView
                  email={selectedEmail}
                  detail={emailDetail}
                  isLoading={isLoadingDetail}
                  onClose={() => setSelectedEmail(null)}
                  onAction={(action) => selectedEmail && handleEmailAction(selectedEmail, action)}
                />
              </>
            )}
          </AnimatePresence>
        </div>

        <footer className="px-6 py-3 bg-zinc-50 border-t border-zinc-200 flex items-center justify-between text-[11px] font-medium text-zinc-500">
          <div className="flex gap-6">
            <p>© 2026 Mailbox Dashboard</p>
            <a href="#" className="hover:text-zinc-900 transition-colors">Privacy</a>
            <a href="#" className="hover:text-zinc-900 transition-colors">Terms</a>
          </div>
          <div className="flex items-center gap-6">
            <p>{accounts.length} Active Connections</p>
            <p>Storage: 1.2 GB used</p>
          </div>
        </footer>
      </main>
    </div>
  );
}

