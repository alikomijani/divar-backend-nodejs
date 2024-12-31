import mongoose, { Schema } from 'mongoose';
import type { Document, Types } from 'mongoose';

export interface ProfileType extends Document {
  user: Types.ObjectId;
  first_name: string;
  last_name: string;
  nation_code: string;
  mobile: string;
  birthday: Date; // Store as Date object for proper date handling
  address_list: {
    location: [number, number]; // Corrected typo: lan -> lng (or lon)
    street: string;
    city: string;
    postalCode: string;
  }[];
}

const addressSchema = new Schema({
  location: {
    type: [Number], // Array of numbers for coordinates
    required: true,
  },
  street: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  postalCode: {
    type: String,
    required: true,
  },
});

const profileSchema = new Schema<ProfileType>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User', // Important: Reference to the User model
      required: true,
      unique: true,
      index: true,
    },
    first_name: {
      type: String,
      required: true,
    },
    last_name: {
      type: String,
      required: true,
    },
    nation_code: {
      type: String,
      required: true,
    },
    mobile: {
      type: String,
      required: true,
    },
    birthday: {
      type: Date,
      required: true,
    },
    address_list: {
      type: [addressSchema], // Use the address schema here
      default: [], // Important: Initialize as empty array
    },
  },
  { timestamps: true }, // Add timestamps for createdAt and updatedAt
);
profileSchema.index({ user: 1 }, { unique: true }); // Unique index for code
const ProfileModel = mongoose.model<ProfileType>('Profile', profileSchema);

export default ProfileModel;
