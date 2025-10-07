import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { User } from '../models/User';
import { signToken } from '../utils/auth';

const router = Router();

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(['student', 'trainer']).default('student'),
});

router.post('/register', async (req, res) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ errors: parsed.error.flatten() });
  const { name, email, password, role } = parsed.data;
  const exists = await User.findOne({ email });
  if (exists) return res.status(409).json({ message: 'Email already registered' });
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, passwordHash, role });
  const token = signToken(user.id, user.role);
  return res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
});

const loginSchema = z.object({ email: z.string().email(), password: z.string().min(6) });

router.post('/login', async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ errors: parsed.error.flatten() });
  const { email, password } = parsed.data;
  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });
  const ok = await user.comparePassword(password);
  if (!ok) return res.status(401).json({ message: 'Invalid credentials' });
  const token = signToken(user.id, user.role);
  return res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
});

export default router;
