import mongoose, { Schema, Document } from 'mongoose';
import { z } from 'zod';

export const ConversationSchemaZod = z.object({
  projectId: z.string(),
  productInstanceId: z.string(),
  title: z.string().optional(),
});

export type IConversation = z.infer<typeof ConversationSchemaZod> & Document;

const ConversationSchema = new Schema({
  projectId: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
  productInstanceId: { type: Schema.Types.ObjectId, ref: 'ProductInstance', required: true },
  title: { type: String, default: 'New Conversation' },
}, { timestamps: true });

export const Conversation = mongoose.models.Conversation || mongoose.model<IConversation>('Conversation', ConversationSchema);
