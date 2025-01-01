import { StatusCodes } from 'http-status-codes';
import { verifyToken } from '@/utils/jwt.utils';
import type { UserRole } from '@/models/user.model';
import type { Controller } from '@/types/express';

export const loginMiddleware: Controller = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      success: false,
      message: 'Error! Token was not provided.',
    });
  }

  try {
    const decodedToken = verifyToken(token!);
    req.user = {
      id: decodedToken.id,
      role: decodedToken.role,
      sellerId: decodedToken.sellerId,
    };
    next();
  } catch {
    res.status(StatusCodes.UNAUTHORIZED).json({
      success: false,
      message: 'Error! Token is invalid.',
    });
  }
};

export function roleMiddleware(requiredRole: UserRole): Controller {
  return async (req, res, next) => {
    const userRole = req.user?.role;
    if (!userRole) {
      return res.status(StatusCodes.FORBIDDEN).json({
        success: false,
        message: 'Error! User role is not defined.',
      });
    }
    if (userRole < requiredRole) {
      return res.status(StatusCodes.FORBIDDEN).json({
        success: false,
        message: `Error! Authorization failed. Required role: ${requiredRole}, but user role is: ${userRole}`,
      });
    }
    next();
  };
}
