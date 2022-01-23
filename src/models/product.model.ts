import mongoose, { Model } from 'mongoose';
import { customAlphabet } from 'nanoid';
import { UserDocument } from './user.model';

const nanoid = customAlphabet('qwertyuiopasdfghjklzxcvbnm', 10);

export interface ProductDocument extends mongoose.Document {
  user: UserDocument['_id'];
  title: string;
  description: string;
  price: number;
  image: string;
  productId?: string,
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new mongoose.Schema<ProductDocument, Model<UserDocument>>(
  {
    productId: {
      type: String,
      required: true,
      unique: true,
      default: () => `${nanoid()}`,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },  
    description: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      trim: true,
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model<ProductDocument>('Product', ProductSchema);

export default Product;
