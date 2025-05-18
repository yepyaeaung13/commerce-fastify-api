# syntax=docker/dockerfile:1

ARG NODE_VERSION=20.17.0
FROM node:${NODE_VERSION}-alpine as base
WORKDIR /usr/src/app

################################################################################
# Install production dependencies
FROM base as deps

COPY package*.json ./
RUN npm ci --omit=dev

################################################################################
# Build the app
FROM base as build

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

################################################################################
# Final minimal image
FROM base as final

ENV NODE_ENV=production
USER node

COPY package*.json ./
COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/dist ./dist

EXPOSE 3000
CMD ["npm", "start"]
