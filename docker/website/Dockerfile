FROM node:22.13.1-alpine AS base

# Install dependencies and build
FROM base AS builder
WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc turbo.json ./
COPY ./prisma ./prisma
COPY ./packages ./packages
COPY ./apps/website ./apps/website

RUN npm install -g pnpm --ignore-scripts \
  && pnpm i --frozen-lockfile --ignore-scripts \
  && pnpm build --filter @chat-game/website

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
