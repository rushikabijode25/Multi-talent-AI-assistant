'use client';

import { 
  LayoutDashboard, 
  MessageSquare, 
  FileText, 
  TrendingUp, 
  Users, 
  ShieldCheck, 
  Zap, 
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useParams } from 'next/navigation';

export default function ProjectDashboardPage() {
  const { projectSlug } = useParams();

  const stats = [
    { label: 'Total Messages', value: '1,234', icon: MessageSquare, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
    { label: 'Active Users', value: '42', icon: Users, color: 'text-pink-400', bg: 'bg-pink-500/10' },
    { label: 'System Health', value: '99.9%', icon: ShieldCheck, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { label: 'AI Efficiency', value: '+12%', icon: TrendingUp, color: 'text-amber-400', bg: 'bg-amber-500/10' },
  ];

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Welcome Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12"
      >
        <h1 className="text-4xl font-extrabold text-white tracking-tight mb-3">
          Project Dashboard
        </h1>
        <p className="text-neutral-400 text-lg">
          Welcome back to <span className="text-indigo-400 font-semibold">{projectSlug}</span>. Here's what's happening today.
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-surface border border-neutral-800 p-6 rounded-2xl shadow-xl hover:border-neutral-700 transition-colors"
          >
            <div className={`w-10 h-10 ${stat.bg} rounded-xl flex items-center justify-center mb-4`}>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <p className="text-sm text-neutral-500 font-medium mb-1">{stat.label}</p>
            <h3 className="text-2xl font-bold text-white">{stat.value}</h3>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions & Features */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Actions Column */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-surface border border-neutral-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
              <Zap className="w-40 h-40 text-indigo-500" />
            </div>
            <div className="relative z-10">
              <h2 className="text-2xl font-bold text-white mb-4">Launch Assistant</h2>
              <p className="text-neutral-400 mb-8 max-w-md">
                Deploy your multi-talented AI assistant to Shopify, Discord, or your custom mobile application with a single click.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link 
                  href={`/${projectSlug}/chat`}
                  className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl transition-all flex items-center shadow-lg shadow-indigo-600/20"
                >
                  Go to Chat <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
                <Link 
                  href={`/${projectSlug}/resume-analyzer`}
                  className="px-6 py-3 bg-neutral-800 hover:bg-neutral-700 text-white font-semibold rounded-xl transition-all flex items-center"
                >
                  Analyze Resumes <FileText className="w-4 h-4 ml-2 text-amber-400" />
                </Link>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-surface/50 border border-neutral-800 p-6 rounded-2xl">
              <h3 className="text-white font-bold mb-2 flex items-center">
                <LayoutDashboard className="w-4 h-4 mr-2 text-pink-400" />
                Admin Controls
              </h3>
              <p className="text-sm text-neutral-500 mb-4">Configure system prompts, integration keys, and billing settings.</p>
              <Link href={`/${projectSlug}/admin`} className="text-indigo-400 text-sm font-semibold hover:underline flex items-center">
                Configure Admin <ChevronRight className="w-3 h-3 ml-1" />
              </Link>
            </div>
            <div className="bg-surface/50 border border-neutral-800 p-6 rounded-2xl">
              <h3 className="text-white font-bold mb-2 flex items-center">
                <ExternalLink className="w-4 h-4 mr-2 text-sky-400" />
                Docs & API
              </h3>
              <p className="text-sm text-neutral-500 mb-4">Read full documentation on how to integrate Debales AI into your stack.</p>
              <button className="text-indigo-400 text-sm font-semibold hover:underline flex items-center">
                View Documentation <ChevronRight className="w-3 h-3 ml-1" />
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar Status Column */}
        <div className="space-y-6">
          <div className="bg-surface border border-neutral-800 p-6 rounded-2xl">
            <h3 className="text-white font-bold mb-4">Instance Status</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
                  <span className="text-sm text-neutral-300">Sales Assistant</span>
                </div>
                <span className="text-xs text-neutral-500 italic">Connected</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 rounded-full bg-neutral-600" />
                  <span className="text-sm text-neutral-500">Support Bot</span>
                </div>
                <span className="text-xs text-neutral-500 italic">Offline</span>
              </div>
            </div>
          </div>

          <div className="bg-indigo-600/10 border border-indigo-500/20 p-6 rounded-2xl">
            <h3 className="text-indigo-400 font-bold mb-2">Pro Plan Active</h3>
            <p className="text-xs text-indigo-300/60 leading-relaxed">
              Your organization is currently on the Professional Tier. You have unlimited AI tokens until next billing cycle.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ChevronRight(props: any) {
  return (
    <svg 
      {...props}
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="m9 18 6-6-6-6"/>
    </svg>
  );
}
