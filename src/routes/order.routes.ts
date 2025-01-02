import {
  createUserOrder,
  getAllOrders,
  getOrdersBySeller,
  getUserOrders,
} from '@/controllers/order.controllers';
import { roleMiddleware } from '@/middlewares/authentication.middleware';
import { UserRole } from '@/models/auth.model';
import express from 'express';

const orderRouter = express.Router();

orderRouter.post('/orders/create', createUserOrder);
orderRouter.get('/orders/', getUserOrders);
orderRouter.get(
  '/shop/orders/',
  roleMiddleware(UserRole.Seller),
  getOrdersBySeller,
);
orderRouter.get('/admin/orders/', roleMiddleware(UserRole.Admin), getAllOrders);
export default orderRouter;
