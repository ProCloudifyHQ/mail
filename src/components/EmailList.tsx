import { useState, useMemo } from 'react';
import { Email } from '../types';
import { Search, RefreshCw, Inbox } from 'lucide-react';
import { format } from 'date-fns';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

interface EmailListProps {
  emails: Email[];
  selectedEmailId: string | null;
  onSelectEmail: (email: Email) => void;
  isLoading: boolean;
  onRefresh: () => void;
}

export default function EmailList({ 
  emails, 
  selectedEmailId, 
  onSelectEmail, 
  isLoading,
  onRefresh
}: EmailListProps) {
  const [search, setSearch] = useState('');
  const [folderFilter, setFolderFilter] = useState<string>('all');

  const uniqueFolders = useMemo(() => {
    const folders = new Set(emails.map(e => e.folderName));
    return Array.from(folders);
  }, [emails]);

  const filteredEmails = useMemo(() => {
    return emails.filter(email => {
      const matchSearch = email.subject.toLowerCase().includes(search.toLowerCase()) || 
                          email.from.toLowerCase().includes(search.toLowerCase());
      const matchFolder = folderFilter === 'all' || email.folderName === folderFilter;
      return matchSearch && matchFolder;
    });
  }, [emails, search, folderFilter]);

  return (
    <div className="w-[450px] flex flex-col h-full bg-white border-r">
      <div className="p-4 space-y-4 border-b bg-zinc-50/50">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-zinc-900 tracking-tight">Inbox</h2>
            <p className="text-xs text-zinc-500 font-medium">
              {isLoading ? 'Checking for mail...' : `${filteredEmails.length} Messages`}
            </p>
          </div>
          <Button variant="ghost" size="icon" onClick={onRefresh} disabled={isLoading}>
            <RefreshCw className={`w-4 h-4 text-zinc-600 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </div>

        <div className="flex gap-2">
          <Select value={folderFilter} onValueChange={setFolderFilter}>
            <SelectTrigger className="w-[140px] h-9 text-xs">
              <SelectValue placeholder="All Folders" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Folders</SelectItem>
              {uniqueFolders.map(folder => (
                <SelectItem key={folder} value={folder}>{folder}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="pl-8 h-9 text-xs w-full"
            />
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto w-full">
        {isLoading && emails.length === 0 && (
          <div className="p-12 text-center text-zinc-500">
            <RefreshCw className="w-6 h-6 mx-auto mb-4 animate-spin text-zinc-300" />
            <p className="text-sm font-medium">Fetching inbox...</p>
          </div>
        )}

        {!isLoading && filteredEmails.length === 0 && (
          <div className="p-12 text-center text-zinc-500">
            <Inbox className="w-8 h-8 mx-auto mb-4 text-zinc-300" />
            <p className="text-sm font-medium text-zinc-900">No messages found</p>
            <p className="text-xs mt-1">Try a different search or filter.</p>
          </div>
        )}

        <div className="flex flex-col">
          {filteredEmails.map((email) => (
            <div
              key={email.id}
              onClick={() => onSelectEmail(email)}
              className={`group flex items-center px-4 py-2 border-b border-zinc-100 cursor-pointer hover:bg-zinc-50 transition-colors ${
                selectedEmailId === email.id ? 'bg-zinc-100/50' : 'bg-transparent'
              }`}
            >
              <div className="flex-1 min-w-0 pr-4">
                <div className="flex items-center gap-2 mb-0.5">
                  {!email.seen && (
                    <div className="w-1.5 h-1.5 rounded-full bg-zinc-900 shrink-0" />
                  )}
                  <span className={`text-sm truncate ${!email.seen ? 'font-bold text-zinc-900' : 'font-medium text-zinc-600'}`}>
                    {email.fromName || email.from}
                  </span>
                </div>
                <p className={`text-[13px] truncate ${!email.seen ? 'font-semibold text-zinc-800' : 'text-zinc-500'}`}>
                  {email.subject || '(No Subject)'}
                </p>
              </div>
              <div className="flex flex-col items-end gap-1.5 shrink-0">
                <span className="text-xs text-zinc-400 font-medium whitespace-nowrap">
                  {format(new Date(email.date), 'MMM d, HH:mm')}
                </span>
                <Badge variant="outline" className="text-[9px] font-medium text-zinc-400 rounded-sm px-1 py-0 shadow-none border-zinc-200">
                  {email.folderName}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
