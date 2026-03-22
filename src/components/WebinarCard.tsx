'use client';

import { Webinar, useStore } from '@/lib/store';
import { StatusBadge } from './StatusBadge';
import { formatDate } from '@/lib/utils';
import { Calendar, Users } from 'lucide-react';
import Image from 'next/image';
import { motion } from 'framer-motion';

export function WebinarCard({ webinar, onEnroll }: { webinar: Webinar; onEnroll?: (id: string) => void }) {
  const enrollments = useStore((state) => state.enrollments);
  const user = useStore((state) => state.user);
  
  const enrollment = user ? enrollments.find(e => e.webinarId === webinar.id && e.userId === user.id) : null;
  const isEnrolled = !!enrollment;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      className="group bg-white dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-xl hover:border-blue-400 dark:hover:border-blue-500/50 transition-all duration-300"
    >
      <div className="relative h-48 overflow-hidden">
        <Image 
          src={webinar.thumbnail} 
          alt={webinar.title} 
          fill 
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-4 left-4">
          <StatusBadge type={webinar.status} />
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm mb-3">
          <Calendar size={14} className="text-blue-500" />
          {formatDate(webinar.date)}
        </div>
        
        <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {webinar.title}
        </h3>
        
        <p className="text-slate-600 dark:text-slate-400 text-sm mb-6 line-clamp-2">
          {webinar.description}
        </p>
        
        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Users size={14} />
            <span>1.2k attending</span>
          </div>
          
          <button
            onClick={() => onEnroll?.(webinar.id)}
            disabled={isEnrolled || webinar.status === 'completed'}
            className={cn(
              "px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-300 transform active:scale-95 shadow-md",
              isEnrolled
                ? "bg-slate-100 dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700 cursor-not-allowed"
                : webinar.status === 'completed'
                ? "bg-slate-50 dark:bg-slate-900 text-slate-400 border border-slate-100 dark:border-slate-800 cursor-not-allowed shadow-none"
                : "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20 hover:shadow-blue-500/40"
            )}
          >
            {isEnrolled ? (
              <span className="flex items-center gap-1.5 ">
                Enrolled
              </span>
            ) : webinar.status === 'completed' ? 'Finished' : 'Enroll Now'}
          </button>
        </div>
      </div>
    </motion.div>
  );
}

import { cn } from '@/lib/utils';
