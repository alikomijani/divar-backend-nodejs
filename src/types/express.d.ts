import type { UserRole } from '@/models/user.model';

declare global {
  namespace Express {
    interface Request {
      user?: RequestUser;
    }
  }
}

export interface RequestUser {
  id: string; // Or Types.ObjectId if applicable
  email: string;
  role: UserRole;
}
