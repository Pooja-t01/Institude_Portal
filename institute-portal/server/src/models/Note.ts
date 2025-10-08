import mongoose, { Schema, Document, Model } from 'mongoose';

export interface NoteDocument extends Document {
  batch: mongoose.Types.ObjectId; // Batch
  trainer: mongoose.Types.ObjectId; // User
  title: string;
  content: string;
  date: string; // YYYY-MM-DD
}

const NoteSchema = new Schema<NoteDocument>(
  {
    batch: { type: Schema.Types.ObjectId, ref: 'Batch', required: true },
    trainer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    date: { type: String, required: true },
  },
  { timestamps: true }
);

export const Note: Model<NoteDocument> = mongoose.model<NoteDocument>('Note', NoteSchema);
