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
          id: this.id,
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
    delete ret._id;
    delete ret.password;
    delete ret.__v;
  },
});
UserSchema.set('toObject', {
  virtuals: true,
});

UserSchema.index({ email: 1 }, { unique: true });

export const UserModel = mongoose.model('User', UserSchema);
export const LoginSchemaZod = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .trim()
    .or(z.string().email('Invalid Email')),
  password: z.string().min(6, 'Password must be at least 6 characters').trim(),
});

export const RegisterSchemaZod = z.object({
  email: z.string().email('Invalid Email').trim(),
  password: z.string().min(6, 'Password must be at least 6 characters').trim(),
  firstName: z.string().min(1, 'firstName is required'),
  lastName: z.string().min(1, 'lastName is required'),
});
export const RefreshTokenSchemaZod = z.object({
  refreshToken: z.string(),
});
export type LoginUser = z.infer<typeof LoginSchemaZod>;
export type RegisterUser = z.infer<typeof RegisterSchemaZod>;
