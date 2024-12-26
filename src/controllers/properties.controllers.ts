import type { ICategory } from '@/models/category.model';
import { PropertyModel } from '@/models/property.model';
import type { Controller, PaginationParams } from '@/types/app.types';
import { getPaginatedQuery } from '@/utils/paginatedQuery';
import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

export const createProperty = async (req: Request, res: Response) => {
  const propertyData: ICategory = req.body;
  const newProperty = await PropertyModel.create(propertyData);
  res.status(StatusCodes.CREATED).json(newProperty);
};

// READ all Properties
export const getAllProperties: Controller<
  object,
  object,
  PaginationParams
> = async (req, res) => {
  const { page = 1, pageSize = 10 } = req.query; // Default to page 1 and limit 10
  const paginatedResult = await getPaginatedQuery(
    PropertyModel,
    page,
    pageSize,
    {},
  );
  return res.status(StatusCodes.OK).json(paginatedResult);
};

// READ a single category by ID
export const getPropertyById: Controller<{ id: string }> = async (req, res) => {
  const { id } = req.params;
  const property = await PropertyModel.findById(id);
  if (!property) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ message: 'Property not found' });
  } else {
    return res.status(StatusCodes.OK).json(property);
  }
};

// UPDATE a Property by ID
export const updateProperty: Controller<
  { id: string },
  Partial<ICategory>
> = async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;
  const updatedProperty = await PropertyModel.findByIdAndUpdate(
    id,
    updatedData,
    {
      new: true,
      runValidators: true,
    },
  );
  if (!updatedProperty) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ message: 'Category not found' });
  } else {
    return res.status(StatusCodes.OK).json(updatedProperty);
  }
};

// DELETE a category by ID
export const deleteProperty: Controller<{ id: string }> = async (req, res) => {
  const { id } = req.params;
  const deletedProperty = await PropertyModel.findByIdAndDelete(id);
  if (!deletedProperty) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ message: 'Property not found' });
  } else {
    return res
      .status(StatusCodes.OK)
      .json({ message: 'Property deleted successfully' });
  }
};
