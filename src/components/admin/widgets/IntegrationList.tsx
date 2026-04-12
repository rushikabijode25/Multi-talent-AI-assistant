import clsx from 'clsx';
import { IntegrationListWidget } from '@/lib/types';
import { Puzzle, ServerCog, Wifi } from 'lucide-react';

export default function IntegrationList({ title, colSpan }: IntegrationListWidget) {
  return (
    <div className={clsx(
      "bg-surface border border-neutral-800 p-6 rounded-2xl shadow-xl",
      colSpan === 2 && "col-span-2 md:col-span-2"
    )}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-neutral-400 text-sm font-semibold tracking-wide uppercase">{title}</h3>
        <span className="flex items-center text-xs text-neutral-500 font-medium bg-neutral-900 px-2 py-1 rounded-full border border-neutral-800">
          <Wifi className="w-3 h-3 mr-1 text-emerald-500 animate-pulse" /> Live
        </span>
      </div>
      <ul className="space-y-3">
        <li className="flex items-center justify-between text-sm p-4 bg-neutral-900/60 rounded-xl border border-neutral-800 hover:bg-neutral-800 transition-colors">
          <div className="flex items-center">
            <div className="p-2 bg-indigo-500/10 rounded-lg mr-4 border border-indigo-500/20">
              <Puzzle className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <p className="text-white font-medium">Shopify GraphQL</p>
              <p className="text-neutral-500 text-xs">Connected 2m ago</p>
            </div>
          </div>
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
        </li>
        <li className="flex items-center justify-between text-sm p-4 bg-neutral-900/60 rounded-xl border border-neutral-800 hover:bg-neutral-800 transition-colors">
          <div className="flex items-center">
            <div className="p-2 bg-pink-500/10 rounded-lg mr-4 border border-pink-500/20">
              <ServerCog className="w-5 h-5 text-pink-400" />
            </div>
            <div>
              <p className="text-white font-medium">Hubspot CRM Sync</p>
              <p className="text-neutral-500 text-xs">Paused</p>
            </div>
          </div>
          <span className="w-2 h-2 rounded-full bg-neutral-600"></span>
        </li>
      </ul>
    </div>
  );
}
