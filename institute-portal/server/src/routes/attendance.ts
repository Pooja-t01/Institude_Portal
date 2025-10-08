import { Router } from 'express';
import { z } from 'zod';
import { requireAuth } from '../utils/auth';
import { Attendance } from '../models/Attendance';

const router = Router();

// Mark attendance for a day per student
router.post('/', requireAuth(['trainer', 'admin']), async (req, res) => {
  const schema = z.object({
    batchId: z.string(),
    studentId: z.string(),
    date: z.string(), // YYYY-MM-DD
    present: z.boolean().default(true),
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ errors: parsed.error.flatten() });
  const { batchId, studentId, date, present } = parsed.data;
  const att = await Attendance.findOneAndUpdate(
    { batch: batchId, student: studentId, date },
    { $set: { present } },
    { new: true, upsert: true }
  );
  return res.json(att);
});

// Get attendance for a student in a batch
router.get('/student', requireAuth(['student', 'trainer', 'admin']), async (req, res) => {
  const schema = z.object({ batchId: z.string(), studentId: z.string().optional(), month: z.string().optional() });
  const parsed = schema.safeParse(req.query);
  if (!parsed.success) return res.status(400).json({ errors: parsed.error.flatten() });
  const { batchId, studentId, month } = parsed.data as any;
  const filter: any = { batch: batchId };
  if (studentId) filter.student = studentId;
  if (month) filter.date = new RegExp(`^${month}`); // e.g., 2025-10
  const items = await Attendance.find(filter).sort({ date: 1 });
  return res.json(items);
});

export default router;
