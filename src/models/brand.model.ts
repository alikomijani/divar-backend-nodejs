import type { Document } from 'mongoose';
import mongoose from 'mongoose';

import { z } from 'zod';

export const BrandSchemaZod = z.object({
  titleFa: z.string().min(1, 'Title (FA) is required'), // Minimum 1 character
  titleEn: z.string().min(1, 'Title (EN) is required'), // Minimum 1 character
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
  createdAt: Date;
  updatedAt: Date;
}
export const BrandSchema = new mongoose.Schema<IBrand>(
  {
    titleFa: { type: String, required: true },
    titleEn: { type: String, required: true },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      index: 1,
      immutable: true,
    },
    logo: { type: String },
  },
  {
    timestamps: true,
  },
);
BrandSchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret) {
    delete ret.__v;
    delete ret._id;
  },
});
BrandSchema.set('toObject', {
  virtuals: true,
});
export const BrandModel = mongoose.model('Brand', BrandSchema);
