import express from 'express';

import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from '../controllers/product.controllers'; // Import your controller functions
import { ProductSchemaZod } from '@/models/product.model';
import { validateData } from '@/middlewares/validation.middleware';

const router = express.Router();

router.post('/', validateData(ProductSchemaZod), createProduct);
router.get('/', getAllProducts);
router.get('/:id', getProductById);
router.put('/:id', validateData(ProductSchemaZod), updateProduct);
router.delete('/:id', deleteProduct);

export default router;
