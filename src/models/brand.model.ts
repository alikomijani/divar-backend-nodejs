import type { Document } from 'mongoose';
import mongoose from 'mongoose';

export interface IBrand extends Document {
  title_fa: string;
  title_en: string;
  slug: string;
  logo: string;
}
export const BrandSchema = new mongoose.Schema<IBrand>({
  title_fa: { type: String, required: true },
  title_en: { type: String, required: true },
  slug: { type: String, required: true },
  logo: { type: String },
});

export const BrandModel = mongoose.model('Brand', BrandSchema);
