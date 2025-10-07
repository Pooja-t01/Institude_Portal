import mongoose, { Schema, Document, Model } from 'mongoose';
import bcrypt from 'bcryptjs';
import { UserRole } from '../types';

export interface UserDocument extends Document {
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  batches: mongoose.Types.ObjectId[]; // for students: enrolled batches; for trainers: owned/training batches
  comparePassword(password: string): Promise<boolean>;
}

const UserSchema = new Schema<UserDocument>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['student', 'trainer', 'admin'], required: true },
    batches: [{ type: Schema.Types.ObjectId, ref: 'Batch' }],
  },
  { timestamps: true }
);

UserSchema.methods.comparePassword = async function (password: string) {
  return bcrypt.compare(password, this.passwordHash);
};

export const User: Model<UserDocument> = mongoose.model<UserDocument>('User', UserSchema);
