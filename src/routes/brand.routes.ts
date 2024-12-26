import express from 'express';
import {
  loginMiddleware,
  roleMiddleware,
} from '@/middlewares/authentication.middleware';
import {
  createBrand,
  deleteBrand,
  getAllBrands,
  updateBrand,
} from '@/controllers/brand.controllers';
import { validateData } from '@/middlewares/validation.middleware';
import { BrandSchemaZod } from '@/models/brand.model';
import { UserRole } from '@/models/user.model';

const brandRouter = express.Router();

brandRouter.post(
  '/',
  loginMiddleware,
  roleMiddleware(UserRole.Admin),
  validateData(BrandSchemaZod),
  createBrand,
); // Create a new brand
brandRouter.get('/', getAllBrands); // Get all cities
brandRouter.put(
  '/:id',
  loginMiddleware,
  roleMiddleware(UserRole.Admin),
  validateData(BrandSchemaZod),
  updateBrand,
); // Update a brand by ID
brandRouter.delete(
  '/:id',
  loginMiddleware,
  roleMiddleware(UserRole.Admin),
  deleteBrand,
); // Delete a brand by ID

export default brandRouter;
