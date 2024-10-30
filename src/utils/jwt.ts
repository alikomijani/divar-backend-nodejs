import { JwtPayload, sign, verify } from 'jsonwebtoken';
import { SECRET_KEY } from '../config';
import { Role } from '@/users/users.models';

type TokenPayload = JwtPayload & { id: number; username: string; role: Role };

export function createAuthToken(payload: TokenPayload) {
  const accessToken = sign(payload, SECRET_KEY, { expiresIn: '1h' });
  const refreshToken = sign(payload, SECRET_KEY, { expiresIn: '7d' });
  return {
    accessToken,
    refreshToken,
  };
}

export function verifyToken(token: string): TokenPayload {
  const decoded = verify(token, SECRET_KEY);
  console.log(decoded);
  if (typeof decoded === 'string') {
    throw new Error('Invalid token structure');
  }
  return decoded as TokenPayload;
}
