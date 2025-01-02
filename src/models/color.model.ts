import type { Document } from 'mongoose';
import mongoose, { Schema } from 'mongoose';
import { z } from 'zod';

// Zod Schema (without _id)
export const ColorSchemaZod = z.object({
  title: z.string().min(1, 'Title is required').trim(),
  hexCode: z
    .string()
    .min(1, 'Hex code is required')
    .trim()
    .regex(/^#([0-9A-Fa-f]{3}){1,2}$/, 'Invalid hex code format'),
});

export type ColorType = z.infer<typeof ColorSchemaZod>;

// Mongoose Interface (Extending ColorType and Document)
export interface IColor extends ColorType, Document {
  createdAt: Date;
  updatedAt: Date;
}

// Mongoose Schema
export const ColorSchema = new Schema<IColor>(
  {
    title: { type: String, required: true, trim: true },
    hexCode: { type: String, required: true, trim: true },
  },
  { timestamps: true },
);
ColorSchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret) {
    delete ret.__v;
    delete ret._id;
  },
});
ColorSchema.set('toObject', {
  virtuals: true,
});
export const ColorModel = mongoose.model<IColor>('Color', ColorSchema);

export default ColorModel;
