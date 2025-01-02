import express from 'express';
import {
  createBadge,
  deleteBadge,
  getAllBadges,
  getBadgeById,
  updateBadge,
} from '@/controllers/badge.controllers';
import { validateIdMiddleware } from '@/middlewares/validate-id.middleware';

const badgeAdminRouter = express.Router();

badgeAdminRouter.post('/', createBadge); // Create a new badge
badgeAdminRouter.get('/', getAllBadges); // Get all
badgeAdminRouter.get('/:id', validateIdMiddleware, getBadgeById); // get a badge by ID
badgeAdminRouter.put('/:id', validateIdMiddleware, updateBadge); // Update a badge by ID
badgeAdminRouter.delete('/:id', validateIdMiddleware, deleteBadge); // Delete a badge by ID

export { badgeAdminRouter };
