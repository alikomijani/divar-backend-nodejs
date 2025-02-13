import type { Document } from 'mongoose';
import mongoose, { Schema } from 'mongoose';
import z from 'zod';
// Zod Schemas
export const ImageSlideSchemaZod = z.object({
  tag: z.string().min(1, 'tag is required'),
  slides: z.array(
    z.object({
      image: z.string().url().trim().min(1, 'image is required'),
      href: z.string().url().min(1, 'href is required'),
    }),
  ),
});

export type ImageSlideType = z.infer<typeof ImageSlideSchemaZod>;

interface IImageSlide extends ImageSlideType, Document {}

const ImageSlideSchema = new Schema<IImageSlide>({
  tag: { type: String, required: true },
  slides: [
    {
      image: { type: String, required: true },
      href: { type: String, required: true },
    },
  ],
});

// Register model
export const ImageSlideModel = mongoose.model<IImageSlide>(
  'ImageSlide',
  ImageSlideSchema,
);
