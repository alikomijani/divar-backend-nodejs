import type { ISeller, SellerType } from '@/models/seller.model';
import SellerModel from '@/models/seller.model';
import type { PaginatedResponse } from '@/types/app.types';
import type { Controller } from '@/types/express';
import { duplicateKey } from '@/utils/duplicate-key';
import { getPaginatedQuery } from '@/utils/paginatedQuery';
import { StatusCodes } from 'http-status-codes';

// Create (POST)
const createSeller: Controller<object, ISeller, SellerType> = async (
  req,
  res,
) => {
  try {
    const newSeller = new SellerModel(req.body);
    const savedSeller = await newSeller.save();
    return res.status(StatusCodes.CREATED).json(savedSeller); // Return the created seller with status 201 (Created)
  } catch (error) {
    return duplicateKey(error, res);
  }
};

// Read All (GET)
const getAllSellers: Controller<
  object,
  object,
  PaginatedResponse<SellerType>
> = async (req, res) => {
  const { page = 1, pageSize = 10 } = req.query; // Default to page 1 and limit 10
  const sellers = await getPaginatedQuery(SellerModel, { page, pageSize });
  return res.json(sellers);
};

// Read by ID (GET)
const getSellerById: Controller<{ id: string }> = async (req, res) => {
  const { id } = req.params;
  const seller = await SellerModel.findById(id);
  if (!seller) {
    return res
      .status(404)
      .json({ success: false, message: 'Seller not found' }); // Return 404 for non-existent seller
  }
  res.json(seller);
};

// Read by ID (GET)
const getSellerDetails: Controller = async (req, res) => {
  const sellerId = req.user?.sellerId;
  const seller = await SellerModel.findById(sellerId);
  if (!seller) {
    return res
      .status(404)
      .json({ success: false, message: 'Seller not found' }); // Return 404 for non-existent seller
  }
  res.json(seller);
};
// Update by ID (PUT)
const updateSeller: Controller<{ id: string }, ISeller, ISeller> = async (
  req,
  res,
) => {
  const { id } = req.params;
  const updatedSeller = await SellerModel.findByIdAndUpdate(id, req.body, {
    new: true,
  }); // Return the updated document
  if (!updatedSeller) {
    return res
      .status(404)
      .json({ success: false, message: 'Seller not found' });
  }
  res.json(updatedSeller);
};

// Delete by ID (DELETE)
const deleteSeller: Controller<{ id: string }> = async (req, res) => {
  const { id } = req.params;
  const deletedSeller = await SellerModel.findByIdAndDelete(id);
  if (!deletedSeller) {
    return res
      .status(404)
      .json({ success: false, message: 'Seller not found' });
  }
  res.status(StatusCodes.NO_CONTENT);
};

export {
  createSeller,
  updateSeller,
  getAllSellers,
  getSellerById,
  deleteSeller,
  getSellerDetails,
};
