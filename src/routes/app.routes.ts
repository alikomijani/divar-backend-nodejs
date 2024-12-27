import { Router } from 'express';
import userRouter from './user.routes';
import categoryRouter from './category.routes';
import propertyRouter from './properties.routes';
import imagesRouter from './image.routes';
import colorRouter from './color.routes';
import cityRouter from './city.routes';
import brandRouter from './brand.routes';
import { validateIdParam } from '@/middlewares/validate-id.middleware';

const appRouter = Router();
appRouter.use(validateIdParam);
appRouter.use('/auth', userRouter);
appRouter.use('/brands', brandRouter);
appRouter.use('/categories', categoryRouter);
appRouter.use('/properties', propertyRouter);
appRouter.use('/images', imagesRouter);
appRouter.use('/colors', colorRouter);
appRouter.use('/cities', cityRouter);

export default appRouter;
