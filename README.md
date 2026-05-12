# Universe

A full-stack product management application built as a monorepo. It consists of two NestJS microservices communicating asynchronously via AWS SQS, and a Next.js frontend.

- **Products service** exposes a REST API to create, delete, and list products with pagination. Every write operation publishes an event to an SQS queue.
- **Notifications service** consumes the SQS queue and logs each incoming event — simulating a notification or audit system reacting to product changes.
- **Web** is a Next.js frontend that lets users browse products, create new ones via a dialog form, and delete them with a confirmation step.

Infrastructure (PostgreSQL, LocalStack SQS, Prometheus) runs via Docker Compose.

## Services

| Service | Port | Description |
|---------|------|-------------|
| products | 3000 | REST API for product management |
| notifications | 3001 | SQS consumer that logs product events |
| web | 3002 | Next.js frontend |
| PostgreSQL | 5432 | Database (products service) |
| LocalStack | 4566 | Local AWS SQS emulator |
| Prometheus | 9090 | Metrics scraper |

## Prerequisites

- [Node.js](https://nodejs.org/) >= 20
- [pnpm](https://pnpm.io/) >= 9 — `npm install -g pnpm`
- [Docker](https://www.docker.com/) with Docker Compose

---

## Option A — Run locally (recommended for development)

This runs the services directly on your machine with hot reload. Faster iteration, no Docker build step for the apps.

**1. Install dependencies**

```bash
pnpm install
```

This installs dependencies for all packages in the monorepo at once (`apps/products`, `apps/notifications`, `apps/web`, `packages/shared`).

**2. Copy environment variables**

```bash
cp .env.example .env
```

The `.env` file is pre-configured to work with the local Docker infrastructure out of the box. No changes needed.

**3. Start infrastructure**

```bash
docker compose up -d
```

This starts:
- PostgreSQL on port 5432
- LocalStack (SQS emulator) on port 4566 — automatically creates the `test-queue`
- Prometheus on port 9090

The `-d` flag runs them in the background. Check logs with `docker compose logs -f`.

**4. Run database migrations**

```bash
pnpm --filter products run db:generate
pnpm --filter products run db:migrate
```

`db:generate` reads the Drizzle schema (`apps/products/src/database/schema.ts`) and generates SQL migration files.  
`db:migrate` executes those SQL files against PostgreSQL, creating the `products` table.

You only need to run this once (or whenever the schema changes).

**5. (Optional) Seed the database**

```bash
pnpm --filter products run db:seed
```

This inserts 30 sample products so you can immediately explore pagination and filtering without creating data manually. Safe to run multiple times — it just adds more rows.

**6. Start all services**

```bash
pnpm dev
```

This starts products, notifications, and web in parallel. Or start them individually:

```bash
pnpm --filter products run start:dev       # http://localhost:3000
pnpm --filter notifications run start:dev  # http://localhost:3001
pnpm --filter web run dev                  # http://localhost:3002
```

---

## Option B — Run everything in Docker

This builds and runs all services as Docker containers. Closer to production, but slower to iterate.

**1. Start infrastructure first**

```bash
docker compose up -d
```

**2. Build and start the apps**

```bash
docker compose -f docker-compose.dev.yml up --build
```

`--build` rebuilds the images. Omit it on subsequent runs if the code hasn't changed.

**3. Run migrations** (first time only)

Migrations need to run inside the products container:

```bash
docker exec -it products sh -c "cd /app/apps/products && node -e \"require('./dist/main')\""
```

Or run them locally against the Docker PostgreSQL (simpler):

```bash
pnpm --filter products run db:migrate
```

---

## Verify everything works

Once all services are running, open a new terminal and run:

```bash
# 1. Check products service is up
curl http://localhost:3000/health

# 2. Get empty product list
curl http://localhost:3000/products

# 3. Create a product
curl -X POST http://localhost:3000/products \
  -H "Content-Type: application/json" \
  -d '{"name": "Test Product", "description": "A test", "price": 9.99}'

# 4. List products (should show the created one)
curl http://localhost:3000/products

# 5. Check Prometheus metrics
curl http://localhost:3000/metrics
```

After step 3, check the **Notifications service logs** — you should see the event logged:

```
[NotificationsService] {"event":"product.created","id":"...","name":"Test Product","price":9.99,"timestamp":"..."}
```

Open the frontend at **http://localhost:3002** to use the UI.

Open Prometheus at **http://localhost:9090** to see metrics.

---

## API Reference

| Method | Endpoint | Body | Description |
|--------|----------|------|-------------|
| GET | `/products` | — | List products. Query: `?page=1&limit=10` |
| POST | `/products` | `{name, description?, price}` | Create a product |
| DELETE | `/products/:id` | — | Soft-delete a product |
| GET | `/health` | — | Health check |
| GET | `/metrics` | — | Prometheus metrics |

## Architecture

See [docs/architecture.md](docs/architecture.md) for a detailed overview.  
See [docs/plan.md](docs/plan.md) for the implementation plan.
