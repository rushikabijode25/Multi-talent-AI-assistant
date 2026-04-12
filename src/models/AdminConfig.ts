import mongoose, { Schema, Document } from 'mongoose';

// Flexible schema design for UI Config documents dynamically rendering Admin dashboard
export interface IAdminConfig extends Document {
  projectId: mongoose.Types.ObjectId;
  layout: any[]; // JSON driven layout elements
}

const AdminConfigSchema = new Schema({
  projectId: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
  layout: { type: Schema.Types.Mixed, default: [] }, // Array of widget definitions
}, { timestamps: true });

export const AdminConfig = mongoose.models.AdminConfig || mongoose.model<IAdminConfig>('AdminConfig', AdminConfigSchema);
