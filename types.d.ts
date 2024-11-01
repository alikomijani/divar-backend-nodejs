import { Role } from '@/users/users.schema';
import express from 'express';
import { Request, Response, NextFunction } from 'express';

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

export type Controller<QueryParams = {}, ReqBody = {}, V = {}> = (
  req: Request<QueryParams, any, ReqBody, V>,
  res: Response,
  next: NextFunction,
) => Promise<any>;
