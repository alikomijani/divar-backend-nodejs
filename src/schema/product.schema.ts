import type { Document, Model } from 'mongoose';
import { Types } from 'mongoose';
import mongoose, { Schema } from 'mongoose';
import { z } from 'zod';
import type { ColorType } from './color.schema';
import type { BadgeType } from './badge.schema';
import refValidator from '@/utils/ref-validator';
import { ProductSellerPriceModel } from './productSellers.schema';
import type { ISeller } from './seller.schema';

const SpecificationSchemaZod = z.object({
  title: z.string().min(1, 'Specification title is required').trim(),
  value: z.string().min(1, 'Specification value is required').trim(),
  name: z.string().min(1, 'Specification name is required').trim(),
  isDefault: z.boolean(),
});

const ImageSchemaZod = z.object({
  main: z.string().url('Main image must be a valid URL').trim(),
  list: z
    .array(z.string().url('List images must be valid URLs').trim())
    .optional(),
});

// Main Product Zod Schema
export const ProductSchemaZod = z.object({
  code: z
    .number({ message: 'ali' })
    .int()
    .positive('Code must be a positive integer'),
  titleFa: z.string().min(1, 'Title (FA) is required').trim(),
  titleEn: z.string().min(1, 'Title (EN) is required').trim(),
  colors: z
    .array(
      z
        .string()
        .refine(
          (val) => mongoose.Types.ObjectId.isValid(val),
          'Invalid Color ID',
        ),
    )
    .optional(),
  status: z.enum(['marketable', 'unmarketable']).default('marketable'),
  images: ImageSchemaZod,
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
  specifications: z.array(SpecificationSchemaZod).optional(),
  review: z.string().trim().optional(),
  expert_review: z.string().trim().optional(),
});

export type ProductType = z.infer<typeof ProductSchemaZod>;

// Mongoose Interface
export interface IProduct
  extends Omit<ProductType, 'colors' | 'badges' | 'category' | 'brand'>,
    Document {
  code: number;
  titleFa: string;
  titleEn: string;
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
  specifications: {
    title: string;
    value: string;
    name: string;
    isDefault: boolean;
  }[];
  review?: string;
  expert_review?: string;
  createdAt: Date;
  updatedAt: Date;
  getBestSeller: () => Promise<{
    id: string;
    seller: ISeller;
    lastPrice: number;
    create_at: Date;
    discount: number;
    count: number;
  } | null>;
}
interface ProductModelStatic extends Model<IProduct> {
  getLastPricesForProduct(productId: string): Promise<
    {
      id: string;
      seller: ISeller;
      lastPrice: number;
      create_at: Date;
      discount: number;
      count: number;
    }[]
  >;
}

// Mongoose Schema
const ProductSchema = new Schema<IProduct, ProductModelStatic>(
  {
    code: { type: Number, required: true, unique: true, immutable: true },
    titleFa: { type: String, required: true, trim: true },
    titleEn: { type: String, required: true, trim: true },
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
    colors: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Color',
        validate: refValidator('Color'),
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

    specifications: {
      type: [
        {
          name: { type: String, required: true, trim: true },
          title: { type: String, required: true, trim: true },
          value: { type: String, required: true, trim: true },
          isDefault: { type: Boolean, required: true },
        },
      ],
      default: [],
    },
    review: { type: String, trim: true },
    expert_review: { type: String, trim: true },
  },
  {
    timestamps: true,
  },
);

ProductSchema.methods.getBestSeller = async function () {
  const model = this.constructor as ProductModelStatic;
  const lastPrices = await model.getLastPricesForProduct(this._id);
  if (!lastPrices || lastPrices.length === 0) {
    return null;
  }

  return lastPrices.reduce((best, seller) =>
    seller.lastPrice < best.lastPrice ? seller : best,
  );
};

ProductSchema.statics.getLastPricesForProduct = async function (
  productId: string,
) {
  try {
    const lastPrices = await ProductSellerPriceModel.aggregate([
      {
        $match: { product: new Types.ObjectId(productId), count: { $gte: 1 } },
      }, // Filter early
      { $sort: { createdAt: -1 } }, // Sort before grouping to get latest prices
      {
        $group: {
          _id: '$seller',
          lastPrice: { $first: '$price' },
          createdAt: { $first: '$createdAt' }, // Ensure correct field name
          discount: { $first: '$discount' },
          count: { $first: '$count' },
          id: { $first: '$_id' },
        },
      },
      {
        $lookup: {
          from: 'sellers',
          localField: '_id',
          foreignField: '_id',
          as: 'sellerDetails',
        },
      },
      { $unwind: '$sellerDetails' }, // Unwind joined seller details
      {
        $project: {
          _id: 0,
          seller: '$sellerDetails',
          lastPrice: 1,
          createdAt: 1,
          discount: 1,
          count: 1,
          id: 1,
        },
      },
    ]);
    return lastPrices;
  } catch (error) {
    console.error('Error fetching last prices:', error);
    throw error;
  }
};

ProductSchema.index({ code: 1, category: 1, brand: 1 });

ProductSchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret) {
    delete ret.__v;
    delete ret._id;
  },
});
ProductSchema.set('toObject', {
  virtuals: true,
});

export const ProductModel = mongoose.model<IProduct, ProductModelStatic>(
  'Product',
  ProductSchema,
);

export default ProductModel;
