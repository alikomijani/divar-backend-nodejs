import { BASE_URL } from '@/configs/app.configs';
import type { Controller } from '@/types/express';
import { StatusCodes } from 'http-status-codes';
import path from 'path';

export const uploadController: Controller = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'No file uploaded',
      });
    }

    const relativePath = path.relative('public', req.file.path);
    if (relativePath.startsWith('..')) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'File path is invalid',
      });
    }
    const url = BASE_URL + '/' + relativePath.replace(/\\/g, '/'); // handle windows path

    return res.status(StatusCodes.OK).json({
      success: true,
      message: 'File uploaded successfully',
      url,
    });
  } catch (error) {
    console.error('File upload error:', error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'File upload failed',
    });
  }
};
