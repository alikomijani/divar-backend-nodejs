import type { CityType } from '@/models/city.model';
import { CityModel } from '@/models/city.model';
import type { PaginatedResponse } from '@/types/app.types';
import type { Controller } from '@/types/express';
import { duplicateKey } from '@/utils/duplicate-key';
import { getPaginatedQuery } from '@/utils/paginatedQuery';
import { StatusCodes } from 'http-status-codes';

export const createCity: Controller<object, CityType> = async (req, res) => {
  try {
    const cityData = req.body;
    const newCity = await CityModel.create(cityData);
    res.status(StatusCodes.CREATED).json(newCity);
  } catch (error) {
    return duplicateKey(error, res);
  }
};

export const getCities: Controller<
  object,
  PaginatedResponse<CityType>
> = async (req, res) => {
  const { page = 1, pageSize = 10 } = req.query; // Default to page 1 and limit 10
  const results = await getPaginatedQuery(CityModel, { page, pageSize });
  res.status(StatusCodes.OK).json(results);
};

export const getCityById: Controller<{ id: string }> = async (req, res) => {
  const { id } = req.params;
  const city = await CityModel.findById(id);
  if (!city) {
    return res.status(StatusCodes.NOT_FOUND).json({
      success: false,
      message: 'City not found',
    });
  } else {
    return res.status(StatusCodes.OK).json(city);
  }
};

export const updateCity: Controller<{ id: string }, CityType> = async (
  req,
  res,
) => {
  const { id } = req.params;
  const cityData: Partial<CityType> = req.body; // Use Partial to allow partial updates
  const updatedCity = await CityModel.findByIdAndUpdate(id, cityData, {
    new: true,
  });
  if (!updatedCity) {
    return res.status(StatusCodes.NOT_FOUND).json({
      success: false,
      message: 'City not found',
    });
  } else {
    return res.status(StatusCodes.OK).json(updatedCity);
  }
};

export const deleteCity: Controller<{ id: string }> = async (req, res) => {
  const { id } = req.params;
  const deletedCity = await CityModel.findByIdAndDelete(id);
  if (!deletedCity) {
    return res.status(StatusCodes.NOT_FOUND).json({
      success: false,
      message: 'City not found',
    });
  } else {
    return res.status(StatusCodes.NO_CONTENT).send();
  }
};
