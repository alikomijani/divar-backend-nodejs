import { ACCESS_SECRET_KEY, REFRESH_SECRET_KEY } from '@/configs/app.configs';
import type { Role } from '@/types/user.types';
import type { JwtPayload } from 'jsonwebtoken';
import {
  JsonWebTokenError,
  sign,
  TokenExpiredError,
  verify,
} from 'jsonwebtoken';

type TokenPayload = JwtPayload & { id: number; username: string; role: Role };

export function createAuthToken(payload: TokenPayload) {
  const accessToken = sign(payload, ACCESS_SECRET_KEY, { expiresIn: '7d' });
  const refreshToken = sign(payload, REFRESH_SECRET_KEY, { expiresIn: '30d' });
  return { accessToken, refreshToken };
}

export function createAccessToken(payload: TokenPayload) {
  const accessToken = sign(payload, ACCESS_SECRET_KEY, { expiresIn: '7d' });
  return accessToken;
}
export function verifyToken(
  token: string,
  type: 'access' | 'refresh' = 'access',
): TokenPayload {
  const secretKey = type === 'access' ? ACCESS_SECRET_KEY : REFRESH_SECRET_KEY;

  try {
    const decodedToken = verify(token, secretKey);
    if (
      decodedToken &&
      typeof decodedToken !== 'string' &&
      decodedToken.hasOwnProperty('id') &&
      decodedToken.hasOwnProperty('username') &&
      decodedToken.hasOwnProperty('role')
    ) {
      return decodedToken as TokenPayload;
    }
    throw new Error('Invalid token structure');
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
