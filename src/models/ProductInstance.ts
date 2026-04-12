import mongoose, { Schema, Document } from 'mongoose';
import { z } from 'zod';

export const ProductInstanceSchemaZod = z.object({
  projectId: z.string(),
  name: z.string().min(1),
  productType: z.enum(['sales_assistant', 'support_bot', 'developer_agent']),
  integrations: z.record(z.boolean()), // e.g. { shopify: true, crm: false }
});

export type IProductInstance = z.infer<typeof ProductInstanceSchemaZod> & Document;

const ProductInstanceSchema = new Schema({
  projectId: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
  name: { type: String, required: true },
  productType: { type: String, required: true },
  integrations: { type: Map, of: Boolean, default: {} },
}, { timestamps: true });

export const ProductInstance = mongoose.models.ProductInstance || mongoose.model<IProductInstance>('ProductInstance', ProductInstanceSchema);
