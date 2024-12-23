import { Router } from 'express';
import {
  createProperty,
  deleteProperty,
  getAllProperties,
  getPropertyById,
  updateProperty,
} from '../controllers/properties.controllers';
import { validateData } from '@/middlewares/validation.middleware';
import {
  loginMiddleware,
  roleMiddleware,
} from '@/middlewares/authentication.middleware';
import { Role } from '@/types/user.types';
import { PropertySchema } from '@/validations/category.validation';

const propertiesRouter = Router();

propertiesRouter.get('/', getAllProperties);
propertiesRouter.get('/:id', getPropertyById);

// protected route

propertiesRouter.post(
  '/',
  // loginMiddleware,
  // roleMiddleware(Role.Admin),
  validateData(PropertySchema),
  createProperty,
);

propertiesRouter.put(
  '/:id',
  // loginMiddleware,
  // roleMiddleware(Role.Admin),
  validateData(PropertySchema),
  updateProperty,
);

propertiesRouter.delete(
  '/:id',
  loginMiddleware,
  roleMiddleware(Role.Admin),
  deleteProperty,
);

export default propertiesRouter;
