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
    order: z.number(),
    count: z.union([z.literal(1), z.literal(2), z.literal(4)]),
    images: z.array(imageSchema),
  }),
  // Schema for 'slider' type
  z.object({
    type: z.literal('slider'),
    page: z.string(),
    order: z.null().default(null), // Default to null
    count: z.null().default(null), // Default to null
    images: z.array(imageSchema),
  }),
]);
export type ImageSlideType = z.infer<typeof BannerSliderSchemaZod>;

const ImageSchema = new Schema({
  href: { type: String, required: true },
  src: { type: String, required: true },
});

// Define the BannerSlider schema
const BannerSliderSchema = new Schema<ImageSlideType>({
  type: { type: String, required: true, enum: ['banner', 'slider'] },
  page: { type: String, required: true },
  images: { type: [ImageSchema], required: true },
  order: {
    type: Number,
    required: function () {
      return this.type === 'banner'; // Required only if type is 'banner'
    },
    default: null, // Default to null if not provided
  },
  count: {
    type: Number,
    required: function () {
      return this.type === 'banner'; // Required only if type is 'banner'
    },
    enum: [1, 2, 4], // Only allow 1, 2, or 4
    default: null, // Default to null if not provided
  },
});

// Create the model
export const BannerSliderModel = mongoose.model(
  'BannerSlider',
  BannerSliderSchema,
);
