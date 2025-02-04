import type { ICategory } from '@/schema/category.schema';
import { CategoryModel } from '@/schema/category.schema';
import type { Controller } from '@/types/express';
import { handleMongooseError } from '@/utils/db-errors';
import { getPaginatedQuery } from '@/utils/paginatedQuery';
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
    return handleMongooseError(error, res);
  }
};

// READ all categories
export const getAllCategories: Controller<
  object,
  { results: ICategory[] }
> = async (req, res) => {
  const { page = 1, pageSize = 10, q = '' } = req.query;
  let query = {};
  if (q) {
    query = {
      $or: [
        { titleFa: { $regex: q, $options: 'i' } }, // Case-insensitive search in titleFa
        { titleEn: { $regex: q, $options: 'i' } }, // Case-insensitive search in titleEn
      ],
    };
  }
  const categories = await getPaginatedQuery(CategoryModel, {
    page,
    pageSize,
    query,
    populateOptions: [{ path: 'parent' }, { path: 'properties' }],
  });

  return res.status(StatusCodes.OK).json(categories);
};

// READ a single category by ID
export const getCategoryBySlug: Controller<{ slug: string }> = async (
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
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ message: 'Category not found', success: false });
  } else {
    return res.status(StatusCodes.OK).json(updatedCategory);
  }
};

// DELETE a category by ID
export const deleteCategory: Controller<{ id: string }> = async (req, res) => {
  const { id } = req.params;
  const deletedCategory = await CategoryModel.findByIdAndDelete(id);
  if (!deletedCategory) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ message: 'Category not found' });
  } else {
    return res.status(StatusCodes.NO_CONTENT).send();
  }
};
