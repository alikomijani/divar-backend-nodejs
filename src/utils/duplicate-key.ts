import { StatusCodes } from 'http-status-codes';
import { MongoServerError } from 'mongodb';
import type { Response } from 'express';
import mongoose from 'mongoose';

export function handleMongooseError(error: any, res: Response) {
  if (error instanceof MongoServerError && error.code === 11000) {
    // Handle duplicate slug error
    const duplicatedField = Object.keys(error.keyValue)[0];
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: `${duplicatedField} already exists. Please use a different ${duplicatedField}.`,
      errors: {
        [duplicatedField]: [
          `${duplicatedField} already exists. Please use a different ${duplicatedField}.`,
        ],
      },
    });
  } else if (error instanceof mongoose.Error.ValidationError) {
    const errorFields = Object.keys(error.errors);
    const errorDetails: Record<string, any> = {};
    errorFields.forEach((key) => {
      errorDetails[key] = [error.errors[key].message];
    });
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: `Invalid Data`,
      errors: errorDetails,
    });
  } else {
    console.log(error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message || 'server error',
    });
  }
}
