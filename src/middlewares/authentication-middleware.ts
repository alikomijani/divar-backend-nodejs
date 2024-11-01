import type { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { verifyToken } from '../utils/jwt';
import type { Role } from '@/users/users.schema';
import type { Controller } from 'types';

export const loginMiddleware: Controller = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      success: false,
      message: 'Error! Token was not provided.',
    });
  }

  try {
    const decodedToken = verifyToken(token);
    if (
      decodedToken &&
      decodedToken.id &&
      decodedToken.username &&
      decodedToken.role
    ) {
      req.user = {
        id: decodedToken.id,
        username: decodedToken.username,
        role: decodedToken.role,
      };
      return next();
    } else {
      throw new Error('Invalid token structure');
    }
  } catch {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      success: false,
      message: 'Error! Token is invalid.',
    });
  }
};

export function roleMiddleware(requiredRole: Role) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (req.user?.role !== requiredRole) {
      res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: 'Error! Authorization fail!',
      });
    } else {
      next();
    }
  };
}
