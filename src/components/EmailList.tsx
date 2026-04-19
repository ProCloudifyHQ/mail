import { Email } from '../types';
import { Mail, Search, RefreshCw, Circle, Inbox } from 'lucide-react';
import { format } from 'date-fns';

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
  return (
    <div className="w-[420px] flex flex-col h-full bg-natural-card border-r border-natural-border/50">
      <div className="p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-serif text-natural-ink">Inbox</h2>
            <p className="text-[10px] font-bold uppercase tracking-widest text-natural-muted mt-1">
              {isLoading ? 'Checking for mail...' : `${emails.length} Messages`}
            </p>
          </div>
          <button 
            onClick={onRefresh}
            disabled={isLoading}
            className="p-2.5 bg-natural-ui hover:bg-natural-border/50 rounded-full transition-all text-natural-ink-light disabled:opacity-50 shadow-sm"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-natural-muted group-focus-within:text-natural-accent transition-colors" />
          <input
            type="text"
            placeholder="Search messages..."
            className="w-full bg-natural-ui border-none rounded-full py-3 pl-12 pr-4 text-sm focus:ring-1 focus:ring-natural-accent transition-all outline-none text-natural-ink placeholder:text-natural-muted"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-3">
        {isLoading && emails.length === 0 && (
          <div className="p-12 text-center space-y-4">
            <div className="w-16 h-16 bg-natural-ui rounded-full flex items-center justify-center mx-auto">
              <Mail className="w-8 h-8 text-natural-muted" />
            </div>
            <p className="text-sm text-natural-muted font-medium">Fetching your inbox...</p>
          </div>
        )}

        {!isLoading && emails.length === 0 && (
          <div className="p-12 text-center space-y-4">
            <div className="w-16 h-16 bg-natural-ui rounded-full flex items-center justify-center mx-auto">
              <Inbox className="w-8 h-8 text-natural-muted" />
            </div>
            <p className="text-sm text-natural-ink font-bold">No messages found</p>
            <p className="text-xs text-natural-muted">Add an account to start receiving mail.</p>
          </div>
        )}

        {emails.map((email, idx) => (
          <button
            key={email.id}
            onClick={() => onSelectEmail(email)}
            className={`w-full text-left p-5 rounded-2xl border transition-all relative group flex items-start gap-4 ${
              selectedEmailId === email.id 
                ? 'bg-white border-natural-accent shadow-md' 
                : 'bg-white border-transparent shadow-sm hover:shadow-md hover:border-natural-border'
            }`}
          >
            <div className="w-10 h-10 rounded-full bg-natural-ui border border-natural-border flex items-center justify-center font-bold text-natural-accent shrink-0">
              {(email.fromName || email.from)[0].toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 mb-1">
                <div className="flex items-center gap-2 overflow-hidden">
                  <h3 className={`text-sm truncate ${!email.seen ? 'font-bold text-natural-ink' : 'font-semibold text-natural-ink-light'}`}>
                    {email.fromName || email.from}
                  </h3>
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-tighter ${
                    idx % 2 === 0 ? 'bg-orange-50 text-orange-600' : 'bg-blue-50 text-blue-600'
                  }`}>
                    {email.folderName}
                  </span>
                </div>
                <span className="text-[10px] font-bold text-natural-muted shrink-0">
                  {format(new Date(email.date), 'HH:mm')}
                </span>
              </div>
              <p className={`text-xs mb-1 truncate ${!email.seen ? 'font-bold text-natural-ink' : 'text-natural-ink-light'}`}>
                {email.subject || '(No Subject)'}
              </p>
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] text-natural-muted truncate flex-1">
                  {email.snippet || 'No preview available'}
                </span>
                {!email.seen && (
                  <div className="w-1.5 h-1.5 rounded-full bg-natural-accent shadow-sm shadow-natural-accent/40" />
                )}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
