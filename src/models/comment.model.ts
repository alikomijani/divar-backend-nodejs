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
  product: z
    .string()
    .refine(
      (val) => mongoose.Types.ObjectId.isValid(val),
      'Invalid Product ID',
    ),
  user: z
    .string()
    .refine((val) => mongoose.Types.ObjectId.isValid(val), 'Invalid User ID'),
});

export type CommentType = z.infer<typeof CommentSchemaZod>;

// Mongoose Interface
export interface IComment extends Document {
  text: string;
  rating?: number; // Rating is optional
  created_at: Date;
  product: Types.ObjectId;
  user: Types.ObjectId;
}

// Mongoose Schema
const CommentSchema = new Schema<IComment>({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String, required: true, trim: true },
  rating: { type: Number, min: 1, max: 5 },
  created_at: { type: Date, default: Date.now },
});

export const CommentModel = mongoose.model<IComment>('Comment', CommentSchema);

export default CommentModel;
