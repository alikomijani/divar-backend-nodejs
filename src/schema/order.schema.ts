import type { Types, Document } from 'mongoose';
import mongoose, { Schema } from 'mongoose';
import { z } from 'zod';
import { addressSchemaZod } from './profile.schema'; // Assuming this exists

interface IOrderItem extends Document {
  productSeller: Types.ObjectId;
  quantity: number;
  order: Types.ObjectId; // Add reference back to the Order
  seller: Types.ObjectId; // Add reference back to the Seller
}

const OrderItemSchema = new Schema<IOrderItem>({
  productSeller: {
    type: Schema.Types.ObjectId,
    ref: 'ProductSellers',
    required: true,
  },
  quantity: { type: Number, required: true },
  order: { type: Schema.Types.ObjectId, ref: 'Order' }, // Reference to the Order
  seller: { type: Schema.Types.ObjectId, ref: 'Seller', required: true }, // Make it required
});

export enum OrderStatus {
  Pending = 'pending',
  Processing = 'processing',
  Shipped = 'shipped',
  Delivered = 'delivered',
  Cancelled = 'cancelled',
}
export interface IOrder extends Document {
  user: Types.ObjectId;
  deliveryDate: Date;
  orderStatus: OrderStatus;
  shippingAddress: {
    street: string;
    city: string;
    postalCode: string;
  };
  orderItems: Types.ObjectId[]; // Store an array of ObjectIds referencing OrderItems
}

const OrderSchema = new Schema<IOrder>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    deliveryDate: { type: Date, default: Date.now },
    orderStatus: {
      type: String,
      enum: OrderStatus,
      default: OrderStatus.Pending,
    },
    shippingAddress: {
      street: { type: String },
      city: { type: String },
      postalCode: { type: String },
      location: {
        type: [Number],
      },
    },
    orderItems: [{ type: Schema.Types.ObjectId, ref: 'OrderItem' }], // Array of OrderItem references
  },
  {
    timestamps: true,
  },
);

export const OrderModel = mongoose.model<IOrder>('Order', OrderSchema);
export const OrderItemModel = mongoose.model<IOrderItem>(
  'OrderItem',
  OrderItemSchema,
);

// Zod Validation (unchanged - this is the key to your requirement)
export const OrderSchemaZod = z.object({
  shippingAddress: addressSchemaZod,
  deliveryDate: z.string().datetime(), // More precise date/time validation
  orderItems: z
    .array(
      z.object({
        productSeller: z
          .string()
          .refine(
            (val) => mongoose.Types.ObjectId.isValid(val),
            'Invalid ProductSeller ID',
          ),
        quantity: z.number().positive().min(1).int(),
      }),
    )
    .min(1),
});
OrderSchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret) {
    delete ret.__v;
    delete ret._id;
  },
});
OrderSchema.set('toObject', {
  virtuals: true,
});
export type OrderSchemaType = z.infer<typeof OrderSchemaZod>;
