import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../db.js';
import { requireAuth, requireRole } from '../auth.js';

export const pocsRouter = Router();

pocsRouter.get('/', async (_req, res) => {
  const pocs = await prisma.poc.findMany({ orderBy: { name: 'asc' } });
  res.json(pocs);
});

const schema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  role: z.string().optional().nullable(),
  avatarUrl: z.string().optional().nullable(),
});

pocsRouter.post('/', requireAuth, requireRole('admin', 'editor'), async (req, res) => {
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'Invalid input' });
  const poc = await prisma.poc.create({ data: parsed.data });
  res.status(201).json(poc);
});

pocsRouter.put('/:id', requireAuth, requireRole('admin', 'editor'), async (req, res) => {
  const id = Number(req.params.id);
  const parsed = schema.partial().safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'Invalid input' });
  const poc = await prisma.poc.update({ where: { id }, data: parsed.data }).catch(() => null);
  if (!poc) return res.status(404).json({ error: 'POC not found' });
  res.json(poc);
});

pocsRouter.delete('/:id', requireAuth, requireRole('admin'), async (req, res) => {
  const id = Number(req.params.id);
  const deleted = await prisma.poc.delete({ where: { id } }).catch(() => null);
  if (!deleted) return res.status(404).json({ error: 'POC not found' });
  res.json({ ok: true });
});
