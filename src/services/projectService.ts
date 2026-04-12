import dbConnect from '@/lib/db';
import { Project } from '@/models/Project';
import { canAccessProject } from '@/access';
import { IProject } from '@/models/Project';

export async function getAuthorizedProjectBySlug(slug: string, userId: string): Promise<IProject | null> {
  await dbConnect();
  const project = await Project.findOne({ slug }).lean();
  
  if (!project) return null;
  
  if (!canAccessProject(userId, project as any)) {
    throw new Error('Access denied');
  }
  
  return project as unknown as IProject;
}

export async function getUserProjects(userId: string) {
  await dbConnect();
  // Fetch all projects where user is in the users array
  return Project.find({ 'users.userId': userId }).lean();
}
