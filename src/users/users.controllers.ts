import type { CreateUser, LoginUserBody } from './users.schema';
import { Role } from './users.schema';
import { StatusCodes } from 'http-status-codes';
import type { Controller } from '../../types';
import { createUserDB, findUser } from './users.models';
import { MongoError } from 'mongodb'; // Import MongoError from the MongoDB driver

export const registerUser: Controller<object, CreateUser> = async (
  req,
  res,
  next,
) => {
  try {
    const user = await createUserDB({ ...req.body, role: Role.User });
    const token = user.createToken();
    return res.status(201).json({
      ...token,
      user,
    });
  } catch (error) {
    if (error instanceof MongoError && error.code === 11000) {
      // Handle duplicate username error
      return res.status(400).json({
        success: false,
        message: 'Username already exists. Please choose another one.',
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
    const user = await findUser({ username: req.params.username });
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
    const user = await findUser({ username: req.body.username });
    if (!user) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ messages: ['Invalid credential'] });
    }
    if (!user.checkPassword(req.body.password)) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ messages: ['Invalid credential'] });
    }
    const token = user.createToken();
    return res.json({ token });
  } catch (err) {
    next(err);
  }
};
