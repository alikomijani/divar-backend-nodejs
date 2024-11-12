import { categoryModel, propertyModel } from '@/models/category.model';
import type { Controller } from '@/types/app.types';
import type { ICategory, ICategoryProperty } from '@/types/category.types';
import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

// CREATE a new category
export const createCategory = async (req: Request, res: Response) => {
  const categoryData: ICategory = req.body;
  const newCategory = await categoryModel.create(categoryData);
  res.status(StatusCodes.CREATED).json(newCategory);
};

// READ all categories
export const getAllCategories = async (_req: Request, res: Response) => {
  const categories = await categoryModel.find().populate('parent');
  res.status(StatusCodes.OK).json(categories);
};

// READ a single category by ID
export const getCategoryById: Controller<{ id: string }> = async (req, res) => {
  const { id } = req.params;
  const category = await categoryModel.findById(id).populate('parent');
  if (!category) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ message: 'Category not found' });
  }
  res.status(StatusCodes.OK).json(category);
};

// UPDATE a category by ID
export const updateCategory: Controller<
  { id: string },
  Partial<ICategory>
> = async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;
  const updatedCategory = await categoryModel.findByIdAndUpdate(
    id,
    updatedData,
    {
      new: true,
      runValidators: true,
    },
  );
  if (!updatedCategory) {
    res.status(StatusCodes.NOT_FOUND).json({ message: 'Category not found' });
  }
  res.status(StatusCodes.OK).json(updatedCategory);
};

// DELETE a category by ID
export const deleteCategory: Controller<{ id: string }> = async (req, res) => {
  const { id } = req.params;
  const deletedCategory = await categoryModel.findByIdAndDelete(id);
  if (!deletedCategory) {
    res.status(StatusCodes.NOT_FOUND).json({ message: 'Category not found' });
  }
  res.status(StatusCodes.OK).json({ message: 'Category deleted successfully' });
};

export const createProperty = async (req: Request, res: Response) => {
  const propertyData: ICategoryProperty = req.body;
  const newProperty = await propertyModel.create(propertyData);
  res.status(StatusCodes.CREATED).json(newProperty);
};

// READ all Properties
export const getAllProperties = async (_req: Request, res: Response) => {
  const properties = await propertyModel.find();
  res.status(StatusCodes.OK).json(properties);
};

// READ a single category by ID
export const getPropertyById: Controller<{ id: string }> = async (req, res) => {
  const { id } = req.params;
  const Property = await propertyModel.findById(id);
  if (!Property) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ message: 'Property not found' });
  }
  res.status(StatusCodes.OK).json(Property);
};

// UPDATE a Property by ID
export const updateProperty: Controller<
  { id: string },
  Partial<ICategoryProperty>
> = async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;
  const updatedProperty = await propertyModel.findByIdAndUpdate(
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
  const deletedProperty = await propertyModel.findByIdAndDelete(id);
  if (!deletedProperty) {
    res.status(StatusCodes.NOT_FOUND).json({ message: 'Property not found' });
  }
  res.status(StatusCodes.OK).json({ message: 'Property deleted successfully' });
};
