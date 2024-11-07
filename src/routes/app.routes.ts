import { Router } from 'express';
import userRouter from './user.routes';
import cityRouter from './city.routes';
import categoryRouter from './category.routes';

const appRouter = Router();

appRouter.use('/auth', userRouter);
appRouter.use('/cities', cityRouter);
appRouter.use('/categories', categoryRouter);

export default appRouter;
