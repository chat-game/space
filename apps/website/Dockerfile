ARG NODE=node:20.16.0-alpine

################# Web builder ##############

FROM $NODE AS builder
WORKDIR /app
COPY package.json .
COPY yarn.lock .
RUN yarn install
COPY . .
RUN yarn nx run website:build

################# Web App ##############

FROM $NODE
WORKDIR /app
COPY --from=builder /app/apps/website/.output .output/

ARG VERSION=nightly
ENV VERSION=${VERSION}
ENV NODE_ENV=production

EXPOSE 3000

CMD [ "node", ".output/server/index.mjs" ]
