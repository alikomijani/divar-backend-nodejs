import { StatusCodes } from 'http-status-codes';
import { verifyToken } from '@/utils/jwt.utils';
import type {
  ChangePasswordType,
  IUser,
  LoginUser,
  RegisterSeller,
  RegisterUser,
  UpdateUserType,
} from '@/schema/auth.schema';
import { UserModel, UserRole } from '@/schema/auth.schema';
import { handleMongooseError } from '@/utils/db-errors';
import ProfileModel from '@/schema/profile.schema';
import type { Controller } from '@/types/express';
import SellerModel from '@/schema/seller.schema';
import { getPaginatedQuery } from '@/utils/paginatedQuery';

export const registerUser: Controller<object, object, RegisterUser> = async (
  req,
  res,
) => {
  try {
    const data = req.body;
    const user = await UserModel.create({
      ...data,
      role: UserRole.User,
    });
    const userProfile = await ProfileModel.create({
      user: user._id,
    });
    const tokens = user.createToken();
    // Remove the password field from the response for security
    return res.status(StatusCodes.CREATED).json({
      tokens,
      user,
      profile: userProfile,
    });
  } catch (error) {
    handleMongooseError(error, res);
  }
};

export const registerAdminUser: Controller<
  object,
  object,
  RegisterUser
> = async (req, res) => {
  try {
    const data = req.body;
    const user = await UserModel.create({
      ...data,
      role: UserRole.Admin,
    });
    const userProfile = await ProfileModel.create({
      user: user._id,
    });
    const tokens = user.createToken();
    // Remove the password field from the response for security
    return res.status(StatusCodes.CREATED).json({
      tokens,
      user,
      profile: userProfile,
    });
  } catch (error) {
    handleMongooseError(error, res);
  }
};

export const registerSeller: Controller<
  object,
  object,
  RegisterSeller
> = async (req, res) => {
  try {
    const { shopName, shopSlug, ...data } = req.body;
    const user = await UserModel.create({
      ...data,
      role: UserRole.Seller,
    });
    const userProfile = await ProfileModel.create({
      user: user._id,
    });

    const shop = await SellerModel.create({
      name: shopName,
      slug: shopSlug,
      user: user.id,
    });

    const tokens = user.createToken(shop.id);
    // Remove the password field from the response for security
    return res.status(StatusCodes.CREATED).json({
      tokens,
      user,
      profile: userProfile,
    });
  } catch (error) {
    handleMongooseError(error, res);
  }
};
export const updateUserProfile: Controller = async (req, res, next) => {
  try {
    const profile = await ProfileModel.findOneAndUpdate(
      { user: req.user?.id },
      { ...req.body },
      {
        new: true,
      },
    );
    return res.json(profile);
  } catch (error) {
    next(error);
  }
};
export const getUser: Controller = async (req, res, next) => {
  try {
    const user = await UserModel.findById(req.user?.id);
    const profile = await ProfileModel.findOne({ user: req.user?.id });

    if (!user || !profile) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ success: false, message: 'User not found' });
    } else {
      return res.json({ user, profile });
    }
  } catch (err) {
    console.log(err);
    next(err);
  }
};

export const loginUser: Controller<object, any, LoginUser> = async (
  req,
  res,
  next,
) => {
  try {
    const { email, password: rowPassword, role } = req.body;
    const user = await UserModel.findOne({ email });
    if (!user || !(await user.checkPassword(rowPassword))) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ success: false, messages: ['Invalid credential'] });
    }

    if (!user.isActive) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ success: false, messages: ['user is deactivate!'] });
    }
    if (user.role < role) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ success: false, messages: ['you must have higher role'] });
    }

    let sellerId: string | undefined = undefined;
    const seller = await SellerModel.findOne({ user: user.id });

    if (role === UserRole.Seller && !seller) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ success: false, messages: ['you must have a shop!'] });
    }
    sellerId = seller?.id;
    // Generate tokens
    const tokens = user.createToken(sellerId);

    // Send response with tokens
    return res.status(StatusCodes.OK).json({
      tokens,
      user,
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

// Controller function to refresh access token
export const refreshAccessToken: Controller<
  object,
  { accessToken: string },
  { refreshToken: string }
> = async (req, res) => {
  const { refreshToken } = req.body;

  // todo: Check if refresh token exists in the database
  if (!refreshToken) {
    return res.sendStatus(StatusCodes.FORBIDDEN); // Forbidden
  }
  try {
    // Verify the refresh token
    const { iat, exp, ...decoded } = verifyToken(refreshToken, 'refresh');
    // Generate a new access token
    const user = await UserModel.findOne({ _id: decoded.id, isActive: true });
    if (user) {
      const newTokens = user.createToken();
      return res.status(StatusCodes.OK).json(newTokens);
    } else {
      throw new Error('User is deactivate');
    }
    // Send the new access token to the client
  } catch (error: any) {
    return res.status(StatusCodes.FORBIDDEN).json({
      success: false,
      message: error?.message || 'Forbidden',
    }); // Forbidden
  }
};

export const getAllUsers: Controller<object, any> = async (req, res) => {
  try {
    const { page = 1, pageSize = 10, role, isActive, q = '' } = req.query; // Default to page 1 and limit 10
    const query: any = {};
    if (role) {
      query.role = role;
    }
    if (isActive !== undefined) {
      query.isActive = isActive;
    }
    if (q) {
      query['$or'] = [
        { email: { $regex: q, $options: 'i' } }, // Case-insensitive search in titleFa
      ];
    }
    const paginatedResult = await getPaginatedQuery(UserModel, {
      page,
      pageSize,
      query,
    });
    return res.json(paginatedResult);
  } catch (error) {
    console.error(error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: 'Failed to fetch users', success: false });
  }
};

export const getUserById: Controller<{ id: string }, any> = async (
  req,
  res,
) => {
  const { id } = req.params;
  const user = await UserModel.findById(id);
  if (!user) {
    return res.status(StatusCodes.NOT_FOUND).json({
      success: false,
      message: 'notFound',
    });
  }
  return res.json(user);
};
export const updateUser: Controller<
  { id: string },
  IUser,
  UpdateUserType
> = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await UserModel.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'notFound',
      });
    }
    return res.json(user);
  } catch (e) {
    return handleMongooseError(e, res);
  }
};

export const changeUserPassword: Controller<
  { id: string },
  IUser,
  ChangePasswordType
> = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await UserModel.findById(id);
    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'notFound',
      });
    }

    if (await user.checkPassword(req.body.oldPassword)) {
      user.setPassword(req.body.newPassword);
    }
    return res.json(user);
  } catch (e) {
    return handleMongooseError(e, res);
  }
};
