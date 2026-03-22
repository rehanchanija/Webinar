"use client";

import { useTheme } from "@/components/providers/ThemeProvider";
import { Sun, Moon, Monitor } from "lucide-react";
import { cn } from "@/lib/utils";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-full border border-slate-200 dark:border-slate-700">
      {[
        { id: "light", icon: Sun },
        { id: "dark", icon: Moon },
        { id: "system", icon: Monitor },
      ].map(({ id, icon: Icon }) => (
        <button
          key={id}
          onClick={() => setTheme(id as any)}
          className={cn(
            "p-2 rounded-full transition-all duration-200",
            theme === id
              ? "bg-white dark:bg-slate-900 shadow-sm text-blue-600 dark:text-blue-400"
              : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100",
          )}
        >
          <Icon size={16} />
        </button>
      ))}
    </div>
  );
}
