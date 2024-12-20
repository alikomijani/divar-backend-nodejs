import { Router } from 'express';
import {
  getUser,
  loginUser,
  refreshAccessToken,
  registerUser,
} from '../controllers/users.controllers';
import { validateData } from '../middlewares/validation.middleware';
import {
  userLoginSchema,
  userRegistrationSchema,
} from '../validations/user.validation';
import { loginMiddleware } from '../middlewares/authentication.middleware';

const userRouter = Router();

userRouter.post(
  '/register',
  validateData(userRegistrationSchema),
  registerUser,
);

userRouter.post('/login', validateData(userLoginSchema), loginUser);
userRouter.post('/refresh', refreshAccessToken);
userRouter.get('/profile', loginMiddleware, getUser);

export default userRouter;
