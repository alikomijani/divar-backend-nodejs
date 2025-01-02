import express from 'express';
import {
  loginMiddleware,
  roleMiddleware,
} from '@/middlewares/authentication.middleware';
import {
  createBadge,
  deleteBadge,
  getAllBadges,
  updateBadge,
} from '@/controllers/badge.controllers';
import { UserRole } from '@/models/user.model';
import { validateIdMiddleware } from '@/middlewares/validate-id.middleware';

const badgeRouter = express.Router();

badgeRouter.post(
  '/',
  loginMiddleware,
  roleMiddleware(UserRole.Admin),
  createBadge,
); // Create a new badge
badgeRouter.get('/', getAllBadges); // Get all
badgeRouter.put(
  '/:id',
  validateIdMiddleware,
  loginMiddleware,
  roleMiddleware(UserRole.Admin),
  updateBadge,
); // Update a badge by ID
badgeRouter.delete(
  '/:id',
  validateIdMiddleware,
  loginMiddleware,
  roleMiddleware(UserRole.Admin),
  deleteBadge,
); // Delete a badge by ID

export default badgeRouter;
