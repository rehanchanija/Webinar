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
  lightModeOnly = false,
  maxWidth = 'sm'
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  title: string; 
  children: React.ReactNode;
  footer?: React.ReactNode;
  action?: React.ReactNode;
  lightModeOnly?: boolean;
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
              "relative w-full rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]",
              lightModeOnly ? "bg-white" : "bg-white dark:bg-slate-900",
              widths[maxWidth]
            )}
          >
            <div className="p-6 flex items-center justify-between shrink-0">
               <h3 className={cn(
                "text-xl font-bold leading-none",
                lightModeOnly ? "text-slate-900" : "text-slate-900 dark:text-slate-100"
              )}>
                {title}
              </h3>
              <div className="flex items-center gap-2">
                {action}
                <button 
                  onClick={onClose}
                  className={cn(
                    "p-2 rounded-full transition-colors",
                    lightModeOnly ? "hover:bg-slate-100 text-slate-500" : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400"
                  )}
                >
                  <X size={20} />
                </button>
              </div>
            </div>
            
            <div className={cn(
              "m-4 md:m-6 rounded-2xl border overflow-y-auto scrollbar-hide",
              lightModeOnly ? "border-slate-100 bg-white" : "border-slate-100 dark:border-slate-800"
            )}>
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
