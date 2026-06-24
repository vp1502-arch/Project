# Product Requirements Document (PRD)

## AI Hub — Unilever Mumbai

| Field | Value |
| --- | --- |
| **Product name** | AI Hub (Unilever Mumbai) |
| **Document status** | Draft v0.1 (for review) |
| **Owner** | _TBD (Product owner / facility lead)_ |
| **Author** | Engineering (Cursor agent) |
| **Last updated** | 2026-06-24 |
| **Target audience** | Unilever Mumbai facility employees, tool owners/POCs, and platform admins |

> **Note on branding:** This document references the Unilever brand color palette and visual style. The hex values listed in [Section 9](#9-ui--ux--branding) are public approximations and **must be validated against Unilever's official brand guidelines** before launch. This project is an internal facility tool and is not an official Unilever product.

---

## 1. Overview

### 1.1 Summary
AI Hub is a single, internal web platform that catalogs every AI tool available within the Unilever Mumbai facility. Today, knowledge about which AI tools exist, what they do, who owns them, how to get trained, and where to find documentation is scattered across emails, chats, shared drives, and people's heads. AI Hub centralizes all of this into one branded, searchable, self-service portal.

### 1.2 Problem statement
Employees at the Unilever Mumbai facility cannot easily discover the AI tools available to them, understand what each tool does, find the right point of contact (POC), access training material, or request training. Tool owners have no consistent place to publish and maintain this information. This leads to duplicated effort, underused tools, repeated questions to POCs, and slow onboarding.

### 1.3 Vision
A "one-stop shop" where any employee can, in under a minute, discover an AI tool, understand its purpose, open it, read its docs, find its POC, schedule training, and get answers to common questions — all in a familiar Unilever-branded experience.

### 1.4 Goals & success metrics
| Goal | Metric | Target (initial) |
| --- | --- | --- |
| Centralize tool discovery | # of tools cataloged | 100% of known facility AI tools |
| Drive self-service | Avg. time to find a tool & its info | < 60 seconds |
| Reduce repetitive POC questions | # of FAQ views vs. direct POC contacts | FAQ deflection trend up over time |
| Increase tool adoption | Tool link click-throughs / month | Growth month-over-month |
| Enable training | # of training requests submitted | Tracked from launch |
| Keep content fresh | % of tools updated in last 90 days | > 80% |

### 1.5 Non-goals (out of scope for v1)
- Building or hosting the AI tools themselves (AI Hub only *links* to them).
- Single Sign-On (SSO) integration with Unilever identity provider (planned for a later phase; v1 uses local auth — see [Section 7](#7-roles--access-control)).
- Automated calendar/Outlook integration for training (v1 captures requests; scheduling is handled manually by POCs initially).
- Mobile native apps (the web app will be responsive instead).
- Multi-facility / multi-tenant support (v1 is scoped to Mumbai only, but data model should not preclude it later).

---

## 2. Target users & personas

| Persona | Description | Primary needs |
| --- | --- | --- |
| **Explorer (employee)** | Any facility employee browsing for tools to help their work. | Discover, search, filter tools; read descriptions; open tool; find POC; read FAQs/docs; request training. |
| **Tool POC / owner** | Owns one or more tools; keeps info current. | Add/update tool details, docs, FAQs, training availability; respond to training requests. |
| **Platform admin** | Manages the catalog and users. | Full CRUD on tools, categories, POCs, FAQs, training; manage users/roles; moderate content. |

---

## 3. Scope & key features (v1)

1. **Public-facing tool catalog** (read access for employees).
2. **Tool detail pages** with full information.
3. **Search & filtering** by name, category, tags.
4. **Admin portal** (two-way access) to manage all content.
5. **Training request / "Schedule a training"** flow.
6. **FAQs** per tool and globally.
7. **Unilever-themed UI**.

---

## 4. Functional requirements

### 4.1 Tool catalog (employee view)
- **FR-1** Display a grid/list of all published tools with: name, logo/icon, short description, category, and tags.
- **FR-2** Search tools by keyword (matches name, description, tags).
- **FR-3** Filter tools by category and tag; sort by name / most recently updated / popularity (link clicks).
- **FR-4** Clicking a tool opens its detail page.
- **FR-5** Each tool card shows a primary "Open tool" link (opens the tool URL in a new tab) and tracks a click count.

### 4.2 Tool detail page
Each tool page displays the following fields (those marked * are required):
- **FR-6** Name*, full description*, category*, tags.
- **FR-7** Tool link/URL* ("Open tool" button).
- **FR-8** Point(s) of contact (POC): name, role, email, optional photo/avatar.
- **FR-9** Training documents: list of links and/or uploaded files (PDF, slides, docs).
- **FR-10** "Schedule a training" button → opens the training request form (see 4.4).
- **FR-11** FAQs specific to the tool (expandable Q&A list).
- **FR-12** Metadata: status (Active / Beta / Deprecated), last updated date, owner.
- **FR-13** Optional: screenshots/gallery, video walkthrough link, related tools.

### 4.3 Admin portal — tool management (two-way access)
- **FR-14** Authenticated admins/POCs can **create, edit, delete** tools.
- **FR-15** Form to upload/edit all tool fields from 4.2, including file uploads for training docs and tool logo/screenshots.
- **FR-16** Manage **categories** and **tags** (create/rename/delete).
- **FR-17** Manage **POCs** (reusable contacts that can be attached to multiple tools).
- **FR-18** Manage **FAQs** (per-tool and global).
- **FR-19** Draft vs. Published state so content can be prepared before going live.
- **FR-20** View and manage incoming **training requests** (see 4.4).

### 4.4 Training request flow ("Schedule a training")
- **FR-21** Employee submits a request with: their name, email, selected tool, preferred date/time(s), and optional notes.
- **FR-22** Request is stored and visible to admins/relevant POC in the admin portal.
- **FR-23** Admin/POC can update request status (New → Scheduled → Completed → Cancelled).
- **FR-24** (Stretch) Email notification to POC on new request and to requester on status change.

### 4.5 FAQs
- **FR-25** Global FAQ page for platform-wide questions.
- **FR-26** Per-tool FAQ section managed via the admin portal.
- **FR-27** Searchable/expandable FAQ entries.

### 4.6 Authentication & roles
- **FR-28** Public/employee browsing of published tools (read-only). _Decision needed: open to all on the network vs. login-required — see [Open questions](#12-open-questions)._
- **FR-29** Admin and POC login required for any management action.
- **FR-30** Role-based access: `admin` (full control), `poc/editor` (manage own/assigned tools), `viewer` (read).

---

## 5. Non-functional requirements
- **NFR-1 Performance:** Catalog and detail pages load in < 2s on facility network.
- **NFR-2 Responsive:** Usable on desktop, tablet, and mobile browsers.
- **NFR-3 Accessibility:** Target WCAG 2.1 AA (color contrast, keyboard nav, alt text).
- **NFR-4 Security:** Hashed passwords, server-side authorization checks on all admin endpoints, input validation, file-upload type/size limits, protection against common web vulns (XSS, CSRF, injection).
- **NFR-5 Maintainability:** Clear separation of frontend/backend, typed code, documented setup.
- **NFR-6 Auditability:** Track created/updated timestamps and the user who last edited a tool.
- **NFR-7 Browser support:** Latest 2 versions of Chrome, Edge, Firefox, Safari.

---

## 6. Information architecture (pages)

**Public**
- `/` — Home / catalog (search + filters + tool grid)
- `/tools/:id` — Tool detail page
- `/faqs` — Global FAQs
- `/training/request` — Training request form (also reachable from a tool page)
- `/login` — Login

**Admin (auth-protected)**
- `/admin` — Dashboard (counts, recent training requests)
- `/admin/tools` — Tool list (CRUD)
- `/admin/tools/new`, `/admin/tools/:id/edit` — Tool create/edit form
- `/admin/categories` — Manage categories & tags
- `/admin/pocs` — Manage points of contact
- `/admin/faqs` — Manage FAQs
- `/admin/training` — Manage training requests
- `/admin/users` — Manage users & roles (admin only)

---

## 7. Roles & access control

| Capability | Explorer (employee) | POC / Editor | Admin |
| --- | --- | --- | --- |
| Browse published tools | ✅ | ✅ | ✅ |
| View tool details / FAQs | ✅ | ✅ | ✅ |
| Submit training request | ✅ | ✅ | ✅ |
| Create / edit tools | ❌ | ✅ (assigned) | ✅ (all) |
| Delete tools | ❌ | ⚠️ optional | ✅ |
| Manage categories/tags/POCs/FAQs | ❌ | ⚠️ limited | ✅ |
| Manage training requests | ❌ | ✅ (own tools) | ✅ |
| Manage users & roles | ❌ | ❌ | ✅ |

> v1 auth = local email/password with hashed credentials and seeded admin account. SSO (Unilever IdP / Azure AD) is a future enhancement.

---

## 8. Data model (initial)

```text
User        { id, name, email, passwordHash, role(admin|editor|viewer), createdAt }
Category    { id, name, description }
Tag         { id, name }
POC         { id, name, role, email, avatarUrl }
Tool        { id, name, slug, shortDescription, fullDescription, url,
              categoryId, tags[], pocIds[], logoUrl, screenshots[],
              status(active|beta|deprecated), publishState(draft|published),
              clickCount, createdBy, updatedBy, createdAt, updatedAt }
TrainingDoc { id, toolId, title, type(link|file), url/filePath }
FAQ         { id, toolId(nullable for global), question, answer, order }
TrainingRequest { id, toolId, requesterName, requesterEmail,
                  preferredDates[], notes, status(new|scheduled|completed|cancelled),
                  createdAt }
```

---

## 9. UI / UX & branding

### 9.1 Visual direction
Clean, modern, card-based catalog with generous whitespace, mirroring Unilever's corporate web style. Prominent header with the AI Hub wordmark and a clear search bar. Tool cards with icon, title, short description, category chip, and "Open tool" CTA.

### 9.2 Color palette (Unilever-inspired — verify against official brand kit)
| Token | Suggested hex | Usage |
| --- | --- | --- |
| Primary (Unilever Blue) | `#1F36C7` | Header, primary buttons, links |
| Primary dark | `#142A86` | Hover states, accents |
| Secondary accent | `#00B5E2` (cyan) | Highlights, chips |
| Success / training | `#3CB44B` | Status badges |
| Surface / background | `#FFFFFF` / `#F5F7FB` | Page & cards |
| Text primary | `#1A1A1A` | Body text |
| Text muted | `#5A6472` | Secondary text |

### 9.3 Typography
- Clean sans-serif (e.g., **Inter** / system UI as a stand-in for Unilever's brand font, which may be licensed). Headings bold; body regular.

### 9.4 Logo / identity
- "AI Hub" wordmark; optionally pair with the Unilever logo subject to internal brand approval.

---

## 10. Recommended technical stack

> Optimized for fast development, a polished UI, simple local setup, and easy maintenance.

| Layer | Recommendation | Rationale |
| --- | --- | --- |
| **Frontend** | React + Vite + TypeScript | Fast dev server, modern DX, great for an interactive catalog. |
| **UI styling** | Tailwind CSS (+ a component lib like shadcn/ui) | Rapid, consistent, themeable to the Unilever palette. |
| **Backend** | Node.js + Express + TypeScript (REST API) | Simple, well-understood, easy to host internally. |
| **Database** | SQLite for local dev (via Prisma ORM), upgradable to PostgreSQL | Zero-config local dev; clean migration path to Postgres for production. |
| **ORM** | Prisma | Type-safe data model matching [Section 8](#8-data-model-initial). |
| **Auth** | JWT or session-based local auth (bcrypt password hashing) | Meets v1 needs; swappable for SSO later. |
| **File uploads** | Local filesystem (dev) → object storage (prod) | Training docs, logos, screenshots. |
| **Testing** | Vitest + React Testing Library (FE), Vitest/Jest + Supertest (BE) | Standard, fast. |
| **Tooling** | ESLint + Prettier | Lint/format consistency. |

**Repository layout (proposed monorepo):**
```text
/
├── docs/PRD.md
├── frontend/        # React + Vite + TS app
├── backend/         # Express + TS API + Prisma
│   └── prisma/      # schema + migrations + seed (incl. seeded admin + sample tools)
├── package.json     # workspace scripts (dev, build, lint, test)
└── README.md
```

---

## 11. Milestones / phased delivery

| Phase | Scope |
| --- | --- |
| **Phase 0 — PRD & setup** | This PRD; scaffold repo, dev environment, CI-ready scripts, seeded DB with sample data. |
| **Phase 1 — Catalog (read)** | Home catalog, search/filter, tool detail pages, global + per-tool FAQs (read-only), seeded content. |
| **Phase 2 — Admin portal** | Auth, role-based access, full CRUD for tools/categories/tags/POCs/FAQs, file uploads, draft/publish. |
| **Phase 3 — Training** | "Schedule a training" form, admin training-request management, statuses. |
| **Phase 4 — Polish** | Unilever theming pass, accessibility, analytics (click counts), responsive QA. |
| **Phase 5 (future)** | SSO, email notifications, calendar integration, multi-facility support. |

---

## 12. Open questions
1. **Access model:** Should employee browsing require login, or be open to anyone on the facility network? (Affects auth in v1.)
2. **Hosting:** Where will this run (internal server, Unilever cloud, etc.)? Determines prod DB and storage choices.
3. **Identity:** Is Azure AD / Unilever SSO available and required for v1, or is local auth acceptable to start?
4. **Branding approval:** Can we use the official Unilever logo and exact brand colors/fonts? Need the official brand kit.
5. **Email/notifications:** Is an SMTP relay available for training-request notifications?
6. **Initial content:** Who provides the initial list of tools and their details (or should admins enter them post-launch)?
7. **Tool count & growth:** Approximate number of tools to plan for (affects pagination/search design).
8. **Data sensitivity:** Any confidential tool info that needs stricter access controls?

---

## 13. Acceptance criteria (v1 "done")
- An employee can browse, search, and filter the tool catalog and open any tool.
- A tool detail page shows description, link, POC, training docs, FAQs, and a working "Schedule a training" button.
- An admin can log in and create/edit/delete tools and all related content, including uploading training docs and a logo.
- Training requests submitted by employees appear in the admin portal and can be status-managed.
- The UI reflects the Unilever-inspired theme and is responsive and accessible (WCAG 2.1 AA targets).
- The project runs locally via documented `dev`, `lint`, `test`, and `build` commands.
