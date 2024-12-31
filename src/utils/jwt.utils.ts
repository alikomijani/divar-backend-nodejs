import { ACCESS_SECRET_KEY, REFRESH_SECRET_KEY } from '@/configs/app.configs';
import type { JwtPayload } from 'jsonwebtoken';
import {
  JsonWebTokenError,
  sign,
  TokenExpiredError,
  verify,
} from 'jsonwebtoken';

enum UserRole {
  User = 1,
  Seller = 2,
  Admin = 3,
}
type TokenPayload = JwtPayload & {
  id: string;
  profile: string;
  seller?: string;
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
