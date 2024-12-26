import type { Document, Types } from 'mongoose';
import mongoose from 'mongoose';

import { z } from 'zod';

export const BrandSchemaZod = z.object({
  title_fa: z.string().min(1, 'Title (FA) is required'), // Minimum 1 character
  title_en: z.string().min(1, 'Title (EN) is required'), // Minimum 1 character
  slug: z
    .string()
    .min(1, 'Slug is required')
    .trim()
    .toLowerCase()
    .regex(
      /^[a-z0-9-]+$/,
      'Slug can only contain lowercase letters, numbers, and hyphens',
    ),
  logo: z.string().optional(), // Optional logo
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

// Define a type based on the Zod schema
export type BrandType = z.infer<typeof BrandSchemaZod>;

export interface IBrand extends BrandType, Document {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
export const BrandSchema = new mongoose.Schema<IBrand>(
  {
    title_fa: { type: String, required: true },
    title_en: { type: String, required: true },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      index: 1,
    },
    logo: { type: String },
  },
  {
    timestamps: true,
  },
);
// Add a virtual ID field
BrandSchema.virtual('id').get(function () {
  return String(this._id);
});

// Set JSON and Object transformations
BrandSchema.set('toJSON', {
  virtuals: true,
  transform: (_, ret) => {
    delete ret._id;
    delete ret.__v;
  },
});

BrandSchema.set('toObject', {
  virtuals: true,
});
export const BrandModel = mongoose.model('Brand', BrandSchema);
