FROM node:18

WORKDIR /app

# Installer dépendances serveur
COPY package*.json ./
RUN npm install

# Copier tout le projet (y compris build React déjà fait)
COPY . .

EXPOSE 3000

CMD ["node", "server.js"]