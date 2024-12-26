import mongoose, { Schema } from 'mongoose';
import { z } from 'zod';

// Zod Schema and Type
export const CitySchemaZod = z.object({
  name: z.string().min(1, 'Name is required').trim(),
  code: z.string().min(1, 'Code is required').trim(),
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

export type CityType = z.infer<typeof CitySchemaZod>;

// Mongoose Interface (Extending CityType and Document)

// Mongoose Schema
const CitySchema = new Schema<CityType>(
  {
    name: { type: String, required: true, trim: true },
    code: { type: String, required: true, trim: true },
    slug: {
      type: String,
      required: true,
      unique: true,
      index: 1,
      trim: true,
      lowercase: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Virtual for 'id'
CitySchema.virtual('id').get(function (this: CityType) {
  return this._id;
});

// Transform to remove _id and __v
CitySchema.set('toJSON', {
  transform: function (doc, ret) {
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export const CityModel = mongoose.model<CityType>('City', CitySchema);

export default CityModel;
