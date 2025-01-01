import type { Request, Response, NextFunction } from 'express';

// More specific type for query parameters
export type Query<T> = Record<keyof T, string | string[] | undefined>;

// Improved Controller type
export type Controller<
  Params = object, // Route parameters (e.g., /users/:id)
  ResBody = any, // Response body type
  ReqBody = object, // Request body type
  Locals extends Record<string, any> = Record<string, any>, // Add Locals type
> = (
  req: Request<Params, ResBody, ReqBody, Query<any>, Locals>,
  res: Response<
    | ResBody
    | {
        message: string;
        success: boolean;
        errors?: Record<string, string | string[]>;
      },
    Locals
  >,
  next: NextFunction,
) => Promise<Response<any> | any> | void;

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
interface RequestUser {
  id: string; // Or Types.ObjectId if applicable
  role: UserRole;
  sellerId?: string;
}
