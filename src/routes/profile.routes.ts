import express from 'express';
import profileController from '../controllers/profile.controllers'; // Import the controller
import { validateIdMiddleware } from '@/middlewares/validate-id.middleware';
import {
  loginMiddleware,
  roleMiddleware,
} from '@/middlewares/authentication.middleware';
import { UserRole } from '@/models/auth.model';

const profileRouter = express.Router();
// admin routes
profileRouter.post(
  '/',
  loginMiddleware,
  roleMiddleware(UserRole.Admin),
  profileController.createProfile,
);
profileRouter.get(
  '/:id',
  validateIdMiddleware,
  loginMiddleware,
  roleMiddleware(UserRole.Admin),
  profileController.getProfileById,
);
profileRouter.put(
  '/:id',
  validateIdMiddleware,
  loginMiddleware,
  roleMiddleware(UserRole.Admin),
  profileController.updateProfile,
);
profileRouter.delete(
  '/:id',
  validateIdMiddleware,
  loginMiddleware,
  roleMiddleware(UserRole.Admin),
  profileController.deleteProfile,
);
profileRouter.get(
  '/',
  loginMiddleware,
  roleMiddleware(UserRole.Admin),
  profileController.getAllProfiles,
);

export default profileRouter;
