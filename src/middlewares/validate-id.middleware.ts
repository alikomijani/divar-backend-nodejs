import type { Controller } from '@/types/app.types';
import { isValidObjectId } from 'mongoose';

export const validateIdParam: Controller<{ id: string }> = (req, res, next) => {
  const { id } = req.params;
  if (id && !isValidObjectId(id)) {
    return res.status(400).json({ message: 'Invalid item ID' }); // Bad Request
  } else {
    next();
  }
};
