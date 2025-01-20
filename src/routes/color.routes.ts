import express from 'express';

import {
  createColor,
  deleteColor,
  getAllColors,
  getColorById,
  updateColor,
} from '@/controllers/colors.controllers';
import { validateData } from '@/middlewares/validation.middleware';
import { ColorSchemaZod } from '@/models/color.model';
import { validateIdMiddleware } from '@/middlewares/validate-id.middleware';

const colorRouter = express.Router();

colorRouter.get('/', getAllColors); // Get all colors

colorRouter.post('/', validateData(ColorSchemaZod), createColor); // Create a new color

colorRouter.get('/:id', validateIdMiddleware, getColorById); // Update a color by ID

colorRouter.put(
  '/:id',
  validateIdMiddleware,
  validateData(ColorSchemaZod),
  updateColor,
); // Update a color by ID

colorRouter.delete('/:id', validateIdMiddleware, deleteColor); // Delete a color by ID

export default colorRouter;
