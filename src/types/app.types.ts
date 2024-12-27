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

export interface PaginatedResponse<T> {
  results: T[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}
