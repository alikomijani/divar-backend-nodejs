import type { Document } from 'mongoose';
import mongoose from 'mongoose';

export interface IColor extends Document {
  title: string;
  hex_code: string;
}
export interface IBadge extends Document {
  icon: string;
  title: string;
}
export const BadgeSchema = new mongoose.Schema<IBadge>({
  icon: { type: String, required: true },
  title: { type: String, required: true },
});
export const BadgeModel = mongoose.model('Badge', BadgeSchema);
