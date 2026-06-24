# AI Hub — Unilever Mumbai

A single internal platform to discover and learn about all the AI tools available in the Unilever Mumbai facility — descriptions, links, points of contact (POCs), training docs, training scheduling, and FAQs — with a two-way (employee + admin) access model and a Unilever-inspired theme.

- 📄 **Product Requirements Document:** [`docs/PRD.md`](docs/PRD.md)

## Tech stack

- **Frontend:** React + Vite + TypeScript + Tailwind CSS (`frontend/`)
- **Backend:** Node.js + Express + TypeScript + Prisma ORM (`backend/`)
- **Database:** SQLite for local dev (PostgreSQL-ready)
- **Auth:** JWT with bcrypt-hashed passwords (local accounts)

## Project structure

```
.
├── docs/PRD.md        # Product requirements
├── backend/           # Express + Prisma API
│   └── prisma/        # schema, seed (admin + sample tools)
├── frontend/          # React + Vite app
└── package.json       # npm workspaces + root scripts
```

## Getting started

```bash
# 1. Install all workspace dependencies
npm install

# 2. Create the backend env file (first time only)
cp backend/.env.example backend/.env

# 3. Generate the Prisma client, create the SQLite DB, and seed sample data
npm run db:setup        # = prisma generate + db push + seed

# 4. Run both apps (backend :4000, frontend :5173)
npm run dev
```

Open http://localhost:5173.

### Demo credentials (from the seed)

| Role | Email | Password |
| --- | --- | --- |
| Admin | `admin@unilever.com` | `admin123` |
| Editor | `editor@unilever.com` | `editor123` |

> Change these before any non-local use.

## Common scripts (run from repo root)

| Command | Description |
| --- | --- |
| `npm run dev` | Run backend + frontend dev servers concurrently |
| `npm run build` | Type-check and build both apps |
| `npm run lint` | Lint both apps |
| `npm run test` | Run backend (and frontend) tests |
| `npm run db:setup` | Generate client, push schema, seed (backend) |

Per-workspace commands: append `-w backend` or `-w frontend` (e.g. `npm run dev -w backend`).

## Key endpoints

- Frontend: http://localhost:5173
- Backend API: http://localhost:4000/api (health check: `/api/health`)
- The Vite dev server proxies `/api` and `/uploads` to the backend.
