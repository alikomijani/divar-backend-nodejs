import { Router } from 'express';
import { getUser, loginUser, registerUser } from './users.controller';
import { validateData } from '../middlewares/validation-middleware';
import { userLoginSchema, userRegistrationSchema } from './users.schema';
import { loginMiddleware } from '../middlewares/authentication-middleware';

const usersRouter = Router();

usersRouter.post(
  '/register',
  validateData(userRegistrationSchema),
  registerUser,
);

usersRouter.post('/login', validateData(userLoginSchema), loginUser);

usersRouter.get('/:username', loginMiddleware, getUser);

export default usersRouter;
