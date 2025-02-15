import type { Document, Types } from 'mongoose';
import { model, Schema } from 'mongoose';
import { z } from 'zod';

export const AddProductSellerPriceSchemaZod = z.object({
  price: z.number().int().min(0).positive(),
  count: z.number().int().min(0).positive(),
  discount: z.number().int().min(0).max(100),
});

interface IProductSellerPrice extends Document {
  product: Types.ObjectId;
  seller: Types.ObjectId;
  price: number;
  discount: number;
  count: number;
  createAt: Date;
}

export const ProductSellerPriceSchema = new Schema<IProductSellerPrice>(
  {
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    seller: { type: Schema.Types.ObjectId, ref: 'Seller', required: true },
    price: { type: Number, required: true },
    count: { type: Number, require: true },
    discount: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  },
);
ProductSellerPriceSchema.index({ product: 1, seller: 1, date: -1 }); // Index for efficient retrieval of last price
ProductSellerPriceSchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret) {
    delete ret.__v;
    delete ret._id;
  },
});
ProductSellerPriceSchema.set('toObject', {
  virtuals: true,
});
export const ProductSellerPriceModel = model<IProductSellerPrice>(
  'ProductSellers',
  ProductSellerPriceSchema,
);
