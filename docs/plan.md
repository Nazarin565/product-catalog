# Implementation Plan: Universe Full-Stack App

## Context

Full-stack product management application built as a monorepo: two NestJS microservices communicating via AWS SQS, and a Next.js frontend.

---

## Stack

| Layer | Technology |
|-------|-----------|
| Backend framework | NestJS (TypeScript) |
| Database | PostgreSQL 16 |
| ORM / Migrations | Drizzle ORM |
| Message broker | AWS SQS via LocalStack |
| Frontend | Next.js 14 (App Router) |
| UI | Tailwind CSS (custom components) |
| Monorepo | pnpm workspaces |
| Containerization | Docker + docker-compose |
| Monitoring | Prometheus + @willsoto/nestjs-prometheus (Products only, port 3000) |
| SQS consumer | @ssut/nestjs-sqs |
| Validation | class-validator + class-transformer |
| HTTP client (FE) | Axios |

---

## Monorepo structure

```
universe/
├── apps/
│   ├── products/          # NestJS — Products microservice (port 3000)
│   ├── notifications/     # NestJS — Notifications microservice (port 3001)
│   └── web/               # Next.js — Frontend (port 3002)
├── packages/
│   └── shared/            # Shared types and DTOs
├── docs/
│   ├── requirements.md
│   └── plan.md
├── docker-compose.yml     # PostgreSQL + LocalStack + Prometheus
├── docker-compose.dev.yml # Products + Notifications + Web containers
├── pnpm-workspace.yaml
├── package.json           # root
└── .env.example
```

---

## Steps

### Step 1 — Monorepo setup
- Initialize pnpm workspaces (`pnpm-workspace.yaml`)
- Create root `package.json` with shared dev dependencies (TypeScript, ESLint, Prettier)
- Add `tsconfig.base.json` with shared compiler options
- Add `.env.example` with all required variables
- Write `README.md` with full setup and run instructions

### Step 2 — Shared package
Create `packages/shared/src/`:
- `events/product-events.ts` — `enum ProductEventType` + event types (`ProductCreatedEvent`, `ProductDeletedEvent`, `ProductEvent` union)
- `index.ts` — public package API

### Step 3 — Products service (`apps/products`)
Structure:
```
src/
├── products/
│   ├── products.module.ts
│   ├── products.controller.ts
│   ├── products.service.ts
│   └── dto/
│       ├── create-product.dto.ts
│       └── pagination.dto.ts
├── database/
│   ├── database.module.ts
│   ├── schema.ts
│   └── migrations/
├── messaging/
│   ├── messaging.module.ts
│   └── sqs-publisher.service.ts
├── health/
│   └── health.controller.ts
├── metrics/
│   └── metrics.module.ts
├── env.ts
├── app.module.ts
└── main.ts
```

Endpoints:
- `POST /products` — create a product (`name`, `description?`, `price`)
- `DELETE /products/:id` — soft-delete a product
- `GET /products?page=1&limit=10` — list products with pagination

SQS events:
- `product.created` → `{ id, name, price, timestamp }`
- `product.deleted` → `{ id, timestamp }`

Database schema (Drizzle):
```
products: id (uuid), name (varchar), description (text), price (numeric), createdAt, deletedAt
```

### Step 4 — Notifications service (`apps/notifications`)
Structure:
```
src/
├── notifications/
│   ├── notifications.module.ts
│   └── notifications.service.ts
├── messaging/
│   └── messaging.module.ts
├── health/
│   └── health.controller.ts
├── env.ts
├── app.module.ts
└── main.ts
```
Logic: consume `test-queue`, log each incoming event via NestJS Logger (structured JSON).

### Step 5 — Frontend (`apps/web`)
Structure:
```
src/
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── products/
│   │   ├── ProductsTable.tsx
│   │   ├── ProductsActions.tsx
│   │   ├── CreateProductDialog.tsx
│   │   ├── DeleteButton.tsx
│   │   ├── DeleteProductDialog.tsx
│   │   └── PaginationControls.tsx
│   └── ui/
│       ├── Button.tsx
│       └── Modal.tsx
├── lib/
│   ├── api.ts
│   └── server-api.ts
└── types/
    └── product.ts
```

UI features:
- Product table with pagination (Server Component, URL-driven)
- "Create Product" button → modal form with validation
- "Delete" button → confirmation dialog
- Loading states on all async actions

### Step 6 — Docker setup
- Add `docker-compose.dev.yml` with products, notifications, and web services
- Verify full stack starts with `docker compose -f docker-compose.yml -f docker-compose.dev.yml up`

---

## Verification

1. `docker compose up` → PostgreSQL, LocalStack, Prometheus start
2. `GET /products` → empty list
3. `POST /products` → product created, SQS event published
4. Notifications logs → event logged
5. `GET /products?page=1&limit=5` → pagination works
6. `DELETE /products/:id` → soft delete, SQS event published
7. Frontend at `localhost:3002` → all UI flows work
8. Prometheus at `localhost:9090` → Products metrics visible
