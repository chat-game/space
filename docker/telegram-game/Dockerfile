FROM node:22.11-alpine as builder

WORKDIR /app

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

COPY ./ ./

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm build --filter @chat-game/telegram-game

FROM nginx:alpine

COPY --from=builder /app/dist /app/dist
COPY --from=builder /app/docker/nginx/conf.d/vhost.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/docker/entrypoint.sh /docker-entrypoint.d/entrypoint.sh

RUN chmod +x /docker-entrypoint.d/entrypoint.sh

EXPOSE 80
