import type { Document } from 'mongoose';
import type mongoose from 'mongoose';

export interface IProduct extends Document {
  enName: string;
  code: string;
  category: {
    type: mongoose.Types.ObjectId;
    ref: 'Category';
    required: false;
  };
}

export interface IComment extends Document {
  enName: string;
  code: string;
  category: {
    type: mongoose.Types.ObjectId;
    ref: 'Category';
    required: false;
  };
}
