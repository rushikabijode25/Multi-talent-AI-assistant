/**
 * Pure Access Rules.
 * These are isolated, pure functions to evaluate authorization independently of side operations.
 * Mandatory layering: Access -> Services -> Routes -> Hooks -> UI
 */

interface MinimalProject {
  _id: any;
  users: Array<{ userId: any, role: string }>;
}

export const canAccessProject = (userId: string, project: MinimalProject): boolean => {
  if (!project || !project.users) return false;
  return project.users.some(u => u.userId.toString() === userId.toString());
};

export const canAccessAdminDashboard = (userId: string, project: MinimalProject): boolean => {
  if (!project || !project.users) return false;
  const user = project.users.find(u => u.userId.toString() === userId.toString());
  return !!user && user.role === 'admin';
};
