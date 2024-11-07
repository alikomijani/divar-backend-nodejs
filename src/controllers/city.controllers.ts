import { cityModel } from '@/models/city.model';
import type { Controller } from '@/types/app.types';
import type { ICity } from '@/types/city.types';
import { StatusCodes } from 'http-status-codes';

export const createCity: Controller<object, ICity> = async (req, res) => {
  const cityData: ICity = req.body;
  try {
    const newCity = new cityModel(cityData);
    await newCity.save();
    return res.status(StatusCodes.CREATED).json({
      success: true,
      message: 'City created successfully',
      city: newCity,
    });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Error creating city',
      error: (error as any).message,
    });
  }
};

export const getCities: Controller<
  object,
  object,
  { page: number; limit: number }
> = async (req, res) => {
  const { page = 1, limit = 10 } = req.query; // Default to page 1 and limit 10
  const pageNumber = Number(page);
  const limitNumber = Number(limit);
  const cities = await cityModel
    .find()
    .skip((pageNumber - 1) * limitNumber) // Skip documents for pagination
    .limit(limitNumber); // Limit the number of documents returned;

  const totalCities = await cityModel.countDocuments();
  return res.status(StatusCodes.OK).json({
    success: true,
    cities,
    totalPages: Math.ceil(totalCities / limitNumber), // Total pages based on the limit
    currentPage: pageNumber,
    totalCities, // Total number of cities
  });
};

export const getCityById: Controller<{ id: string }> = async (req, res) => {
  const { id } = req.params;
  try {
    const city = await cityModel.findById(id);
    if (!city) {
      return res.status(404).json({
        success: false,
        message: 'City not found',
      });
    }
    return res.status(200).json({
      success: true,
      city,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error fetching city',
      error: (error as any).message,
    });
  }
};

export const updateCity: Controller<{ id: string }, ICity> = async (
  req,
  res,
) => {
  const { id } = req.params;
  const cityData: Partial<ICity> = req.body; // Use Partial to allow partial updates

  try {
    const updatedCity = await cityModel.findByIdAndUpdate(id, cityData, {
      new: true,
    });
    if (!updatedCity) {
      return res.status(404).json({
        success: false,
        message: 'City not found',
      });
    }
    return res.status(200).json({
      success: true,
      message: 'City updated successfully',
      city: updatedCity,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error updating city',
      error: (error as any).message,
    });
  }
};

export const deleteCity: Controller<{ id: string }> = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedCity = await cityModel.findByIdAndDelete(id);
    if (!deletedCity) {
      return res.status(404).json({
        success: false,
        message: 'City not found',
      });
    }
    res.status(200).json({
      success: true,
      message: 'City deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting city',
      error: (error as any).message,
    });
  }
};
