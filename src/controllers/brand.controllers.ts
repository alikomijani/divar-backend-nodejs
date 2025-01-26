import type { IBrand } from '@/schema/brand.schema';
import { BrandModel } from '@/schema/brand.schema';
import type { PaginatedResponse } from '@/types/app.types';
import type { Controller } from '@/types/express';
import { handleMongooseError } from '@/utils/db-errors';
import { getPaginatedQuery } from '@/utils/paginatedQuery';
import { StatusCodes } from 'http-status-codes';

// Create Brand
export const createBrand: Controller<object, IBrand> = async (req, res) => {
  try {
    const data = req.body;
    const newBrand = await BrandModel.create(data);
    res.status(StatusCodes.CREATED).json(newBrand);
  } catch (error) {
    return handleMongooseError(error, res);
  }
};

// Get All Brands
export const getAllBrands: Controller<
  object,
  PaginatedResponse<IBrand>
> = async (req, res) => {
  const { page = 1, pageSize = 10, brandSlugs, category } = req.query; // Default to page 1 and limit 10
  const query: Record<string, any> = {};
  if (brandSlugs) {
    const slugArray = Array.isArray(brandSlugs) ? brandSlugs : [brandSlugs]; // Ensure it's an array
    const brands = await BrandModel.find({ slug: { $in: slugArray } }).select(
      '_id',
    ); // Find brands by slugs
    if (!brands.length) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: 'No brands found for the provided slugs',
        success: false,
      });
    }
    query.brand = { $in: brands.map((brand) => brand._id) }; // Use the brand IDs in the query
  }

  // If category is provided, add it to the query
  if (category) {
    query.category = category;
  }
  const paginatedResult = await getPaginatedQuery(BrandModel, {
    page,
    pageSize,
    query,
  });
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
    return handleMongooseError(error, res);
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
