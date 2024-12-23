import { Router } from 'express';
import userRouter from './user.routes';
import cityRouter from './city.routes';
import categoryRouter from './category.routes';
import propertiesRouter from './properties.routes';

const appRouter = Router();

appRouter.use('/auth', userRouter);
appRouter.use('/cities', cityRouter);
appRouter.use('/categories', categoryRouter);
appRouter.use('/properties', propertiesRouter);

export default appRouter;
