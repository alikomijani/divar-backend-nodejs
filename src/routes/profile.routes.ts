import express from 'express';
import profileController from '../controllers/profile.controllers'; // Import the controller
import { validateIdMiddleware } from '@/middlewares/validate-id.middleware';

const profileAdminRouter = express.Router();
profileAdminRouter.get(
  '/:id',
  validateIdMiddleware,
  profileController.getProfileById,
);
profileAdminRouter.put(
  '/:id',
  validateIdMiddleware,
  profileController.updateProfile,
);

profileAdminRouter.get('/', profileController.getAllProfiles);
export { profileAdminRouter };
