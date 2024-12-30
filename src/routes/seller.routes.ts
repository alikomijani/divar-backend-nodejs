import {
  createSeller,
  deleteSeller,
  getAllSellers,
  getSellerById,
  updateSeller,
} from '@/controllers/seller.controllers';
import {
  loginMiddleware,
  roleMiddleware,
} from '@/middlewares/authentication.middleware';
import { validateIdMiddleware } from '@/middlewares/validate-id.middleware';
import { validateData } from '@/middlewares/validation.middleware';
import { SellerSchemaZod } from '@/models/seller.model';
import { UserRole } from '@/models/user.model';
import { Router } from 'express';

const sellerRouter = Router();

sellerRouter.get(
  '/',
  loginMiddleware,
  roleMiddleware(UserRole.Admin),
  getAllSellers,
);
sellerRouter.get(
  '/:id',
  validateIdMiddleware,
  loginMiddleware,
  roleMiddleware(UserRole.Admin),
  getSellerById,
);

sellerRouter.post(
  '/',
  loginMiddleware,
  roleMiddleware(UserRole.Admin),
  validateData(SellerSchemaZod),
  createSeller,
);

sellerRouter.put(
  '/:id',
  validateIdMiddleware,
  loginMiddleware,
  roleMiddleware(UserRole.Admin),
  validateData(SellerSchemaZod),
  updateSeller,
);

sellerRouter.put(
  '/:id',
  validateIdMiddleware,
  loginMiddleware,
  roleMiddleware(UserRole.Admin),
  deleteSeller,
);
export default sellerRouter;
