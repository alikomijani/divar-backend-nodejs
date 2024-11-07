import type { Request, Response, NextFunction } from 'express';

export type Controller<QueryParams = object, ReqBody = object, V = object> = (
  req: Request<QueryParams, any, ReqBody, V>,
  res: Response,
  next: NextFunction,
) => Promise<Response | any> | any;
