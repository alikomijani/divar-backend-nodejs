import { checkHash, hash } from '@/utils/hash';
import { createAuthToken } from '@/utils/jwt';
import type { Document } from 'mongoose';
import mongoose from 'mongoose';

export enum Role {
  User,
  Admin,
}

export interface LoginUserBody {
  username: string;
  password: string;
}
export interface CreateUser {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: Role;
}
interface IUser extends CreateUser, Document {
  setPassword: (rawPassword: string) => Promise<void>;
  checkPassword: (rawPassword: string) => Promise<boolean>;
  createToken: () => {
    accessToken: string;
    refreshToken: string;
  };
}

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
  return this.firstName + ' ' + this.lastName;
});

userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await hash(this.password);
  }
  next();
});

userSchema.set('toJSON', {
  virtuals: true,
});
userSchema.set('toObject', {
  virtuals: true,
});

userSchema.index({ username: 1, email: 1 }, { unique: true });

export const userModel = mongoose.model('User', userSchema);
