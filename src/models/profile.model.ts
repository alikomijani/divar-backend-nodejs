import mongoose, { Schema } from 'mongoose';
import type { Document, Types } from 'mongoose';
import { z } from 'zod';

// Zod Schemas
const locationSchemaZod = z.tuple([z.number(), z.number()]);

export const addressSchemaZod = z.object({
  location: locationSchemaZod,
  street: z.string().min(1, 'Street is required'),
  city: z.string().min(1, 'City is required'),
  postalCode: z.string().min(1, 'Postal code is required'),
});

export const profileSchemaZod = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  nationCode: z.string().optional(),
  mobile: z.string().optional(),
  birthday: z.string().datetime().optional(),
  addressList: z.array(addressSchemaZod).default([]),
});

export interface ProfileType extends Document {
  user: Types.ObjectId;
  firstName?: string;
  lastName?: string;
  nationCode?: string;
  mobile?: string;
  birthday?: Date;
  addressList: {
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
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    nationCode: {
      type: String,
    },
    mobile: {
      type: String,
    },
    birthday: {
      type: Date,
    },
    addressList: {
      type: [addressSchema],
      default: [],
    },
  },
  { timestamps: true },
);
profileSchema.index({ user: 1 }, { unique: true });

profileSchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret) {
    delete ret._id;
    delete ret.__v;
  },
});
profileSchema.set('toObject', {
  virtuals: true,
});

const ProfileModel = mongoose.model<ProfileType>('Profile', profileSchema);

export default ProfileModel;
