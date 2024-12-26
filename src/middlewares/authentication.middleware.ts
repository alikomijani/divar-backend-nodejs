import { StatusCodes } from 'http-status-codes';
import { verifyToken } from '@/utils/jwt.utils';
import type { Controller } from '@/types/app.types';
import type { Role } from '@/types/user.types';

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
      username: decodedToken.username,
      role: decodedToken.role,
    };
    next();
  } catch {
    res.status(StatusCodes.UNAUTHORIZED).json({
      success: false,
      message: 'Error! Token is invalid.',
    });
  }
};

export function roleMiddleware(requiredRole: Role): Controller {
  return (req, res, next) => {
    const userRole = req.user?.role;
    if (!userRole) {
      res.status(StatusCodes.FORBIDDEN).json({
        success: false,
        message: 'Error! User role is not defined.',
      });
    }
    if (userRole < requiredRole) {
      res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: `Error! Authorization failed. Required role: ${requiredRole}, but user role is: ${userRole}`,
      });
    }
    next();
  };
}
