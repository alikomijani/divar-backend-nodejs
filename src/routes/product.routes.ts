import express from 'express';

import {
  createProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
  getProductByCode,
  getProductPrices,
  getSellerAllProducts,
  getSellerProductByCode,
} from '../controllers/product.controllers'; // Import your controller functions
import { ProductSchemaZod } from '@/schema/product.schema';
import { validateData } from '@/middlewares/validation.middleware';
import { validateIdMiddleware } from '@/middlewares/validate-id.middleware';

const productRouter = express.Router();
const productAdminRouter = express.Router();
const productShopRouter = express.Router();

//user
productRouter.get('/', getAllProducts);
productRouter.get('/:code', getProductByCode);
productRouter.get('/:code/sellers', getProductPrices);

//shop
productShopRouter.get('/', getSellerAllProducts);
productShopRouter.get('/:code', getSellerProductByCode);
productShopRouter.post('/', validateData(ProductSchemaZod), createProduct);
productShopRouter.put(
  '/:id',
  validateIdMiddleware,
  validateData(ProductSchemaZod),
  updateProduct,
);

// admin
productAdminRouter.get('/', getAllProducts);
productAdminRouter.get('/:code', getProductByCode);
productAdminRouter.post('/', validateData(ProductSchemaZod), createProduct);
productAdminRouter.put(
  '/:id',
  validateIdMiddleware,
  validateData(ProductSchemaZod),
  updateProduct,
);
productAdminRouter.delete('/:code', deleteProduct);

export { productRouter, productAdminRouter, productShopRouter };
