import { Mail, Inbox, Plus, Folder, Settings } from 'lucide-react';
import { Account } from '../types';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SidebarProps {
  accounts: Account[];
  selectedFolder: number | 'all' | 'settings';
  onSelectFolder: (folder: number | 'all' | 'settings') => void;
  onAddAccount: () => void;
}

export default function Sidebar({ 
  accounts, 
  selectedFolder, 
  onSelectFolder, 
  onAddAccount
}: SidebarProps) {
  return (
    <aside className="w-64 bg-zinc-50 border-r border-zinc-200 flex flex-col h-full text-zinc-600">
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 bg-zinc-900 rounded-lg flex items-center justify-center shadow-sm">
          <Mail className="w-4 h-4 text-white" />
        </div>
        <h1 className="font-bold text-zinc-900 tracking-tight">Mailbox</h1>
      </div>

      <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
        <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-zinc-500">Main View</div>
        <button
          onClick={() => onSelectFolder('all')}
          className={cn(
            "w-full flex items-center gap-3 px-3 py-2 rounded-md transition-all text-sm font-medium",
            selectedFolder === 'all' 
              ? "bg-white text-zinc-900 shadow-sm border border-zinc-200" 
              : "hover:bg-zinc-100/80 text-zinc-500 hover:text-zinc-900 border border-transparent"
          )}
        >
          <Inbox className={cn("w-4 h-4", selectedFolder === 'all' && "text-zinc-900")} />
          <span>All Inbox</span>
        </button>

        <div className="pt-6 pb-2 px-3">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Custom Folders</h2>
        </div>

        {accounts.map((account, idx) => (
          <button
            key={account.id}
            onClick={() => onSelectFolder(account.id)}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2 rounded-md transition-all text-sm font-medium",
              selectedFolder === account.id 
                ? "bg-white text-zinc-900 shadow-sm border border-zinc-200" 
                : "hover:bg-zinc-100/80 text-zinc-500 hover:text-zinc-900 border border-transparent"
            )}
          >
            <Folder className="w-4 h-4" />
            <span className="truncate">{account.folder_name}</span>
          </button>
        ))}

      </nav>

      <div className="p-4 border-t border-zinc-200 flex flex-col gap-2">
        <Button
          variant="outline"
          className="w-full justify-start text-zinc-600 bg-white"
          onClick={onAddAccount}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Account
        </Button>
        <Button
          variant={selectedFolder === 'settings' ? 'secondary' : 'ghost'}
          className={cn("w-full justify-start", selectedFolder === 'settings' ? "bg-zinc-200/50 font-medium text-zinc-900" : "text-zinc-500 font-medium")}
          onClick={() => onSelectFolder('settings')}
        >
          <Settings className="w-4 h-4 mr-2" />
          Settings
        </Button>
      </div>
    </aside>
  );
}
