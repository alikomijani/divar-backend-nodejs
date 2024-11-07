import type { Document, Types } from 'mongoose';

export interface ICategory extends Document {
  name: string;
  slug: string;
  parent?: Types.ObjectId;
  icon: string;
  filters: IFilter[];
  properties: IProperty[];
}

export interface IFilter {
  title: string;
  label: string;
  type: string;
}

export interface IProperty {
  name: string;
  label: string;
  type: string;
  options: { label: string; value: string | number | boolean }[];
}
