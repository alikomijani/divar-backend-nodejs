import { Router } from 'express';
import { authRouter, authAdminRouter } from './auth.routes';
import { badgeAdminRouter } from './badge.routes';
import { brandRouter, brandAdminRouter } from './brand.routes';
import { categoryRouter, categoryAdminRouter } from './category.routes';
import propertyRouter from './properties.routes';
import imagesRouter from './image.routes';
import colorRouter from './color.routes';
import { cityAdminRouter, cityRouter } from './city.routes';
import {
  productRouter,
  productAdminRouter,
  productShopRouter,
} from './product.routes';
import commentRouter from './comment.routes';
import {
  sellerRouter,
  sellerAdminRouter,
  sellerShopRouter,
} from './seller.routes';
import { orderRouter, orderAdminRouter, orderShopRouter } from './order.routes';
import {
  bannerSliderAdminRouter,
  bannerSliderRouter,
} from './bannerSlider.routes';
import {
  loginMiddleware,
  roleMiddleware,
} from '@/middlewares/authentication.middleware';
import { UserRole } from '@/schema/auth.schema';
import { profileAdminRouter } from './profile.routes';

const userRouter = Router();

userRouter.use('/auth', authRouter);
userRouter.use('/brands', brandRouter);
userRouter.use('/categories', categoryRouter);
userRouter.use('/images', imagesRouter);
userRouter.use('/cities', cityRouter);
userRouter.use('/products', productRouter);
userRouter.use(commentRouter);
userRouter.use('/sellers', sellerRouter);
userRouter.use('/orders', loginMiddleware, orderRouter); // all order routes need authentication
userRouter.use('/banners', bannerSliderRouter);

const adminRouter = Router();
adminRouter.use(loginMiddleware, roleMiddleware(UserRole.Admin));
adminRouter.use('/badges', badgeAdminRouter);
adminRouter.use('/brands', brandAdminRouter);
adminRouter.use('/categories', categoryAdminRouter);
adminRouter.use('/cities', cityAdminRouter);
adminRouter.use('/profiles', profileAdminRouter);
adminRouter.use('/colors', colorRouter);
adminRouter.use('/properties', propertyRouter);
adminRouter.use('/products', productAdminRouter);
adminRouter.use('/auth', authAdminRouter);
adminRouter.use('/sellers', sellerAdminRouter);
adminRouter.use('/orders', orderAdminRouter);
adminRouter.use('/banners', bannerSliderAdminRouter);

const shopRouter = Router();
shopRouter.use(loginMiddleware, roleMiddleware(UserRole.Seller));
shopRouter.use('/orders', orderShopRouter);
shopRouter.use('/sellers', sellerShopRouter);
shopRouter.use('/products', productShopRouter);
shopRouter.use('/categories', categoryAdminRouter); // category permission same as admin
shopRouter.use('/colors', colorRouter);
shopRouter.use('/properties', propertyRouter);
shopRouter.use('/badges', badgeAdminRouter);
shopRouter.use('/banners', bannerSliderAdminRouter);

export { userRouter, adminRouter, shopRouter };
