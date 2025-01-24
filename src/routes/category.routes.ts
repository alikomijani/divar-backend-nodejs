import { Router } from 'express';
import {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
  getCategoryBySlug,
} from '../controllers/category.controllers';
import { validateData } from '@/middlewares/validation.middleware';
import { CategorySchemaZod } from '@/models/category.model';
import { validateIdMiddleware } from '@/middlewares/validate-id.middleware';

const categoryRouter = Router();

categoryRouter.get('/', getAllCategories);
categoryRouter.get('/:slug', getCategoryBySlug);

const categoryAdminRouter = Router();

categoryAdminRouter.get('/', getAllCategories);
categoryAdminRouter.get('/:id', validateIdMiddleware, getCategoryById);
categoryAdminRouter.post('/', validateData(CategorySchemaZod), createCategory);
categoryAdminRouter.put(
  '/:id',
  validateIdMiddleware,
  validateData(CategorySchemaZod),
  updateCategory,
);
categoryAdminRouter.delete('/:slug', validateIdMiddleware, deleteCategory);

export { categoryAdminRouter, categoryRouter };
