'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Modal({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  footer,
  action,
  maxWidth = 'sm'
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  title: string; 
  children: React.ReactNode;
  footer?: React.ReactNode;
  action?: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl';
}) {
  const widths = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className={cn(
              "relative w-full bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]",
              widths[maxWidth]
            )}
          >
            <div className="p-6 flex items-center justify-between shrink-0">
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 leading-none">
                {title}
              </h3>
              <div className="flex items-center gap-2">
                {action}
                <button 
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
            
            <div className="m-4 md:m-6 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-y-auto scrollbar-hide">
              <div className="p-4 md:p-8">
                {children}
              </div>
            </div>
            
            {footer && (
              <div className="p-6 bg-slate-50/50 dark:bg-slate-800/20 flex justify-end gap-3 shrink-0">
                {footer}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
