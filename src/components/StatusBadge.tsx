import { cn } from '@/lib/utils';

type BadgeType = 'live' | 'upcoming' | 'completed' | 'pending' | 'approved' | 'rejected';

export function StatusBadge({ type }: { type: BadgeType }) {
  const variants: Record<BadgeType, string> = {
    live: "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400 border-red-200 dark:border-red-500/30 animate-pulse",
    upcoming: "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400 border-blue-200 dark:border-blue-500/30",
    completed: "bg-slate-100 text-slate-700 dark:bg-slate-500/20 dark:text-slate-400 border-slate-200 dark:border-slate-500/30",
    pending: "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400 border-amber-200 dark:border-amber-500/30",
    approved: "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400 border-green-200 dark:border-green-500/30",
    rejected: "bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-400 border-rose-200 dark:border-rose-500/30",
  };

  return (
    <span className={cn(
      "px-2 py-1 rounded-full text-xs font-semibold border flex items-center gap-1.5 w-fit",
      variants[type]
    )}>
      {type === 'live' && <span className="w-1.5 h-1.5 rounded-full bg-red-500" />}
      {type.charAt(0).toUpperCase() + type.slice(1)}
    </span>
  );
}
