'use client';

import { use } from 'react';
import { useQuery } from '@tanstack/react-query';
import WidgetRenderer from '@/components/admin/WidgetRenderer';

export default function AdminDashboard({ params }: { params: Promise<{ projectSlug: string }> }) {
  const { projectSlug } = use(params);

  const { data: config, isLoading, error } = useQuery({
    queryKey: ['adminConfig', projectSlug],
    queryFn: async () => {
      const res = await fetch(`/api/projects/${projectSlug}/admin`);
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    }
  });

  if (isLoading) return <div className="p-8 text-neutral-400">Loading Dashboard Config...</div>;
  if (error) return <div className="p-8 text-red-400">Error loading dashboard: {(error as Error).message}</div>;

  return (
    <div className="p-8 w-full max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-neutral-400">This layout is entirely driven by MongoDB configuration.</p>
      </div>

      <WidgetRenderer layout={config.layout} />
    </div>
  );
}
