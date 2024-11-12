import type { ICategory, ICategoryProperty } from '@/types/category.types';
import mongoose, { Schema } from 'mongoose';

const propertySchema = new Schema<ICategoryProperty>({
  name: { type: String, required: true },
  label: { type: String, required: true },
  type: { type: String, required: true },
  options: [
    {
      label: { type: String, required: true },
      value: { type: Schema.Types.Mixed, required: true },
    },
  ],
});

const categorySchema = new Schema<ICategory>({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  icon: { type: String, required: false },
  properties: { type: [propertySchema], default: [] },
  parent: {
    type: mongoose.Types.ObjectId,
    ref: 'Category',
    required: false,
  },
});

// Add a virtual ID field
categorySchema.virtual('id').get(function () {
  return String(this._id);
});

// Set JSON and Object transformations
categorySchema.set('toJSON', {
  virtuals: true,
  transform: (_, ret) => {
    delete ret._id;
    delete ret.__v;
  },
});

categorySchema.set('toObject', {
  virtuals: true,
});

// Index for unique slug field
categorySchema.index({ slug: 1 }, { unique: true });

export const categoryModel = mongoose.model<ICategory>(
  'Category',
  categorySchema,
);

export const propertyModel = mongoose.model<ICategoryProperty>(
  'Property',
  propertySchema,
);
