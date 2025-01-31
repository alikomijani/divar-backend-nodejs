import {
  createSeller,
  deleteSeller,
  getAllSellers,
  getSellerById,
  updateSeller,
  addProductPrice,
} from '@/controllers/seller.controllers';

import { validateIdMiddleware } from '@/middlewares/validate-id.middleware';
import { validateData } from '@/middlewares/validation.middleware';
import { AddProductSellerPriceSchemaZod } from '@/schema/productSellers.schema';
import { SellerSchemaZod } from '@/schema/seller.schema';
import { Router } from 'express';

const sellerRouter = Router();
const sellerAdminRouter = Router();
const sellerShopRouter = Router();
// user Router
//http://shop.digig.com/seller/
sellerRouter.get('/', getAllSellers);
sellerRouter.get('/:id', validateIdMiddleware, getSellerById);

// shop Router

//http://shop.digig.com/shop/seller/
//sellerRouter.get('/', getAllSellers);
sellerShopRouter.post(
  '/product/:code/add-price',
  validateData(AddProductSellerPriceSchemaZod),
  addProductPrice,
);

// admin routes
//http://shop.digig.com/admin/seller/
sellerAdminRouter.get('/', getAllSellers);
sellerAdminRouter.get('/:id', validateIdMiddleware, getSellerById);
sellerAdminRouter.post('/', validateData(SellerSchemaZod), createSeller);

sellerAdminRouter.put(
  '/:id',
  validateIdMiddleware,
  validateData(SellerSchemaZod),
  updateSeller,
);
sellerAdminRouter.put('/:id', validateIdMiddleware, deleteSeller);

export { sellerRouter, sellerAdminRouter, sellerShopRouter };
