import type { ICategoryProperty } from '@/types/category.types';
import mongoose, { Schema } from 'mongoose';

export const PropertySchema = new Schema<ICategoryProperty>({
  name: { type: String, required: true },
  label: { type: String, required: true },
  type: { type: String, required: true },
  options: [
    {
      label: { type: String, required: true },
      value: { type: String, required: true },
    },
  ],
});

PropertySchema.virtual('id').get(function () {
  return String(this._id);
});

PropertySchema.set('toJSON', {
  virtuals: true,
  transform: (_, ret) => {
    delete ret._id;
    delete ret.__v;
  },
});

PropertySchema.set('toObject', {
  virtuals: true,
});

export const PropertyModel = mongoose.model<ICategoryProperty>(
  'Property',
  PropertySchema,
);
