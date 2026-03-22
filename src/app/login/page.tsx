'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { LogIn, ArrowRight, Radio } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const login = useStore((state) => state.login);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate real auth delay
    setTimeout(() => {
      login(email, name || 'Demo User');
      router.push('/dashboard');
    }, 1200);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md auth-card p-10 rounded-3xl"
      >
        <div className="flex flex-col items-center mb-10">
          <div className="bg-blue-600 rounded-2xl p-4 shadow-xl shadow-blue-500/20 mb-6 group-hover:scale-110 transition-transform">
            <Radio className="text-white" size={32} />
          </div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2">Welcome Back</h1>
          <p className="text-slate-500 dark:text-slate-400 text-center text-sm px-6">
            Enter your details to catch up with the latest live sessions.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Email</label>
            <input
              type="email"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-5 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
            />
          </div>

          <div className="space-y-4">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-70 text-white font-bold py-4 px-6 rounded-2xl flex items-center justify-center gap-2 group transition-all transform active:scale-95 shadow-xl shadow-blue-600/20"
            >
              {isLoading ? (
                <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Continue Streaming
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
            <p className="text-center text-sm text-slate-500 mt-6">
              Don't have an account? <Link href="/signup" className="text-blue-500 hover:text-blue-600 font-bold transition-colors">Sign Up Free</Link>
            </p>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
