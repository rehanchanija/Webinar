'use client';

import { useParams, useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';
import { StatusBadge } from '@/components/StatusBadge';
import { formatDate } from '@/lib/utils';
import { Calendar, Users, MessageCircle, Share2, ArrowLeft, Radio } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useEffect } from 'react';

export default function WebinarDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { webinars, user, enrollments } = useStore();
  
  const webinarId = params.id as string;
  const webinar = webinars.find(w => w.id === webinarId);
  
  const enrollment = user ? enrollments.find(e => e.webinarId === webinarId && e.userId === user.id) : null;
  const isApproved = enrollment?.status === 'approved';

  useEffect(() => {
    if (!user) {
      router.replace('/login');
    } else if (!isApproved && webinar) {
      router.replace('/enrollments');
    }
  }, [user, isApproved, router, webinar]);

  if (!webinar || !isApproved) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <Link 
        href="/enrollments" 
        className="inline-flex items-center gap-2 text-slate-500 hover:text-blue-500 dark:text-slate-400 dark:hover:text-blue-400 font-bold mb-8 transition-colors group"
      >
        <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900 group-hover:bg-blue-100 dark:group-hover:bg-blue-500/20 transition-all">
          <ArrowLeft size={20} />
        </div>
        Back to Dashboard
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-8">
          {/* Main Video Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="group relative h-0 pb-[56.25%] overflow-hidden rounded-[40px] shadow-2xl border-4 border-white dark:border-slate-800 bg-black shadow-blue-500/10"
          >
            <div className="absolute inset-0 z-10 flex flex-col justify-between p-6 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="flex justify-between items-start">
                <StatusBadge type={webinar.status} />
                <div className="flex bg-black/50 backdrop-blur-md px-4 py-2 rounded-2xl text-white text-xs font-bold items-center gap-2 border border-white/20">
                  <Users size={14} className="text-blue-400" />
                  1,482 LIVE
                </div>
              </div>
            </div>

            <iframe
              src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&mute=1"
              title="Webinar Live Stream"
              className="absolute inset-0 w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </motion.div>

          <div className="flex flex-col gap-6 p-8 glass rounded-[40px]">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-3 tracking-tight">
                  {webinar.title}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 dark:text-slate-400 font-bold">
                  <div className="flex items-center gap-1.5 p-2 px-3 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-xl border border-blue-100 dark:border-blue-500/20">
                     <Calendar size={14} />
                     {formatDate(webinar.date)}
                  </div>
                  <div className="flex items-center gap-1.5 p-2 px-3 bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 rounded-xl border border-slate-200 dark:border-slate-800">
                    <Users size={14} />
                    1.2k attending
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <button className="flex items-center gap-2 px-5 py-3 bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-2xl font-bold text-slate-600 dark:text-slate-400 transition-all active:scale-95 border border-slate-200 dark:border-slate-800">
                  <Share2 size={18} />
                  Share
                </button>
              </div>
            </div>

            <hr className="border-slate-100 dark:border-slate-800" />

            <div className="prose prose-slate dark:prose-invert max-w-none">
              <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2 underline decoration-blue-500 underline-offset-4 decoration-4">
                About this webinar
              </h4>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-lg italic">
                {webinar.description} 
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
              </p>
            </div>
          </div>
        </div>

        {/* Live Chat Simulation */}
        <div className="lg:col-span-4 flex flex-col h-[600px] lg:h-auto">
          <div className="flex-1 glass rounded-[40px] flex flex-col overflow-hidden shadow-2xl shadow-blue-500/5">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800/50 flex items-center justify-between bg-white/50 dark:bg-slate-900/50">
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-widest text-xs">Live Interaction</h3>
              </div>
              <Users size={16} className="text-slate-400" />
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
              {[
                { user: 'Sarah J.', text: 'This intro is amazing! So excited for this session.', color: 'text-pink-500' },
                { user: 'Mike Chen', text: 'Will there be a recording available afterwards?', color: 'text-blue-500' },
                { user: 'Alex Rivera', text: 'I started using these techniques last week. Major difference.', color: 'text-amber-500' },
                { user: 'Emily Watson', text: 'The designer perspective on this is super helpful.', color: 'text-green-500' },
                { user: 'Host', text: 'Welcome everyone! We will be starting in 2 minutes.', color: 'text-blue-600 font-black italic' },
              ].map((msg, i) => (
                <div key={i} className="flex flex-col gap-1 group">
                   <span className={cn("text-xs font-black uppercase tracking-tighter opacity-70", msg.color)}>
                     {msg.user}
                   </span>
                   <p className="text-sm bg-slate-50 dark:bg-slate-900/50 p-3 rounded-2xl rounded-tl-none text-slate-700 dark:text-slate-300 border border-slate-100 dark:border-slate-800 transition-transform group-hover:translate-x-1">
                     {msg.text}
                   </p>
                </div>
              ))}
            </div>
            
            <div className="p-6 border-t border-slate-100 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-900/50">
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Say something..."
                  className="w-full pl-6 pr-14 py-4 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none"
                />
                <button className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg transition-all active:scale-95">
                  <MessageCircle size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
