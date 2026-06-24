import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../db.js';
import { requireAuth, requireRole } from '../auth.js';

export const toolsRouter = Router();

const toolInclude = {
  category: true,
  tags: true,
  pocs: true,
  trainingDocs: true,
  faqs: { orderBy: { order: 'asc' as const } },
};

function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Public: list published tools with search/filter/sort
toolsRouter.get('/', async (req, res) => {
  const { q, category, tag, sort, includeDrafts } = req.query as Record<string, string>;

  const where: any = {};
  if (!includeDrafts) where.publishState = 'published';
  if (q) {
    where.OR = [
      { name: { contains: q } },
      { shortDescription: { contains: q } },
      { fullDescription: { contains: q } },
    ];
  }
  if (category) where.category = { name: category };
  if (tag) where.tags = { some: { name: tag } };

  let orderBy: any = { name: 'asc' };
  if (sort === 'recent') orderBy = { updatedAt: 'desc' };
  if (sort === 'popular') orderBy = { clickCount: 'desc' };

  const tools = await prisma.tool.findMany({ where, orderBy, include: toolInclude });
  res.json(tools);
});

// Public: get one tool by slug or id
toolsRouter.get('/:idOrSlug', async (req, res) => {
  const { idOrSlug } = req.params;
  const asId = Number(idOrSlug);
  const tool = await prisma.tool.findFirst({
    where: Number.isInteger(asId) && asId > 0 ? { id: asId } : { slug: idOrSlug },
    include: toolInclude,
  });
  if (!tool) return res.status(404).json({ error: 'Tool not found' });
  res.json(tool);
});

// Public: register a click (for popularity metric)
toolsRouter.post('/:id/click', async (req, res) => {
  const id = Number(req.params.id);
  const tool = await prisma.tool.update({
    where: { id },
    data: { clickCount: { increment: 1 } },
  }).catch(() => null);
  if (!tool) return res.status(404).json({ error: 'Tool not found' });
  res.json({ clickCount: tool.clickCount });
});

const toolSchema = z.object({
  name: z.string().min(1),
  shortDescription: z.string().min(1),
  fullDescription: z.string().min(1),
  url: z.string().url(),
  logoUrl: z.string().optional().nullable(),
  status: z.enum(['active', 'beta', 'deprecated']).optional(),
  publishState: z.enum(['draft', 'published']).optional(),
  categoryId: z.number().int().optional().nullable(),
  tagNames: z.array(z.string()).optional(),
  pocIds: z.array(z.number().int()).optional(),
});

// Build a Prisma nested-write for tags. `set: []` is only valid on update
// (to replace existing relations); it must be omitted on create.
function connectTags(tagNames: string[] | undefined, mode: 'create' | 'update') {
  if (!tagNames) return undefined;
  const connectOrCreate = tagNames.map((name) => ({
    where: { name },
    create: { name },
  }));
  return mode === 'update' ? { set: [], connectOrCreate } : { connectOrCreate };
}

// Admin/editor: create
toolsRouter.post('/', requireAuth, requireRole('admin', 'editor'), async (req, res) => {
  const parsed = toolSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'Invalid input', details: parsed.error.flatten() });
  }
  const { tagNames, pocIds, ...data } = parsed.data;
  const baseSlug = slugify(data.name);
  let slug = baseSlug;
  let i = 1;
  while (await prisma.tool.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${i++}`;
  }
  try {
    const tool = await prisma.tool.create({
      data: {
        ...data,
        slug,
        createdBy: req.user?.email,
        updatedBy: req.user?.email,
        tags: connectTags(tagNames, 'create'),
        pocs: pocIds ? { connect: pocIds.map((id) => ({ id })) } : undefined,
      },
      include: toolInclude,
    });
    res.status(201).json(tool);
  } catch (err: any) {
    res.status(400).json({ error: err?.message ?? 'Could not create tool' });
  }
});

// Admin/editor: update
toolsRouter.put('/:id', requireAuth, requireRole('admin', 'editor'), async (req, res) => {
  const id = Number(req.params.id);
  const parsed = toolSchema.partial().safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'Invalid input', details: parsed.error.flatten() });
  }
  const { tagNames, pocIds, ...data } = parsed.data;
  const tool = await prisma.tool.update({
    where: { id },
    data: {
      ...data,
      updatedBy: req.user?.email,
      tags: connectTags(tagNames, 'update'),
      pocs: pocIds ? { set: pocIds.map((pid) => ({ id: pid })) } : undefined,
    },
    include: toolInclude,
  }).catch(() => null);
  if (!tool) return res.status(404).json({ error: 'Tool not found' });
  res.json(tool);
});

// Admin: delete
toolsRouter.delete('/:id', requireAuth, requireRole('admin'), async (req, res) => {
  const id = Number(req.params.id);
  const deleted = await prisma.tool.delete({ where: { id } }).catch(() => null);
  if (!deleted) return res.status(404).json({ error: 'Tool not found' });
  res.json({ ok: true });
});
