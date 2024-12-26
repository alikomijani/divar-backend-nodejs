import type { Document } from 'mongoose';
import mongoose from 'mongoose';
// Define interfaces for the subfields
export interface IAnswer {
  user: mongoose.Types.ObjectId;
  answer: string;
  created_at: Date;
}

// Define the main ProductQuestion interface
export interface IProductQuestion extends Document {
  product: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  question: string;
  answers: IAnswer[];
  created_at: Date;
  updated_at?: Date; // Optional because of timestamps
}
const ProductQuestionSchema = new mongoose.Schema<IProductQuestion>(
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
    },
    answers: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        answer: { type: String, required: true },
        created_at: { type: Date, default: Date.now },
      },
    ],
    created_at: { type: Date, default: Date.now },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  },
);

// Indexes for better query performance
ProductQuestionSchema.index({ product: 1 });
ProductQuestionSchema.index({ user: 1 });

// Virtual for answer count
ProductQuestionSchema.virtual('answerCount').get(function () {
  return this.answers.length;
});

// Register model
export const ProductQuestionModel = mongoose.model(
  'Question',
  ProductQuestionSchema,
);
