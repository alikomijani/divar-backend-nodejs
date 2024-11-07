import { z } from 'zod';

// Filter schema
const FilterSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  label: z.string().min(1, 'Label is required'),
  type: z.string().min(1, 'Type is required'), // Adjust if you have specific allowed types
});

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
  parent: z.string().nullable(), // Assuming `parent` is an ObjectId, validated as a string
  filters: z.array(FilterSchema).optional().default([]),
  properties: z.array(PropertySchema).optional().default([]),
});

export { CategorySchema, FilterSchema, PropertySchema };
