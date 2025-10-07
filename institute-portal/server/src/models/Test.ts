import mongoose, { Schema, Document, Model } from 'mongoose';

export interface TestDocument extends Document {
  batch: mongoose.Types.ObjectId; // Batch
  trainer: mongoose.Types.ObjectId; // User
  title: string;
  date: string; // YYYY-MM-DD
}

const TestSchema = new Schema<TestDocument>(
  {
    batch: { type: Schema.Types.ObjectId, ref: "Batch", required: true },
    trainer: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    date: { type: String, required: true },
  },
  { timestamps: true }
);

export const Test: Model<TestDocument> = mongoose.model<TestDocument>('Test', TestSchema);
