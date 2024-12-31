import mongoose, { Schema } from 'mongoose';
import type { Document, Types } from 'mongoose';
import { z } from 'zod';

// Zod Schemas
const locationSchemaZod = z.tuple([z.number(), z.number()]);

const addressSchemaZod = z.object({
  location: locationSchemaZod,
  street: z.string().min(1, 'Street is required'),
  city: z.string().min(1, 'City is required'),
  postalCode: z.string().min(1, 'Postal code is required'),
});

export const profileSchemaZod = z.object({
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  nation_code: z.string().optional(),
  mobile: z.string().optional(),
  birthday: z.string().datetime().optional(),
  address_list: z.array(addressSchemaZod).default([]),
});

export interface ProfileType extends Document {
  user: Types.ObjectId;
  first_name?: string;
  last_name?: string;
  nation_code?: string;
  mobile?: string;
  birthday?: Date;
  address_list: {
    location: [number, number];
    street: string;
    city: string;
    postalCode: string;
  }[];
}

const addressSchema = new Schema({
  location: {
    type: [Number],
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
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    first_name: {
      type: String,
    },
    last_name: {
      type: String,
    },
    nation_code: {
      type: String,
    },
    mobile: {
      type: String,
    },
    birthday: {
      type: Date,
    },
    address_list: {
      type: [addressSchema],
      default: [],
    },
  },
  { timestamps: true },
);
profileSchema.index({ user: 1 }, { unique: true });
const ProfileModel = mongoose.model<ProfileType>('Profile', profileSchema);

export default ProfileModel;
