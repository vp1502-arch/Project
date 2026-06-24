import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../db.js';
import { requireAuth, requireRole } from '../auth.js';

export const faqsRouter = Router();

// Public: list FAQs. ?global=true for platform-wide FAQs, ?toolId=N for a tool.
faqsRouter.get('/', async (req, res) => {
  const { toolId, global } = req.query as Record<string, string>;
  const where: any = {};
  if (global === 'true') where.toolId = null;
  else if (toolId) where.toolId = Number(toolId);
  const faqs = await prisma.faq.findMany({ where, orderBy: { order: 'asc' } });
  res.json(faqs);
});

const schema = z.object({
  question: z.string().min(1),
  answer: z.string().min(1),
  toolId: z.number().int().optional().nullable(),
  order: z.number().int().optional(),
});

faqsRouter.post('/', requireAuth, requireRole('admin', 'editor'), async (req, res) => {
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'Invalid input' });
  const faq = await prisma.faq.create({ data: parsed.data });
  res.status(201).json(faq);
});

faqsRouter.put('/:id', requireAuth, requireRole('admin', 'editor'), async (req, res) => {
  const id = Number(req.params.id);
  const parsed = schema.partial().safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'Invalid input' });
  const faq = await prisma.faq.update({ where: { id }, data: parsed.data }).catch(() => null);
  if (!faq) return res.status(404).json({ error: 'FAQ not found' });
  res.json(faq);
});

faqsRouter.delete('/:id', requireAuth, requireRole('admin', 'editor'), async (req, res) => {
  const id = Number(req.params.id);
  const deleted = await prisma.faq.delete({ where: { id } }).catch(() => null);
  if (!deleted) return res.status(404).json({ error: 'FAQ not found' });
  res.json({ ok: true });
});
