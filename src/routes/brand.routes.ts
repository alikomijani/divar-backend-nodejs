import express from 'express';
import {
  loginMiddleware,
  roleMiddleware,
} from '@/middlewares/authentication.middleware';
import {
  createBrand,
  deleteBrand,
  getAllBrands,
  getBrandBySlug,
  updateBrand,
} from '@/controllers/brand.controllers';
import { validateData } from '@/middlewares/validation.middleware';
import { BrandSchemaZod } from '@/models/brand.model';
import { UserRole } from '@/models/auth.model';

const brandRouter = express.Router();

brandRouter.get('/', getAllBrands); // Get all cities
brandRouter.get('/:slug', getBrandBySlug); // Get all cities

const brandAdminRouter = express.Router();
brandAdminRouter.get('/', getAllBrands); // Get all cities
brandAdminRouter.get('/:slug', getBrandBySlug); // Get all cities
brandAdminRouter.post(
  '/',
  loginMiddleware,
  roleMiddleware(UserRole.Admin),
  validateData(BrandSchemaZod),
  createBrand,
); // Create a new brand
brandAdminRouter.put(
  '/:slug',
  loginMiddleware,
  roleMiddleware(UserRole.Admin),
  validateData(BrandSchemaZod),
  updateBrand,
); // Update a brand by ID
brandAdminRouter.delete(
  '/:slug',
  loginMiddleware,
  roleMiddleware(UserRole.Admin),
  deleteBrand,
); // Delete a brand by ID

export { brandRouter, brandAdminRouter };
