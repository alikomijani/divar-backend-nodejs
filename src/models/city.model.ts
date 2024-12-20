import type { ICity } from '@/types/city.types';
import mongoose from 'mongoose';

const CitySchema = new mongoose.Schema<ICity>({
  name: { type: String, required: true },
  code: { type: String, required: true }, // Make username unique
  slug: { type: String, required: true, unique: true, index: 1 },
});

CitySchema.virtual('id').get(function () {
  return String(this._id);
});

CitySchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret) {
    delete ret._id;
    delete ret.__v;
  },
});

CitySchema.set('toObject', {
  virtuals: true,
});

export const City = mongoose.model<ICity>('City', CitySchema);
