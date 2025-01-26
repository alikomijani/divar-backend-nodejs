import express from 'express';

import {
  createBrand,
  deleteBrand,
  getAllBrands,
  getBrandById,
  getBrandBySlug,
  updateBrand,
} from '@/controllers/brand.controllers';
import { validateData } from '@/middlewares/validation.middleware';
import { BrandSchemaZod } from '@/schema/brand.model';
import { validateIdMiddleware } from '@/middlewares/validate-id.middleware';

const brandRouter = express.Router();
brandRouter.get('/', getAllBrands); // Get all cities
brandRouter.get('/:slug', getBrandBySlug); // Get all cities

const brandAdminRouter = express.Router();
brandAdminRouter.get('/', getAllBrands); // Get all cities
brandAdminRouter.get('/:id', validateIdMiddleware, getBrandById); // Get all cities
brandAdminRouter.post('/', validateData(BrandSchemaZod), createBrand); // Create a new brand
brandAdminRouter.put(
  '/:id',
  validateIdMiddleware,
  validateData(BrandSchemaZod),
  updateBrand,
); // Update a brand by ID
brandAdminRouter.delete('/:id', validateIdMiddleware, deleteBrand); // Delete a brand by ID

export { brandRouter, brandAdminRouter };
