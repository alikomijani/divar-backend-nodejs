import type { IColor } from '@/models/product.model';
import { ColorModel } from '@/models/product.model';
import type { Controller } from '@/types/app.types';
import { StatusCodes } from 'http-status-codes';

export const createColor: Controller<object, IColor> = async (req, res) => {
  const data = req.body;
  const newColor = new ColorModel(data);
  await newColor.save();
  res.status(StatusCodes.CREATED).json(newColor);
};

// Read All Colors
export const getAllColors: Controller<object, IColor[]> = async (req, res) => {
  const colors = await ColorModel.find();
  res.status(StatusCodes.OK).json({
    results: colors,
  });
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
