FROM node:16.15.1-slim AS build
WORKDIR /app
ENV NODE_ENV=development
COPY package*.json .
RUN npm install
COPY . .
RUN npm run build

FROM node:16.15.1-slim AS start
WORKDIR /app
ENV NODE_ENV=development
COPY package*.json .
RUN npm install --omit=dev
COPY --from=build /app/dist .
CMD ["node", "index.js"]
EXPOSE 8000