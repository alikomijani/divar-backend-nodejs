import express from 'express';
import {
  loginMiddleware,
  roleMiddleware,
} from '@/middlewares/authentication.middleware';
import {
  createColor,
  deleteColor,
  getAllColors,
  updateColor,
} from '@/controllers/colors.controllers';
import { validateData } from '@/middlewares/validation.middleware';
import { UserRole } from '@/models/user.model';
import { ColorSchemaZod } from '@/models/color.model';

const colorRouter = express.Router();

colorRouter.get('/', getAllColors); // Get all colors

colorRouter.post(
  '/',
  loginMiddleware,
  roleMiddleware(UserRole.Admin),
  validateData(ColorSchemaZod),
  createColor,
); // Create a new color
colorRouter.put(
  '/:id',
  loginMiddleware,
  roleMiddleware(UserRole.Admin),
  validateData(ColorSchemaZod),
  updateColor,
); // Update a color by ID

colorRouter.delete(
  '/:id',
  loginMiddleware,
  roleMiddleware(UserRole.Admin),
  deleteColor,
); // Delete a color by ID

export default colorRouter;
