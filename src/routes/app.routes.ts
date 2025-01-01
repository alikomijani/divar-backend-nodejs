import { Router } from 'express';
import userRouter from './user.routes';
import categoryRouter from './category.routes';
import propertyRouter from './properties.routes';
import imagesRouter from './image.routes';
import colorRouter from './color.routes';
import cityRouter from './city.routes';
import brandRouter from './brand.routes';
import badgeRouter from './badge.routes';
import productRouter from './product.routes';
import commentRouter from './comment.routes';
import sellerRouter from './seller.routes';
import orderRouter from './order.routes';
import {
  loginMiddleware,
  roleMiddleware,
} from '@/middlewares/authentication.middleware';
import { UserRole } from '@/models/user.model';

const appRouter = Router();
appRouter.use('/auth', userRouter);
appRouter.use('/brands', brandRouter);
appRouter.use('/categories', categoryRouter);
appRouter.use('/properties', propertyRouter);
appRouter.use('/images', imagesRouter);
appRouter.use('/colors', colorRouter);
appRouter.use('/cities', cityRouter);
appRouter.use('/badges', badgeRouter);
appRouter.use('/products', productRouter);
appRouter.use(commentRouter);
appRouter.use(
  '/admin/seller',
  loginMiddleware,
  roleMiddleware(UserRole.Admin),
  sellerRouter,
); // edit seller info need admin permission
appRouter.use(loginMiddleware, orderRouter); // all order routes need authentication

export default appRouter;
