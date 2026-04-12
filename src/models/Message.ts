import mongoose, { Schema, Document } from 'mongoose';
import { z } from 'zod';

export const MessageSchemaZod = z.object({
  conversationId: z.string(),
  role: z.enum(['user', 'assistant', 'system']),
  content: z.string(),
  isStep: z.boolean().default(false), // e.g., "Analyzing...", "Calling CRM..."
});

export type IMessage = z.infer<typeof MessageSchemaZod> & Document;

const MessageSchema = new Schema({
  conversationId: { type: Schema.Types.ObjectId, ref: 'Conversation', required: true },
  role: { type: String, enum: ['user', 'assistant', 'system'], required: true },
  content: { type: String, required: true },
  isStep: { type: Boolean, default: false },
}, { timestamps: true });

export const Message = mongoose.models.Message || mongoose.model<IMessage>('Message', MessageSchema);
