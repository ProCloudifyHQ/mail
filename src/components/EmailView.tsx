import { Email, EmailDetail } from '../types';
import { Mail, Clock, User, Reply, Trash2, ArrowLeft, Maximize2 } from 'lucide-react';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'motion/react';

interface EmailViewProps {
  email: Email | null;
  detail: EmailDetail | null;
  isLoading: boolean;
  onClose: () => void;
}

export default function EmailView({ email, detail, isLoading, onClose }: EmailViewProps) {
  if (!email && !isLoading) {
    return (
      <div className="flex-1 bg-natural-bg flex items-center justify-center p-12">
        <div className="max-w-sm text-center space-y-6">
          <div className="w-24 h-24 bg-white rounded-[2rem] flex items-center justify-center mx-auto shadow-sm border border-natural-border ring-8 ring-natural-ui/50">
            <Mail className="w-10 h-10 text-natural-muted" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-natural-ink font-serif">Select a message</h2>
            <p className="text-sm text-natural-muted font-medium leading-relaxed">
              Choose an email from the list on the left to read its contents and manage your messages.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-natural-card flex flex-col h-full relative overflow-hidden">
      <div className="p-4 border-b border-natural-border flex items-center justify-between bg-white/50 backdrop-blur-md z-10">
        <div className="flex items-center gap-2">
          <button 
            onClick={onClose}
            className="p-2 hover:bg-natural-ui rounded-xl text-natural-muted lg:hidden"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 px-3 py-1 bg-natural-ui text-natural-accent rounded-full border border-natural-border/50 shadow-sm">
            <Mail className="w-3.5 h-3.5" />
            <span className="text-[10px] font-bold uppercase tracking-widest">{email?.folderName}</span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button className="p-2.5 hover:bg-natural-ui rounded-xl text-natural-muted transition-all hover:text-natural-ink">
            <Reply className="w-4.5 h-4.5" />
          </button>
          <button className="p-2.5 hover:bg-natural-ui rounded-xl text-natural-muted transition-all hover:text-red-500">
            <Trash2 className="w-4.5 h-4.5" />
          </button>
          <div className="w-px h-5 bg-natural-border mx-3" />
          <button className="p-2.5 hover:bg-natural-ui rounded-xl text-natural-muted transition-all hover:text-natural-ink">
            <Maximize2 className="w-4.5 h-4.5" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-12 space-y-12">
          {/* Header */}
          <div className="space-y-8">
            <h1 className="text-4xl font-bold text-natural-ink leading-[1.1] font-serif">
              {email?.subject || '(No Subject)'}
            </h1>
            
            <div className="flex items-start gap-5">
              <div className="w-14 h-14 bg-natural-ui rounded-2xl flex items-center justify-center shrink-0 border border-natural-border shadow-sm ring-4 ring-natural-ui/50">
                <User className="w-7 h-7 text-natural-accent" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-4 mb-1.5">
                  <h3 className="text-lg font-bold text-natural-ink truncate">
                    {email?.fromName || email?.from}
                  </h3>
                  <div className="flex items-center gap-2 text-natural-muted shrink-0">
                    <Clock className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-wider">
                      {email && format(new Date(email.date), 'MMM d, yyyy · HH:mm')}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-natural-muted">{email?.from}</p>
                  <span className="text-[10px] font-bold text-natural-accent/50">TO ME</span>
                </div>
              </div>
            </div>
          </div>

          <div className="h-px bg-natural-border/50" />

          {/* Content */}
          <div className="relative min-h-[400px]">
            <AnimatePresence mode="wait">
              {isLoading ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6 py-4"
                >
                  <div className="h-4 bg-natural-ui rounded-full w-3/4 animate-pulse" />
                  <div className="h-4 bg-natural-ui rounded-full w-1/2 animate-pulse" />
                  <div className="h-4 bg-natural-ui rounded-full w-2/3 animate-pulse" />
                  <div className="h-4 bg-natural-ui rounded-full w-1/4 animate-pulse mt-8" />
                  <div className="h-4 bg-natural-ui rounded-full w-full animate-pulse" />
                </motion.div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="prose prose-natural max-w-none prose-sm sm:prose-base overflow-hidden"
                >
                  {detail?.html ? (
                    <div 
                      dangerouslySetInnerHTML={{ __html: detail.html }} 
                      className="email-content"
                    />
                  ) : (
                    <pre className="whitespace-pre-wrap font-sans text-natural-ink-light leading-relaxed">
                      {detail?.text || 'No content available'}
                    </pre>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
