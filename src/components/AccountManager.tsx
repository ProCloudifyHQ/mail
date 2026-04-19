import React, { useState } from 'react';
import { Mail, Shield, Server, Hash, Folder, X, AlertCircle, Save } from 'lucide-react';
import { Account } from '../types';

interface AccountManagerProps {
  onAdd: (account: Omit<Account, 'id'>) => void;
  onCancel: () => void;
}

export default function AccountManager({ onAdd, onCancel }: AccountManagerProps) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    host: '',
    port: '993',
    secure: true,
    folder_name: ''
  });

  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password || !formData.host || !formData.folder_name) {
      setError('Please fill in all required fields');
      return;
    }
    
    onAdd({
      ...formData,
      port: parseInt(formData.port),
      secure: formData.secure
    });
  };

  return (
    <div className="flex-1 bg-natural-bg flex items-start justify-center p-8 overflow-y-auto">
      <div className="max-w-2xl w-full bg-white rounded-3xl shadow-sm border border-natural-border overflow-hidden">
        <div className="p-8 border-b border-natural-border flex items-center justify-between bg-natural-ui/50">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-natural-ink font-serif">Add Email Account</h2>
            <p className="text-xs font-bold uppercase tracking-widest text-natural-muted">Connect a new inbox to your dashboard</p>
          </div>
          <button onClick={onCancel} className="p-2 hover:bg-natural-border/30 rounded-full text-natural-muted transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          {error && (
            <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 animate-in fade-in slide-in-from-top-2 shadow-sm">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="space-y-4">
                <label className="text-[10px] font-bold text-natural-muted uppercase tracking-widest px-1">Identity</label>
                <div className="space-y-3">
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-natural-muted group-focus-within:text-natural-accent transition-colors" />
                    <input
                      type="email"
                      placeholder="Email Address"
                      className="w-full bg-natural-ui border border-natural-border rounded-2xl py-3.5 pl-12 pr-4 text-sm focus:bg-white focus:ring-4 focus:ring-natural-accent/10 focus:border-natural-accent transition-all outline-none text-natural-ink placeholder:text-natural-muted"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                  <div className="relative group">
                    <Shield className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-natural-muted group-focus-within:text-natural-accent transition-colors" />
                    <input
                      type="password"
                      placeholder="App Password"
                      className="w-full bg-natural-ui border border-natural-border rounded-2xl py-3.5 pl-12 pr-4 text-sm focus:bg-white focus:ring-4 focus:ring-natural-accent/10 focus:border-natural-accent transition-all outline-none text-natural-ink placeholder:text-natural-muted"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    />
                  </div>
                  <div className="relative group">
                    <Folder className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-natural-muted group-focus-within:text-natural-accent transition-colors" />
                    <input
                      type="text"
                      placeholder="Folder Name (e.g. Work Mail)"
                      className="w-full bg-natural-ui border border-natural-border rounded-2xl py-3.5 pl-12 pr-4 text-sm focus:bg-white focus:ring-4 focus:ring-natural-accent/10 focus:border-natural-accent transition-all outline-none text-natural-ink placeholder:text-natural-muted"
                      value={formData.folder_name}
                      onChange={(e) => setFormData({ ...formData, folder_name: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-4">
                <label className="text-[10px] font-bold text-natural-muted uppercase tracking-widest px-1">IMAP Settings</label>
                <div className="space-y-3">
                  <div className="relative group">
                    <Server className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-natural-muted group-focus-within:text-natural-accent transition-colors" />
                    <input
                      type="text"
                      placeholder="IMAP Server (e.g. imap.gmail.com)"
                      className="w-full bg-natural-ui border border-natural-border rounded-2xl py-3.5 pl-12 pr-4 text-sm focus:bg-white focus:ring-4 focus:ring-natural-accent/10 focus:border-natural-accent transition-all outline-none text-natural-ink placeholder:text-natural-muted"
                      value={formData.host}
                      onChange={(e) => setFormData({ ...formData, host: e.target.value })}
                    />
                  </div>
                  <div className="relative group">
                    <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-natural-muted group-focus-within:text-natural-accent transition-colors" />
                    <input
                      type="text"
                      placeholder="Port (Default: 993)"
                      className="w-full bg-natural-ui border border-natural-border rounded-2xl py-3.5 pl-12 pr-4 text-sm focus:bg-white focus:ring-4 focus:ring-natural-accent/10 focus:border-natural-accent transition-all outline-none text-natural-ink placeholder:text-natural-muted"
                      value={formData.port}
                      onChange={(e) => setFormData({ ...formData, port: e.target.value })}
                    />
                  </div>
                  <div className="flex items-center gap-3 p-2 bg-natural-ui rounded-2xl border border-natural-border/50">
                    <input
                      type="checkbox"
                      id="secure"
                      className="w-5 h-5 rounded-md border-natural-border text-natural-accent focus:ring-natural-accent/20 transition-all"
                      checked={formData.secure}
                      onChange={(e) => setFormData({ ...formData, secure: e.target.checked })}
                    />
                    <label htmlFor="secure" className="text-xs font-bold text-natural-muted uppercase tracking-tight cursor-pointer">
                      Secure SSL/TLS
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 flex items-center gap-4">
            <button
              type="submit"
              className="flex-1 bg-natural-accent hover:bg-natural-accent/90 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-natural-accent/20 active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <Save className="w-5 h-5" />
              Save Account
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="px-8 border border-natural-border hover:bg-natural-ui text-natural-ink-light font-bold py-4 rounded-2xl transition-all active:scale-[0.98]"
            >
              Cancel
            </button>
          </div>
        </form>

        <div className="p-8 bg-natural-ui/30 border-t border-natural-border/50">
          <p className="text-[10px] font-bold text-natural-muted text-center leading-relaxed uppercase tracking-widest">
            App Passwords may be required for Gmail and modern providers.
          </p>
        </div>
      </div>
    </div>
  );
}
