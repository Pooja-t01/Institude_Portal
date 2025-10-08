import { Router } from 'express';
import { z } from 'zod';
import { requireAuth, AuthRequest } from '../utils/auth';
import { Batch } from '../models/Batch';
import { User } from '../models/User';

const router = Router();

// Trainer creates batch
router.post('/', requireAuth(['trainer', 'admin']), async (req: AuthRequest, res) => {
  const schema = z.object({ name: z.string().min(2), description: z.string().optional() });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ errors: parsed.error.flatten() });
  const { name, description } = parsed.data;
  const batch = await Batch.create({ name, description, trainer: req.user!.userId });
  return res.json(batch);
});

// Add student to batch
router.post('/:batchId/students', requireAuth(['trainer', 'admin']), async (req, res) => {
  const param = z.object({ batchId: z.string() }).safeParse(req.params);
  const body = z.object({ studentId: z.string() }).safeParse(req.body);
  if (!param.success || !body.success) return res.status(400).json({ message: 'Invalid' });
  const batch = await Batch.findById(param.data.batchId);
  const student = await User.findById(body.data.studentId);
  if (!batch || !student) return res.status(404).json({ message: 'Not found' });
  if (!batch.students.includes(student.id as any)) batch.students.push(student._id);
  await batch.save();
  if (!student.batches.includes(batch._id)) {
    student.batches.push(batch._id);
    await student.save();
  }
  return res.json(batch);
});

// List batches for current user
router.get('/mine', requireAuth(['student', 'trainer', 'admin']), async (req: AuthRequest, res) => {
  const role = req.user!.role;
  if (role === 'trainer') {
    const batches = await Batch.find({ trainer: req.user!.userId });
    return res.json(batches);
  }
  const batches = await Batch.find({ students: req.user!.userId });
  return res.json(batches);
});

export default router;
