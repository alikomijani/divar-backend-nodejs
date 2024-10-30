import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { verifyToken } from '../utils/jwt';
import { Controller } from '../../types';

export const authMiddleware: Controller = async (
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
    if (decodedToken && decodedToken.id && decodedToken.username) {
      req.user = {
        id: decodedToken.id,
        username: decodedToken.username,
      };
      return next();
    } else {
      throw new Error('Invalid token structure');
    }
  } catch (error) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      success: false,
      message: 'Error! Token is invalid.',
    });
  }
};
