import { StatusCodes } from 'http-status-codes';
import type { IProduct } from '@/models/product.model';
import ProductModel from '@/models/product.model';
import { MongoServerError } from 'mongodb';
import type { Controller } from '@/types/app.types';

export const createProduct: Controller = async (req, res) => {
  try {
    // req.body is already validated by the middleware
    const newProduct = new ProductModel(req.body);
    const savedProduct = await newProduct.save();
    res.status(StatusCodes.CREATED).json(savedProduct);
  } catch (error) {
    if (error instanceof MongoServerError && error.code === 11000) {
      // Handle duplicate email  error
      const duplicatedField = Object.keys(error.keyValue)[0];
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: `${duplicatedField} already exists. Please use a different ${duplicatedField}.`,
        errors: {
          [duplicatedField]: `${duplicatedField} already exists. Please use a different ${duplicatedField}.`,
        },
      });
    } else {
      console.error(error);
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: 'Failed to create product', success: false });
    }
  }
};

export const getAllProducts: Controller = async (req, res) => {
  try {
    const products = await ProductModel.find();
    return res.json(products);
  } catch (error) {
    console.error(error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: 'Failed to fetch products', success: false });
  }
};

export const getProductById: Controller<{ id: string }> = async (req, res) => {
  try {
    const product = await ProductModel.findById(req.params.id);
    if (!product) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    console.error(error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: 'Failed to fetch product' });
  }
};

export const updateProduct: Controller<
  { id: string },
  IProduct,
  IProduct
> = async (req, res) => {
  try {
    // req.body is already validated
    const updatedProduct = await ProductModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true },
    );

    if (!updatedProduct) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Product not found',
      });
    }
    return res.json(updatedProduct);
  } catch (error) {
    if (error instanceof MongoServerError && error.code === 11000) {
      // Handle duplicate email  error
      const duplicatedField = Object.keys(error.keyValue)[0];
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: `${duplicatedField} already exists. Please use a different ${duplicatedField}.`,
        errors: {
          [duplicatedField]: `${duplicatedField} already exists. Please use a different ${duplicatedField}.`,
        },
      });
    } else {
      console.error(error);
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ success: false, message: 'Failed to update product' });
    }
  }
};

export const deleteProduct: Controller<{ id: string }> = async (req, res) => {
  try {
    const deletedProduct = await ProductModel.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: 'Product not found', success: false });
    }
    res.status(StatusCodes.NO_CONTENT).send();
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: 'Failed to delete product' });
  }
};
