import bcrypt from 'bcryptjs';

export function hash(data: string) {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(data, salt);
}
export function checkHash(pureData: string, hashedData: string) {
  return bcrypt.compareSync(pureData, hashedData);
}
