import { StatusCodes } from 'http-status-codes';
import { verifyToken } from '@/utils/jwt.utils';
import type { LoginUser, RegisterUser } from '@/models/user.model';
import { UserModel, UserRole } from '@/models/user.model';
import { duplicateKey } from '@/utils/duplicate-key';
import ProfileModel from '@/models/profile.model';
import type { Controller } from '@/types/express';
import SellerModel from '@/models/seller.model';

export const registerUser: Controller = async (req, res) => {
  try {
    const data = req.body as RegisterUser;
    const user = await UserModel.create({
      email: data.email,
      password: data.password,
      role: UserRole.User,
    });
    const userProfile = await ProfileModel.create({
      user: user.id,
      first_name: data.first_name,
      last_name: data.last_name,
    });
    const tokens = user.createToken();
    // Remove the password field from the response for security
    const { password, ...userWithoutPassword } = user.toObject();
    return res.status(StatusCodes.CREATED).json({
      tokens,
      user: userWithoutPassword,
      profile: userProfile,
    });
  } catch (error) {
    duplicateKey(error, res);
  }
};

export const getUserProfile: Controller = async (req, res, next) => {
  try {
    const profile = await ProfileModel.findById({ user: req.user?.id });
    if (!profile) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ success: false, message: 'Profile not found' });
    }
    return res.json(profile);
  } catch (error) {
    console.log(error);
    next(error);
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
    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ success: false, message: 'User not found' });
    } else {
      return res.json(user);
    }
  } catch (err) {
    next(err);
  }
};

export const loginUser: Controller<object, any, LoginUser> = async (
  req,
  res,
  next,
) => {
  try {
    const { email, password: rowPassword } = req.body;
    const user = await UserModel.findOne({ email });
    if (!user || !(await user.checkPassword(rowPassword))) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ messages: ['Invalid credential'] });
    }

    if (!user.isActive) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ messages: ['user is deactivate!'] });
    }
    let sellerId: string | undefined = undefined;
    if (user.role === UserRole.Seller) {
      const seller = await SellerModel.findOne({ user: user.id });
      sellerId = seller?.id;
    }
    // Generate tokens
    const tokens = user.createToken(sellerId);

    // Send response with tokens
    return res.status(StatusCodes.OK).json({
      tokens,
      user: {
        id: user.id,
        email: user.email,
      },
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
    const user = await UserModel.findOne({ id: decoded.id, isActive: true });
    if (user) {
      const newTokens = user.createToken();
      return res.status(StatusCodes.OK).json(newTokens);
    } else {
      throw new Error('user not found or deactivate');
    }
    // Send the new access token to the client
  } catch (error: any) {
    return res.sendStatus(StatusCodes.FORBIDDEN).json({
      success: false,
      message: error?.message || 'Forbidden',
    }); // Forbidden
  }
};
