import type { Document, Types } from 'mongoose';

export interface ICategory extends Document {
  name: string;
  slug: string;
  parent?: Types.ObjectId;
  icon: string;
  properties: ICategoryProperty[];
}

export interface ICategoryProperty extends Document {
  name: string;
  label: string;
  type: string;
  options: { label: string; value: string | number | boolean }[];
}
