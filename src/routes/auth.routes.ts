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

const authRouter = Router();

authRouter.post('/register', validateData(RegisterSchemaZod), registerUser);
authRouter.post('/login', validateData(LoginSchemaZod), loginUser);
authRouter.post(
  '/refresh',
  validateData(RefreshTokenSchemaZod),
  refreshAccessToken,
);
authRouter.get('/user', loginMiddleware, getUser);
authRouter.put(
  '/profile',
  loginMiddleware,
  validateData(profileSchemaZod),
  updateUserProfile,
);

export default authRouter;
