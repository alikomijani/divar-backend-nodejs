import { checkHash, hash } from '@/utils/hash.utils';
import type { AuthTokens } from '@/utils/jwt.utils';
import { createAuthToken } from '@/utils/jwt.utils';
import type { Document } from 'mongoose';
import mongoose from 'mongoose';

import { z } from 'zod';

export enum UserRole {
  User = 1,
  Seller = 2,
  Admin = 3,
}
export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string; // for hashing, not exposed in responses
  role: UserRole;
  isActive: boolean;
  checkPassword(rawPassword: string): Promise<boolean>;
  setPassword(rawPassword: string): Promise<void>;
  createToken(sellerId?: string): AuthTokens;
}
const UserSchema = new mongoose.Schema<IUser>(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: {
      type: String,
      required: true,
      index: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true },
    role: { type: Number, enum: UserRole, default: UserRole.User },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
    methods: {
      checkPassword: async function (rawPassword: string) {
        return await checkHash(rawPassword, this.password);
      },
      setPassword: async function (rawPassword: string) {
        this.password = await hash(rawPassword);
        await this.save();
      },
      createToken: function (sellerId?: string) {
        return createAuthToken({
          id: this._id as string,
          role: this.role,
          sellerId,
        });
      },
    },
  },
);

UserSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await hash(this.password);
  }
  next();
});
UserSchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret) {
    delete ret.password;
    delete ret.__v;
    delete ret._id;
  },
});
UserSchema.set('toObject', {
  virtuals: true,
  transform: function (doc, ret) {
    delete ret.password;
  },
});

export const UserModel = mongoose.model('User', UserSchema);
export const LoginSchemaZod = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .trim()
    .or(z.string().email('Invalid Email')),
  password: z.string(),
  role: z.nativeEnum(UserRole),
});

export const RegisterSchemaZod = z.object({
  email: z.string().email('Invalid Email').trim(),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  firstName: z.string().min(1, 'firstName is required'),
  lastName: z.string().min(1, 'lastName is required'),
});

export const RegisterSellerSchemaZod = z.object({
  email: z.string().email('Invalid Email').trim(),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  firstName: z.string().min(1, 'firstName is required'),
  lastName: z.string().min(1, 'lastName is required'),
  shopName: z.string().min(1, 'name is required'),
  shopSlug: z.string().min(1, 'slug is required'),
});

export const UpdateUserSchemaZod = z.object({
  email: z.string().email('Invalid Email').trim(),
  firstName: z.string().min(1, 'firstName is required'),
  lastName: z.string().min(1, 'lastName is required'),
  role: z.nativeEnum(UserRole),
});

export const ChangePasswordSchemaZod = z.object({
  oldPassword: z.string(),
  newPassword: z.string().min(6, 'Password must be at least 6 characters'),
});

export const SetPasswordSchemaZod = z.object({
  oldPassword: z.string(),
  newPassword: z.string().min(6, 'Password must be at least 6 characters'),
});
export const RefreshTokenSchemaZod = z.object({
  refreshToken: z.string(),
});

export type LoginUser = z.infer<typeof LoginSchemaZod>;
export type RegisterUser = z.infer<typeof RegisterSchemaZod>;
export type RegisterSeller = z.infer<typeof RegisterSellerSchemaZod>;
export type UpdateUserType = z.infer<typeof UpdateUserSchemaZod>;
export type ChangePasswordType = z.infer<typeof ChangePasswordSchemaZod>;
export type SetPasswordType = z.infer<typeof SetPasswordSchemaZod>;
