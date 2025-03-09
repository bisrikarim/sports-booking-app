# Étape 1 : Construction de l'application Next.js
FROM node:18 AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .
RUN npm run build

# Étape 2 : Exécution de l'application avec une image légère
FROM node:18-alpine AS runner

WORKDIR /app

COPY --from=builder /app ./

ENV NODE_ENV=production

# Exposer le port utilisé par Next.js
EXPOSE 3000

CMD ["npm", "run", "start"]
