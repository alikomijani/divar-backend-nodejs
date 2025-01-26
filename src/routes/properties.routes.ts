import { Router } from 'express';
import {
  createProperty,
  deleteProperty,
  getAllProperties,
  getPropertyById,
  updateProperty,
} from '../controllers/properties.controllers';
import { validateData } from '@/middlewares/validation.middleware';
import { PropertySchemaZod } from '@/schema/property.model';
import { validateIdMiddleware } from '@/middlewares/validate-id.middleware';

const propertiesRouter = Router();

propertiesRouter.get('/', getAllProperties);
propertiesRouter.get('/:id', validateIdMiddleware, getPropertyById);

// protected route

propertiesRouter.post('/', validateData(PropertySchemaZod), createProperty);

propertiesRouter.put('/:id', validateData(PropertySchemaZod), updateProperty);

propertiesRouter.delete('/:id', deleteProperty);

export default propertiesRouter;
