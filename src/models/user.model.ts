import mongoose, {Model} from 'mongoose';
import bcrypt from 'bcrypt';
import config from 'config';
import logger from '../utils/logger';

export interface UserDocument extends mongoose.Document {
  email: string;
  name: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(password: string): Promise<boolean>;
}

const UserSchema = new mongoose.Schema<UserDocument, Model<UserDocument>>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

UserSchema.pre('save', async function (next) {
  const user = this as UserDocument;

  if (!user.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(config.get<number>('saltWorkFactor'));
    const hash = await bcrypt.hash(user.password, salt);

    user.password = hash;
    return next();
  } catch (error: any) {
    logger.error(`Error ${error}`);
  }
});

UserSchema.methods.comparePassword = async function (
  password: string
): Promise<boolean> {
  const user = this as UserDocument;
  try {
    return await bcrypt.compare(password, user.password);
  } catch (error: any) {
    logger.error(`Error ${error}`);
    return false;
  }
};

const User = mongoose.model<UserDocument>('User', UserSchema);

export default User;
