import type { Document, ObjectId } from 'mongoose';
import mongoose from 'mongoose';

export interface IColor extends Document {
  title: string;
  hex_code: string;
}
const ColorSchema = new mongoose.Schema<IColor>({
  title: { type: String },
  hex_code: { type: String },
});

export interface IBadge extends Document {
  icon: string;
  title: string;
}
const BadgeSchema = new mongoose.Schema<IBadge>({
  icon: { url: { type: String } },
  title: { type: String },
});
export interface IBrand extends Document {
  title_fa: string;
  title_en: string;
  slug: string;
  logo: string;
}
const BrandSchema = new mongoose.Schema<IBrand>({
  title_fa: { type: String, required: true },
  title_en: { type: String, required: true },
  slug: { type: String, required: true },
  logo: { type: String },
});

const ProductSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  title_fa: { type: String, required: true },
  title_en: { type: String, required: true },
  status: {
    type: String,
    required: true,
    enum: ['marketable', 'unmarketable'],
  },
  images: {
    main: { type: String },
    list: { type: [String], default: [] },
  },
  colors: [ColorSchema],
  badges: [BadgeSchema],
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  brand: { type: mongoose.Schema.Types.ObjectId, ref: 'Brand' },
  review: {
    description: { type: String },
    attributes: [
      {
        title: { type: String },
        values: { type: [String], default: [] },
      },
    ],
  },
  specifications: [
    {
      title: { type: String },
      attributes: [
        {
          title: { type: String },
          values: { type: [String], default: [] },
        },
      ],
    },
  ],
  expert_reviews: {
    description: { type: String },
  },
});
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

const ProductQuestionSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  question: { type: String, required: true },
  answers: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      answer: { type: String },
      created_at: { type: Date, default: Date.now },
    },
  ],
  created_at: { type: Date, default: Date.now },
});

export const ColorModel = mongoose.model('Color', ColorSchema);
export const BadgeModel = mongoose.model('Badge', BadgeSchema);
export const BrandModel = mongoose.model('Brand', BrandSchema);
export const ProductModel = mongoose.model('Product', ProductSchema);
export const CommentModel = mongoose.model('Comment', CommentSchema);
export const ProductQuestionModel = mongoose.model(
  'Comment',
  ProductQuestionSchema,
);
