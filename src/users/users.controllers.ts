import type { CreateUser, LoginUserBody } from './users.schema';
import { Role, userModel } from './users.schema';
import { StatusCodes } from 'http-status-codes';
import type { Controller } from '../../types';
import { MongoServerError } from 'mongodb'; // Import MongoError from the MongoDB driver

export const registerUser: Controller<object, CreateUser> = async (
  req,
  res,
  next,
) => {
  try {
    const user = await userModel.create({ ...req.body, role: Role.User });
    const token = user.createToken();
    // Remove the password field from the response for security
    const { password, ...userWithoutPassword } = user.toObject();
    return res.status(StatusCodes.CREATED).json({
      ...token,
      userWithoutPassword,
    });
  } catch (error) {
    if (error instanceof MongoServerError && error.code === 11000) {
      // Handle duplicate email or username error
      const duplicatedField = Object.keys(error.keyValue)[0];
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: `${duplicatedField} already exists. Please use a different ${duplicatedField}.`,
        errors: {
          duplicatedField: `${duplicatedField} already exists. Please use a different ${duplicatedField}.`,
        },
      });
    }
    return next(error);
  }
};
export const getUser: Controller<{ username: string }, object> = async (
  req,
  res,
  next,
) => {
  try {
    const user = await userModel
      .findOne({ username: req.params.username })
      .select('-password');
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
    const token = user.createToken();

    // Send response with tokens
    return res.status(StatusCodes.OK).json({
      token,
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
