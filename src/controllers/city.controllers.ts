import type { CityType } from '@/models/city.model';
import { CityModel } from '@/models/city.model';
import type { Controller, PaginationParams } from '@/types/app.types';
import { getPaginatedQuery } from '@/utils/paginatedQuery';
import { StatusCodes } from 'http-status-codes';
import { MongoServerError } from 'mongodb';

export const createCity: Controller<object, CityType> = async (req, res) => {
  try {
    const cityData = req.body;
    const newCity = await CityModel.create(cityData);
    res.status(StatusCodes.CREATED).json(newCity);
  } catch (error) {
    if (error instanceof MongoServerError && error.code === 11000) {
      // Handle duplicate email or username error
      const duplicatedField = Object.keys(error.keyValue)[0];
      res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: `${duplicatedField} already exists. Please use a different ${duplicatedField}.`,
        errors: {
          [duplicatedField]: `${duplicatedField} already exists. Please use a different ${duplicatedField}.`,
        },
      });
    }
  }
};

export const getCities: Controller<object, object, PaginationParams> = async (
  req,
  res,
) => {
  const { page = 1, pageSize = 10 } = req.query; // Default to page 1 and limit 10
  const results = await getPaginatedQuery(CityModel, page, pageSize, {});
  res.status(StatusCodes.OK).json(results);
};

export const getCityBySlug: Controller<{ slug: string }> = async (req, res) => {
  const { slug } = req.params;
  const city = await CityModel.findOne({ slug });
  if (!city) {
    return res.status(StatusCodes.NOT_FOUND).json({
      success: false,
      message: 'City not found',
    });
  }
  res.status(StatusCodes.OK).json(city);
};

export const updateCity: Controller<{ slug: string }, CityType> = async (
  req,
  res,
) => {
  const { slug } = req.params;
  const cityData: Partial<CityType> = req.body; // Use Partial to allow partial updates
  const updatedCity = await CityModel.findOneAndUpdate({ slug }, cityData, {
    new: true,
  });
  if (!updatedCity) {
    return res.status(StatusCodes.NOT_FOUND).json({
      success: false,
      message: 'City not found',
    });
  }
  res.status(StatusCodes.OK).json(updatedCity);
};

export const deleteCity: Controller<{ slug: string }> = async (req, res) => {
  const { slug } = req.params;
  const deletedCity = await CityModel.findOneAndDelete({ slug });
  if (!deletedCity) {
    return res.status(StatusCodes.NOT_FOUND).json({
      success: false,
      message: 'City not found',
    });
  }
  res.status(StatusCodes.ACCEPTED).json({
    success: true,
    message: 'City deleted successfully',
  });
};
