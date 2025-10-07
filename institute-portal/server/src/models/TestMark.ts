import mongoose, { Schema, Document, Model } from 'mongoose';

export interface TestMarkDocument extends Document {
  test: mongoose.Types.ObjectId; // Test
  student: mongoose.Types.ObjectId; // User
  marks: number;
}

const TestMarkSchema = new Schema<TestMarkDocument>(
  {
    test: { type: Schema.Types.ObjectId, ref: 'Test', required: true },
    student: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    marks: { type: Number, required: true },
  },
  { timestamps: true }
);

TestMarkSchema.index({ test: 1, student: 1 }, { unique: true });

export const TestMark: Model<TestMarkDocument> = mongoose.model<TestMarkDocument>('TestMark', TestMarkSchema);
