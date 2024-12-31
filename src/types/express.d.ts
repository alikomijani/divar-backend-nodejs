declare global {
  namespace Express {
    interface Request {
      user?: RequestUser;
    }
  }
}
enum UserRole {
  User = 1,
  Seller = 2,
  Admin = 3,
}
export interface RequestUser {
  id: string; // Or Types.ObjectId if applicable
  profile: string;
  seller?: string;
  role: UserRole;
}
