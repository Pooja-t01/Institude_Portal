import { Router } from 'express';
import { z } from 'zod';
import { requireAuth, AuthRequest } from '../utils/auth';
import { Note } from '../models/Note';

const router = Router();

router.post('/', requireAuth(['trainer', 'admin']), async (req: AuthRequest, res) => {
  const schema = z.object({ batchId: z.string(), title: z.string().min(1), content: z.string().min(1), date: z.string() });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ errors: parsed.error.flatten() });
  const { batchId, title, content, date } = parsed.data;
  const note = await Note.create({ batch: batchId, title, content, date, trainer: req.user!.userId });
  return res.json(note);
});

router.get('/', requireAuth(['student', 'trainer', 'admin']), async (req, res) => {
  const schema = z.object({ batchId: z.string(), date: z.string().optional() });
  const parsed = schema.safeParse(req.query);
  if (!parsed.success) return res.status(400).json({ errors: parsed.error.flatten() });
  const { batchId, date } = parsed.data as any;
  const filter: any = { batch: batchId };
  if (date) filter.date = date;
  const notes = await Note.find(filter).sort({ createdAt: -1 });
  return res.json(notes);
});

export default router;
