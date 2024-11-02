import type { Role } from '@/users/users.schema';
import type { Request, Response, NextFunction } from 'express';

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

export type Controller<QueryParams = object, ReqBody = object, V = object> = (
  req: Request<QueryParams, any, ReqBody, V>,
  res: Response,
  next: NextFunction,
) => Promise<Response | any> | any;
