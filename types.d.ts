import type { Role } from '@/models/user.model';

declare global {
  namespace Express {
    export interface Request {
      user?: {
        id: number;
        username: string;
        role: Role;
      };
    }
  }
}
