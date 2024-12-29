import type { IComment } from '@/models/comment.model';
import CommentModel from '@/models/comment.model';
import type { Controller, PaginatedResponse } from '@/types/app.types';
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
export const getAllComments: Controller<
  object,
  PaginatedResponse<IComment>
> = async (req, res) => {
  try {
    const { userId, productId, page = 1, pageSize = 10 } = req.query;
    const query: any = {};

    if (userId) {
      query.user = userId;
    }

    if (productId) {
      query.product = productId;
    }
    const comments = await getPaginatedQuery(
      CommentModel,
      page,
      pageSize,
      query,
    );
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
    const comment = await CommentModel.findOneAndUpdate(
      { id: req.params.id, user: req.user?.id },
      { text, rating },
      { new: true },
    );
    if (!comment) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ success: false, message: 'Comment not found' });
    }
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
    const comment = await CommentModel.findOneAndDelete({
      id: req.params.id,
      user: req.user?.id,
    });
    if (!comment) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: 'Comment not found' });
    }
    return res.status(StatusCodes.NO_CONTENT);
  } catch (err) {
    console.error(err);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: 'Server Error' });
  }
};
