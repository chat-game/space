FROM node:22.13.1-alpine AS builder

WORKDIR /app

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

COPY ./ ./

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm build --filter @chat-game/telegram-game

FROM nginx:stable-alpine

RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 appuser

COPY --from=builder --chown=nodejs:appuser /app/apps/telegram-game/dist /app/dist
COPY --from=builder --chown=nodejs:appuser /app/docker/telegram-game/default.conf /etc/nginx/conf.d/default.conf

RUN chown -R appuser:nodejs /var/cache/nginx/client_temp

USER appuser

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]