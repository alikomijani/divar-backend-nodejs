import type { IUser } from '@/types/user.types';
import { checkHash, hash } from '@/utils/hash.utils';
import { createAuthToken } from '@/utils/jwt.utils';
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      index: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    username: {
      type: String,
      required: true,
      index: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true },
    firstName: { type: String },
    lastName: { type: String },
    role: { type: Number, default: 0 },
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
      createToken: function () {
        return createAuthToken({
          id: this.id,
          username: this.username,
          role: this.role,
        });
      },
    },
  },
);

userSchema.virtual('id').get(function () {
  return String(this._id);
});

userSchema.virtual('fullName').get(function () {
  if (this.firstName && this.password) {
    return this.firstName + ' ' + this.lastName;
  }
});

userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await hash(this.password);
  }
  next();
});
userSchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret) {
    delete ret._id;
    delete ret.password;
    delete ret.__v;
  },
});
userSchema.set('toObject', {
  virtuals: true,
});

userSchema.index({ username: 1, email: 1 }, { unique: true });

export const userModel = mongoose.model('User', userSchema);
