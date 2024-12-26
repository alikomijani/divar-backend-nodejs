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

const badgeRouter = express.Router();

badgeRouter.post('/', createBadge); // Create a new badge
badgeRouter.get('/', getAllBadges); // Get all cities
badgeRouter.put(
  '/:id',
  loginMiddleware,
  roleMiddleware(UserRole.Admin),
  updateBadge,
); // Update a badge by ID
badgeRouter.delete(
  '/:id',
  loginMiddleware,
  roleMiddleware(UserRole.Admin),
  deleteBadge,
); // Delete a badge by ID

export default badgeRouter;
