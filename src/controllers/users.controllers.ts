import { StatusCodes } from 'http-status-codes';
import { MongoServerError } from 'mongodb'; // Import MongoError from the MongoDB driver
import { createAccessToken, verifyToken } from '@/utils/jwt.utils';
import { User } from '@/models/user.model';
import type { Controller } from '@/types/app.types';
import type { CreateUser, LoginUserBody } from '@/types/user.types';
import { Role } from '@/types/user.types';
import type { NextFunction, Request, Response } from 'express';
import type { RequestUserType } from '@/types/express';

export const registerUser: Controller<object, CreateUser> = async (
  req,
  res,
  next,
) => {
  try {
    const user = await User.create({ ...req.body, role: Role.User });
    const tokens = user.createToken();
    // Remove the password field from the response for security
    const { password, ...userWithoutPassword } = user.toObject();
    res.status(StatusCodes.CREATED).json({
      tokens,
      user: userWithoutPassword,
    });
  } catch (error) {
    if (error instanceof MongoServerError && error.code === 11000) {
      // Handle duplicate email or username error
      const duplicatedField = Object.keys(error.keyValue)[0];
      res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: `${duplicatedField} already exists. Please use a different ${duplicatedField}.`,
        errors: {
          [duplicatedField]: `${duplicatedField} already exists. Please use a different ${duplicatedField}.`,
        },
      });
    }
    next(error);
  }
};
export const getUser = async (
  req: Request<object, object, RequestUserType>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = await User.findById(req.user?.id);
    if (!user) {
      res.status(404).send('User not found');
    } else {
      res.json(user);
    }
  } catch (err) {
    next(err);
  }
};

export const loginUser: Controller<object, LoginUserBody> = async (
  req,
  res,
  next,
) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ messages: ['Invalid credential'] });
      return;
    }
    // Check if password is correct
    const isPasswordValid = await user.checkPassword(password);
    if (!isPasswordValid) {
      res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ messages: ['Invalid credential'] });
    }

    // Generate tokens
    const tokens = user.createToken();

    // Send response with tokens
    res.status(StatusCodes.OK).json({
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
    res.sendStatus(StatusCodes.FORBIDDEN); // Forbidden
  }
  try {
    // Verify the refresh token
    const { iat, exp, ...decoded } = verifyToken(refreshToken, 'refresh');
    // Generate a new access token
    const newAccessToken = createAccessToken(decoded);
    // Send the new access token to the client
    res.status(StatusCodes.OK).json({ accessToken: newAccessToken });
  } catch {
    res.sendStatus(StatusCodes.FORBIDDEN); // Forbidden
  }
};
