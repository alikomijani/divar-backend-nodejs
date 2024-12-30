import mongoose, { Schema } from 'mongoose';
import { z } from 'zod';

// Zod Schema and Type
export const SellerSchemaZod = z.object({
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
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  _id: z.string().optional(),
});

export type SellerType = z.infer<typeof SellerSchemaZod>;

// Mongoose Interface (Extending CityType and Document)

// Mongoose Schema
const SellerSchema = new Schema<SellerType>(
  {
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

export const SellerModel = mongoose.model<SellerType>('Seller', SellerSchema);

export default SellerModel;
