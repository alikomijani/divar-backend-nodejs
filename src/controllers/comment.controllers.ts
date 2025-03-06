import type { CommentType, IComment } from '@/schema/comment.schema';
import CommentModel from '@/schema/comment.schema';
import { UserRole } from '@/schema/auth.schema';
import type { PaginatedResponse } from '@/types/app.types';
import type { Controller } from '@/types/express';
import { getPaginatedQuery } from '@/utils/paginatedQuery';
import { StatusCodes } from 'http-status-codes';
import ProductModel from '@/schema/product.schema';

// Create
export const createComment: Controller<object, IComment, CommentType> = async (
  req,
  res,
) => {
  try {
    const product = await ProductModel.findOne({ code: req.body.product });
    if (!product) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'invalid Data',
        errors: {
          product: ['Product not found!'],
        },
      });
    }
    const newComment = new CommentModel({
      ...req.body,
      product: product._id,
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
  { code: string },
  PaginatedResponse<IComment>
> = async (req, res) => {
  try {
    const { page = 1, pageSize = 10, ...restQuery } = req.query;
    const product = await ProductModel.findOne({ code: req.params.code });
    if (!product) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'invalid Data',
        errors: {
          product: ['Product not found!'],
        },
      });
    }
    const comments = await getPaginatedQuery(CommentModel, {
      page,
      pageSize,
      populateOptions: [{ path: 'user' }],
      query: {
        product: product?._id,
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
    if (!(req.user?.role === UserRole.Admin || comment.id === req.user?.id)) {
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
