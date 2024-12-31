import type { Types, Document } from 'mongoose';
import mongoose, { Schema } from 'mongoose';

interface IOrder extends Document {
  user: Types.ObjectId; // Reference to the user who placed the order
  orderDate: Date;
  orderStatus: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'; // e.g.,
  totalAmount: number;
  shippingAddress: {
    // Store shipping address details
    street: string;
    city: string;
    postalCode: string;
    country: string;
    // ... other address fields
  };
  // ... other order-level fields (e.g., payment method, tracking number)
}

const OrderSchema = new Schema<IOrder>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  orderDate: { type: Date, default: Date.now },
  orderStatus: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending',
  },
  totalAmount: { type: Number, required: true },
  shippingAddress: {
    street: { type: String },
    city: { type: String },
    postalCode: { type: String },
    country: { type: String },
  },
});

export const OrderModel = mongoose.model<IOrder>('Order', OrderSchema);

interface IOrderItem extends Document {
  order: Types.ObjectId; // Reference to the order
  product: Types.ObjectId; // Reference to the product
  productSeller: Types.ObjectId; // Reference to ProductSeller
  quantity: number;
}

const OrderItemSchema = new Schema<IOrderItem>({
  order: { type: Schema.Types.ObjectId, ref: 'Order', required: true },
  product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  productSeller: {
    type: Schema.Types.ObjectId,
    ref: 'ProductSeller',
    required: true,
  }, // Reference to ProductSeller
  quantity: { type: Number, required: true },
});

export const OrderItemModel = mongoose.model<IOrderItem>(
  'OrderItem',
  OrderItemSchema,
);
