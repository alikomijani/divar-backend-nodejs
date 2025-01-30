import {
  createUserOrder,
  getAllOrders,
  getOrdersBySeller,
  getUserOrders,
} from '@/controllers/order.controllers';
import { roleMiddleware } from '@/middlewares/authentication.middleware';
import { validateData } from '@/middlewares/validation.middleware';
import { UserRole } from '@/schema/auth.schema';
import { OrderSchemaZod } from '@/schema/order.schema';
import express from 'express';

const orderRouter = express.Router();
const orderAdminRouter = express.Router();
const orderShopRouter = express.Router();

// user router
orderRouter.post('/', validateData(OrderSchemaZod), createUserOrder);
orderRouter.get('/', getUserOrders);

//shop router
orderShopRouter.get('/', roleMiddleware(UserRole.Seller), getOrdersBySeller);

// admin router
orderAdminRouter.get('/', roleMiddleware(UserRole.Admin), getAllOrders);

export { orderAdminRouter, orderRouter, orderShopRouter };
