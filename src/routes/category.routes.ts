import { Router } from 'express';
import {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from '../controllers/category.controllers';
import { validateData } from '@/middlewares/validation.middleware';
import {
  loginMiddleware,
  roleMiddleware,
} from '@/middlewares/authentication.middleware';
import { UserRole } from '@/models/user.model';
import { CategorySchemaZod } from '@/models/category.model';

const categoryRouter = Router();

categoryRouter.get('/', getAllCategories);

categoryRouter.post(
  '/',
  loginMiddleware,
  roleMiddleware(UserRole.Admin),
  validateData(CategorySchemaZod),
  createCategory,
);

categoryRouter.get('/:id', getCategoryById);
categoryRouter.put(
  '/:id',
  loginMiddleware,
  roleMiddleware(UserRole.Admin),
  validateData(CategorySchemaZod),
  updateCategory,
);
categoryRouter.delete(
  '/:id',
  loginMiddleware,
  roleMiddleware(UserRole.Admin),
  deleteCategory,
);

export default categoryRouter;
