import type { Document } from 'mongoose';
import { model, Schema, Types } from 'mongoose';
import { z } from 'zod';

export const AddProductSellerPriceSchema = z.object({
  productId: z
    .string()
    .refine((val) => Types.ObjectId.isValid(val), 'Invalid product ID'),
  sellerId: z
    .string()
    .refine((val) => Types.ObjectId.isValid(val), 'Invalid seller ID'),
  price: z.number().int().min(0).positive(),
  count: z.number().int().min(0).positive(),
  discount: z.number().int().min(0).max(100).positive(),
});

interface IProductSellerPrice extends Document {
  product: Types.ObjectId;
  seller: Types.ObjectId;
  price: number;
  discount: number;
  count: number;
  create_at: Date;
}

export const ProductSellerPriceSchema = new Schema<IProductSellerPrice>({
  product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  seller: { type: Schema.Types.ObjectId, ref: 'Seller', required: true },
  price: { type: Number, required: true },
  count: { type: Number, require: true },
  discount: { type: Number, default: 0 },
  create_at: { type: Date, default: Date.now }, // Or version: { type: Number }
});
ProductSellerPriceSchema.index({ product: 1, seller: 1, date: -1 }); // Index for efficient retrieval of last price

export const ProductSellerPriceModel = model<IProductSellerPrice>(
  'ProductSellers',
  ProductSellerPriceSchema,
);
