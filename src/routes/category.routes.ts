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

categoryRouter.get('/:id', getCategoryById);
categoryRouter.put(
  '/:id',
  // loginMiddleware,
  // roleMiddleware(Role.Admin),
  validateData(CategorySchema),
  updateCategory,
);
categoryRouter.delete(
  '/:id',
  loginMiddleware,
  roleMiddleware(Role.Admin),
  deleteCategory,
);

export default categoryRouter;
