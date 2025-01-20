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
const productAdminRouter = express.Router();

productRouter.get('/', getAllProducts);
productRouter.get('/:code', getProductByCode);
productRouter.get('/:code/sellers', getProductPrices);

// admin
productAdminRouter.get('/', getAllProducts);
productAdminRouter.get('/:code', getProductByCode);
productAdminRouter.post(
  '/',
  loginMiddleware,
  roleMiddleware(UserRole.Admin),
  validateData(ProductSchemaZod),
  createProduct,
);
productAdminRouter.put(
  '/:code',
  loginMiddleware,
  roleMiddleware(UserRole.Seller),
  validateData(ProductSchemaZod),
  updateProduct,
);
productAdminRouter.delete(
  '/:code',
  loginMiddleware,
  roleMiddleware(UserRole.Seller),
  deleteProduct,
);

export { productRouter, productAdminRouter };
