import express from 'express';
import {
  loginMiddleware,
  roleMiddleware,
} from '@/middlewares/authentication.middleware';
import { Role } from '@/types/user.types';
import {
  createColor,
  deleteColor,
  getAllColors,
  updateColor,
} from '@/controllers/colors.controllers';
import { validateData } from '@/middlewares/validation.middleware';
import { ColorSchema } from '@/validations/product.validation';

const colorRouter = express.Router();

colorRouter.get('/', getAllColors); // Get all colors

colorRouter.post(
  '/',
  loginMiddleware,
  roleMiddleware(Role.Admin),
  validateData(ColorSchema),
  createColor,
); // Create a new color
colorRouter.put(
  '/:id',
  loginMiddleware,
  roleMiddleware(Role.Admin),
  validateData(ColorSchema),
  updateColor,
); // Update a color by ID

colorRouter.delete(
  '/:id',
  loginMiddleware,
  roleMiddleware(Role.Admin),
  deleteColor,
); // Delete a color by ID

export default colorRouter;
