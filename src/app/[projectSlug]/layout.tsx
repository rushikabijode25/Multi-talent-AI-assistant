import { LayoutDashboard, MessageSquarePlus, Settings, LogOut, Bot, ChevronRight, FileText } from 'lucide-react';
import Link from 'next/link';

export default async function ProjectLayout({ children, params }: { children: React.ReactNode, params: Promise<{ projectSlug: string }> }) {
  const { projectSlug } = await params;

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background">
      {/* Left Sidebar */}
      <aside className="w-64 border-r border-neutral-800 bg-surface flex flex-col justify-between">
        <div className="p-4">
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-8 h-8 rounded-md bg-indigo-600 flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg text-white tracking-wide">Debales AI</span>
          </div>

          <nav className="space-y-1">
            <Link href={`/${projectSlug}/chat`} className="flex items-center w-full px-3 py-2 text-sm text-neutral-300 hover:bg-neutral-800 hover:text-white rounded-lg transition-colors group">
              <MessageSquarePlus className="w-4 h-4 mr-3 text-neutral-400 group-hover:text-indigo-400" />
              New Conversation
            </Link>
            <Link href={`/${projectSlug}/admin`} className="flex items-center w-full px-3 py-2 text-sm text-neutral-300 hover:bg-neutral-800 hover:text-white rounded-lg transition-colors group">
              <LayoutDashboard className="w-4 h-4 mr-3 text-neutral-400 group-hover:text-pink-400" />
              Admin Dashboard
            </Link>
            <Link href={`/${projectSlug}/resume-analyzer`} className="flex items-center w-full px-3 py-2 text-sm text-neutral-300 hover:bg-neutral-800 hover:text-white rounded-lg transition-colors group">
              <FileText className="w-4 h-4 mr-3 text-neutral-400 group-hover:text-amber-400" />
              Resume Analyzer
            </Link>
          </nav>

          <div className="mt-8">
            <h3 className="px-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">Instances</h3>
            <div className="space-y-1">
              {/* Hardcoded for demo UI purposes as specified in assignment */}
              <button className="flex justify-between items-center w-full px-3 py-2 text-sm text-neutral-400 hover:bg-neutral-800 hover:text-white rounded-lg transition-colors">
                <span>Sales Assistant</span>
                <ChevronRight className="w-3 h-3 opacity-50" />
              </button>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-neutral-800">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-neutral-700"></div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">Demo User</p>
              <p className="text-xs text-neutral-500 truncate">demo@debales.ai</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full bg-background relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/10 via-background to-background pointer-events-none" />
        <div className="relative flex-1 overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
