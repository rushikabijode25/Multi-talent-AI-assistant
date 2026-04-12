import clsx from 'clsx';
import { StatCardWidget } from '@/lib/types';
import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';

export default function StatCard({ title, value, colSpan }: StatCardWidget) {
  return (
    <div className={clsx(
      "bg-surface border border-neutral-800 p-6 rounded-2xl shadow-xl hover:shadow-indigo-900/10 transition-all duration-300 relative overflow-hidden group",
      colSpan === 2 && "col-span-2 md:col-span-2"
    )}>
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
        <TrendingUp className="w-16 h-16 text-indigo-400" />
      </div>
      <h3 className="text-neutral-400 text-sm font-semibold tracking-wide uppercase">{title}</h3>
      <p className="text-4xl font-extrabold mt-3 text-white tracking-tight">{value}</p>
      <div className="mt-4 flex items-center text-xs font-medium text-emerald-400">
        <span className="bg-emerald-400/10 px-2 py-1 rounded-md">+12.5% from last week</span>
      </div>
    </div>
  );
}
