import { z } from 'zod';

export const userRegistrationSchema = z.object({
  username: z.string().min(6),
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().min(2).optional(),
  lastName: z.string().min(2).optional(),
});

export const userLoginSchema = z.object({
  username: z.string(),
  password: z.string(),
});
