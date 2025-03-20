# Étape de construction
FROM node:18-alpine AS builder

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances
RUN npm ci

# Copier les fichiers du projet
COPY . .

# Construire l'application Next.js
RUN npm run build

# Étape de production
FROM node:18-alpine AS runner

WORKDIR /app

# Définir les variables d'environnement
ENV NODE_ENV=production

# Copier les fichiers nécessaires depuis l'étape de construction
COPY --from=builder /app/next.config.mjs ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Exposer le port sur lequel Next.js fonctionne
EXPOSE 3000

# Définir la commande de démarrage
CMD ["npm", "start"]