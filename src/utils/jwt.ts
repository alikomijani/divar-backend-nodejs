import type { JwtPayload } from 'jsonwebtoken';
import {
  JsonWebTokenError,
  sign,
  TokenExpiredError,
  verify,
} from 'jsonwebtoken';
import { ACCESS_SECRET_KEY, REFRESH_SECRET_KEY } from '../config';
import type { Role } from '@/users/users.schema';

type TokenPayload = JwtPayload & { id: number; username: string; role: Role };

export function createAuthToken(payload: TokenPayload) {
  const accessToken = sign(payload, ACCESS_SECRET_KEY, { expiresIn: '1h' });
  const refreshToken = sign(payload, REFRESH_SECRET_KEY, { expiresIn: '7d' });
  return { accessToken, refreshToken };
}

export function verifyToken(
  token: string,
  type: 'access' | 'refresh' = 'access',
): TokenPayload {
  const secretKey = type === 'access' ? ACCESS_SECRET_KEY : REFRESH_SECRET_KEY;

  try {
    const decoded = verify(token, secretKey);

    if (typeof decoded === 'string') {
      throw new Error('Invalid token structure');
    }

    return decoded as TokenPayload;
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      throw new Error('Token has expired');
    }
    if (error instanceof JsonWebTokenError) {
      throw new Error('Invalid token');
    }
    throw new Error('Token verification failed');
  }
}
