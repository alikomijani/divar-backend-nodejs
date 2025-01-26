import {
  createSeller,
  deleteSeller,
  getAllSellers,
  getSellerById,
  updateSeller,
} from '@/controllers/seller.controllers';

import { validateIdMiddleware } from '@/middlewares/validate-id.middleware';
import { validateData } from '@/middlewares/validation.middleware';
import { SellerSchemaZod } from '@/models/seller.model';
import { Router } from 'express';

const sellerRouter = Router();
const sellerAdminRouter = Router();

sellerRouter.get('/', getAllSellers);
sellerRouter.get('/:id', validateIdMiddleware, getSellerById);

// admin routes

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
export { sellerRouter, sellerAdminRouter };
