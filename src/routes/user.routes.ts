import { Router } from 'express';
import {
  getUser,
  getUserProfile,
  loginUser,
  refreshAccessToken,
  registerUser,
  updateUserProfile,
} from '../controllers/users.controllers';
import { validateData } from '../middlewares/validation.middleware';

import { loginMiddleware } from '../middlewares/authentication.middleware';
import {
  LoginSchemaZod,
  RefreshTokenSchemaZod,
  RegisterSchemaZod,
} from '@/models/user.model';
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
userRouter.get('/profile', loginMiddleware, getUserProfile);
userRouter.put(
  '/profile',
  loginMiddleware,
  validateData(profileSchemaZod),
  updateUserProfile,
);

export default userRouter;
