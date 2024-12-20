import mongoose from 'mongoose';

const ColorSchema = new mongoose.Schema({
  id: { type: Number },
  title: { type: String },
  hex_code: { type: String },
});

const BadgeSchema = new mongoose.Schema({
  icon: { url: { type: String } },
  title: { type: String },
});

const BrandSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  title_fa: { type: String, required: true },
  title_en: { type: String, required: true },
  slug: { type: String, required: true },
  logo: { url: { type: [String], default: [] } },
  is_premium: { type: Boolean, default: false },
});

const ProductSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  title_fa: { type: String, required: true },
  title_en: { type: String, required: true },
  status: {
    type: String,
    required: true,
    enum: ['marketable', 'unmarketable'],
  },
  images: {
    main: { type: String },
    list: { type: [String], default: [] },
  },
  colors: [ColorSchema],
  badges: [BadgeSchema],
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  brand: { type: mongoose.Schema.Types.ObjectId, ref: 'Brand' },
  review: {
    description: { type: String },
    attributes: [
      {
        title: { type: String },
        values: { type: [String], default: [] },
      },
    ],
  },
  specifications: [
    {
      title: { type: String },
      attributes: [
        {
          title: { type: String },
          values: { type: [String], default: [] },
        },
      ],
    },
  ],
  expert_reviews: {
    description: { type: String },
  },
});
const CommentSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String, required: true },
  rating: { type: Number, min: 1, max: 5 },
  created_at: { type: Date, default: Date.now },
});

const ProductQuestionSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  question: { type: String, required: true },
  answers: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      answer: { type: String },
      created_at: { type: Date, default: Date.now },
    },
  ],
  created_at: { type: Date, default: Date.now },
});

export const ColorModel = mongoose.model('Color', ColorSchema);
export const BadgeModel = mongoose.model('Badge', BadgeSchema);
export const BrandModel = mongoose.model('Brand', BrandSchema);
export const ProductModel = mongoose.model('Product', ProductSchema);
export const CommentModel = mongoose.model('Comment', CommentSchema);
export const ProductQuestionModel = mongoose.model(
  'Comment',
  ProductQuestionSchema,
);
