import mongoose from 'mongoose';

export default function refValidator(model: string) {
  return {
    async validator(value: mongoose.Types.ObjectId) {
      try {
        const obj = await mongoose.model(model).findById(value).lean();
        return !!obj; // Returns true if obj exists, false otherwise
      } catch (error) {
        console.error(error);
        return false; // Handle potential errors during the lookup
      }
    },
    message: `Invalid ${model} ID`,
  };
}
