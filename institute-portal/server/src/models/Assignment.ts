import mongoose, { Schema, Document, Model } from 'mongoose';

export interface AssignmentDocument extends Document {
  batch: mongoose.Types.ObjectId; // Batch
  trainer: mongoose.Types.ObjectId; // User
  title: string;
  description: string;
  dueDate?: string; // YYYY-MM-DD
}

const AssignmentSchema = new Schema<AssignmentDocument>(
  {
    batch: { type: Schema.Types.ObjectId, ref: 'Batch', required: true },
    trainer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    dueDate: { type: String },
  },
  { timestamps: true }
);

export const Assignment: Model<AssignmentDocument> = mongoose.model<AssignmentDocument>('Assignment', AssignmentSchema);
