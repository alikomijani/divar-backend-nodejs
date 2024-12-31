import { StatusCodes } from 'http-status-codes';
import { MongoServerError } from 'mongodb';
import type { Response } from 'express';

export function duplicateKey(error: any, res: Response) {
  if (error instanceof MongoServerError && error.code === 11000) {
    // Handle duplicate slug error
    const duplicatedField = Object.keys(error.keyValue)[0];
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: `${duplicatedField} already exists. Please use a different ${duplicatedField}.`,
      errors: {
        [duplicatedField]: `${duplicatedField} already exists. Please use a different ${duplicatedField}.`,
      },
    });
  } else {
    console.log(error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message || 'server error',
    });
  }
}
