ARG NODE_VERSION=20.10.0

FROM node:${NODE_VERSION}-alpine as dependencies

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install


FROM node:${NODE_VERSION}-alpine as tester

WORKDIR /app

COPY --from=dependencies /app/node_modules ./node_modules

COPY . .

RUN yarn run test



FROM node:${NODE_VERSION}-alpine as production

WORKDIR /app

COPY package.json yarn.lock ./

COPY .env.development ./

COPY --from=tester /app/dist ./dist

RUN yarn install --production

EXPOSE 3011

CMD ["yarn", "start:prod"]
