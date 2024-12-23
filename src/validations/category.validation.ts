import { z } from 'zod';

// Property schema
const PropertySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  label: z.string().min(1, 'Label is required'),
  type: z.string().min(1, 'Type is required'), // Adjust if you have specific allowed types
  options: z
    .array(
      z.object({
        label: z.string().min(1, 'Option label is required'),
        value: z.union([z.string(), z.number(), z.boolean()]), // Accepts string, number, or boolean
      }),
    )
    .optional(),
});

// Category schema
const CategorySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  slug: z.string().min(1, 'Slug is required'),
  icon: z.string().optional(),
  parent: z.string().optional(), // Assuming `parent` is an ObjectId, validated as a string
  properties: z.array(z.string()).optional().default([]),
});

export { CategorySchema, PropertySchema };
