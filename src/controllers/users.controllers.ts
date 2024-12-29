import { StatusCodes } from 'http-status-codes';
import { createAccessToken, verifyToken } from '@/utils/jwt.utils';
import type { LoginUser, RegisterUser } from '@/models/user.model';
import { UserModel, UserRole } from '@/models/user.model';
import type { Controller } from '@/types/app.types';
import type { RequestUser } from '@/types/express';
import { duplicateKey } from '@/utils/duplicate-key';

export const registerUser: Controller<
  object,
  { tokens: any; user: RequestUser },
  RegisterUser
> = async (req, res) => {
  try {
    const user = await UserModel.create({ ...req.body, role: UserRole.User });
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
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ messages: ['Invalid credential'] });
      return;
    }
    // Check if password is correct
    const isPasswordValid = await user.checkPassword(password);
    if (!isPasswordValid) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ messages: ['Invalid credential'] });
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
    const newAccessToken = createAccessToken(decoded);
    // Send the new access token to the client
    return res.status(StatusCodes.OK).json({ accessToken: newAccessToken });
  } catch {
    return res
      .sendStatus(StatusCodes.FORBIDDEN)
      .json({ success: false, message: 'Forbidden' }); // Forbidden
  }
};
