ARG NODE=node:20.16.0-alpine

################# Base builder ##############

FROM $NODE AS builder
WORKDIR /app

COPY . .
RUN yarn install
RUN yarn prisma-schema:generate
RUN yarn website:build

################# Website ##############

FROM $NODE
WORKDIR /app
COPY --from=builder /app/apps/website/.output .

ARG VERSION=nightly
ENV VERSION=${VERSION}
ENV NODE_ENV=production

EXPOSE 3000

CMD ["/app/server/index.mjs"]
