import { Mail, Inbox, Plus, Folder, Settings, X, Trash2 } from 'lucide-react';
import { Account } from '../types';
import { motion } from 'motion/react';

interface SidebarProps {
  accounts: Account[];
  selectedFolder: number | 'all' | 'settings';
  onSelectFolder: (folder: number | 'all' | 'settings') => void;
  onAddAccount: () => void;
  onDeleteAccount: (id: number) => void;
}

export default function Sidebar({ 
  accounts, 
  selectedFolder, 
  onSelectFolder, 
  onAddAccount,
  onDeleteAccount
}: SidebarProps) {
  return (
    <aside className="w-64 bg-natural-ui border-r border-natural-border flex flex-col h-full text-natural-ink-light">
      <div className="p-8 flex items-center gap-3">
        <div className="w-8 h-8 bg-natural-accent rounded-lg flex items-center justify-center shadow-sm">
          <Mail className="w-5 h-5 text-white" />
        </div>
        <h1 className="font-bold text-natural-ink text-lg tracking-tight font-serif">Email Hub</h1>
      </div>

      <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
        <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-natural-muted">Main View</div>
        <button
          onClick={() => onSelectFolder('all')}
          className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-300 font-medium ${
            selectedFolder === 'all' 
              ? 'bg-white text-natural-ink shadow-sm border border-natural-border' 
              : 'hover:bg-natural-border/50 text-natural-muted hover:text-natural-ink-light border border-transparent'
          }`}
        >
          <Inbox className={`w-4 h-4 ${selectedFolder === 'all' ? 'text-natural-accent' : ''}`} />
          <span className="text-sm">All Inbox</span>
        </button>

        <div className="pt-8 pb-2 px-3">
          <h2 className="text-[10px] font-bold uppercase tracking-widest text-natural-muted">Custom Folders</h2>
        </div>

        {accounts.map((account, idx) => (
          <div key={account.id} className="group flex items-center gap-1">
            <button
              onClick={() => onSelectFolder(account.id)}
              className={`flex-1 flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-300 font-medium ${
                selectedFolder === account.id 
                  ? 'bg-white text-natural-ink shadow-sm border border-natural-border' 
                  : 'hover:bg-natural-border/50 text-natural-muted hover:text-natural-ink-light border border-transparent'
              }`}
            >
              <div className={`w-2 h-2 rounded-full ${idx % 2 === 0 ? 'bg-orange-400' : 'bg-blue-400'}`} />
              <span className="text-sm truncate">{account.folder_name}</span>
            </button>
            <button 
              onClick={() => onDeleteAccount(account.id)}
              className="opacity-0 group-hover:opacity-100 p-1.5 hover:text-red-500 transition-opacity"
              title="Delete account"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}

        <button
          onClick={onAddAccount}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-natural-accent hover:text-natural-ink hover:bg-white hover:shadow-sm border border-transparent hover:border-natural-border transition-all mt-4 font-medium"
        >
          <Plus className="w-4 h-4" />
          <span className="text-sm">Add Account</span>
        </button>
      </nav>

      <div className="p-4 border-t border-natural-border flex flex-col gap-4">
        <div className="p-4 bg-natural-border/50 rounded-2xl">
          <p className="text-[10px] uppercase font-bold text-natural-muted mb-1">Backup Status</p>
          <div className="flex items-center gap-2 text-[10px] font-bold text-natural-ink-light">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
            SYCHRONIZED
          </div>
        </div>
        <button
          onClick={() => onSelectFolder('settings')}
          className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-300 font-medium ${
            selectedFolder === 'settings' 
              ? 'bg-white text-natural-ink shadow-sm border border-natural-border' 
              : 'hover:bg-natural-border/50 text-natural-muted hover:text-natural-ink-light border border-transparent'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span className="text-sm">Settings</span>
        </button>
      </div>
    </aside>
  );
}
