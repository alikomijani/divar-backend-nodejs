import type { Document, ObjectId } from 'mongoose';
import mongoose from 'mongoose';

export interface IComment extends Document {
  text: string;
  rating: number;
  created_at: Date;
  product: ObjectId;
  user: ObjectId;
}
const CommentSchema = new mongoose.Schema<IComment>({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String, required: true },
  rating: { type: Number, min: 1, max: 5 },
  created_at: { type: Date, default: Date.now },
});

export const CommentModel = mongoose.model('Comment', CommentSchema);
