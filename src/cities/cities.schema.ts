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

citySchema.virtual('id').get(function () {
  return String(this._id);
});

citySchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret) {
    delete ret._id;
    delete ret.__v;
  },
});

citySchema.set('toObject', {
  virtuals: true,
});

citySchema.index({ slug: 1 }, { unique: true });

export const cityModel = mongoose.model<ICity>('City', citySchema);
