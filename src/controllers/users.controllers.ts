import { StatusCodes } from 'http-status-codes';
import { MongoServerError } from 'mongodb'; // Import MongoError from the MongoDB driver
import { createAccessToken, verifyToken } from '@/utils/jwt.utils';
import { userModel } from '@/models/user.model';
import type { Controller } from '@/types/app.types';
import type { CreateUser, LoginUserBody } from '@/types/user.types';
import { Role } from '@/types/user.types';

export const registerUser: Controller<object, CreateUser> = async (
  req,
  res,
  next,
) => {
  try {
    const user = await userModel.create({ ...req.body, role: Role.User });
    const tokens = user.createToken();
    // Remove the password field from the response for security
    const { password, ...userWithoutPassword } = user.toObject();
    return res.status(StatusCodes.CREATED).json({
      tokens,
      user: userWithoutPassword,
    });
  } catch (error) {
    if (error instanceof MongoServerError && error.code === 11000) {
      // Handle duplicate email or username error
      const duplicatedField = Object.keys(error.keyValue)[0];
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: `${duplicatedField} already exists. Please use a different ${duplicatedField}.`,
        errors: {
          [duplicatedField]: `${duplicatedField} already exists. Please use a different ${duplicatedField}.`,
        },
      });
    }
    return next(error);
  }
};
export const getUser: Controller = async (req, res, next) => {
  try {
    const user = await userModel.findById(req.user?.id);
    if (!user) {
      return res.status(404).send('User not found');
    } else {
      return res.json(user);
    }
  } catch (err) {
    return next(err);
  }
};

export const loginUser: Controller<object, LoginUserBody> = async (
  req,
  res,
  next,
) => {
  try {
    const { username, password } = req.body;
    const user = await userModel.findOne({ username });
    if (!user) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ messages: ['Invalid credential'] });
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
        username: user.username,
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
  { refreshToken: string }
> = (req, res) => {
  const { refreshToken } = req.body;

  // todo: Check if refresh token exists in the database
  if (!refreshToken) {
    return res.sendStatus(StatusCodes.FORBIDDEN); // Forbidden
  }
  try {
    // Verify the refresh token
    const decoded = verifyToken(refreshToken, 'refresh');
    const newAccessToken = createAccessToken(decoded);
    // Generate a new access token

    // Send the new access token to the client
    return res.status(StatusCodes.OK).json({ accessToken: newAccessToken });
  } catch {
    return res.sendStatus(StatusCodes.FORBIDDEN); // Forbidden
  }
};
