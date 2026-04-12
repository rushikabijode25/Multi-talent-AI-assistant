import mongoose, { Schema, Document } from 'mongoose';
import { z } from 'zod';

export const ProjectSchemaZod = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  users: z.array(z.object({
    userId: z.string(), // normally ObjectId
    role: z.enum(['admin', 'member'])
  }))
});

export type IProject = z.infer<typeof ProjectSchemaZod> & Document;

const ProjectSchema = new Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  users: [{
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    role: { type: String, enum: ['admin', 'member'], default: 'member' }
  }]
}, { timestamps: true });

export const Project = mongoose.models.Project || mongoose.model<IProject>('Project', ProjectSchema);
