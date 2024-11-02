import type { CreateUser } from './users.schema';
import { userModel } from './users.schema';

export async function createUserDB(userData: CreateUser) {
  const user = new userModel({
    ...userData,
  });
  await user.save();
  return user;
}
export async function findUser(query: Partial<CreateUser>) {
  return await userModel.findOne(query);
}
