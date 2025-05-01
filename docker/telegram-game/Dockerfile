FROM node:22.15.0-alpine AS builder
WORKDIR /app

COPY ./ ./

RUN npm install -g pnpm --ignore-scripts \
  && pnpm i --frozen-lockfile --ignore-scripts \
  && pnpm build --filter @chat-game/telegram-game

FROM nginx:stable-alpine

RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 appuser

COPY --from=builder /app/apps/telegram-game/dist /app/dist
COPY --from=builder /app/docker/telegram-game/default.conf /etc/nginx/conf.d/default.conf

USER appuser

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]