# Étape 1 : Construire l'application
FROM node:20

# Définir le répertoire de travail dans le conteneur
WORKDIR /app

# Copier les fichiers package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances
RUN npm install


# Copier le reste des fichiers de l'application
COPY . .

RUN npm run build

EXPOSE 3333

# Démarrer l'application
CMD ["node", "bin/server.js"]