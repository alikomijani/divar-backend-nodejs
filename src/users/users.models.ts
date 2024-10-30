export interface CreateUser {
  id: number;
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}
export interface UserInfo {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
}
export interface LoginUserBody {
  username: string;
  password: string;
}

export const users: CreateUser[] = [];
