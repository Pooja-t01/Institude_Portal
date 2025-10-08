import mongoose, { Schema, Document, Model } from 'mongoose';

export interface BatchDocument extends Document {
  name: string;
  description?: string;
  trainer: mongoose.Types.ObjectId; // User (trainer)
  students: mongoose.Types.ObjectId[]; // User (students)
  startDate?: Date;
  endDate?: Date;
}

const BatchSchema = new Schema<BatchDocument>(
  {
    name: { type: String, required: true },
    description: String,
    trainer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    students: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    startDate: Date,
    endDate: Date,
  },
  { timestamps: true }
);

export const Batch: Model<BatchDocument> = mongoose.model<BatchDocument>('Batch', BatchSchema);
