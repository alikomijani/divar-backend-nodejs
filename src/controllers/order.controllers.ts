import type { IOrder, OrderSchemaType } from '@/schema/order.schema';
import { OrderItemModel, OrderModel } from '@/schema/order.schema';
import { ProductSellerPriceModel } from '@/schema/productSellers.schema';
import type { PaginatedResponse } from '@/types/app.types';
import type { Controller } from '@/types/express';
import { getPaginatedQuery } from '@/utils/paginatedQuery';
import { StatusCodes } from 'http-status-codes';
import mongoose from 'mongoose';

export const createUserOrder: Controller<
  object,
  IOrder,
  OrderSchemaType
> = async (req, res) => {
  try {
    const validatedData = req.body;
    const newOrder = new OrderModel({
      user: req.user!.id,
      deliveryDate: validatedData.deliveryDate,
      shippingAddress: validatedData.shippingAddress,
    });

    await newOrder.save();

    const orderItems = await Promise.all(
      validatedData.orderItems.map(async (itemData) => {
        const productSeller = await ProductSellerPriceModel.findById(
          itemData.productSeller,
        );
        const newOrderItem = new OrderItemModel({
          ...itemData,
          order: newOrder.id,
          seller: productSeller?.seller, // Set the seller ID
        });
        await newOrderItem.save();
        return newOrderItem.id;
      }),
    );

    newOrder.orderItems = orderItems;
    await newOrder.save();
    const populatedOrderItem = await newOrder.populate(
      'orderItems.productSeller',
    );
    return res.json(populatedOrderItem);
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

export const getUserOrders: Controller<
  object,
  PaginatedResponse<IOrder>
> = async (req, res, next) => {
  try {
    const { page = 1, pageSize = 10 } = req.query;
    const results = await getPaginatedQuery(OrderModel, {
      page,
      pageSize,
      query: {
        user: req.user?.id,
      },
      populateOptions: [
        {
          path: 'orderItems',
          populate: [
            { path: 'seller' },
            { path: 'productSeller', populate: [{ path: 'product' }] },
          ],
        },
      ],
    });
    return res.json(results);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const getOrdersBySeller: Controller = async (req, res) => {
  const sellerId = req.user?.sellerId;
  if (!sellerId) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: 'seller id not found', success: false });
  }
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const orders = await OrderModel.aggregate([
      {
        $lookup: {
          from: 'orderitems',
          localField: 'orderItems',
          foreignField: '_id',
          as: 'orderItems',
        },
      },
      {
        $unwind: '$orderItems',
      },
      {
        $match: {
          'orderItems.seller': new mongoose.Types.ObjectId(sellerId), // Only include orders that have items from this seller
        },
      },
      {
        $lookup: {
          from: 'productsellers', // Ensure correct collection name
          localField: 'orderItems.productSeller',
          foreignField: '_id',
          as: 'orderItems.productSeller',
        },
      },
      {
        $unwind: {
          path: '$orderItems.productSeller',
          preserveNullAndEmptyArrays: true, // Keep orderItems even if no productSeller
        },
      },
      {
        $lookup: {
          from: 'users', // Populate user data
          localField: 'user',
          foreignField: '_id',
          as: 'user',
        },
      },
      {
        $unwind: {
          path: '$user',
          preserveNullAndEmptyArrays: true, // Keep order even if user is missing
        },
      },
      {
        $group: {
          _id: '$_id',
          shippingAddress: { $first: '$shippingAddress' },
          user: {
            $first: {
              _id: '$user._id',
              firstName: '$user.firstName',
              lastName: '$user.lastName',
              email: '$user.email',
            },
          }, // Select only required user fields
          deliveryDate: { $first: '$deliveryDate' },
          orderStatus: { $first: '$orderStatus' },
          orderItems: { $push: '$orderItems' }, // Group back the filtered order items
        },
      },
      {
        $addFields: {
          id: '$_id', // Rename `_id` to `id`
        },
      },
      {
        $project: {
          _id: 0, // Remove `_id` field
        },
      },
      { $skip: skip }, // Skip based on page number
      { $limit: limit }, // Limit number of results per page
    ]);

    // Get total count for pagination
    const totalOrders = await OrderModel.aggregate([
      {
        $lookup: {
          from: 'orderitems',
          localField: 'orderItems',
          foreignField: '_id',
          as: 'orderItems',
        },
      },
      { $unwind: '$orderItems' },
      {
        $match: {
          'orderItems.seller': new mongoose.Types.ObjectId(sellerId),
        },
      },
      {
        $group: {
          _id: '$_id',
        },
      },
      { $count: 'total' },
    ]);

    const total = totalOrders.length > 0 ? totalOrders[0].total : 0;
    const totalPages = Math.ceil(total / limit);
    return res.json({
      results: orders,
      total,
      page,
      totalPages,
      limit,
    });
  } catch (error) {
    console.error('Error fetching seller orders:', error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: 'Failed to fetch orders', success: false });
  }
};

export const getAllOrders: Controller = async (req, res) => {
  try {
    const { page = 1, pageSize = 10 } = req.query;
    const orders = await getPaginatedQuery(OrderModel, {
      page,
      pageSize,
      populateOptions: [
        { path: 'user' },
        {
          path: 'orderItems',
          populate: [
            { path: 'seller' },
            { path: 'productSeller', populate: [{ path: 'product' }] },
          ],
        },
      ],
    });
    return res.json(orders);
  } catch (error) {
    console.error('Error getting orders:', error);
    throw error;
  }
};
