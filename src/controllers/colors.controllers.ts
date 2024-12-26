import type { IColor } from '@/models/color.model';
import { ColorModel } from '@/models/color.model';
import type { Controller, PaginationParams } from '@/types/app.types';
import { getPaginatedQuery } from '@/utils/paginatedQuery';
import { StatusCodes } from 'http-status-codes';

export const createColor: Controller<object, IColor> = async (req, res) => {
  const data = req.body;
  const newColor = new ColorModel(data);
  await newColor.save();
  res.status(StatusCodes.CREATED).json(newColor);
};

// Read All Colors
export const getAllColors: Controller<
  object,
  IColor[],
  PaginationParams
> = async (req, res) => {
  const { page = 1, pageSize = 10 } = req.query; // Default to page 1 and limit 10
  const paginatedResult = await getPaginatedQuery(
    ColorModel,
    page,
    pageSize,
    {},
  );
  res.status(StatusCodes.OK).json(paginatedResult);
};

// Update Color
export const updateColor: Controller<{ id: string }, IColor> = async (
  req,
  res,
) => {
  const { id } = req.params;
  const data: IColor = req.body;
  const updatedColor = await ColorModel.findByIdAndUpdate(id, data, {
    new: true,
  });
  if (!updatedColor) {
    return res.status(StatusCodes.NOT_FOUND).json({
      success: false,
      message: 'Color not found',
    });
  }
  res.status(StatusCodes.OK).json(updatedColor);
};

// Delete Color
export const deleteColor: Controller<{ id: string }> = async (req, res) => {
  const { id } = req.params;
  const deletedColor = await ColorModel.findByIdAndDelete(id);
  if (!deletedColor) {
    return res.status(StatusCodes.NOT_FOUND).json({
      success: false,
      message: 'Color not found',
    });
  }
  res.status(StatusCodes.OK).json({
    success: true,
    message: 'Color deleted successfully',
  });
};
