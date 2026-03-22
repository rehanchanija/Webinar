'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';
import { ThemeToggle } from './ThemeToggle';
import { LayoutDashboard, BookOpen, LogOut, Code, LayoutGrid, Radio } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useStore();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const navItems = user 
    ? [
        { name: 'Dashboard', href: '/dashboard', icon: LayoutGrid },
        { name: 'My Enrollments', href: '/enrollments', icon: BookOpen },
      ]
    : [
        { name: 'Dashboard', href: '/dashboard', icon: LayoutGrid },
      ];

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-slate-200/60 dark:border-slate-800/60 bg-white/70 dark:bg-slate-950/70 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/dashboard" className="flex items-center gap-2.5 group">
              <div className="bg-blue-600 rounded-xl p-1.5 shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform">
                <Radio className="text-white" size={20} />
              </div>
              <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                Streamly
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-1.5 ml-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200",
                    pathname === item.href
                      ? "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-100"
                  )}
                >
                  <item.icon size={18} />
                  {item.name}
                  {pathname === item.href && (
                    <motion.div
                      layoutId="nav-active"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400 rounded-full"
                    />
                  )}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            
            <div className="h-4 w-px bg-slate-200 dark:bg-slate-800 hidden sm:block" />

            {user ? (
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex flex-col items-end text-sm">
                  <span className="font-semibold text-slate-900 dark:text-white leading-none">
                    {user.name}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-500">
                    {user.email}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-full text-slate-500 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-500/10 dark:hover:text-rose-400 transition-all active:scale-95"
                  title="Logout"
                >
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1 sm:gap-3">
                <Link 
                  href="/login" 
                  className="px-4 py-2 font-bold text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm"
                >
                  Log in
                </Link>
                <Link 
                  href="/signup" 
                  className="px-4 sm:px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all shadow-lg shadow-blue-500/20 active:scale-95 text-sm"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
