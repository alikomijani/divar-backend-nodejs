import { ACCESS_SECRET_KEY, REFRESH_SECRET_KEY } from '@/configs/app.configs';
import type { UserRole } from '@/models/user.model';
import type { JwtPayload } from 'jsonwebtoken';
import {
  JsonWebTokenError,
  sign,
  TokenExpiredError,
  verify,
} from 'jsonwebtoken';
import type { Types } from 'mongoose';

type TokenPayload = JwtPayload & {
  id: string | Types.ObjectId;
  profile?: string | Types.ObjectId;
  seller?: string | Types.ObjectId;
  role: UserRole;
};
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}
export function createAuthToken(payload: TokenPayload): AuthTokens {
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
      decodedToken.hasOwnProperty('role') &&
      decodedToken.hasOwnProperty('profile')
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
