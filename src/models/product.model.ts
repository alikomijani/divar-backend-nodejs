import { CategorySchema } from '@/validations/category.validation';
import type { Document } from 'mongoose';
import mongoose from 'mongoose';
import { BrandSchema } from './brand.model';

export interface IColor extends Document {
  title: string;
  hex_code: string;
}
export interface IBadge extends Document {
  icon: string;
  title: string;
}
export const BadgeSchema = new mongoose.Schema<IBadge>({
  icon: { type: String },
  title: { type: String },
});

const ColorSchema = new mongoose.Schema<IColor>({
  title: { type: String },
  hex_code: { type: String },
});

const ProductSchema = new mongoose.Schema({
  code: { type: Number, required: true, unique: true },
  title_fa: { type: String, required: true },
  title_en: { type: String, required: true },
  status: {
    type: String,
    enum: ['marketable', 'unmarketable'],
    default: 'marketable',
  },
  images: {
    main: { type: String, require: true },
    list: { type: [String], default: [] },
  },
  colors: [ColorSchema],
  badges: [BadgeSchema],
  category: { type: CategorySchema },
  brand: { type: BrandSchema },
  review: [
    {
      title: { type: String, require: true },
      value: { type: String, require: true },
    },
  ],
  specifications: [
    {
      title: { type: String, require: true },
      value: { type: String, require: true },
    },
  ],
  expert_reviews: { type: String },
});

export const ColorModel = mongoose.model('Color', ColorSchema);
export const BadgeModel = mongoose.model('Badge', BadgeSchema);
export const ProductModel = mongoose.model('Product', ProductSchema);
