FROM node:20-alpine AS builder

RUN npm install -g pnpm

WORKDIR /app

COPY package.json pnpm-workspace.yaml tsconfig.base.json ./
COPY packages/shared/package.json ./packages/shared/
COPY apps/products/package.json ./apps/products/

RUN pnpm install --frozen-lockfile

COPY packages/shared ./packages/shared
COPY apps/products ./apps/products

RUN pnpm --filter shared run build
RUN pnpm --filter products run build

FROM node:20-alpine AS runner

RUN npm install -g pnpm

WORKDIR /app

COPY package.json pnpm-workspace.yaml ./
COPY packages/shared/package.json ./packages/shared/
COPY apps/products/package.json ./apps/products/

RUN pnpm install --frozen-lockfile --prod

COPY --from=builder /app/packages/shared/dist ./packages/shared/dist
COPY --from=builder /app/apps/products/dist ./apps/products/dist

WORKDIR /app/apps/products

EXPOSE 3000

CMD ["node", "dist/main"]
