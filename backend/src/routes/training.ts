import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../db.js';
import { requireAuth, requireRole } from '../auth.js';

export const trainingRouter = Router();

const createSchema = z.object({
  toolId: z.number().int(),
  requesterName: z.string().min(1),
  requesterEmail: z.string().email(),
  preferredDates: z.string().optional().nullable(),
  requestedSlot: z.string().datetime().optional().nullable(),
  durationMins: z.number().int().positive().optional(),
  notes: z.string().optional().nullable(),
});

// Public: submit a training request / booking
trainingRouter.post('/', async (req, res) => {
  const parsed = createSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'Invalid input', details: parsed.error.flatten() });
  }
  const tool = await prisma.tool.findUnique({ where: { id: parsed.data.toolId } });
  if (!tool) return res.status(404).json({ error: 'Tool not found' });
  const { requestedSlot, ...rest } = parsed.data;
  const request = await prisma.trainingRequest.create({
    data: {
      ...rest,
      requestedSlot: requestedSlot ? new Date(requestedSlot) : null,
      // A booking with a chosen slot is treated as scheduled.
      status: requestedSlot ? 'scheduled' : 'new',
    },
  });
  res.status(201).json(request);
});

// Admin/editor: list all training requests
trainingRouter.get('/', requireAuth, requireRole('admin', 'editor'), async (_req, res) => {
  const requests = await prisma.trainingRequest.findMany({
    orderBy: { createdAt: 'desc' },
    include: { tool: { select: { id: true, name: true, slug: true } } },
  });
  res.json(requests);
});

const statusSchema = z.object({
  status: z.enum(['new', 'scheduled', 'completed', 'cancelled']),
});

// Admin/editor: update status
trainingRouter.put('/:id', requireAuth, requireRole('admin', 'editor'), async (req, res) => {
  const id = Number(req.params.id);
  const parsed = statusSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'Invalid input' });
  const request = await prisma.trainingRequest
    .update({ where: { id }, data: { status: parsed.data.status } })
    .catch(() => null);
  if (!request) return res.status(404).json({ error: 'Request not found' });
  res.json(request);
});
