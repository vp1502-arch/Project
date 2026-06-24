import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../db.js';
import { requireAuth, requireRole } from '../auth.js';

export const categoriesRouter = Router();

categoriesRouter.get('/', async (_req, res) => {
  const categories = await prisma.category.findMany({ orderBy: { name: 'asc' } });
  res.json(categories);
});

const schema = z.object({ name: z.string().min(1), description: z.string().optional().nullable() });

categoriesRouter.post('/', requireAuth, requireRole('admin', 'editor'), async (req, res) => {
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'Invalid input' });
  const category = await prisma.category.create({ data: parsed.data }).catch(() => null);
  if (!category) return res.status(409).json({ error: 'Category already exists' });
  res.status(201).json(category);
});

categoriesRouter.put('/:id', requireAuth, requireRole('admin', 'editor'), async (req, res) => {
  const id = Number(req.params.id);
  const parsed = schema.partial().safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'Invalid input' });
  const category = await prisma.category.update({ where: { id }, data: parsed.data }).catch(() => null);
  if (!category) return res.status(404).json({ error: 'Category not found' });
  res.json(category);
});

categoriesRouter.delete('/:id', requireAuth, requireRole('admin'), async (req, res) => {
  const id = Number(req.params.id);
  const deleted = await prisma.category.delete({ where: { id } }).catch(() => null);
  if (!deleted) return res.status(404).json({ error: 'Category not found' });
  res.json({ ok: true });
});

// Tags (read-only list + create)
export const tagsRouter = Router();

tagsRouter.get('/', async (_req, res) => {
  const tags = await prisma.tag.findMany({ orderBy: { name: 'asc' } });
  res.json(tags);
});
