import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import authRoutes from './routes/auth';
import batchRoutes from './routes/batches';
import attendanceRoutes from './routes/attendance';
import noteRoutes from './routes/notes';
import assignmentRoutes from './routes/assignments';
import testRoutes from './routes/tests';

dotenv.config();

const app = express();

app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/auth', authRoutes);
app.use('/api/batches', batchRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/tests', testRoutes);

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/institute_portal';
const PORT = Number(process.env.PORT || 4000);

async function start() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server listening on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server', err);
    process.exit(1);
  }
}

start();
