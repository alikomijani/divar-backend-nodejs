import type { Document, Types } from 'mongoose';
import mongoose, { Schema } from 'mongoose';
import { z } from 'zod';

// Zod Schemas
const AnswerSchemaZod = z.object({
  user: z
    .string()
    .refine((val) => mongoose.Types.ObjectId.isValid(val), 'Invalid User ID'),
  answer: z.string().min(1, 'Answer is required').trim(),
});

export const ProductQuestionSchemaZod = z.object({
  product: z
    .string()
    .refine(
      (val) => mongoose.Types.ObjectId.isValid(val),
      'Invalid Product ID',
    ),
  user: z
    .string()
    .refine((val) => mongoose.Types.ObjectId.isValid(val), 'Invalid User ID'),
  question: z.string().min(1, 'Question is required').trim(),
  answers: z.array(AnswerSchemaZod).optional(),
});

export type ProductQuestionType = z.infer<typeof ProductQuestionSchemaZod>;
export type AnswerType = z.infer<typeof AnswerSchemaZod>;

// Mongoose Interfaces
interface IAnswer extends Omit<AnswerType, 'user'>, Document {
  user: Types.ObjectId;
  created_at: Date;
}

interface IProductQuestion
  extends Omit<ProductQuestionType, 'product' | 'user' | 'answers'>,
    Document {
  product: Types.ObjectId;
  user: Types.ObjectId;
  answers: Types.DocumentArray<
    mongoose.Types.Subdocument<Types.ObjectId> & Omit<IAnswer, 'created_at'>
  >;
  created_at: Date;
  updated_at?: Date;
}

// Mongoose Schema
const AnswerSchema = new Schema<IAnswer>({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  answer: { type: String, required: true, trim: true },
  created_at: { type: Date, default: Date.now },
});

const ProductQuestionSchema = new Schema<IProductQuestion>(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, 'Product reference is required'],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required'],
    },
    question: {
      type: String,
      required: [true, 'Question text is required'],
      trim: true,
    },
    answers: [AnswerSchema],
    created_at: { type: Date, default: Date.now },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Indexes for better query performance
ProductQuestionSchema.index({ product: 1 });
ProductQuestionSchema.index({ user: 1 });

// Virtual for answer count
ProductQuestionSchema.virtual('answerCount').get(function (
  this: IProductQuestion,
) {
  return this.answers.length;
});

// Register model
export const ProductQuestionModel = mongoose.model<IProductQuestion>(
  'Question',
  ProductQuestionSchema,
);

export default ProductQuestionModel;
