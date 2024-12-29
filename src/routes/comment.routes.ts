import express from 'express';
import { loginMiddleware } from '@/middlewares/authentication.middleware';

import { validateData } from '@/middlewares/validation.middleware';
import { validateIdMiddleware } from '@/middlewares/validate-id.middleware';
import {
  createComment,
  deleteComment,
  getAllComments,
  updateComment,
} from '@/controllers/comment.controllers';
import { getColorById } from '@/controllers/colors.controllers';
import {
  CommentSchemaZod,
  UpdateCommentSchemaZod,
} from '@/models/comment.model';

const commentRouter = express.Router();

commentRouter.get('/', getAllComments); // Get all colors

commentRouter.post(
  '/',
  loginMiddleware,
  validateData(CommentSchemaZod),
  createComment,
); // Create a new color

commentRouter.get('/:id', validateIdMiddleware, getColorById); // Update a color by ID

commentRouter.put(
  '/:id',
  validateIdMiddleware,
  loginMiddleware,
  validateData(UpdateCommentSchemaZod),
  updateComment,
); // Update a color by ID

commentRouter.delete(
  '/:id',
  validateIdMiddleware,
  loginMiddleware,
  deleteComment,
); // Delete a color by ID

export default commentRouter;
