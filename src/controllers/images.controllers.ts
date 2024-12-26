import { BASE_URL } from '@/configs/app.configs';
import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

export const uploadController = (req: Request, res: Response) => {
  if (!req.file) {
    res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: 'No file uploaded',
    });
  } else {
    const filePath = req.file.path;
    res.status(StatusCodes.OK).json({
      success: true,
      message: 'File uploaded successfully',
      url: BASE_URL + filePath.split('/public')[1],
    });
  }
};
