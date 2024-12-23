import { Router } from 'express';
import {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from '../controllers/category.controllers';
import { validateData } from '@/middlewares/validation.middleware';
import { CategorySchema } from '../validations/category.validation';
import {
  loginMiddleware,
  roleMiddleware,
} from '@/middlewares/authentication.middleware';
import { Role } from '@/types/user.types';

const categoryRouter = Router();

categoryRouter.get('/', getAllCategories);

categoryRouter.post(
  '/',
  // loginMiddleware,
  // roleMiddleware(Role.Admin),
  validateData(CategorySchema),
  createCategory,
);

categoryRouter.get('/:slug', getCategoryById);
categoryRouter.put(
  '/:slug',
  // loginMiddleware,
  // roleMiddleware(Role.Admin),
  validateData(CategorySchema),
  updateCategory,
);
categoryRouter.delete(
  '/:slug',
  loginMiddleware,
  roleMiddleware(Role.Admin),
  deleteCategory,
);

export default categoryRouter;
