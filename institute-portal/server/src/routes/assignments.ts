import { Router } from 'express';
import { z } from 'zod';
import { requireAuth, AuthRequest } from '../utils/auth';
import { Assignment } from '../models/Assignment';

const router = Router();

router.post('/', requireAuth(['trainer', 'admin']), async (req: AuthRequest, res) => {
  const schema = z.object({ batchId: z.string(), title: z.string().min(1), description: z.string().min(1), dueDate: z.string().optional() });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ errors: parsed.error.flatten() });
  const { batchId, title, description, dueDate } = parsed.data;
  const assignment = await Assignment.create({ batch: batchId, title, description, dueDate, trainer: req.user!.userId });
  return res.json(assignment);
});

router.get('/', requireAuth(['student', 'trainer', 'admin']), async (req, res) => {
  const schema = z.object({ batchId: z.string() });
  const parsed = schema.safeParse(req.query);
  if (!parsed.success) return res.status(400).json({ errors: parsed.error.flatten() });
  const { batchId } = parsed.data as any;
  const list = await Assignment.find({ batch: batchId }).sort({ createdAt: -1 });
  return res.json(list);
});

export default router;
