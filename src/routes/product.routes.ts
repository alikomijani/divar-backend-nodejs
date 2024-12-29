import express from 'express';

import {
  createProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
  getProductByCode,
} from '../controllers/product.controllers'; // Import your controller functions
import { ProductSchemaZod } from '@/models/product.model';
import { validateData } from '@/middlewares/validation.middleware';
import { validateIdMiddleware } from '@/middlewares/validate-id.middleware';
import {
  loginMiddleware,
  roleMiddleware,
} from '@/middlewares/authentication.middleware';
import { UserRole } from '@/models/user.model';

const productRouter = express.Router();

productRouter.post('/', validateData(ProductSchemaZod), createProduct);
productRouter.get('/', getAllProducts);
productRouter.get('/:code', getProductByCode);
productRouter.put(
  '/:id',
  validateIdMiddleware,
  loginMiddleware,
  roleMiddleware(UserRole.Admin),
  validateData(ProductSchemaZod),
  updateProduct,
);
productRouter.delete('/:id', deleteProduct);

export default productRouter;
