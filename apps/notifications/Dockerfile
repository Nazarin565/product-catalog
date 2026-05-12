FROM node:20-alpine AS builder

RUN npm install -g pnpm

WORKDIR /app

COPY package.json pnpm-workspace.yaml tsconfig.base.json ./
COPY packages/shared/package.json ./packages/shared/
COPY apps/notifications/package.json ./apps/notifications/

RUN pnpm install --frozen-lockfile

COPY packages/shared ./packages/shared
COPY apps/notifications ./apps/notifications

RUN pnpm --filter shared run build
RUN pnpm --filter notifications run build

FROM node:20-alpine AS runner

RUN npm install -g pnpm

WORKDIR /app

COPY package.json pnpm-workspace.yaml ./
COPY packages/shared/package.json ./packages/shared/
COPY apps/notifications/package.json ./apps/notifications/

RUN pnpm install --frozen-lockfile --prod

COPY --from=builder /app/packages/shared/dist ./packages/shared/dist
COPY --from=builder /app/apps/notifications/dist ./apps/notifications/dist

WORKDIR /app/apps/notifications

EXPOSE 3001

CMD ["node", "dist/main"]
