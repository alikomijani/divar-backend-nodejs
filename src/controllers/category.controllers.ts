import type { ICategory } from '@/models/category.model';
import { CategoryModel } from '@/models/category.model';
import type { Controller } from '@/types/express';
import { duplicateKey } from '@/utils/duplicate-key';
import { StatusCodes } from 'http-status-codes';

// CREATE a new category
export const createCategory: Controller<object, ICategory> = async (
  req,
  res,
) => {
  try {
    const categoryData = req.body;
    const newCategory = await CategoryModel.create(categoryData);
    return res.status(StatusCodes.CREATED).json(newCategory);
  } catch (error) {
    return duplicateKey(error, res);
  }
};

// READ all categories
export const getAllCategories: Controller<
  object,
  { results: ICategory[] }
> = async (req, res) => {
  const categories = await CategoryModel.find()
    .populate('properties')
    .populate('parent');
  return res.status(StatusCodes.OK).json({ results: categories });
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
    },
  )
    .populate('parent')
    .populate('properties');
  if (!updatedCategory) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ message: 'Category not found', success: false });
  } else {
    return res.status(StatusCodes.OK).json(updatedCategory);
  }
};

// DELETE a category by ID
export const deleteCategory: Controller<{ slug: string }> = async (
  req,
  res,
) => {
  const { slug } = req.params;
  const deletedCategory = await CategoryModel.findOneAndDelete({ slug });
  if (!deletedCategory) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ message: 'Category not found' });
  } else {
    return res.status(StatusCodes.NO_CONTENT).send();
  }
};
