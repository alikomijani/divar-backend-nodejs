import type { Document } from 'mongoose';
import mongoose, { Schema } from 'mongoose';
import { z } from 'zod';

// Zod Schema
export const PropertySchemaZod = z.object({
  name: z.string().min(1, 'Name is required').trim(),
  label: z.string().min(1, 'Label is required').trim(),
  type: z.string().min(1, 'Type is required').trim(),
  options: z
    .array(
      z.object({
        label: z.string().min(1, 'Option label is required').trim(),
        value: z.string().min(1, 'Option value is required').trim(),
      }),
    )
    .optional(), // Options array is optional
});

export type PropertyType = z.infer<typeof PropertySchemaZod>;

// Mongoose Interface (Extending PropertyType and Document)
export interface ICategoryProperty extends PropertyType, Document {}

// Mongoose Schema
export const PropertySchema = new Schema<ICategoryProperty>(
  {
    name: { type: String, required: true, trim: true },
    label: { type: String, required: true, trim: true },
    type: { type: String, required: true, trim: true },
    options: [
      {
        label: { type: String, required: true, trim: true },
        value: { type: String, required: true, trim: true },
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

export const PropertyModel = mongoose.model<ICategoryProperty>(
  'Property',
  PropertySchema,
);
PropertySchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret) {
    delete ret.__v;
    delete ret._id;
  },
});
PropertySchema.set('toObject', {
  virtuals: true,
});
export default PropertyModel;
