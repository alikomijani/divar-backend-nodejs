import express from 'express';
import {
  createCity,
  getCities,
  getCityBySlug,
  updateCity,
  deleteCity,
} from '../controllers/city.controllers';
import {
  loginMiddleware,
  roleMiddleware,
} from '@/middlewares/authentication.middleware';
import { Role } from '@/types/user.types';

const cityRouter = express.Router();

cityRouter.post('/', createCity); // Create a new city
cityRouter.get('/', getCities); // Get all cities
cityRouter.get('/:slug', getCityBySlug); // Get a city by ID
cityRouter.put(
  '/:slug',
  loginMiddleware,
  roleMiddleware(Role.Admin),
  updateCity,
); // Update a city by ID
cityRouter.delete(
  '/:slug',
  loginMiddleware,
  roleMiddleware(Role.Admin),
  deleteCity,
); // Delete a city by ID

export default cityRouter;
