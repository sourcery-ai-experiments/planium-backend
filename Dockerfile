ARG NODE_VERSION=20.10.0

FROM node:${NODE_VERSION}-alpine as dependencies

WORKDIR /app

COPY package.json yarn.lock tsconfig.json ./

RUN yarn install



FROM node:${NODE_VERSION}-alpine as builder

WORKDIR /app

COPY . .

COPY --from=dependencies /app/node_modules ./node_modules

RUN yarn run build



FROM node:${NODE_VERSION}-alpine as tester

WORKDIR /app

COPY --from=dependencies /app/node_modules ./node_modules

COPY . .

RUN yarn run test



FROM node:${NODE_VERSION}-alpine as production

WORKDIR /app

COPY --from=dependencies /app/node_modules ./node_modules

COPY --from=builder /app/dist ./dist

COPY package.json yarn.lock .env.development ./

EXPOSE 3011

CMD ["yarn", "start:prod"]
