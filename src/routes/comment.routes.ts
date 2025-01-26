import express from 'express';
import { loginMiddleware } from '@/middlewares/authentication.middleware';

import { validateData } from '@/middlewares/validation.middleware';
import { validateIdMiddleware } from '@/middlewares/validate-id.middleware';
import {
  createComment,
  deleteComment,
  getProductComments,
  updateComment,
} from '@/controllers/comment.controllers';
import {
  CommentSchemaZod,
  UpdateCommentSchemaZod,
} from '@/schema/comment.model';

const commentRouter = express.Router();

commentRouter.get('/product/:code/comments', getProductComments); // Get all colors

commentRouter.post(
  '/comments',
  loginMiddleware,
  validateData(CommentSchemaZod),
  createComment,
); // Create a new comment

commentRouter.put(
  '/comments/:id',
  validateIdMiddleware,
  loginMiddleware,
  validateData(UpdateCommentSchemaZod),
  updateComment,
); // Update a comment by ID

commentRouter.delete(
  '/comments/:id',
  validateIdMiddleware,
  loginMiddleware,
  deleteComment,
); // Delete a comment by ID

export default commentRouter;
