import { z } from 'zod';

export const userRegistrationSchema = z.object({
  username: z.string().min(6, 'username is required.').toLowerCase(),
  email: z.string().email().toLowerCase(),
  password: z.string().min(8, 'Password is required.'),
  firstName: z.string().min(2).optional(),
  lastName: z.string().min(2).optional(),
});

export const userLoginSchema = z.object({
  username: z.string().toLowerCase(),
  password: z.string(),
});
export const refreshTokenSchema = z.object({
  refreshToken: z.string(),
});
