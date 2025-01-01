import type { Document, Model } from 'mongoose';
import { Types } from 'mongoose';
import mongoose, { Schema } from 'mongoose';
import { z } from 'zod';
import type { ColorType } from './color.model';
import type { BadgeType } from './badge.model';
import refValidator from '@/utils/ref-validator';
import { ProductSellerPriceModel } from './productSellers.model';

// Zod Schemas for subdocuments
const ReviewSchemaZod = z.object({
  title: z.string().min(1, 'Review title is required').trim(),
  value: z.string().min(1, 'Review value is required').trim(),
  name: z.string().min(1, 'Review name is required').trim(),
});

const SpecificationSchemaZod = z.object({
  title: z.string().min(1, 'Specification title is required').trim(),
  value: z.string().min(1, 'Specification value is required').trim(),
  name: z.string().min(1, 'Specification name is required').trim(),
});

const ImageSchemaZod = z.object({
  main: z.string().url('Main image must be a valid URL').trim(),
  list: z
    .array(z.string().url('List images must be valid URLs').trim())
    .optional(),
});

// Main Product Zod Schema
export const ProductSchemaZod = z.object({
  code: z.number().int().positive('Code must be a positive integer'),
  title_fa: z.string().min(1, 'Title (FA) is required').trim(),
  title_en: z.string().min(1, 'Title (EN) is required').trim(),
  status: z.enum(['marketable', 'unmarketable']).default('marketable'),
  images: ImageSchemaZod,
  // colors: z
  //   .array(
  //     z
  //       .string()
  //       .refine(
  //         (val) => mongoose.Types.ObjectId.isValid(val),
  //         'Invalid Color ID',
  //       ),
  //   )
  //   .optional(),
  badges: z
    .array(
      z
        .string()
        .refine(
          (val) => mongoose.Types.ObjectId.isValid(val),
          'Invalid Badge ID',
        ),
    )
    .optional(),
  category: z
    .string()
    .refine(
      (val) => mongoose.Types.ObjectId.isValid(val),
      'Invalid Category ID',
    ),
  brand: z
    .string()
    .refine((val) => mongoose.Types.ObjectId.isValid(val), 'Invalid Brand ID'),
  review: z.array(ReviewSchemaZod).optional(),
  specifications: z.array(SpecificationSchemaZod).optional(),
  expert_reviews: z.string().trim().optional(),
});

export type ProductType = z.infer<typeof ProductSchemaZod>;

// Mongoose Interface
export interface IProduct
  extends Omit<ProductType, 'colors' | 'badges' | 'category' | 'brand'>,
    Document {
  code: number;
  title_fa: string;
  title_en: string;
  status: 'marketable' | 'unmarketable';
  images: {
    main: string;
    list: string[];
  };
  colors: Types.DocumentArray<
    mongoose.Types.Subdocument<Types.ObjectId> & ColorType
  >;
  badges: Types.DocumentArray<
    mongoose.Types.Subdocument<Types.ObjectId> & BadgeType
  >;
  category: Types.ObjectId;
  brand: Types.ObjectId;
  review: { title: string; value: string; name: string }[];
  specifications: { title: string; value: string; name: string }[];
  expert_reviews?: string;
  createdAt: Date;
  updatedAt: Date;
}
interface ProductModelStatic extends Model<IProduct> {
  getLastPricesForProduct(productId: string): Promise<
    {
      seller: Types.ObjectId;
      lastPrice: number;
      create_at: Date;
      discount: number;
      count: number;
    }[]
  >;
}
// Mongoose Schema
const ProductSchema = new Schema<IProduct>(
  {
    code: { type: Number, required: true, unique: true, immutable: true },
    title_fa: { type: String, required: true, trim: true },
    title_en: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ['marketable', 'unmarketable'],
      default: 'marketable',
    },
    images: {
      main: { type: String, required: true, trim: true },
      list: { type: [String], default: [] },
    },
    badges: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Badge',
        validate: refValidator('Badge'),
      },
    ],
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
      validate: refValidator('Category'),
    },
    brand: {
      type: Schema.Types.ObjectId,
      ref: 'Brand',
      validate: refValidator('Brand'),
    },
    review: {
      type: [
        {
          name: { type: String, required: true, trim: true },
          title: { type: String, required: true, trim: true },
          value: { type: String, required: true, trim: true },
        },
      ],
      default: [],
    },
    specifications: {
      type: [
        {
          name: { type: String, required: true, trim: true },
          title: { type: String, required: true, trim: true },
          value: { type: String, required: true, trim: true },
        },
      ],
      default: [],
    },
    expert_reviews: { type: String, trim: true },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

ProductSchema.statics.getLastPricesForProduct = async function (
  productId: string,
) {
  try {
    const lastPrices = await ProductSellerPriceModel.aggregate([
      { $match: { product: new Types.ObjectId(productId) } },
      { $sort: { createAt: -1 } },
      {
        $group: {
          _id: '$seller',
          lastPrice: { $first: '$price' },
          create_at: { $first: '$create_at' },
          discount: { $first: '$discount' },
          count: { $first: '$count' },
        },
      },
      { $match: { count: { $gte: 1 } } }, // Add this $match stage
      {
        $project: {
          _id: 0,
          seller: '$_id',
          lastPrice: 1,
          create_at: 1,
          discount: 1,
          count: 1,
        },
      },
    ]);
    return lastPrices;
  } catch (error) {
    console.error('Error fetching last prices:', error);
    throw error; // Re-throw the error to be handled by the caller
  }
};

ProductSchema.index({ code: 1 }, { unique: true }); // Unique index for code
ProductSchema.index({ code: 1, category: 1, brand: 1 });
export const ProductModel = mongoose.model<IProduct, ProductModelStatic>(
  'Product',
  ProductSchema,
);

export default ProductModel;
