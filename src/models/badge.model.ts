import type { Document, Types } from 'mongoose';
import mongoose from 'mongoose';
import { z } from 'zod';

// Zod Schema
export const BadgeSchemaZod = z.object({
  icon: z.string().url().trim(),
  title: z.string().min(1, 'Title is required').trim(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type BadgeType = z.infer<typeof BadgeSchemaZod>;
export interface IBadge extends BadgeType, Document {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
export const BadgeSchema = new mongoose.Schema<IBadge>(
  {
    icon: { type: String, required: true, trim: true }, // Added trim
    title: { type: String, required: true, trim: true }, // Added trim
  },
  { timestamps: true }, // Add timestamps
);
export const BadgeModel = mongoose.model('Badge', BadgeSchema);
