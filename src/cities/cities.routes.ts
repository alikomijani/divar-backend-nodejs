import express from 'express';
import {
  createCity,
  getCities,
  getCityById,
  updateCity,
  deleteCity,
} from './cities.controllers';
import {
  loginMiddleware,
  roleMiddleware,
} from '@/middlewares/authentication-middleware';
import { Role } from '@/users/users.schema';

const citiesRouter = express.Router();

citiesRouter.post('/', createCity); // Create a new city
citiesRouter.get('/', getCities); // Get all cities
citiesRouter.get('/:id', getCityById); // Get a city by ID
citiesRouter.put(
  '/:id',
  loginMiddleware,
  roleMiddleware(Role.Admin),
  updateCity,
); // Update a city by ID
citiesRouter.delete(
  '/:id',
  loginMiddleware,
  roleMiddleware(Role.Admin),
  deleteCity,
); // Delete a city by ID

export default citiesRouter;
