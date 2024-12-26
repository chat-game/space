FROM node:22.12.0-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json pnpm-lock.yaml .npmrc ./
RUN corepack enable pnpm && pnpm i --frozen-lockfile --ignore-scripts

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN corepack enable pnpm && pnpm build --filter @chat-game/website

# Production image, copy all the files and run
FROM base
WORKDIR /app

ENV NODE_ENV=production
ARG VERSION=nightly
ENV VERSION=${VERSION}

RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 appuser

COPY --from=builder /app/apps/website/.output ./

USER appuser

EXPOSE 3000
ENV PORT=3000

CMD ["/app/server/index.mjs"]
