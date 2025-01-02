import express from 'express';
import {
  createCity,
  getCities,
  getCityById,
  updateCity,
  deleteCity,
} from '../controllers/city.controllers';
import { validateIdMiddleware } from '@/middlewares/validate-id.middleware';

const cityRouter = express.Router();
cityRouter.get('/', getCities); // Get all cities

const cityAdminRouter = express.Router();

cityAdminRouter.post('/', createCity); // Create a new city
cityAdminRouter.get('/', getCities); // Get all cities
cityAdminRouter.get('/:id', validateIdMiddleware, getCityById); // Get a city by ID
cityAdminRouter.put('/:id', validateIdMiddleware, updateCity); // Update a city by ID
cityAdminRouter.delete('/:id', validateIdMiddleware, deleteCity); // Delete a city by ID

export { cityAdminRouter, cityRouter };
