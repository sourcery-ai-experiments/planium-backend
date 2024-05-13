ARG NODE_VERSION=20.10.0


FROM node:${NODE_VERSION}-alpine as development
WORKDIR /app
COPY . .
RUN yarn install
CMD ["yarn", "start:dev"]


# FROM node:${NODE_VERSION}-alpine as dependencies
# WORKDIR /app
# COPY package.json yarn.lock tsconfig.json ./
# RUN yarn install


# FROM node:${NODE_VERSION}-alpine as prod-dependencies
# WORKDIR /app
# COPY package.json yarn.lock tsconfig.json ./
# RUN yarn install --production


# FROM node:${NODE_VERSION}-alpine as builder
# WORKDIR /app
# COPY . .
# COPY --from=dependencies /app/node_modules ./node_modules
# RUN yarn run build


# FROM node:${NODE_VERSION}-alpine as tester
# WORKDIR /app
# COPY --from=dependencies /app/node_modules ./node_modules
# COPY . .
# RUN yarn run test


# FROM node:${NODE_VERSION}-alpine as production
# WORKDIR /app
# COPY --from=prod-dependencies /app/node_modules ./node_modules
# COPY --from=builder /app/dist ./dist
# COPY package.json yarn.lock ./
# EXPOSE 3011
# CMD ["yarn", "start:prod"]
