import { checkHash, hash } from '@/utils/hash';
import { createAuthToken } from '@/utils/jwt';
import mongoose from 'mongoose';

export enum Role {
  User,
  Admin,
}
export interface CreateUser {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: Role;
}
export interface UserInfo {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
}
export interface LoginUserBody {
  username: string;
  password: string;
}
interface IUser extends CreateUser {
  setPassword: (rawPassword: string) => Promise<void>;
  checkPassword: (rawPassword: string) => boolean;
  createToken: () => {
    accessToken: string;
    refreshToken: string;
  };
}

const userSchema = new mongoose.Schema<IUser>({
  email: { type: String, required: true },
  username: { type: String, required: true, unique: true }, // Make username unique
  password: { type: String, required: true },
  firstName: { type: String },
  lastName: { type: String },
  role: { type: Number, default: 0 },
});
userSchema.index({ username: 1 }, { unique: true });
userSchema.methods.checkPassword = function (rawPassword: string) {
  return checkHash(rawPassword, this.password);
};
userSchema.methods.setPassword = async function (rawPassword: string) {
  this.password = hash(rawPassword);
  await this.save();
};

userSchema.methods.createToken = function () {
  return createAuthToken({
    id: this.id,
    username: this.username,
    role: this.role,
  });
};
export const userModel = mongoose.model('User', userSchema);
