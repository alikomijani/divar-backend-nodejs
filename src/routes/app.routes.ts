import { Router } from 'express';
import userRouter from './user.routes';
import categoryRouter from './category.routes';
import propertyRouter from './properties.routes';
import imagesRouter from './image.routes';
import colorRouter from './color.routes';

const appRouter = Router();

appRouter.use('/auth', userRouter);
appRouter.use('/categories', categoryRouter);
appRouter.use('/properties', propertyRouter);
appRouter.use('/images', imagesRouter);
appRouter.use('/colors', colorRouter);

export default appRouter;
