import type { IBadge } from '@/models/product.model';
import { BadgeModel } from '@/models/product.model';
import type { Controller } from '@/types/app.types';
import { StatusCodes } from 'http-status-codes';

// Create Badge
export const createBadge: Controller<{ id: string }, IBadge> = async (
  req,
  res,
) => {
  const data = req.body;
  const newBadge = new BadgeModel(data);
  await newBadge.save();
  res.status(StatusCodes.CREATED).json(newBadge);
};

// Get All Badges
export const getAllBadges: Controller<object, null> = async (req, res) => {
  const badges = await BadgeModel.find({});
  res.status(StatusCodes.OK).json({
    results: badges,
  });
};

// Get Badge by ID
export const getBadgeById: Controller<{ id: string }, null> = async (
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
  }
  res.status(StatusCodes.OK).json(badge);
};

// Update Badge
export const updateBadge: Controller<{ id: string }, IBadge> = async (
  req,
  res,
) => {
  const { id } = req.params;
  const data: IBadge = req.body;
  const updatedBadge = await BadgeModel.findByIdAndUpdate(id, data, {
    new: true,
  });
  if (!updatedBadge) {
    return res.status(StatusCodes.NOT_FOUND).json({
      success: false,
      message: 'Badge not found',
    });
  }
  res.status(StatusCodes.OK).json(updatedBadge);
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
  }
  res.status(StatusCodes.OK).json({
    success: true,
    message: 'Badge deleted successfully',
  });
};
