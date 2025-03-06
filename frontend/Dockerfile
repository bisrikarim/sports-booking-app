# Utiliser une image Node.js pour la construction
FROM node:18 AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . ./
RUN npm run build

# Utiliser une image légère pour servir l'application
FROM node:18-alpine AS production

WORKDIR /app

COPY --from=build /app/build ./build

RUN npm install -g serve

CMD ["serve", "-s", "build", "-l", "3000"]
