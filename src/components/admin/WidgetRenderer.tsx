'use client';

import { DashboardWidget } from '@/lib/types';
import StatCard from './widgets/StatCard';
import ChartWidget from './widgets/ChartWidget';
import IntegrationList from './widgets/IntegrationList';
import { motion } from 'framer-motion';

export default function WidgetRenderer({ layout }: { layout: DashboardWidget[] }) {
  if (!layout || layout.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 mt-8 border-2 border-dashed border-neutral-800 bg-neutral-900/30 rounded-3xl h-80">
        <div className="w-16 h-16 bg-neutral-800 rounded-full flex items-center justify-center mb-4">
          <span className="text-neutral-500 text-2xl font-bold">?</span>
        </div>
        <p className="text-neutral-400 font-medium text-lg">No layout widgets configured in DB.</p>
        <p className="text-neutral-500 text-sm mt-2 max-w-sm text-center">Modify the AdminConfig document within MongoDB to dynamically construct this dashboard.</p>
      </div>
    );
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  };

  return (
    <motion.div 
      variants={container} 
      initial="hidden" 
      animate="show"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full mt-8"
    >
      {layout.map((widget, i) => {
        let WidgetComponent;
        
        switch (widget.type) {
          case 'StatCard': WidgetComponent = <StatCard {...widget} />; break;
          case 'Chart': WidgetComponent = <ChartWidget {...widget} />; break;
          case 'IntegrationList': WidgetComponent = <IntegrationList {...widget} />; break;
          default: 
            WidgetComponent = (
              <div className="bg-red-900/20 border border-red-500/50 p-6 rounded-2xl text-red-400">
                Unknown widget type: {(widget as any).type}
              </div>
            );
        }

        return (
          <motion.div key={i} variants={item} className={widget.colSpan === 2 || widget.colSpan === 3 ? `col-span-1 md:col-span-2 lg:col-span-${widget.colSpan}` : ''}>
            {WidgetComponent}
          </motion.div>
        );
      })}
    </motion.div>
  );
}
