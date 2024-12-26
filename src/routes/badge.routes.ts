import express from 'express';
import {
  loginMiddleware,
  roleMiddleware,
} from '@/middlewares/authentication.middleware';
import { Role } from '@/types/user.types';
import {
  createBadge,
  deleteBadge,
  getAllBadges,
  updateBadge,
} from '@/controllers/badge.controllers';

const badgeRouter = express.Router();

badgeRouter.post('/', createBadge); // Create a new badge
badgeRouter.get('/', getAllBadges); // Get all cities
badgeRouter.put(
  '/:id',
  loginMiddleware,
  roleMiddleware(Role.Admin),
  updateBadge,
); // Update a badge by ID
badgeRouter.delete(
  '/:id',
  loginMiddleware,
  roleMiddleware(Role.Admin),
  deleteBadge,
); // Delete a badge by ID

export default badgeRouter;
