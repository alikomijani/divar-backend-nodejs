import { NextFunction, Request, Response } from 'express';
import { CreateUser, LoginUserBody, Role, users } from './users.models';
import { createAuthToken } from '../utils/jwt';
import { StatusCodes } from 'http-status-codes';
import { checkHash, hash } from '../utils/hash';
import { Controller } from '../../types';

export const registerUser: Controller<{}, CreateUser> = async (
  req,
  res,
  next,
) => {
  try {
    const password = hash(req.body.password);
    const user: CreateUser = {
      id: users.length + 1,
      username: req.body.username.toLowerCase(),
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      password,
      email: req.body.email.toLowerCase(),
      role: Role.User,
    };

    users.push(user);
    const token = createAuthToken({
      id: user.id,
      username: user.username,
      role: user.role,
    });
    return res.status(201).json({
      ...token,
      user,
    });
  } catch (err) {
    return next(err);
  }
};
export const getUser: Controller<{ username: string }, {}> = async (
  req,
  res,
  next,
) => {
  try {
    const user = users.find((u) => u.username === req.params.username);
    if (!user) {
      return res.status(404).send('User not found');
    } else {
      // remove password
      const { password, ...newUser } = user;
      return res.json(newUser);
    }
  } catch (err) {
    return next(err);
  }
};

export const loginUser: Controller<{}, LoginUserBody> = async (
  req,
  res,
  next,
) => {
  try {
    const user = users.find((u) => u.username === req.body.username);
    if (!user) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ messages: ['Invalid credential'] });
    }
    const checkPassword = checkHash(req.body.password, user.password);
    if (!checkPassword) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ messages: ['Invalid credential'] });
    }
    const token = createAuthToken({
      id: user.id,
      username: user.username,
      role: user.role,
    });
    return res.json({ token });
  } catch (err) {
    next(err);
  }
};
