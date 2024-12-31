import { StatusCodes } from 'http-status-codes';
import { verifyToken } from '@/utils/jwt.utils';
import type { LoginUser, RegisterUser } from '@/models/user.model';
import { UserModel, UserRole } from '@/models/user.model';
import type { Controller } from '@/types/app.types';
import { duplicateKey } from '@/utils/duplicate-key';
import ProfileModel from '@/models/profile.model';
import { hash } from '@/utils/hash.utils';

export const registerUser: Controller<
  object,
  { tokens: any; user: { email: string; role: UserRole } },
  RegisterUser
> = async (req, res) => {
  try {
    const user = await UserModel.create({ ...req.body, role: UserRole.User });
    const userProfile = await ProfileModel.create({
      user: user.id,
      first_name: '',
      last_name: '',
    });
    user.profile = userProfile.id;
    await user.save();
    const tokens = user.createToken();
    // Remove the password field from the response for security
    const { password, ...userWithoutPassword } = user.toObject();
    return res.status(StatusCodes.CREATED).json({
      tokens,
      user: userWithoutPassword,
    });
  } catch (error) {
    return duplicateKey(error, res);
  }
};
export const getUserProfile: Controller = async (req, res) => {
  const profile = ProfileModel.findOne({ user: req.user?.id });
  if (!profile) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ success: false, message: 'Profile not found' });
  }
  return res.json(profile);
};

export const updateUserProfile: Controller = async (req, res) => {
  const profile = ProfileModel.findOneAndReplace(
    { user: req.user?.id },
    { ...req.body, user: req.user?.id },
    {
      upsert: true,
    },
  );

  return res.json(profile);
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
    const password = await hash(rowPassword);
    const user = await UserModel.findOne({ email, password });
    if (!user) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ messages: ['Invalid credential'] });
    }
    if (!user.isActive) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ messages: ['user is deactivate!'] });
    }

    // Generate tokens
    const tokens = user.createToken();

    // Send response with tokens
    return res.status(StatusCodes.OK).json({
      tokens,
      user: {
        id: user.id,
        email: user.email,
      },
    });
  } catch (err) {
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
