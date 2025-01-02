import { StatusCodes } from 'http-status-codes';
import { verifyToken } from '@/utils/jwt.utils';
import type { LoginUser, RegisterUser } from '@/models/auth.model';
import { UserModel, UserRole } from '@/models/auth.model';
import { duplicateKey } from '@/utils/duplicate-key';
import ProfileModel from '@/models/profile.model';
import type { Controller } from '@/types/express';
import SellerModel from '@/models/seller.model';

export const registerUser: Controller<object, object, RegisterUser> = async (
  req,
  res,
) => {
  try {
    const data = req.body;
    const user = await UserModel.create({
      email: data.email,
      password: data.password,
      role: UserRole.User,
    });
    const userProfile = await ProfileModel.create({
      user: user.id,
      firstName: data.firstName,
      lastName: data.lastName,
    });
    const tokens = user.createToken();
    // Remove the password field from the response for security
    return res.status(StatusCodes.CREATED).json({
      tokens,
      user,
      profile: userProfile,
    });
  } catch (error) {
    duplicateKey(error, res);
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
    const { email, password: rowPassword } = req.body;
    const user = await UserModel.findOne({ email });
    const profile = await ProfileModel.findOne({ user: user?.id });
    if (!profile || !user || !(await user.checkPassword(rowPassword))) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ success: false, messages: ['Invalid credential'] });
    }

    if (!user.isActive) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ success: false, messages: ['user is deactivate!'] });
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
      user,
      profile,
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
