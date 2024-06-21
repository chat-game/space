ARG NODE=node:20-alpine

################# Web builder ##############

FROM $NODE AS builder
WORKDIR /app
COPY package.json .
COPY yarn.lock .
RUN yarn install
COPY . .
RUN npx prisma generate
RUN yarn run build

################# Web App ##############

FROM $NODE
WORKDIR /app
COPY --from=builder /app/build build/
COPY --from=builder /app/node_modules node_modules/
COPY package.json .

ARG VERSION=nightly
ENV VERSION=${VERSION}
ENV NODE_ENV=production

EXPOSE 3000

CMD [ "node", "build" ]
