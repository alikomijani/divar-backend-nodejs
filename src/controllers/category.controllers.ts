import { CategoryModel } from '@/models/category.model';
import type { Controller } from '@/types/app.types';
import type { ICategory } from '@/types/category.types';
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
export const getCategoryById: Controller<{ slug: string }> = async (
  req,
  res,
) => {
  const { slug } = req.params;
  const category = await CategoryModel.findOne({ slug })
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
  { slug: string },
  Partial<ICategory>
> = async (req, res) => {
  const { slug } = req.params;
  const updatedData = req.body;
  const updatedCategory = await CategoryModel.findOneAndUpdate(
    { slug },
    updatedData,
    {
      new: true,
      runValidators: true,
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
export const deleteCategory: Controller<{ slug: string }> = async (
  req,
  res,
) => {
  const { slug } = req.params;
  const deletedCategory = await CategoryModel.findOneAndDelete({ slug });
  if (!deletedCategory) {
    res.status(StatusCodes.NOT_FOUND).json({ message: 'Category not found' });
  }
  res.status(StatusCodes.OK).json({ message: 'Category deleted successfully' });
};
