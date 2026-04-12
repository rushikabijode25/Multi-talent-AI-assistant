import clsx from 'clsx';
import { ChartWidgetData } from '@/lib/types';
import { Activity } from 'lucide-react';

export default function ChartWidget({ title, colSpan }: ChartWidgetData) {
  return (
    <div className={clsx(
      "bg-surface border border-neutral-800 p-6 rounded-2xl shadow-xl h-80 flex flex-col hover:border-neutral-700 transition-colors",
      colSpan === 2 && "col-span-2 md:col-span-2"
    )}>
      <h3 className="text-neutral-400 text-sm font-semibold tracking-wide uppercase mb-6">{title}</h3>
      <div className="flex-1 flex items-center justify-center border border-dashed border-neutral-800 bg-neutral-900/50 rounded-xl relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        <div className="text-center relative z-10">
          <Activity className="w-10 h-10 text-indigo-500 mb-3 mx-auto animate-pulse" />
          <span className="text-neutral-500 text-sm font-medium">Enterprise Telemetry Data (Simulated)</span>
        </div>
      </div>
    </div>
  );
}
