import { Router } from 'express';
import {
  getAllUsers,
  getUser,
  getUserById,
  loginUser,
  refreshAccessToken,
  registerUser,
  updateUser,
  updateUserProfile,
} from '../controllers/auth.controllers';
import { validateData } from '../middlewares/validation.middleware';

import { loginMiddleware } from '../middlewares/authentication.middleware';
import {
  LoginSchemaZod,
  RefreshTokenSchemaZod,
  RegisterSchemaZod,
} from '@/schema/auth.model';
import { profileSchemaZod } from '@/schema/profile.model';
import { validateIdMiddleware } from '@/middlewares/validate-id.middleware';

const authRouter = Router();
const authAdminRouter = Router();

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
authAdminRouter.get('/users', getAllUsers);
authAdminRouter.get('/users:id', validateIdMiddleware, getUserById);
authAdminRouter.put('/users/:id', updateUser);

export { authRouter, authAdminRouter };
