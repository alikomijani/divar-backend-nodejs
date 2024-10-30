import { Router } from 'express';

import { getUser, loginUser, registerUser } from './users.controller';
import { validateData } from '../middlewares/validation-middleware';
import { userLoginSchema, userRegistrationSchema } from './users.schema';
import { authMiddleware } from '../middlewares/authentication-middleware';
const usersRouter = Router();

usersRouter.post(
  '/register',
  validateData(userRegistrationSchema),
  registerUser,
);

usersRouter.post('/login', validateData(userLoginSchema), loginUser);

usersRouter.get('/:username', authMiddleware, getUser);

export default usersRouter;
