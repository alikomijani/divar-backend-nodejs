import type { Document } from 'mongoose';

export interface ICity extends Document {
  name: string;
  code: string;
  slug: string;
}
