// src/middleware/validationMiddleware.ts
import type { Request, Response, NextFunction } from 'express';
import type { z } from 'zod';

import { StatusCodes } from 'http-status-codes';

export function validateData(schema: z.ZodObject<any, any>) {
  return (req: Request, res: Response, next: NextFunction) => {
    const validatedFields = schema.safeParse(req.body);
    if (!validatedFields.success) {
      res.status(StatusCodes.BAD_REQUEST).json({
        message: 'invalid data',
        errors: validatedFields.error.flatten().fieldErrors,
      });
    } else {
      req.body = validatedFields.data;
      next();
    }
  };
}
