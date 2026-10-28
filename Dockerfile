FROM node:22-alpine AS build

WORKDIR /src

COPY package*.json ./

RUN npm ci

COPY tsconfig.json ./
COPY src ./src

RUN npm run build

FROM node:22-alpine

WORKDIR /src

ENV NODE_ENV=production

COPY package*.json ./

RUN npm ci --omit=dev && npm cache clean --force

COPY --from=build /src/dist ./dist
COPY .sequelizerc ./
COPY src/db/config.js ./dist/db/config.js
COPY src/db/migrations ./dist/db/migrations
COPY src/db/seeds ./dist/db/seeds

EXPOSE 3000

CMD ["npm", "start"]
