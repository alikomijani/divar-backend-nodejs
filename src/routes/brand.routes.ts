import express from 'express';
import {
  loginMiddleware,
  roleMiddleware,
} from '@/middlewares/authentication.middleware';
import { Role } from '@/types/user.types';
import {
  createBrand,
  deleteBrand,
  getAllBrands,
  updateBrand,
} from '@/controllers/brand.controllers';

const brandRouter = express.Router();

brandRouter.post('/', createBrand); // Create a new brand
brandRouter.get('/', getAllBrands); // Get all cities
brandRouter.put(
  '/:id',
  loginMiddleware,
  roleMiddleware(Role.Admin),
  updateBrand,
); // Update a brand by ID
brandRouter.delete(
  '/:id',
  loginMiddleware,
  roleMiddleware(Role.Admin),
  deleteBrand,
); // Delete a brand by ID

export default brandRouter;
