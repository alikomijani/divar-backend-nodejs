import { PropertyModel } from '@/models/property.model';
import type { Controller } from '@/types/app.types';
import type { ICategoryProperty } from '@/types/category.types';
import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

export const createProperty = async (req: Request, res: Response) => {
  const propertyData: ICategoryProperty = req.body;
  const newProperty = await PropertyModel.create(propertyData);
  res.status(StatusCodes.CREATED).json(newProperty);
};

// READ all Properties
export const getAllProperties = async (_req: Request, res: Response) => {
  const properties = await PropertyModel.find();
  res.status(StatusCodes.OK).json({
    results: properties,
  });
};

// READ a single category by ID
export const getPropertyById: Controller<{ id: string }> = async (req, res) => {
  const { id } = req.params;
  const property = await PropertyModel.findById(id);
  if (!property) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ message: 'Property not found' });
  }
  res.status(StatusCodes.OK).json(property);
};

// UPDATE a Property by ID
export const updateProperty: Controller<
  { id: string },
  Partial<ICategoryProperty>
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
    res.status(StatusCodes.NOT_FOUND).json({ message: 'Category not found' });
  }
  res.status(StatusCodes.OK).json(updatedProperty);
};

// DELETE a category by ID
export const deleteProperty: Controller<{ id: string }> = async (req, res) => {
  const { id } = req.params;
  const deletedProperty = await PropertyModel.findByIdAndDelete(id);
  if (!deletedProperty) {
    res.status(StatusCodes.NOT_FOUND).json({ message: 'Property not found' });
  }
  res.status(StatusCodes.OK).json({ message: 'Property deleted successfully' });
};
