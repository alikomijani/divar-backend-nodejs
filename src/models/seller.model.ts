import type { Document, Types } from 'mongoose';
import mongoose, { Schema } from 'mongoose';
import { z } from 'zod';

// Zod Schema and Type (unchanged)
export const SellerSchemaZod = z.object({
  user: z
    .string()
    .refine((val) => mongoose.Types.ObjectId.isValid(val), 'Invalid User ID'),
  name: z.string().min(1, 'Name is required').trim(),
  slug: z
    .string()
    .min(1, 'Slug is required')
    .trim()
    .toLowerCase()
    .regex(
      /^[a-z0-9-]+$/,
      'Slug can only contain lowercase letters, numbers, and hyphens',
    ),
});

export type SellerType = z.infer<typeof SellerSchemaZod>;

export interface ISeller extends Omit<SellerType, 'user'>, Document {
  user: Types.ObjectId;
}

// Mongoose Schema (Corrected)
const SellerSchema = new Schema<ISeller>(
  {
    user: {
      type: Schema.Types.ObjectId, // Use Schema.Types.ObjectId
      required: true,
      unique: true,
      ref: 'User',
    },
    name: { type: String, required: true, trim: true },
    slug: {
      type: String,
      required: true,
      unique: true,
      index: 1,
      trim: true,
      lowercase: true,
      immutable: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

export const SellerModel = mongoose.model<ISeller>('Seller', SellerSchema);

export default SellerModel;
