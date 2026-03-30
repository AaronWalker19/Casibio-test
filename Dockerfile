FROM node:18

WORKDIR /app

# Copier package.json
COPY package*.json ./

# Installer dépendances serveur
RUN npm install

# Copier tout le projet
COPY . .

# Build React
WORKDIR /app/client
RUN npm install && npm run build

# Revenir à la racine
WORKDIR /app

EXPOSE 3000

CMD ["node", "server.js"]