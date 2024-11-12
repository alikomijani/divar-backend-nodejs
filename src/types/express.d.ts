import type { Role } from '@/models/user.model';

declare global {
  namespace Express {
    export interface Request {
      user?: RequestUserType;
    }
  }
}
export type RequestUserType = {
  id: number;
  username: string;
  role: Role;
};
