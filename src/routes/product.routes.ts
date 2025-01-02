import express from 'express';

import {
  createProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
  getProductByCode,
  getProductPrices,
} from '../controllers/product.controllers'; // Import your controller functions
import { ProductSchemaZod } from '@/models/product.model';
import { validateData } from '@/middlewares/validation.middleware';
import {
  loginMiddleware,
  roleMiddleware,
} from '@/middlewares/authentication.middleware';
import { UserRole } from '@/models/auth.model';

const productRouter = express.Router();

productRouter.post(
  '/',
  loginMiddleware,
  roleMiddleware(UserRole.Admin),
  validateData(ProductSchemaZod),
  createProduct,
);
productRouter.get('/', getAllProducts);
productRouter.get('/:code', getProductByCode);
productRouter.get('/:code/sellers', getProductPrices);
productRouter.put(
  '/:code',
  loginMiddleware,
  roleMiddleware(UserRole.Seller),
  validateData(ProductSchemaZod),
  updateProduct,
);
productRouter.delete(
  '/:code',
  loginMiddleware,
  roleMiddleware(UserRole.Seller),
  deleteProduct,
);

export default productRouter;
