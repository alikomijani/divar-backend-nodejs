import { Router } from 'express';
import authRouter from './auth.routes';
import categoryRouter from './category.routes';
import propertyRouter from './properties.routes';
import imagesRouter from './image.routes';
import colorRouter from './color.routes';
import cityRouter from './city.routes';
import brandRouter from './brand.routes';
import { badgeAdminRouter } from './badge.routes';
import productRouter from './product.routes';
import commentRouter from './comment.routes';
import sellerRouter from './seller.routes';
import orderRouter from './order.routes';
import {
  loginMiddleware,
  roleMiddleware,
} from '@/middlewares/authentication.middleware';
import { UserRole } from '@/models/auth.model';

const userRouter = Router();

userRouter.use('/auth', authRouter);
userRouter.use('/brands', brandRouter);
userRouter.use('/categories', categoryRouter);

userRouter.use('/images', imagesRouter);
userRouter.use('/colors', colorRouter);
userRouter.use('/cities', cityRouter);
userRouter.use('/products', productRouter);
userRouter.use(commentRouter);
userRouter.use(
  '/admin/seller',
  loginMiddleware,
  roleMiddleware(UserRole.Admin),
  sellerRouter,
); // edit seller info need admin permission
userRouter.use(loginMiddleware, orderRouter); // all order routes need authentication

const adminRouter = Router();
adminRouter.use(loginMiddleware, roleMiddleware(UserRole.Admin));
adminRouter.use('/badges', badgeAdminRouter);
adminRouter.use('/properties', propertyRouter);
const shopRouter = Router();
shopRouter.use(loginMiddleware, roleMiddleware(UserRole.Seller));

export { userRouter, adminRouter, shopRouter };
