import { Email, EmailDetail } from '../types';
import { Mail, Clock, User, Reply, Trash2, ArrowLeft, EyeOff } from 'lucide-react';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface EmailViewProps {
  email: Email | null;
  detail: EmailDetail | null;
  isLoading: boolean;
  onClose: () => void;
  onAction?: (action: 'markRead' | 'markUnread' | 'delete') => void;
}

export default function EmailView({ email, detail, isLoading, onClose, onAction }: EmailViewProps) {
  if (!email && !isLoading) {
    return (
      <div className="flex-1 bg-zinc-50 flex items-center justify-center p-12">
        <div className="max-w-sm text-center space-y-6">
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto shadow-sm border border-zinc-200">
            <Mail className="w-8 h-8 text-zinc-400" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-zinc-900 tracking-tight">Select a message</h2>
            <p className="text-sm text-zinc-500 font-medium leading-relaxed">
              Choose an email from the list on the left to read its contents and manage your messages.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-white flex flex-col h-full relative overflow-hidden">
      <div className="p-4 border-b border-zinc-200 flex items-center justify-between bg-white z-10 hidden md:flex">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={onClose} className="md:hidden">
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <Badge variant="secondary" className="px-3 flex items-center gap-1.5 h-7 shadow-sm">
            <Mail className="w-3.5 h-3.5" />
            {email?.folderName}
          </Badge>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" title="Reply">
            <Reply className="w-4 h-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            title="Mark as Unread"
            onClick={() => onAction && onAction('markUnread')}
          >
            <EyeOff className="w-4 h-4" />
          </Button>
          <Separator orientation="vertical" className="h-6 mx-2 bg-zinc-200" />
          <Button 
            variant="ghost" 
            size="icon" 
            className="hover:text-red-500 hover:bg-red-50" 
            title="Move to Trash"
            onClick={() => {
              if (confirm('Move this message to trash?')) {
                onAction && onAction('delete');
              }
            }}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-6 md:p-12 space-y-8">
          {/* Header */}
          <div className="space-y-6">
            <h1 className="text-2xl md:text-3xl font-bold text-zinc-900 tracking-tight">
              {email?.subject || '(No Subject)'}
            </h1>
            
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-zinc-100 rounded-full flex items-center justify-center shrink-0 border border-zinc-200">
                <User className="w-5 h-5 text-zinc-500" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-4 mb-0.5">
                  <h3 className="text-base font-bold text-zinc-900 truncate">
                    {email?.fromName || email?.from}
                  </h3>
                  <div className="flex items-center gap-1.5 text-zinc-500 shrink-0">
                    <Clock className="w-3.5 h-3.5" />
                    <span className="text-xs font-medium">
                      {email && format(new Date(email.date), 'MMM d, yyyy · HH:mm')}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-zinc-500">{email?.from}</p>
                  <span className="text-[10px] font-bold text-zinc-400 bg-zinc-100 px-1.5 py-0.5 rounded">TO ME</span>
                </div>
              </div>
            </div>
          </div>

          <Separator className="bg-zinc-200" />

          {/* Content */}
          <div className="relative min-h-[400px]">
            <AnimatePresence mode="wait">
              {isLoading ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4 py-4"
                >
                  <div className="h-4 bg-zinc-100 rounded-full w-3/4 animate-pulse" />
                  <div className="h-4 bg-zinc-100 rounded-full w-1/2 animate-pulse" />
                  <div className="h-4 bg-zinc-100 rounded-full w-2/3 animate-pulse" />
                  <div className="h-4 bg-zinc-100 rounded-full w-1/4 animate-pulse mt-8" />
                  <div className="h-4 bg-zinc-100 rounded-full w-full animate-pulse" />
                </motion.div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="prose prose-zinc max-w-none prose-sm sm:prose-base overflow-hidden"
                >
                  {detail?.html ? (
                    <div 
                      dangerouslySetInnerHTML={{ __html: detail.html }} 
                      className="text-zinc-800 leading-relaxed overflow-x-auto"
                    />
                  ) : (
                    <pre className="whitespace-pre-wrap font-sans text-zinc-800 leading-relaxed text-sm">
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
