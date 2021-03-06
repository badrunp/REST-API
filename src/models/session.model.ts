import mongoose, { Model } from 'mongoose';
import { UserDocument } from './user.model';

export interface SessionDocument extends mongoose.Document {
  user: UserDocument['_id'];
  valid: boolean;
  userAgen: string;
  createdAt: Date;
  updatedAt: Date;
}

const SessionSchema = new mongoose.Schema<SessionDocument, Model<SessionDocument>>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    valid: {
      type: Boolean,
      default: true,
    },
    userAgen: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Session = mongoose.model<SessionDocument>('Session', SessionSchema);

export default Session;
