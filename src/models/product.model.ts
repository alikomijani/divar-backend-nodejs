import type { Document } from 'mongoose';
import mongoose from 'mongoose';

export interface IColor extends Document {
  title: string;
  hex_code: string;
}
export interface IBadge extends Document {
  icon: string;
  title: string;
}
export const BadgeSchema = new mongoose.Schema<IBadge>({
  icon: { url: { type: String } },
  title: { type: String },
});

const ColorSchema = new mongoose.Schema<IColor>({
  title: { type: String },
  hex_code: { type: String },
});

const ProductSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  title_fa: { type: String, required: true },
  title_en: { type: String, required: true },
  status: {
    type: String,
    enum: ['marketable', 'unmarketable'],
    default: 'marketable',
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

export const ColorModel = mongoose.model('Color', ColorSchema);
export const BadgeModel = mongoose.model('Badge', BadgeSchema);
export const ProductModel = mongoose.model('Product', ProductSchema);
