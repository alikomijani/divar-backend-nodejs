import { z } from 'zod';
import { CategorySchema } from './category.validation';

export const BadgeSchema = z.object({
  icon: z.string().url(),
  title: z.string(),
});

export const ColorSchema = z.object({
  title: z.string(),
  hex_code: z.string(),
});

export const BrandSchema = z.object({
  title_fa: z.string(),
  title_en: z.string(),
  slug: z.string(),
  logo: z.string().url(),
});

export const ProductSchema = z.object({
  code: z.number().int(),
  title_fa: z.string(),
  title_en: z.string(),
  status: z.enum(['marketable', 'unmarketable']).default('marketable'),
  images: z.object({
    main: z.string().url(),
    list: z.array(z.string().url()).default([]),
  }),
  colors: z.array(ColorSchema),
  badges: z.array(BadgeSchema),
  category: CategorySchema,
  brand: BrandSchema,
  review: z.array(
    z.object({
      title: z.string(),
      values: z.string(),
    }),
  ),
  specifications: z.array(
    z.object({
      title: z.string(),
      values: z.string(),
    }),
  ),
  expert_reviews: z.string(),
});
