import { StatusCodes } from 'http-status-codes';
import type { IProduct } from '@/schema/product.schema';
import ProductModel from '@/schema/product.schema';
import { getPaginatedQuery } from '@/utils/paginatedQuery';
import { handleMongooseError } from '@/utils/db-errors';
import type { Controller } from '@/types/express';
import { getSellerLastPrice } from '@/models/product.model';

export const createProduct: Controller = async (req, res) => {
  try {
    // req.body is already validated by the middleware
    const newProduct = new ProductModel(req.body);
    const savedProduct = await newProduct.save();
    res.status(StatusCodes.CREATED).json(savedProduct);
  } catch (error) {
    console.log(error);
    return handleMongooseError(error, res);
  }
};

export const getAllProducts: Controller = async (req, res) => {
  try {
    // TODO: filter base on textSearch brand category, colors , price
    const { page = 1, pageSize = 10, q = '' } = req.query; // Default to page 1 and limit 10
    let query = {};
    if (q) {
      query = {
        $or: [
          { titleFa: { $regex: q, $options: 'i' } }, // Case-insensitive search in titleFa
          { titleEn: { $regex: q, $options: 'i' } }, // Case-insensitive search in titleEn
        ],
      };
    }
    const paginatedResult = await getPaginatedQuery(ProductModel, {
      page,
      pageSize,
      query,
      populateOptions: [
        { path: 'badges' },
        { path: 'category' },
        { path: 'brand' },
        { path: 'colors' },
      ],
    });
    const productsWithBestSeller = await Promise.all(
      paginatedResult.results.map(async (product) => ({
        ...product.toObject(), // Convert Mongoose document to plain object
        bestSeller: await product.getBestSeller(), // ✅ No TypeScript error now!
      })),
    );
    paginatedResult.results = productsWithBestSeller;
    return res.json(paginatedResult);
  } catch (error) {
    console.error(error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: 'Failed to fetch products', success: false });
  }
};

export const getProductByCode: Controller<{ code: string }> = async (
  req,
  res,
) => {
  try {
    const product = await ProductModel.findOne({
      code: req.params.code,
    })
      .populate({
        path: 'category',
        populate: {
          path: 'properties',
        },
      })
      .populate('badges')
      .populate('brand')
      .populate('colors');
    if (!product) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: 'Product not found' });
    }
    const bestSeller = await product.getBestSeller();
    res.json({ ...product.toObject(), bestSeller });
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
    const id = req.params.id;
    // req.body is already validated
    const updatedProduct = await ProductModel.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedProduct) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Product not found',
      });
    }
    return res.json(updatedProduct);
  } catch (error) {
    return handleMongooseError(error, res);
  }
};

export const deleteProduct: Controller<{ code: string }> = async (req, res) => {
  try {
    const deletedProduct = await ProductModel.findOneAndDelete({
      code: req.params.code,
    });
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

export const getProductPrices: Controller<{ code: string }> = async (
  req,
  res,
) => {
  try {
    const product = await ProductModel.findOne({ code: req.params.code });
    if (!product) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: 'Product not found' });
    }
    const last_price = await ProductModel.getLastPricesForProduct(product.id);
    return res.json(last_price);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching last prices' });
  }
};

export const getSellerProductByCode: Controller<{ code: string }> = async (
  req,
  res,
) => {
  try {
    const product = await ProductModel.findOne({
      code: req.params.code,
    })
      .populate('category')
      .populate('badges')
      .populate('brand')
      .populate('colors');
    if (!product) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: 'Product not found' });
    }
    const bestSeller = await await getSellerLastPrice(
      req.user!.sellerId as string,
      product.id,
    );
    res.json({ ...product.toObject(), bestSeller });
  } catch (error) {
    console.error(error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: 'Failed to fetch product' });
  }
};

export const getSellerAllProducts: Controller = async (req, res) => {
  try {
    // TODO: filter base on textSearch brand category, colors , price
    const { page = 1, pageSize = 10 } = req.query; // Default to page 1 and limit 10
    const paginatedResult = await getPaginatedQuery(ProductModel, {
      page,
      pageSize,
      populateOptions: [
        { path: 'badges' },
        { path: 'category' },
        { path: 'brand' },
        { path: 'colors' },
      ],
    });
    const productsWithBestSeller = await Promise.all(
      paginatedResult.results.map(async (product) => ({
        ...product.toObject(), // Convert Mongoose document to plain object
        bestSeller: await getSellerLastPrice(
          req.user!.sellerId as string,
          product.id,
        ),
      })),
    );
    paginatedResult.results = productsWithBestSeller;
    return res.json(paginatedResult);
  } catch (error) {
    console.error(error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: 'Failed to fetch products', success: false });
  }
};
