import mongoose from 'mongoose';

export interface ICity {
  name: string;
  code: string;
  slug: string;
}

const citySchema = new mongoose.Schema<ICity>({
  name: { type: String, required: true },
  code: { type: String, required: true }, // Make username unique
  slug: { type: String, required: true, unique: true },
});
citySchema.index({ slug: 1 }, { unique: true });

export const cityModel = mongoose.model<ICity>('City', citySchema);
