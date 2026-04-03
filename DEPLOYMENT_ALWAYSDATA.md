# Guide de Déploiement sur alwaysdata.net

## 🎯 Problème Résolu

Les erreurs 502 étaient causées par **sqlite3 qui ne peut pas être compilé** sur un serveur d'hébergement mutualisé. La solution est d'utiliser **MySQL** (fourni par alwaysdata.net).

## 📋 Étapes de Configuration

### 1️⃣ Trouver vos identifiants MySQL

1. Connectez-vous à votre compte alwaysdata.net
2. Allez dans l'onglet **"Bases de données"** → **"MySQL"**
3. Notez les informations suivantes:
   - **Serveur**: `mysql-casibio.alwaysdata.net` (ou similaire)
   - **Utilisateur**: `casibio` (ou votre nom d'utilisateur)
   - **Mot de passe**: (montré dans le panel)
   - **Base de données**: `casibio_db` (ou le nom de votre BD)

### 2️⃣ Créer un fichier `.env` sur alwaysdata.net

Via FileZilla, créez un fichier `.env` à la racine du projet:

```
PORT=3000
DB_HOST=mysql-casibio.alwaysdata.net
DB_USER=casibio
DB_PASSWORD=votre-mot-de-passe
DB_NAME=casibio_db
ADMIN_USERNAME=admin
ADMIN_EMAIL=admin@test.com
ADMIN_PASSWORD=admin123
JWT_SECRET=your-super-secret-key-change-in-prod
```

### 3️⃣ Mettre à jour le fichier `package.json`

Assurez-vous que vous avez **mysql2** et plus **sqlite3**:

```json
"dependencies": {
  "mysql2": "^3.6.5",
  "bcryptjs": "^3.0.3",
  "express": "^5.2.1",
  "jsonwebtoken": "^9.0.3",
  "multer": "^2.1.1",
  "cors": "^2.8.6",
  "form-data": "^4.0.5",
  "node-fetch": "^2.7.0"
}
```

### 4️⃣ Télécharger tous les fichiers modifiés

Via FileZilla, mettez à jour:
- ✅ `server.js`
- ✅ `db/database.js`
- ✅ `routes/auth.js`
- ✅ `routes/projects.js`
- ✅ `package.json`
- ✅ `.env` (créer nouveau)

### 5️⃣ Exécuter `npm install`

Sur alwaysdata.net, via le terminal SSH:
```bash
cd /home/username/public_html
npm install
```

### 6️⃣ Redémarrer le serveur Node.js

Via le panel alwaysdata.net:
- Allez à **"Serveurs"** → **"Node.js"**
- Arrêtez puis redémarrez votre application

---

## ✅ Vérification

Une fois redéployé, testez:
```
https://casibio.alwaysdata.net/
```

Ça doit répondre **200 OK** (pas 502).

Testez l'API:
```
https://casibio.alwaysdata.net/api/auth/login
```

---

## 🐛 Troubleshooting

### Erreur: "Access denied for user"
- Vérifier les identifiants MySQL dans `.env`
- Vérifier que la BD MySQL est active dans le panel

### Erreur: "Client does not support authentication protocol"
- Vous utilisez peut-être une ancienne version de MySQL
- Contactez le support alwaysdata.net

### Erreur: "Connection timeout"
- Le serveur MySQL n'est peut-être pas accessible
- Vérifier le HOST (copiez depuis le panel)

---

## 📝 Notes de Sécurité

⚠️ **IMPORTANT**: 
- Ne commitez jamais `.env` dans Git
- Changez les mots de passe en production
- Utilisez des valeurs `JWT_SECRET` sécurisées

