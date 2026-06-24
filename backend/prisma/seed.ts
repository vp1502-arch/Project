import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding AI Hub database...');

  // --- Users ---
  const adminPassword = await bcrypt.hash('admin123', 10);
  const editorPassword = await bcrypt.hash('editor123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@unilever.com' },
    update: { passwordHash: adminPassword, role: 'admin', name: 'AI Hub Admin' },
    create: {
      name: 'AI Hub Admin',
      email: 'admin@unilever.com',
      passwordHash: adminPassword,
      role: 'admin',
    },
  });

  await prisma.user.upsert({
    where: { email: 'editor@unilever.com' },
    update: { passwordHash: editorPassword, role: 'editor', name: 'Tool Editor' },
    create: {
      name: 'Tool Editor',
      email: 'editor@unilever.com',
      passwordHash: editorPassword,
      role: 'editor',
    },
  });

  // --- Categories ---
  const categoryNames = ['Generative AI', 'Data & Analytics', 'Automation', 'Computer Vision'];
  const categories: Record<string, number> = {};
  for (const name of categoryNames) {
    const c = await prisma.category.upsert({
      where: { name },
      update: {},
      create: { name },
    });
    categories[name] = c.id;
  }

  // --- POCs ---
  const poc1 = await prisma.poc.upsert({
    where: { id: 1 },
    update: {},
    create: { name: 'Priya Sharma', role: 'AI Lead, Mumbai', email: 'priya.sharma@unilever.com' },
  });
  const poc2 = await prisma.poc.upsert({
    where: { id: 2 },
    update: {},
    create: { name: 'Rahul Mehta', role: 'Data Science Manager', email: 'rahul.mehta@unilever.com' },
  });

  // --- Tools ---
  const tools = [
    {
      name: 'UniGPT Assistant',
      slug: 'unigpt-assistant',
      shortDescription: 'Internal generative AI chat assistant for drafting and Q&A.',
      fullDescription:
        'UniGPT is the facility-approved generative AI assistant for drafting emails, summarizing documents, and answering business questions securely within Unilever guardrails.',
      url: 'https://example.com/unigpt',
      status: 'active',
      category: 'Generative AI',
      tags: ['chatbot', 'productivity', 'llm'],
      pocs: [poc1.id],
      faqs: [
        { question: 'Is my data kept private?', answer: 'Yes, prompts stay within the Unilever tenant and are not used for public model training.' },
        { question: 'Which languages are supported?', answer: 'English and Hindi are fully supported today.' },
      ],
      docs: [{ title: 'Getting started guide', type: 'link', url: 'https://example.com/unigpt/docs' }],
    },
    {
      name: 'InsightBoard',
      slug: 'insightboard',
      shortDescription: 'Self-service analytics dashboards for plant KPIs.',
      fullDescription:
        'InsightBoard provides real-time dashboards for manufacturing KPIs, OEE, and quality metrics across the Mumbai facility lines.',
      url: 'https://example.com/insightboard',
      status: 'active',
      category: 'Data & Analytics',
      tags: ['dashboards', 'kpi', 'analytics'],
      pocs: [poc2.id],
      faqs: [
        { question: 'How often is data refreshed?', answer: 'Most dashboards refresh every 15 minutes.' },
      ],
      docs: [{ title: 'Dashboard catalog', type: 'link', url: 'https://example.com/insightboard/catalog' }],
    },
    {
      name: 'FlowBot RPA',
      slug: 'flowbot-rpa',
      shortDescription: 'Robotic process automation for repetitive back-office tasks.',
      fullDescription:
        'FlowBot automates repetitive workflows such as invoice processing and report generation using approved RPA bots.',
      url: 'https://example.com/flowbot',
      status: 'beta',
      category: 'Automation',
      tags: ['rpa', 'automation'],
      pocs: [poc1.id, poc2.id],
      faqs: [],
      docs: [],
    },
    {
      name: 'VisionQC',
      slug: 'visionqc',
      shortDescription: 'Computer vision quality control on packaging lines.',
      fullDescription:
        'VisionQC uses computer vision models to detect packaging defects in real time, reducing manual inspection effort.',
      url: 'https://example.com/visionqc',
      status: 'active',
      category: 'Computer Vision',
      tags: ['cv', 'quality', 'manufacturing'],
      pocs: [poc2.id],
      faqs: [
        { question: 'What defect types are detected?', answer: 'Label misalignment, missing caps, and seal defects.' },
      ],
      docs: [{ title: 'Model overview', type: 'link', url: 'https://example.com/visionqc/model' }],
    },
  ];

  for (const t of tools) {
    const { category, tags, pocs, faqs, docs, ...data } = t;
    const tool = await prisma.tool.upsert({
      where: { slug: t.slug },
      update: {
        ...data,
        categoryId: categories[category],
        updatedBy: admin.email,
        tags: {
          set: [],
          connectOrCreate: tags.map((name) => ({ where: { name }, create: { name } })),
        },
        pocs: { set: pocs.map((id) => ({ id })) },
      },
      create: {
        ...data,
        categoryId: categories[category],
        createdBy: admin.email,
        updatedBy: admin.email,
        tags: { connectOrCreate: tags.map((name) => ({ where: { name }, create: { name } })) },
        pocs: { connect: pocs.map((id) => ({ id })) },
      },
    });

    // Reset child FAQs/docs for idempotency
    await prisma.faq.deleteMany({ where: { toolId: tool.id } });
    await prisma.trainingDoc.deleteMany({ where: { toolId: tool.id } });
    if (faqs.length) {
      await prisma.faq.createMany({
        data: faqs.map((f, i) => ({ ...f, toolId: tool.id, order: i })),
      });
    }
    if (docs.length) {
      await prisma.trainingDoc.createMany({
        data: docs.map((d) => ({ ...d, toolId: tool.id })),
      });
    }
  }

  // --- Global FAQs ---
  await prisma.faq.deleteMany({ where: { toolId: null } });
  await prisma.faq.createMany({
    data: [
      {
        toolId: null,
        question: 'What is AI Hub?',
        answer: 'AI Hub is the single platform to discover all AI tools available in the Unilever Mumbai facility.',
        order: 0,
      },
      {
        toolId: null,
        question: 'How do I request a new tool to be listed?',
        answer: 'Contact the AI Hub admin team, who can add your tool to the catalog.',
        order: 1,
      },
    ],
  });

  console.log('Seed complete. Admin login: admin@unilever.com / admin123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
