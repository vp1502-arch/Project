# AGENTS.md

Guidance for AI agents and developers working in this repository.

## Project

**AI Hub — Unilever Mumbai**: an internal catalog of AI tools (npm workspaces monorepo).

- `backend/` — Express + TypeScript + Prisma (SQLite), JWT auth. API under `/api`.
- `frontend/` — React + Vite + TypeScript + Tailwind. Dev server proxies `/api` and `/uploads` to the backend.
- `docs/PRD.md` — product requirements.

See `README.md` for the full setup, scripts, and demo credentials.

## Cursor Cloud specific instructions

The startup/update script runs `npm install` and (when `backend/package.json` exists) `npm run db:setup`, so dependencies, the Prisma client, the SQLite dev DB, and seed data are ready on boot. Notes that are NOT obvious from the README:

- **Run services with `npm run dev` from the repo root** (runs backend on `:4000` and frontend on `:5173` via `concurrently`). The frontend must be reached at **http://localhost:5173** (not the backend port) because Vite proxies `/api` to the backend.
- **The backend needs `backend/.env`.** `npm run db:setup` reads `DATABASE_URL` from it. The update script copies `backend/.env.example` → `backend/.env` if missing. At runtime the app also falls back to sane defaults (`src/env.ts`), but the Prisma CLI (`db push`, `seed`) requires the `.env` file.
- **Tests write to the dev SQLite DB.** `npm run test -w backend` (vitest + supertest) logs in as the seeded admin and creates a tool in `backend/prisma/dev.db`, leaving test rows behind. Re-run `npm run db:setup` to reset to clean seed data if the catalog looks cluttered. Tests depend on the seed having run first (the admin account must exist).
- **Prisma + SQLite limitation:** SQLite supports neither native enums nor scalar lists. `role`/`status`/`publishState` are plain strings, and tag/POC lists use relations. When writing nested relation updates, `set: []` is only valid on **update**, never on **create** (see `connectTags` in `backend/src/routes/tools.ts`).
- **After changing `prisma/schema.prisma`,** run `npm run db:setup -w backend` (regenerates the client and pushes the schema). The `tsx watch` dev server does not pick up Prisma client regeneration on its own — restart `npm run dev` after schema changes.
- **Seeded logins:** `admin@unilever.com` / `admin123` (admin) and `editor@unilever.com` / `editor123` (editor).
