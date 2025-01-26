import type { IBadge } from '@/schema/badge.schema';
import { BadgeModel } from '@/schema/badge.schema';

import type { PaginatedResponse } from '@/types/app.types';
import type { Controller } from '@/types/express';
import { getPaginatedQuery } from '@/utils/paginatedQuery';
import { StatusCodes } from 'http-status-codes';

// Create Badge
export const createBadge: Controller<object, IBadge, IBadge> = async (
  req,
  res,
) => {
  const data = req.body;
  const newBadge = new BadgeModel(data);
  await newBadge.save();
  res.status(StatusCodes.CREATED).json(newBadge);
};

// Get All Badges
export const getAllBadges: Controller<
  object,
  object,
  PaginatedResponse<IBadge>
> = async (req, res) => {
  const { page = 1, pageSize = 10 } = req.query; // Default to page 1 and limit 10
  const paginatedQuery = await getPaginatedQuery(BadgeModel, {
    page,
    pageSize,
  });
  res.status(StatusCodes.OK).json(paginatedQuery);
};

// Get Badge by ID
export const getBadgeById: Controller<{ id: string }, IBadge> = async (
  req,
  res,
) => {
  const { id } = req.params;
  const badge = await BadgeModel.findById(id);
  if (!badge) {
    return res.status(StatusCodes.NOT_FOUND).json({
      success: false,
      message: 'Badge not found',
    });
  } else {
    res.status(StatusCodes.OK).json(badge);
  }
};

// Update Badge
export const updateBadge: Controller<{ id: string }, IBadge, IBadge> = async (
  req,
  res,
) => {
  const { id } = req.params;
  const data = req.body;
  const updatedBadge = await BadgeModel.findByIdAndUpdate(id, data, {
    new: true,
  });
  if (!updatedBadge) {
    return res.status(StatusCodes.NOT_FOUND).json({
      success: false,
      message: 'Badge not found',
    });
  } else {
    res.status(StatusCodes.OK).json(updatedBadge);
  }
};

// Delete Badge
export const deleteBadge: Controller<{ id: string }> = async (req, res) => {
  const { id } = req.params;
  const deletedBadge = await BadgeModel.findByIdAndDelete(id);
  if (!deletedBadge) {
    return res.status(StatusCodes.NOT_FOUND).json({
      success: false,
      message: 'Badge not found',
    });
  } else {
    res.status(StatusCodes.NO_CONTENT).send();
  }
};
