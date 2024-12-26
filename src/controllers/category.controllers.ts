import type { ICategory } from '@/models/category.model';
import { CategoryModel } from '@/models/category.model';
import type { Controller } from '@/types/app.types';
import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

// CREATE a new category
export const createCategory = async (req: Request, res: Response) => {
  const categoryData: ICategory = req.body;
  const newCategory = await CategoryModel.create(categoryData);
  res.status(StatusCodes.CREATED).json(newCategory);
};

// READ all categories
export const getAllCategories = async (_req: Request, res: Response) => {
  const categories = await CategoryModel.find()
    .populate('properties')
    .populate('parent');
  res.status(StatusCodes.OK).json({ results: categories });
};

// READ a single category by ID
export const getCategoryById: Controller<{ id: string }> = async (req, res) => {
  const { id } = req.params;
  const category = await CategoryModel.findById(id)
    .populate('properties')
    .populate('parent');
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
  const updatedCategory = await CategoryModel.findByIdAndUpdate(
    id,
    updatedData,
    {
      new: true,
    },
  )
    .populate('parent')
    .populate('properties');
  if (!updatedCategory) {
    res.status(StatusCodes.NOT_FOUND).json({ message: 'Category not found' });
  }
  res.status(StatusCodes.OK).json(updatedCategory);
};

// DELETE a category by ID
export const deleteCategory: Controller<{ id: string }> = async (req, res) => {
  const { id } = req.params;
  const deletedCategory = await CategoryModel.findByIdAndDelete(id);
  if (!deletedCategory) {
    res.status(StatusCodes.NOT_FOUND).json({ message: 'Category not found' });
  }
  res.status(StatusCodes.OK).json({ message: 'Category deleted successfully' });
};
