import refValidator from '@/utils/ref-validator';
import type { Document, Types } from 'mongoose';
import mongoose, { Schema } from 'mongoose';
import { z } from 'zod';

// Zod Schema
export const CommentSchemaZod = z.object({
  text: z.string().min(1, 'Text is required').trim(),
  rating: z
    .number()
    .int()
    .min(1, 'Rating must be at least 1')
    .max(5, 'Rating cannot exceed 5')
    .optional(), // Rating is optional
  product: z.number(),
});
export type CommentType = z.infer<typeof CommentSchemaZod>;

// Update Zod Schema
export const UpdateCommentSchemaZod = z.object({
  text: z.string().min(1, 'Text is required').trim(),
  rating: z
    .number()
    .int()
    .min(1, 'Rating must be at least 1')
    .max(5, 'Rating cannot exceed 5')
    .optional(), // Rating is optional
});

// Mongoose Interface
export interface IComment extends Document {
  text: string;
  rating?: number; // Rating is optional
  product: Types.ObjectId;
  user: Types.ObjectId;
  createAt: Date;
  updateAt: Date;
}

// Mongoose Schema
const CommentSchema = new Schema<IComment>(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
      validate: refValidator('Product'),
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    text: { type: String, required: true, trim: true },
    rating: { type: Number, min: 1, max: 5 },
  },
  {
    timestamps: true,
  },
);
CommentSchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret) {
    delete ret.__v;
    delete ret._id;
  },
});
CommentSchema.set('toObject', {
  virtuals: true,
});
export const CommentModel = mongoose.model<IComment>('Comment', CommentSchema);

export default CommentModel;
