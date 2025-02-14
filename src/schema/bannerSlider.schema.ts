import type { Document } from 'mongoose';
import mongoose, { Schema } from 'mongoose';
import { z } from 'zod';

// Define the common image schema
const imageSchema = z.object({
  href: z.string(),
  src: z.string(),
});

// Define the base schema
export const BannerSliderSchemaZod = z.discriminatedUnion('type', [
  // Schema for 'banner' type
  z.object({
    type: z.literal('banner'),
    page: z.string(),
    order: z.number(), // Required for banners
    count: z.union([z.literal(1), z.literal(2), z.literal(4)]), // Fix: Use z.union instead of z.enum
    images: z.array(imageSchema),
  }),
  // Schema for 'slider' type
  z.object({
    type: z.literal('slider'),
    page: z.string(),
    order: z.number().optional(), // Optional for sliders
    count: z.number().optional(), // Optional for sliders
    images: z.array(imageSchema),
  }),
]);
export type ImageSlideType = z.infer<typeof BannerSliderSchemaZod>;

const ImageSchema = new Schema({
  href: { type: String, required: true },
  src: { type: String, required: true },
});

// Define the Mongoose schema interface
interface IBannerSlider extends Document {
  type: 'banner' | 'slider';
  page: string;
  images: { href: string; src: string }[];
  order?: number | null;
  count?: 1 | 2 | 4 | null;
}

// Define the BannerSlider schema
const BannerSliderSchema = new Schema<IBannerSlider>({
  type: { type: String, required: true, enum: ['banner', 'slider'] },
  page: { type: String, required: true },
  images: { type: [ImageSchema], required: true },
  order: {
    type: Number,
    required: function (this: IBannerSlider) {
      return this.type === 'banner';
    },
    default: null,
  },
  count: {
    type: Number,
    enum: [1, 2, 4],
    required: function (this: IBannerSlider) {
      return this.type === 'banner';
    },
    default: null,
  },
});
BannerSliderSchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret) {
    delete ret.__v;
    delete ret._id;
  },
});
BannerSliderSchema.set('toObject', {
  virtuals: true,
});
ImageSchema.set('toObject', {
  virtuals: true,
});
ImageSchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret) {
    delete ret.__v;
    delete ret._id;
  },
});
// Create and export the model
export const BannerSliderModel = mongoose.model<IBannerSlider>(
  'BannerSlider',
  BannerSliderSchema,
);
