import type { Document } from 'mongoose';
import mongoose from 'mongoose';
import { z } from 'zod';

// Zod Schema
export const BadgeSchemaZod = z.object({
  icon: z.string().url().trim(),
  title: z.string().min(1, 'Title is required').trim(),
});

export type BadgeType = z.infer<typeof BadgeSchemaZod>;
export interface IBadge extends BadgeType, Document {
  createdAt: Date;
  updatedAt: Date;
}
export const BadgeSchema = new mongoose.Schema<IBadge>({
  icon: { type: String, required: true, trim: true }, // Added trim
  title: { type: String, required: true, trim: true }, // Added trim
});

BadgeSchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret) {
    delete ret.__v;
    delete ret._id;
  },
});
BadgeSchema.set('toObject', {
  virtuals: true,
});
export const BadgeModel = mongoose.model('Badge', BadgeSchema);
