'use client';

import { useStore, EnrollmentStatus } from '@/lib/store';
import { StatusBadge } from '@/components/StatusBadge';
import { formatDate } from '@/lib/utils';
import { Calendar, Video, Mail, Trash2, CheckCircle2, XCircle, Clock, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function EnrollmentsPage() {
  const router = useRouter();
  const { user, enrollments, webinars, setEnrollmentStatus } = useStore();
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      router.replace('/login');
    }
  }, [user, router]);

  const userEnrollments = enrollments.filter(e => e.userId === user?.id);

  const getWebinar = (id: string) => webinars.find(w => w.id === id);

  const handleSimulateAction = (enrollmentId: string, status: EnrollmentStatus) => {
    setEnrollmentStatus(enrollmentId, status);
    if (status === 'approved') {
      setToast('Success! Your enrollment was approved. Webinar link sent to your email.');
      setTimeout(() => setToast(null), 5000);
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative">
      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-6 py-4 bg-green-600 text-white rounded-2xl shadow-2xl shadow-green-600/30"
          >
            <Mail size={20} />
            <span className="font-bold">{toast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">
            My Enrollments
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-lg">
            Manage your registered sessions and join live events.
          </p>
        </div>
        
        <div className="flex items-center gap-3 px-4 py-2 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-xl border border-blue-100 dark:border-blue-500/20">
          <Clock size={18} />
          <span className="text-sm font-bold">{userEnrollments.length} Active Requests</span>
        </div>
      </div>

      <div className="space-y-6">
        {userEnrollments.length > 0 ? (
          userEnrollments.map((enrollment, index) => {
            const webinar = getWebinar(enrollment.webinarId);
            if (!webinar) return null;

            return (
              <motion.div
                key={enrollment.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group relative overflow-hidden bg-white dark:bg-slate-950 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all p-4 sm:p-6"
              >
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="relative w-full md:w-32 h-20 rounded-2xl overflow-hidden shrink-0 border border-slate-100 dark:border-slate-800">
                    <Image src={webinar.thumbnail} alt={webinar.title} fill className="object-cover" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <StatusBadge type={enrollment.status} />
                      <span className="text-slate-300 dark:text-slate-700">|</span>
                      <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm">
                        <Calendar size={14} className="text-blue-500" />
                        {formatDate(webinar.date)}
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1 truncate">
                      {webinar.title}
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm italic mb-4">
                      Enrollment ID: #{enrollment.id}
                    </p>

                    <div className="flex flex-wrap items-center gap-3 mt-4">
                      {enrollment.status === 'approved' ? (
                        <Link 
                          href={`/webinar/${webinar.id}`}
                          className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all shadow-lg shadow-blue-500/20 active:scale-95 text-sm"
                        >
                          <Video size={18} />
                          Join Webinar
                        </Link>
                      ) : (
                        <button 
                          disabled
                          className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 font-bold border border-slate-200 dark:border-slate-700 cursor-not-allowed text-sm"
                        >
                          <Video size={18} />
                          Join Webinar
                        </button>
                      )}

                      {/* Simulation Controls - For Demo ONLY */}
                      {enrollment.status === 'pending' && (
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => handleSimulateAction(enrollment.id, 'approved')}
                            className="p-2 py-2.5 rounded-xl bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-500/20 transition-all font-bold text-sm px-4 flex items-center gap-2 border border-green-200 dark:border-green-500/20"
                            title="Simulate Approval"
                          >
                            <CheckCircle2 size={16} />
                            Self-Approve
                          </button>
                          <button 
                            onClick={() => handleSimulateAction(enrollment.id, 'rejected')}
                            className="p-2 py-2.5 rounded-xl bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-500/20 transition-all font-bold text-sm px-4 flex items-center gap-2 border border-rose-200 dark:border-rose-500/20"
                            title="Simulate Rejection"
                          >
                            <XCircle size={16} />
                            Reject
                          </button>
                        </div>
                      )}
                      
                      {enrollment.status === 'rejected' && (
                        <button 
                          onClick={() => handleSimulateAction(enrollment.id, 'pending')}
                          className="px-4 py-2.5 rounded-xl text-slate-500 hover:text-blue-500 transition-colors font-bold text-sm flex items-center gap-2"
                        >
                          <Trash2 size={16} />
                          Retry Request
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center glass rounded-[40px] px-10">
            <div className="bg-slate-100 dark:bg-slate-800 p-8 rounded-full mb-6">
              <BookOpen size={48} className="text-slate-300 dark:text-slate-600" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">No enrollments yet</h3>
            <p className="text-slate-500 dark:text-slate-400 max-w-sm mb-8">
              Explore our catalogue and register for sessions you find interesting.
            </p>
            <Link 
              href="/dashboard"
              className="px-8 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all shadow-xl shadow-blue-600/20"
            >
              Browse Catalog
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
