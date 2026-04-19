/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import EmailList from './components/EmailList';
import EmailView from './components/EmailView';
import AccountManager from './components/AccountManager';
import { Account, Email, EmailDetail } from './types';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [emails, setEmails] = useState<Email[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<number | 'all' | 'settings'>('all');
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [emailDetail, setEmailDetail] = useState<EmailDetail | null>(null);
  const [isLoadingEmails, setIsLoadingEmails] = useState(false);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  const [isAddingAccount, setIsAddingAccount] = useState(false);

  const fetchAccounts = useCallback(async () => {
    try {
      const res = await fetch('/api/accounts');
      const data = await res.json();
      setAccounts(data);
    } catch (err) {
      console.error('Failed to fetch accounts', err);
    }
  }, []);

  const fetchEmails = useCallback(async (folder: number | 'all') => {
    setIsLoadingEmails(true);
    try {
      const url = folder === 'all' ? '/api/emails' : `/api/emails?accountId=${folder}`;
      const res = await fetch(url);
      const data = await res.json();
      setEmails(data);
    } catch (err) {
      console.error('Failed to fetch emails', err);
    } finally {
      setIsLoadingEmails(false);
    }
  }, []);

  const fetchEmailDetail = async (email: Email) => {
    setSelectedEmail(email);
    setIsLoadingDetail(true);
    try {
      const res = await fetch(`/api/emails/${email.accountId}/${email.uid}`);
      const data = await res.json();
      setEmailDetail(data);
    } catch (err) {
      console.error('Failed to fetch email detail', err);
    } finally {
      setIsLoadingDetail(false);
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
    try {
      const res = await fetch('/api/accounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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

  const handleDeleteAccount = async (id: number) => {
    if (!confirm('Are you sure you want to delete this account?')) return;
    try {
      await fetch(`/api/accounts/${id}`, { method: 'DELETE' });
      fetchAccounts();
      if (selectedFolder === id) setSelectedFolder('all');
    } catch (err) {
      console.error('Failed to delete account', err);
    }
  };

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
        onDeleteAccount={handleDeleteAccount}
      />

      <main className="flex-1 flex flex-col overflow-hidden bg-natural-card">
        <div className="flex-1 flex overflow-hidden">
          <AnimatePresence mode="wait">
            {isAddingAccount || selectedFolder === 'settings' ? (
              <motion.div 
                key="account-manager"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex-1 overflow-hidden"
              >
                <AccountManager 
                  onAdd={handleAddAccount} 
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
                />
              </>
            )}
          </AnimatePresence>
        </div>

        {/* Footer from Design */}
        <footer className="px-8 py-4 bg-natural-ui border-t border-natural-border flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-natural-muted">
          <div className="flex gap-8">
            <p>© 2026 Email Hub Dashboard</p>
            <a href="#" className="hover:text-natural-ink transition-colors">Privacy</a>
            <a href="#" className="hover:text-natural-ink transition-colors">Terms</a>
          </div>
          <div className="flex items-center gap-6">
            <p>{accounts.length} Active Connections</p>
            <p>Cloud Storage: 1.2 GB used</p>
          </div>
        </footer>
      </main>
    </div>
  );
}

