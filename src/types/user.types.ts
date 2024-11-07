import type { Document } from 'mongoose';

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
export interface IUser extends CreateUser, Document {
  setPassword: (rawPassword: string) => Promise<void>;
  checkPassword: (rawPassword: string) => Promise<boolean>;
  createToken: () => {
    accessToken: string;
    refreshToken: string;
  };
}
