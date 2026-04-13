import mongoose from 'mongoose';
import dbConnect from '../lib/db';
import { User } from '../models/User';
import { Project } from '../models/Project';
import { ProductInstance } from '../models/ProductInstance';
import { AdminConfig } from '../models/AdminConfig';

/**
 * Run this module directly via typically ts-node or simply wrapping it in a Next.js route for simplicity 
 * if no external ts runner is available. We'll expose this logic in an API route too.
 */
export async function seedDatabase() {
  await dbConnect();

  console.log('Clearing old data...');
  await User.deleteMany({});
  await Project.deleteMany({});
  await ProductInstance.deleteMany({});
  await AdminConfig.deleteMany({});

  console.log('Inserting seed data...');

  // 1. Create User
  const adminUser = await User.create({
    name: 'Admin User',
    email: 'admin@debales.ai',
    role: 'admin',
  });

  const memberUser = await User.create({
    name: 'Member User',
    email: 'member@debales.ai',
    role: 'member',
  });

  // 2. Create Project
  const project = await Project.create({
    name: 'Demo Project',
    slug: 'default-project',
    users: [
      { userId: adminUser._id, role: 'admin' },
      { userId: memberUser._id, role: 'member' }
    ]
  });

  // 3. Create Product Instance
  const salesInstance = await ProductInstance.create({
    projectId: project._id,
    name: 'Sales Assistant Pro',
    productType: 'sales_assistant',
    integrations: { shopify: true, crm: false }
  });

  // 4. Create Admin Dashboard Config (MongoDB Driven)
  await AdminConfig.create({
    projectId: project._id,
    layout: [
      { type: 'StatCard', title: 'Total Messages', value: '1,234', colSpan: 1 },
      { type: 'StatCard', title: 'Active End Users', value: '42', colSpan: 1 },
      { type: 'Chart', title: 'API Usage', dataRef: 'usage_last_7_days', colSpan: 2 },
      { type: 'IntegrationList', title: 'Active Integrations', colSpan: 2 }
    ]
  });

  console.log('Database seeding complete!');
  console.log('Admin ID:', adminUser._id);
  console.log('Project Slug: default-project');
  
  return { success: true, adminUserId: adminUser._id.toString() };
}
