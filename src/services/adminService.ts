import dbConnect from '@/lib/db';
import { AdminConfig } from '@/models/AdminConfig';
import { canAccessAdminDashboard } from '@/access';
import { getAuthorizedProjectBySlug } from './projectService';

export async function getDashboardConfig(slug: string, userId: string) {
  await dbConnect();
  
  const project = await getAuthorizedProjectBySlug(slug, userId);
  if (!project) throw new Error('Project not found');

  if (!canAccessAdminDashboard(userId, project as any)) {
    throw new Error('Admin access denied');
  }

  // Dashboard configuration driven purely from MongoDB
  const configDoc = await AdminConfig.findOne({ projectId: project._id }).lean();
  
  return {
    layout: configDoc?.layout || [],
    projectId: configDoc?.projectId
  };
}
