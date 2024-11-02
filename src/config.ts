export const ACCESS_SECRET_KEY =
  process.env.ACCESS_SECRET_KEY || 'some secret key';
export const REFRESH_SECRET_KEY =
  process.env.REFRESH_SECRET_KEY || 'some secret key';
export const PORT = process.env.PORT || 8000;
export const DB_URL =
  process.env.DB_URL ||
  'mongodb://root:example@localhost:27017/divar?authSource=admin';
