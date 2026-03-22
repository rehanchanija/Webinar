'use client';

import { useState, useMemo, useEffect } from 'react';
import { useStore, Webinar, WebinarStatus } from '@/lib/store';
import { WebinarCard } from '@/components/WebinarCard';
import { Modal } from '@/components/Modal';
import { Search, Filter, AlertCircle, CheckCircle2, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const router = useRouter();
  const { webinars, user, enroll } = useStore();
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | WebinarStatus>('all');
  const [selectedWebinar, setSelectedWebinar] = useState<Webinar | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [hasEnrolled, setHasEnrolled] = useState(false);

  useEffect(() => {
    if (!user) {
      router.replace('/login');
    }
  }, [user, router]);

  const filteredWebinars = useMemo(() => {
    return webinars.filter((w) => {
      const matchesSearch = w.title.toLowerCase().includes(search.toLowerCase()) || 
                           w.description.toLowerCase().includes(search.toLowerCase());
      const matchesFilter = activeFilter === 'all' || w.status === activeFilter;
      return matchesSearch && matchesFilter;
    });
  }, [webinars, search, activeFilter]);

  const handleEnrollClick = (id: string) => {
    const webinar = webinars.find(w => w.id === id);
    if (webinar) {
      setSelectedWebinar(webinar);
      setIsModalOpen(true);
      setHasEnrolled(false);
    }
  };

  const confirmEnrollment = () => {
    if (!selectedWebinar) return;
    setIsEnrolling(true);
    
    setTimeout(() => {
      enroll(selectedWebinar.id);
      setIsEnrolling(false);
      setHasEnrolled(true);
      
      // Close modal after success
      setTimeout(() => {
        setIsModalOpen(false);
        setHasEnrolled(false);
      }, 2000);
    }, 1500);
  };

  if (!user) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">
            Explore Webinars
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-lg">
            Level up your skills with live and on-demand sessions.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="relative group flex-1 sm:w-64">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
            <input
              type="text"
              placeholder="Search sessions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none"
            />
          </div>
          
          <div className="flex bg-slate-100 dark:bg-slate-900/50 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-x-auto">
            {['all', 'live', 'upcoming', 'completed'].map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter as any)}
                className={cn(
                  "px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all duration-200",
                  activeFilter === filter
                    ? "bg-white dark:bg-slate-800 shadow-lg text-blue-600 dark:text-blue-400"
                    : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-200"
                )}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence mode="popLayout">
          {filteredWebinars.length > 0 ? (
            filteredWebinars.map((webinar) => (
              <WebinarCard 
                key={webinar.id} 
                webinar={webinar} 
                onEnroll={handleEnrollClick}
              />
            ))
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-full flex flex-col items-center justify-center py-20 text-center"
            >
              <div className="bg-slate-100 dark:bg-slate-900 p-6 rounded-full mb-4">
                <Search size={48} className="text-slate-300 dark:text-slate-700" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">No webinars found</h3>
              <p className="text-slate-500 dark:text-slate-400">Try adjusting your search or filters.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Enrollment Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => !isEnrolling && setIsModalOpen(false)}
        title={hasEnrolled ? "Success!" : "Confirm Enrollment"}
        footer={
          !hasEnrolled && (
            <div className="flex gap-3 w-full sm:w-auto">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                disabled={isEnrolling}
              >
                Cancel
              </button>
              <button 
                onClick={confirmEnrollment}
                disabled={isEnrolling}
                className="flex-1 sm:flex-none px-8 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all shadow-xl shadow-blue-600/20 flex items-center justify-center min-w-[140px]"
              >
                {isEnrolling ? (
                  <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : "Confirm & Join"}
              </button>
            </div>
          )
        }
      >
        <div className="flex flex-col items-center text-center">
          {hasEnrolled ? (
            <motion.div 
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="py-4"
            >
              <div className="w-20 h-20 bg-green-100 dark:bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 size={40} className="text-green-600 dark:text-green-400" />
              </div>
              <h4 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">You're on the list!</h4>
              <p className="text-slate-500 dark:text-slate-400 mb-2">
                Your request is <span className="text-amber-500 font-bold italic">Pending Approval</span>. 
              </p>
              <p className="text-sm text-slate-400 bg-slate-100 dark:bg-slate-800/50 p-4 rounded-2xl max-w-sm mt-4">
                We'll notify you via email as soon as the host approves your registration.
              </p>
            </motion.div>
          ) : (
            <>
              <div className="w-20 h-20 bg-blue-100 dark:bg-blue-500/20 rounded-full flex items-center justify-center mb-6">
                <AlertCircle size={40} className="text-blue-600 dark:text-blue-400" />
              </div>
              <h4 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Ready to join?</h4>
              <p className="text-slate-500 dark:text-slate-400 max-w-sm">
                You are about to enroll in <span className="font-bold text-slate-900 dark:text-white">"{selectedWebinar?.title}"</span>. 
                Do you want to proceed with the registration?
              </p>
            </>
          )}
        </div>
      </Modal>
    </div>
  );
}
