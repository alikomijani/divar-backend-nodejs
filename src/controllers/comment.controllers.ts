import type { IComment } from '@/models/comment.model';
import CommentModel from '@/models/comment.model';
import { UserRole } from '@/models/auth.model';
import type { PaginatedResponse } from '@/types/app.types';
import type { Controller } from '@/types/express';
import { getPaginatedQuery } from '@/utils/paginatedQuery';
import { StatusCodes } from 'http-status-codes';

// Create
export const createComment: Controller<object, IComment, IComment> = async (
  req,
  res,
) => {
  try {
    const newComment = new CommentModel({
      ...req.body,
      user: req.user!.id, // assuming you have a middleware that sets req.user.id
    });
    const savedComment = await newComment.save();
    res.status(StatusCodes.CREATED).json(savedComment);
  } catch (err) {
    console.error(err);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: 'Server Error' });
  }
};

// Read All
export const getProductComments: Controller<
  { productId: string },
  PaginatedResponse<IComment>
> = async (req, res) => {
  try {
    const { page = 1, pageSize = 10, ...restQuery } = req.query;
    const comments = await getPaginatedQuery(CommentModel, {
      page,
      pageSize,
      query: {
        product: req.params.productId,
        ...restQuery,
      },
    });
    res.status(StatusCodes.OK).json(comments);
  } catch (err) {
    console.error(err);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: 'Server Error' });
  }
};

// Update
export const updateComment: Controller<
  { id: string },
  IComment,
  IComment
> = async (req, res) => {
  try {
    const { text, rating } = req.body;
    const comment = await CommentModel.findById(req.params.id);
    if (!comment) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ success: false, message: 'Comment not found' });
    }
    if (req.user?.role !== UserRole.Admin && comment.id !== req.user?.id) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ success: false, message: 'Forbidden' });
    }
    comment.text = text;
    comment.rating = rating;
    await comment.save();
    return res.status(StatusCodes.ACCEPTED).json(comment);
  } catch (err) {
    console.error(err);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: 'Server Error' });
  }
};

// Delete
export const deleteComment: Controller<{ id: string }> = async (req, res) => {
  try {
    const comment = await CommentModel.findById(req.params.id);
    if (!comment) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ success: false, message: 'Comment not found' });
    }
    if (req.user?.role !== UserRole.Admin && comment.id !== req.user?.id) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ success: false, message: 'Forbidden' });
    }
    await comment.deleteOne();
    return res.status(StatusCodes.NO_CONTENT);
  } catch (err) {
    console.error(err);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: 'Server Error' });
  }
};
