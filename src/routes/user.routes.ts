import { Router } from 'express';
import {
  getUser,
  loginUser,
  refreshAccessToken,
  registerUser,
} from '../controllers/users.controllers';
import { validateData } from '../middlewares/validation.middleware';

import { loginMiddleware } from '../middlewares/authentication.middleware';
import {
  LoginSchemaZod,
  RefreshTokenSchemaZod,
  RegisterSchemaZod,
} from '@/models/user.model';

const userRouter = Router();

userRouter.post('/register', validateData(RegisterSchemaZod), registerUser);

userRouter.post('/login', validateData(LoginSchemaZod), loginUser);
userRouter.post(
  '/refresh',
  validateData(RefreshTokenSchemaZod),
  refreshAccessToken,
);
userRouter.get('/profile', loginMiddleware, getUser);

export default userRouter;
