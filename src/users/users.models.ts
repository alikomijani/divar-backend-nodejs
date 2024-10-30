import { hash } from '@/utils/hash';
import type { CreateUser } from './users.schema';
import { userModel } from './users.schema';

export async function createUserDB(userData: CreateUser) {
  const user = new userModel({
    ...userData,
    password: hash(userData.password),
  });
  await user.save();
  return user;
}
export async function findUser(query: Partial<CreateUser>) {
  return await userModel.findOne(query);
}
