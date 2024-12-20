import { CityModel } from '@/models/city.model';
import type { Controller } from '@/types/app.types';
import type { ICity } from '@/types/city.types';
import { StatusCodes } from 'http-status-codes';

export const createCity: Controller<object, ICity> = async (req, res) => {
  const cityData: ICity = req.body;
  const newCity = new CityModel(cityData);
  await newCity.save();
  res.status(StatusCodes.CREATED).json({
    success: true,
    message: 'City created successfully',
    result: newCity,
  });
};

export const getCities: Controller<
  object,
  object,
  { page: number; limit: number }
> = async (req, res) => {
  const { page = 1, limit = 10 } = req.query; // Default to page 1 and limit 10
  const pageNumber = Number(page);
  const limitNumber = Number(limit);
  const cities = await CityModel.find()
    .skip((pageNumber - 1) * limitNumber) // Skip documents for pagination
    .limit(limitNumber); // Limit the number of documents ed;
  const total = await CityModel.countDocuments();
  res.status(StatusCodes.OK).json({
    success: true,
    results: cities,
    totalPages: Math.ceil(total / limitNumber), // Total pages based on the limit
    currentPage: pageNumber,
    total, // Total number of cities
  });
};

export const getCityBySlug: Controller<{ slug: string }> = async (req, res) => {
  const { slug } = req.params;
  const city = await CityModel.findOne({ slug });
  if (!city) {
    res.status(StatusCodes.NOT_FOUND).json({
      success: false,
      message: 'City not found',
    });
  }
  res.status(StatusCodes.OK).json({
    success: true,
    result: city,
  });
};

export const updateCity: Controller<{ slug: string }, ICity> = async (
  req,
  res,
) => {
  const { slug } = req.params;
  const cityData: Partial<ICity> = req.body; // Use Partial to allow partial updates

  const updatedCity = await CityModel.findOneAndUpdate({ slug }, cityData, {
    new: true,
  });
  if (!updatedCity) {
    res.status(StatusCodes.NOT_FOUND).json({
      success: false,
      message: 'City not found',
    });
  }
  res.status(StatusCodes.OK).json({
    success: true,
    message: 'City updated successfully',
    result: updatedCity,
  });
};

export const deleteCity: Controller<{ slug: string }> = async (req, res) => {
  const { slug } = req.params;
  const deletedCity = await CityModel.findOneAndDelete({ slug });
  if (!deletedCity) {
    res.status(StatusCodes.NOT_FOUND).json({
      success: false,
      message: 'City not found',
    });
  }
  res.status(StatusCodes.ACCEPTED).json({
    success: true,
    message: 'City deleted successfully',
  });
};
