import type { Document, Types } from 'mongoose';
import mongoose, { Schema } from 'mongoose';
import { z } from 'zod';

// Zod Schema
export const CategorySchemaZod = z.object({
  titleEn: z.string().min(1, 'Name is required').trim(),
  titleFa: z.string().min(1, 'Name is required').trim(),
  slug: z
    .string()
    .min(1, 'Slug is required')
    .trim()
    .toLowerCase()
    .regex(
      /^[a-z0-9-]+$/,
      'Slug can only contain lowercase letters, numbers, and hyphens',
    ),
  icon: z.string().url().trim().optional(),
  returnReasonAlert: z.string().trim().optional(),
  properties: z.array(z.string()).optional(), // Array of strings (ObjectIds)
  parent: z.string().optional(), // String (ObjectId)
});

export type CategoryType = z.infer<typeof CategorySchemaZod>;

// Interface
export interface ICategory extends Document {
  titleFa: string;
  titleEn: string;
  slug: string;
  icon?: string;
  returnReasonAlert?: string;
  properties?: Types.ObjectId[];
  parent?: Types.ObjectId;
  updateAt?: Date;
  createAt?: Date;
}

// Mongoose Schema
export const CategorySchema = new Schema<ICategory>(
  {
    titleEn: { type: String, required: true, trim: true },
    titleFa: { type: String, required: true, trim: true },
    slug: {
      type: String,
      required: true,
      unique: true,
      index: 1,
      trim: true,
      lowercase: true,
      immutable: true,
    },
    icon: { type: String, trim: true },
    returnReasonAlert: { type: String, trim: true },
    properties: [
      {
        type: mongoose.Types.ObjectId,
        ref: 'Property',
      },
    ],
    parent: {
      type: mongoose.Types.ObjectId,
      ref: 'Category',
    },
  },
  { timestamps: true },
);

CategorySchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret) {
    delete ret.__v;
    delete ret._id;
  },
});
CategorySchema.set('toObject', {
  virtuals: true,
});
export const CategoryModel = mongoose.model<ICategory>(
  'Category',
  CategorySchema,
);
