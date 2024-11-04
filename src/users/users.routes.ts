import { Router } from 'express';
import { getUser, loginUser, registerUser } from './users.controllers';
import { validateData } from '../middlewares/validation-middleware';
import { userLoginSchema, userRegistrationSchema } from './users.validations';
import { loginMiddleware } from '../middlewares/authentication-middleware';

const usersRouter = Router();

usersRouter.post(
  '/register',
  validateData(userRegistrationSchema),
  registerUser,
);

usersRouter.post('/login', validateData(userLoginSchema), loginUser);

usersRouter.get('/profile', loginMiddleware, getUser);

export default usersRouter;
