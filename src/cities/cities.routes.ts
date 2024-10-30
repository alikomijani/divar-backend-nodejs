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

const router = express.Router();

router.post('/', createCity); // Create a new city
router.get('/', getCities); // Get all cities
router.get('/:id', getCityById); // Get a city by ID
router.put('/:id', loginMiddleware, roleMiddleware(Role.Admin), updateCity); // Update a city by ID
router.delete('/:id', loginMiddleware, roleMiddleware(Role.Admin), deleteCity); // Delete a city by ID

export default router;
