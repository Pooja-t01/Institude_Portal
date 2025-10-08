import { Router } from 'express';
import { z } from 'zod';
import { requireAuth, AuthRequest } from '../utils/auth';
import { Test } from '../models/Test';
import { TestMark } from '../models/TestMark';

const router = Router();

router.post('/', requireAuth(['trainer', 'admin']), async (req: AuthRequest, res) => {
  const schema = z.object({ batchId: z.string(), title: z.string().min(1), date: z.string() });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ errors: parsed.error.flatten() });
  const { batchId, title, date } = parsed.data;
  const test = await Test.create({ batch: batchId, title, date, trainer: req.user!.userId });
  return res.json(test);
});

router.post('/:testId/marks', requireAuth(['trainer', 'admin']), async (req, res) => {
  const schema = z.object({ marks: z.array(z.object({ studentId: z.string(), marks: z.number().min(0) })) });
  const param = z.object({ testId: z.string() }).safeParse(req.params);
  const parsed = schema.safeParse(req.body);
  if (!param.success || !parsed.success) return res.status(400).json({ message: 'Invalid input' });
  const { testId } = param.data;
  const ops = parsed.data.marks.map((m) =>
    TestMark.findOneAndUpdate({ test: testId, student: m.studentId }, { $set: { marks: m.marks } }, { upsert: true, new: true })
  );
  const results = await Promise.all(ops);
  return res.json(results);
});

router.get('/:testId/marks', requireAuth(['student', 'trainer', 'admin']), async (req, res) => {
  const param = z.object({ testId: z.string() }).safeParse(req.params);
  if (!param.success) return res.status(400).json({ message: 'Invalid input' });
  const list = await TestMark.find({ test: param.data.testId }).sort({ createdAt: -1 });
  return res.json(list);
});

export default router;
