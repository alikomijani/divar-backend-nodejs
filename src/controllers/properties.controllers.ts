import type { ICategoryProperty } from '@/schema/property.model';
import { PropertyModel } from '@/schema/property.model';
import type { PaginatedResponse } from '@/types/app.types';
import type { Controller } from '@/types/express';
import { getPaginatedQuery } from '@/utils/paginatedQuery';
import { StatusCodes } from 'http-status-codes';

export const createProperty: Controller<
  object,
  ICategoryProperty,
  ICategoryProperty
> = async (req, res) => {
  try {
    const propertyData: ICategoryProperty = req.body;
    const newProperty = await PropertyModel.create(propertyData);
    res.status(StatusCodes.CREATED).json(newProperty);
  } catch (error) {
    console.error('Error creating property:', error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: 'Failed to create property' });
  }
};

export const getAllProperties: Controller<
  object,
  PaginatedResponse<ICategoryProperty>
> = async (req, res) => {
  try {
    const { page = 1, pageSize = 10, q = '' } = req.query;
    let query = {};
    if (q) {
      query = {
        $or: [
          { name: { $regex: q, $options: 'i' } }, // Case-insensitive search in name
          { label: { $regex: q, $options: 'i' } },
        ],
      };
    }
    const paginatedResult = await getPaginatedQuery(PropertyModel, {
      page,
      pageSize,
      query,
    });
    return res.status(StatusCodes.OK).json(paginatedResult);
  } catch (error) {
    console.error('Error fetching properties:', error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: 'Failed to fetch properties' });
  }
};

export const getPropertyById: Controller<
  { id: string },
  ICategoryProperty
> = async (req, res) => {
  try {
    const property = await PropertyModel.findById(req.params.id);
    if (!property) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: 'Property not found', success: false });
    }
    return res.status(StatusCodes.OK).json(property);
  } catch (error) {
    console.error('Error fetching property:', error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: 'Failed to fetch property', success: false });
  }
};

export const updateProperty: Controller<
  { id: string },
  ICategoryProperty,
  Partial<ICategoryProperty>
> = async (req, res) => {
  try {
    const updatedData: Partial<ICategoryProperty> = req.body;
    const updatedProperty = await PropertyModel.findByIdAndUpdate(
      req.params.id,
      updatedData,
      {
        new: true,
        runValidators: true,
      },
    );
    if (!updatedProperty) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: 'Property not found', success: false });
    }
    return res.status(StatusCodes.OK).json(updatedProperty);
  } catch (error) {
    console.error('Error updating property:', error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: 'Failed to update property', success: false });
  }
};

export const deleteProperty: Controller<{ id: string }> = async (req, res) => {
  try {
    const deletedProperty = await PropertyModel.findByIdAndDelete(
      req.params.id,
    );
    if (!deletedProperty) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: 'Property not found' });
    }
    return res.status(StatusCodes.NO_CONTENT).send(); // 204 No Content
  } catch (error) {
    console.error('Error deleting property:', error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: 'Failed to delete property' });
  }
};
