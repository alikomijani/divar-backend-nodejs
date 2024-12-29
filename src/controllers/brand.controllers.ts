import type { IBrand } from '@/models/brand.model';
import { BrandModel } from '@/models/brand.model';
import type { Controller, PaginatedResponse } from '@/types/app.types';
import { getPaginatedQuery } from '@/utils/paginatedQuery';
import { StatusCodes } from 'http-status-codes';

// Create Brand
export const createBrand: Controller<object, IBrand> = async (req, res) => {
  const data = req.body;
  const newBrand = await BrandModel.create(data);
  res.status(StatusCodes.CREATED).json(newBrand);
};

// Get All Brands
export const getAllBrands: Controller<
  object,
  PaginatedResponse<IBrand>
> = async (req, res) => {
  const { page = 1, pageSize = 10 } = req.query; // Default to page 1 and limit 10
  const paginatedResult = await getPaginatedQuery(
    BrandModel,
    page,
    pageSize,
    {},
  );
  res.status(StatusCodes.OK).json(paginatedResult);
};

// Get Brand by slug
export const getBrandBySlug: Controller<{ slug: string }, IBrand> = async (
  req,
  res,
) => {
  const { slug } = req.params;
  const brand = await BrandModel.findOne({ slug });
  if (!brand) {
    return res.status(StatusCodes.NOT_FOUND).json({
      message: 'Brand not found',
      success: false,
    });
  } else {
    return res.status(StatusCodes.OK).json(brand);
  }
};

// Update Brand
export const updateBrand: Controller<{ slug: string }, IBrand, IBrand> = async (
  req,
  res,
) => {
  const { slug } = req.params;
  const data = req.body;
  const updatedBrand = await BrandModel.findOneAndUpdate({ slug }, data, {
    new: true,
  });
  if (!updatedBrand) {
    return res.status(StatusCodes.NOT_FOUND).json({
      success: false,
      message: 'Brand not found',
    });
  } else {
    return res.status(StatusCodes.OK).json(updatedBrand);
  }
};

// Delete Brand
export const deleteBrand: Controller<{ slug: string }> = async (req, res) => {
  const { slug } = req.params;
  const deletedBrand = await BrandModel.findOneAndDelete({ slug });
  if (!deletedBrand) {
    return res.status(StatusCodes.NOT_FOUND).json({
      success: false,
      message: 'Brand not found',
    });
  } else {
    return res.status(StatusCodes.NO_CONTENT).send();
  }
};
