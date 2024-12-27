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
import { UserRole } from '@/models/user.model';
import { PropertySchemaZod } from '@/models/property.model';
import { validateIdMiddleware } from '@/middlewares/validate-id.middleware';

const propertiesRouter = Router();

propertiesRouter.get('/', getAllProperties);
propertiesRouter.get('/:id', validateIdMiddleware, getPropertyById);

// protected route

propertiesRouter.post(
  '/',
  loginMiddleware,
  roleMiddleware(UserRole.Admin),
  validateData(PropertySchemaZod),
  createProperty,
);

propertiesRouter.put(
  '/:id',
  validateIdMiddleware,
  loginMiddleware,
  roleMiddleware(UserRole.Admin),
  validateData(PropertySchemaZod),
  updateProperty,
);

propertiesRouter.delete(
  '/:id',
  validateIdMiddleware,
  loginMiddleware,
  roleMiddleware(UserRole.Admin),
  deleteProperty,
);

export default propertiesRouter;
