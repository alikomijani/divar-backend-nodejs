import { Router } from 'express';
import {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from './controllers';
import { validateData } from '@/middlewares/validation-middleware';
import { CategorySchema } from './validation';
import {
  loginMiddleware,
  roleMiddleware,
} from '@/middlewares/authentication-middleware';
import { Role } from '@/users/users.schema';

const router = Router();

router.get('/', getAllCategories);

router.post(
  '/',
  loginMiddleware,
  roleMiddleware(Role.Admin),
  validateData(CategorySchema),
  createCategory,
);

router.get('/:id', getCategoryById);
router.put(
  '/:id',
  loginMiddleware,
  roleMiddleware(Role.Admin),
  validateData(CategorySchema),
  updateCategory,
);
router.delete(
  '/:id',
  loginMiddleware,
  roleMiddleware(Role.Admin),
  deleteCategory,
);

export default router;
