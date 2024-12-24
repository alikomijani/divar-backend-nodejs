import type { ICategory } from '@/types/category.types';
import mongoose, { Schema } from 'mongoose';

const CategorySchema = new Schema<ICategory>({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true, index: 1 },
  icon: { type: String, required: false },
  returnReasonAlert: { type: String },
  properties: [
    {
      type: mongoose.Types.ObjectId,
      ref: 'Property',
    },
  ],
  parent: {
    type: mongoose.Types.ObjectId,
    ref: 'Category',
    required: false,
  },
});

// Add a virtual ID field
CategorySchema.virtual('id').get(function () {
  return String(this._id);
});

// Set JSON and Object transformations
CategorySchema.set('toJSON', {
  virtuals: true,
  transform: (_, ret) => {
    delete ret._id;
    delete ret.__v;
  },
});

CategorySchema.set('toObject', {
  virtuals: true,
});

export const CategoryModel = mongoose.model<ICategory>(
  'Category',
  CategorySchema,
);
