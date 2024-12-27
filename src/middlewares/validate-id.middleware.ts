import type { Controller } from '@/types/app.types';
import { isValidObjectId } from 'mongoose';
import { StatusCodes } from 'http-status-codes';

export const validateIdMiddleware: Controller<{ id: string }> = async (
  req,
  res,
  next,
) => {
  const { id } = req.params;
  if (!id) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: 'ID parameter is required',
    });
  }
  if (!isValidObjectId(id)) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: 'Invalid ID format', // More specific message
    });
  }
  next();
};
