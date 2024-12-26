import type { Document } from 'mongoose';
import mongoose from 'mongoose';

export interface IColor extends Document {
  title: string;
  hex_code: string;
}
export const ColorSchema = new mongoose.Schema<IColor>({
  title: { type: String, required: true },
  hex_code: { type: String, required: true },
});
export const ColorModel = mongoose.model('Color', ColorSchema);
