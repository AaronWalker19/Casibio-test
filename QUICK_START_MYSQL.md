# 🚀 CASiBIO - Démarrage rapide avec MySQL

## ✅ Configuration rapide (XAMPP/phpMyAdmin)

### 1️⃣ Démarrer XAMPP

```bash
# Windows
C:\xampp\xampp-control.exe
# Cliquer sur "Start" pour Apache et MySQL

# macOS (si installé avec brew)
brew services start mysql

# Linux (Ubuntu/Debian)
sudo systemctl start mysql
```

### 2️⃣ Ouvrir phpMyAdmin

```
http://localhost/phpmyadmin
```

Identifiants :
- **Utilisateur** : `root`
- **Mot de passe** : (vide)

### 3️⃣ Créer la base de données

Dans phpMyAdmin :

1. Cliquer sur **SQL** en haut
2. Copier tout le contenu de `db/schema.sql`
3. Coller dans la zone SQL
4. Cliquer **Exécuter**

✅ Les tables sont créées automatiquement !

### 4️⃣ Configurer le projet

Copier `.env.local` vers `.env` :

```bash
cp .env.local .env
```

Adapter si nécessaire (identifiants MySQL différents) :

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=casibio
PORT=3000
```

### 5️⃣ Installer et démarrer

```bash
# Installer les dépendances
npm install

# Démarrer le serveur
npm start
```

Vous devriez voir :

```
🚀 SERVER START - MYSQL VERSION

📊 MySQL Configuration:
   Host: localhost:3306
   User: root
   Database: casibio
   💡 Gérer via phpMyAdmin: http://localhost/phpmyadmin

✓ Routes API enregistrées
✓ Base de données MySQL initialisée
✓ Admin initialization complete

📋 COMPTES UTILISATEURS :
══════════════════════════════════════════════════════════════════
  👑 admin                | Email: admin@test.com            | Role: admin
══════════════════════════════════════════════════════════════════

📚 PROJETS :
══════════════════════════════════════════════════════════════════
  (Aucun projet créé)
══════════════════════════════════════════════════════════════════

✓ Server running on port 3000
🌐 Access: http://localhost:3000
🔗 API: http://localhost:3000/api/health
```

### 6️⃣ Tester

```bash
# Health check
curl http://localhost:3000/api/health

# Le navigateur
http://localhost:3000
```

---

## 📊 Gérer les données via phpMyAdmin

### Voir les utilisateurs

1. phpMyAdmin → `casibio` → `users`
2. Voir tous les enregistrements

### Voir les projets

1. phpMyAdmin → `casibio` → `projects`
2. Voir tous les enregistrements

### Exécuter des requêtes SQL

1. phpMyAdmin → **SQL**
2. Écrire une requête :

```sql
SELECT * FROM users;
SELECT COUNT(*) FROM projects;
SELECT * FROM project_files;
```

---

## ❌ Dépannage

### "Error: connect ECONNREFUSED"
👉 MySQL n'est pas démarré
- XAMPP : Cliquer "Start" sur MySQL
- brew : `brew services start mysql`
- Linux : `sudo systemctl start mysql`

### "Error: Unknown database 'casibio'"
👉 Base de données non créée
- PhpMyAdmin → Importer `db/schema.sql`
- Ou exécuter en terminal : `mysql -u root < db/schema.sql`

### "Error: Access denied for user 'root'"
👉 Mot de passe incorrect dans .env
- Vérifier les identifiants MySQL
- Essayer avec mot de passe vide : `DB_PASSWORD=`

### Port 3000 déjà utilisé
```bash
# Trouver le processus
lsof -i :3000

# Tuer le processus
kill -9 <PID>

# Ou utiliser un autre port
PORT=3001 npm start
```

---

## 🔗 Accès

- **Frontend** : http://localhost:3000
- **API Health** : http://localhost:3000/api/health
- **phpMyAdmin** : http://localhost/phpmyadmin
- **Login Admin** : username `admin` / password `admin123`

---

## 📝 Commandes utiles

```bash
# Démarrer
npm start

# Créer l'admin
npm run create-admin

# Installer les dépendances
npm install

# Voir les logs MySQL (Linux)
sudo tail -f /var/log/mysql/mysql.log
```

---

✅ **C'est prêt pour démarrer !** 🎉
