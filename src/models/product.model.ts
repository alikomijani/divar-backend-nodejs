import mongoose from 'mongoose';
import type { IBrand } from './brand.model';
import { BrandSchema } from './brand.model';
import type { ICategory } from '@/types/category.types';
import { CategorySchema } from './category.model';
import type { IColor } from './color.model';
import { ColorSchema } from './color.model';
import type { IBadge } from './badge.model';
import { BadgeSchema } from './badge.model';

export interface IProduct extends mongoose.Document {
  code: number;
  title_fa: string;
  title_en: string;
  status: 'marketable' | 'unmarketable';
  images: {
    main: string;
    list: string[];
  };
  colors: IColor[];
  badges: IBadge[];
  category: ICategory; // Assuming CategorySchema has an interface
  brand: IBrand; // Assuming BrandSchema has an interface
  review: { title: string; value: string }[];
  specifications: { title: string; value: string }[];
  expert_reviews?: string;
}

const ProductSchema = new mongoose.Schema<IProduct>(
  {
    code: {
      type: Number,
      required: [true, 'Product code is required'],
      unique: true,
    },
    title_fa: {
      type: String,
      required: [true, 'Product title in Farsi is required'],
    },
    title_en: {
      type: String,
      required: [true, 'Product title in English is required'],
    },
    status: {
      type: String,
      enum: ['marketable', 'unmarketable'],
      default: 'marketable',
    },
    images: {
      main: { type: String, required: true },
      list: { type: [String], default: [] },
    },
    colors: [ColorSchema],
    badges: [BadgeSchema],
    category: { type: CategorySchema }, // Ensure CategorySchema is imported
    brand: { type: BrandSchema }, // Ensure BrandSchema is imported
    review: {
      type: [
        {
          title: { type: String, required: true },
          value: { type: String, required: true },
        },
      ],
      default: [],
    },
    specifications: {
      type: [
        {
          title: { type: String, required: true },
          value: { type: String, required: true },
        },
      ],
      default: [],
    },
    expert_reviews: { type: String },
  },
  {
    timestamps: true,
  },
);
ProductSchema.index({ code: 1, 'category._id': 1, 'brand._id': 1 });

export const ProductModel = mongoose.model('Product', ProductSchema);
