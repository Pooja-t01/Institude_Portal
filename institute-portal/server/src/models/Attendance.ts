import mongoose, { Schema, Document, Model } from 'mongoose';

export interface AttendanceDocument extends Document {
  batch: mongoose.Types.ObjectId; // Batch
  student: mongoose.Types.ObjectId; // User
  date: string; // YYYY-MM-DD
  present: boolean;
}

const AttendanceSchema = new Schema<AttendanceDocument>(
  {
    batch: { type: Schema.Types.ObjectId, ref: 'Batch', required: true },
    student: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: String, required: true },
    present: { type: Boolean, default: true },
  },
  { timestamps: true }
);

AttendanceSchema.index({ batch: 1, student: 1, date: 1 }, { unique: true });

export const Attendance: Model<AttendanceDocument> = mongoose.model<AttendanceDocument>('Attendance', AttendanceSchema);
