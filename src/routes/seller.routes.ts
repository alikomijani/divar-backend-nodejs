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

sellerRouter.get('/', getAllSellers);
sellerRouter.get('/:id', validateIdMiddleware, getSellerById);

sellerRouter.post('/', validateData(SellerSchemaZod), createSeller);

sellerRouter.put(
  '/:id',
  validateIdMiddleware,
  validateData(SellerSchemaZod),
  updateSeller,
);

sellerRouter.put('/:id', validateIdMiddleware, deleteSeller);
export default sellerRouter;
