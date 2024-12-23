import type { IBadge, IBrand, IColor } from '@/models/product.model';
import { BadgeModel, BrandModel, ColorModel } from '@/models/product.model';
import type { Controller } from '@/types/app.types';
import { StatusCodes } from 'http-status-codes';

export const createColor: Controller<object, IColor> = async (req, res) => {
  const data = req.body;
  const newColor = new ColorModel(data);
  await newColor.save();
  res.status(StatusCodes.CREATED).json({
    success: true,
    message: 'color created successfully',
    result: newColor,
  });
};

// Read All Colors
export const getAllColors: Controller<object, IColor[]> = async (req, res) => {
  const colors = await ColorModel.find();
  res.status(StatusCodes.OK).json({
    success: true,
    result: colors,
  });
};

// Update Color
export const updateColor: Controller<{ id: string }, IColor> = async (
  req,
  res,
) => {
  const { id } = req.params;
  const data: IColor = req.body;
  const updatedColor = await ColorModel.findByIdAndUpdate(id, data, {
    new: true,
  });
  if (!updatedColor) {
    return res.status(StatusCodes.NOT_FOUND).json({
      success: false,
      message: 'Color not found',
    });
  }
  res.status(StatusCodes.OK).json({
    success: true,
    message: 'Color updated successfully',
    result: updatedColor,
  });
};

// Delete Color
export const deleteColor: Controller<{ id: string }, null> = async (
  req,
  res,
) => {
  const { id } = req.params;
  const deletedColor = await ColorModel.findByIdAndDelete(id);
  if (!deletedColor) {
    return res.status(StatusCodes.NOT_FOUND).json({
      success: false,
      message: 'Color not found',
    });
  }
  res.status(StatusCodes.OK).json({
    success: true,
    message: 'Color deleted successfully',
  });
};

// Create Badge
export const createBadge: Controller<{ id: string }, IBadge> = async (
  req,
  res,
) => {
  const data = req.body;
  const newBadge = new BadgeModel(data);
  await newBadge.save();
  res.status(StatusCodes.CREATED).json({
    success: true,
    message: 'Badge created successfully',
    result: newBadge,
  });
};

// Get All Badges
export const getAllBadges: Controller<object, null> = async (req, res) => {
  const badges = await BadgeModel.find({});
  res.status(StatusCodes.OK).json({
    success: true,
    result: badges,
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
  res.status(StatusCodes.OK).json({
    success: true,
    result: badge,
  });
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
  res.status(StatusCodes.OK).json({
    success: true,
    message: 'Badge updated successfully',
    result: updatedBadge,
  });
};

// Delete Badge
export const deleteBadge: Controller<{ id: string }, null> = async (
  req,
  res,
) => {
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

// Create Brand
export const createBrand: Controller<object, IBrand> = async (req, res) => {
  const data = req.body;
  const newBrand = new BrandModel(data);
  await newBrand.save();
  res.status(StatusCodes.CREATED).json({
    success: true,
    message: 'Brand created successfully',
    result: newBrand,
  });
};

// Get All Brands
export const getAllBrands: Controller = async (req, res) => {
  const brands = await BrandModel.find({});
  res.status(StatusCodes.OK).json({
    success: true,
    result: brands,
  });
};

// Get Brand by ID
export const getBrandById: Controller<{ slug: string }> = async (req, res) => {
  const { slug } = req.params;
  const brand = await BrandModel.findById(slug);
  if (!brand) {
    return res.status(StatusCodes.NOT_FOUND).json({
      success: false,
      message: 'Brand not found',
    });
  }
  res.status(StatusCodes.OK).json({
    success: true,
    result: brand,
  });
};

// Update Brand
export const updateBrand: Controller<{ id: string }, IBrand> = async (
  req,
  res,
) => {
  const { id } = req.params;
  const data: IBrand = req.body;
  const updatedBrand = await BrandModel.findByIdAndUpdate(id, data, {
    new: true,
  });
  if (!updatedBrand) {
    return res.status(StatusCodes.NOT_FOUND).json({
      success: false,
      message: 'Brand not found',
    });
  }
  res.status(StatusCodes.OK).json({
    success: true,
    message: 'Brand updated successfully',
    result: updatedBrand,
  });
};

// Delete Brand
export const deleteBrand: Controller<{ id: string }> = async (req, res) => {
  const { id } = req.params;
  const deletedBrand = await BrandModel.findByIdAndDelete(id);
  if (!deletedBrand) {
    return res.status(StatusCodes.NOT_FOUND).json({
      success: false,
      message: 'Brand not found',
    });
  }
  res.status(StatusCodes.OK).json({
    success: true,
    message: 'Brand deleted successfully',
  });
};
