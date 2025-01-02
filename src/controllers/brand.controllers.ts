import type { IBrand } from '@/models/brand.model';
import { BrandModel } from '@/models/brand.model';
import type { PaginatedResponse } from '@/types/app.types';
import type { Controller } from '@/types/express';
import { duplicateKey } from '@/utils/duplicate-key';
import { getPaginatedQuery } from '@/utils/paginatedQuery';
import { StatusCodes } from 'http-status-codes';

// Create Brand
export const createBrand: Controller<object, IBrand> = async (req, res) => {
  try {
    const data = req.body;
    const newBrand = await BrandModel.create(data);
    res.status(StatusCodes.CREATED).json(newBrand);
  } catch (error) {
    return duplicateKey(error, res);
  }
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

export const getBrandById: Controller<{ id: string }, IBrand> = async (
  req,
  res,
) => {
  const { id } = req.params;
  const brand = await BrandModel.findById(id);
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
export const updateBrand: Controller<{ id: string }, IBrand, IBrand> = async (
  req,
  res,
) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const updatedBrand = await BrandModel.findByIdAndUpdate(id, data, {
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
  } catch (error) {
    return duplicateKey(error, res);
  }
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
  } else {
    return res.status(StatusCodes.NO_CONTENT).send();
  }
};
