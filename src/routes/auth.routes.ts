import { Router } from 'express';
import {
  getUser,
  loginUser,
  refreshAccessToken,
  registerUser,
  updateUserProfile,
} from '../controllers/auth.controllers';
import { validateData } from '../middlewares/validation.middleware';

import { loginMiddleware } from '../middlewares/authentication.middleware';
import {
  LoginSchemaZod,
  RefreshTokenSchemaZod,
  RegisterSchemaZod,
} from '@/models/auth.model';
import { profileSchemaZod } from '@/models/profile.model';

const userRouter = Router();

userRouter.post('/register', validateData(RegisterSchemaZod), registerUser);
userRouter.post('/login', validateData(LoginSchemaZod), loginUser);
userRouter.post(
  '/refresh',
  validateData(RefreshTokenSchemaZod),
  refreshAccessToken,
);
userRouter.get('/user', loginMiddleware, getUser);
userRouter.put(
  '/profile',
  loginMiddleware,
  validateData(profileSchemaZod),
  updateUserProfile,
);

export default userRouter;
