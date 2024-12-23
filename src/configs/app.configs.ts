import path from 'path';

export const ACCESS_SECRET_KEY =
  process.env.ACCESS_SECRET_KEY || 'some secret key';
export const REFRESH_SECRET_KEY =
  process.env.REFRESH_SECRET_KEY || 'some secret key';
export const PORT = process.env.PORT || 8000;
export const PUBLIC_PATH = path.join(__dirname, '../../public');
export const UPLOAD_PATH = path.join(__dirname, '../../public/uploads');
export const BASE_URL = process.env.BASE_URL || 'http://localhost:8000';
