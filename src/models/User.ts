import mongoose, { Schema, Document } from 'mongoose';
import { z } from 'zod';

export const UserSchemaZod = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  role: z.enum(['admin', 'member']).default('member'),
});

export type IUser = z.infer<typeof UserSchemaZod> & Document;

const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, enum: ['admin', 'member'], default: 'member' },
}, { timestamps: true });

export const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
