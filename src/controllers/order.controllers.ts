import type { IOrder, OrderSchemaType } from '@/schema/order.schema';
import { OrderItemModel, OrderModel } from '@/schema/order.schema';
import { ProductSellerPriceModel } from '@/schema/productSellers.schema';
import type { PaginatedResponse } from '@/types/app.types';
import type { Controller } from '@/types/express';
import { getPaginatedQuery } from '@/utils/paginatedQuery';
import { StatusCodes } from 'http-status-codes';

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
    // to do aggregate order
    const orders = await OrderItemModel.find({
      seller: sellerId,
    })
      .populate('productSeller')
      .populate('order');

    return res.json(orders);
  } catch (error) {
    console.error('Error getting orders by seller:', error);
    throw error;
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
