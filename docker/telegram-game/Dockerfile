FROM node:22.13.0-alpine AS builder

WORKDIR /app

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

COPY ./ ./

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm build --filter @chat-game/telegram-game

FROM nginx:stable-alpine

COPY --from=builder /app/apps/telegram-game/dist /app/dist
COPY --from=builder /app/docker/telegram-game/default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]