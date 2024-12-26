import type { IBrand } from '@/models/brand.model';
import { BrandModel } from '@/models/brand.model';
import type { Controller } from '@/types/app.types';
import { StatusCodes } from 'http-status-codes';

// Create Brand
export const createBrand: Controller<object, IBrand> = async (req, res) => {
  const data = req.body;
  const newBrand = new BrandModel(data);
  await newBrand.save();
  res.status(StatusCodes.CREATED).json(newBrand);
};

// Get All Brands
export const getAllBrands: Controller = async (req, res) => {
  const brands = await BrandModel.find({});
  res.status(StatusCodes.OK).json({
    results: brands,
  });
};

// Get Brand by ID
export const getBrandById: Controller<{ slug: string }> = async (req, res) => {
  const { slug } = req.params;
  const brand = await BrandModel.findById(slug);
  if (!brand) {
    return res.status(StatusCodes.NOT_FOUND).json({
      message: 'Brand not found',
    });
  }
  res.status(StatusCodes.OK).json(brand);
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
      message: 'Brand not found',
    });
  }
  res.status(StatusCodes.OK).json(updatedBrand);
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
