import type { IBadge } from '@/models/product.model';
import { BadgeModel } from '@/models/product.model';
import type { Controller, PaginationParams } from '@/types/app.types';
import { StatusCodes } from 'http-status-codes';

// Create Badge
export const createBadge: Controller<object, IBadge> = async (req, res) => {
  const data = req.body;
  const newBadge = new BadgeModel(data);
  await newBadge.save();
  res.status(StatusCodes.CREATED).json(newBadge);
};

// Get All Badges
export const getAllBadges: Controller<object, null, PaginationParams> = async (
  req,
  res,
) => {
  const { page = 1, pageSize = 10 } = req.query; // Default to page 1 and limit 10
  const pageNumber = Number(page);
  const limitNumber = Number(pageSize);
  const total = await BadgeModel.countDocuments();
  const badges = await BadgeModel.find()
    .skip((pageNumber - 1) * limitNumber) // Skip documents for pagination
    .limit(limitNumber); // Limit the number of documents
  res.status(StatusCodes.OK).json({
    results: badges,
    total,
    totalPages: Math.ceil(total / limitNumber), // Total pages based on the limit
    page,
    pageSize,
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
