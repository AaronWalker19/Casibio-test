# 🐬 Configuration MySQL pour CASiBIO

## ✅ Prérequis

- MySQL 5.7+ ou MariaDB 10.2+
- Node.js v14+
- npm

---

## 📋 Étapes d'installation

### 1️⃣ Installer MySQL localement (si pas déjà fait)

**Windows (XAMPP):**
```bash
# Télécharger et installer XAMPP de xampp.com
# Lancer Apache + MySQL depuis le Control Panel
```

**macOS (Homebrew):**
```bash
brew install mysql
brew services start mysql
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt-get install mysql-server
sudo systemctl start mysql
```

### 2️⃣ Créer l'utilisateur MySQL

```bash
# Se connecter à MySQL
mysql -u root -p

# Dans le shell MySQL :
CREATE DATABASE casibio CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'casibio_user'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON casibio.* TO 'casibio_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### 3️⃣ Créer les tables

```bash
# Option A : Via SSH/Terminal
mysql -u casibio_user -p casibio < db/schema.sql

# Option B : Via phpMyAdmin
# 1. Ouvrir phpMyAdmin (http://localhost/phpmyadmin)
# 2. Sélectionner la base 'casibio'
# 3. Copier-coller le contenu de db/schema.sql dans l'onglet SQL
# 4. Cliquer Exécuter
```

### 4️⃣ Configurer les variables d'environnement

Créez un fichier `.env` à la racine du projet :

```env
# MySQL Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=casibio_user
DB_PASSWORD=your_password
DB_NAME=casibio

# Server
PORT=3000
```

### 5️⃣ Installer les dépendances Node.js

```bash
npm install
```

### 6️⃣ Démarrer le serveur

```bash
npm start
```

Vous devriez voir :
```
🚀 SERVER START - MySQL Version
📊 MySQL Config: casibio_user@localhost:3306/casibio
✓ Pool MySQL créé
✓ Connexion à MySQL réussie
✓ Tables créées/vérifiées
✓ Base de données MySQL initialisée
✓ Admin initialization complete

📋 COMPTES UTILISATEURS :
════════════════════════════════════════════════════════════
  👤 admin                | Email: admin@test.com            | Rôle: admin
════════════════════════════════════════════════════════════

📚 PROJETS :
════════════════════════════════════════════════════════════
  (Aucun projet créé)
════════════════════════════════════════════════════════════

✓ Server running on port 3000
🌐 Access: http://localhost:3000
```

---

## 🧪 Tester la connexion

```bash
# Health check
curl http://localhost:3000/api/health

# Doit afficher :
# {"status":"OK","database":"MySQL"}
```

---

## 📍 Configuration pour AlwaysData

### Variables d'environnement sur AlwaysData

```env
DB_HOST=mysql-casibio.alwaysdata.net
DB_PORT=3306
DB_USER=votre_login
DB_PASSWORD=votre_mot_de_passe
DB_NAME=votre_login_casibio
PORT=3000
```

### Créer les tables sur AlwaysData

1. Via **Web Access** (phpMyAdmin) :
   - Accéder à votre panneau AlwaysData
   - Ouvrir Web Access → phpMyAdmin
   - Importer `db/schema.sql`

2. Via **SSH/Terminal** :
   ```bash
   mysql -u votre_user -p votre_base < db/schema.sql
   ```

---

## ❌ Dépannage

### Erreur: "ECONNREFUSED"
**Cause:** MySQL n'est pas démarré ou mauvaise configuration  
**Solution:**
```bash
# Redémarrer MySQL
brew services restart mysql      # macOS
sudo systemctl restart mysql      # Linux
# XAMPP Control Panel → Start MySQL (Windows)

# Vérifier la connexion
mysql -u root -p
```

### Erreur: "Access denied for user"
**Cause:** Mauvais identifiant/mot de passe  
**Solution:**
```bash
# Vérifier le .env
# Réinitialiser le mot de passe MySQL
mysql -u root -p
SET PASSWORD FOR 'casibio_user'@'localhost' = PASSWORD('new_password');
FLUSH PRIVILEGES;
```

### Erreur: "Unknown database 'casibio'"
**Cause:** Base de données non créée  
**Solution:**
```bash
mysql -u root -p
CREATE DATABASE casibio CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### Erreur: "Tables already exist"
**Cause:** Les tables existent déjà (pas une erreur)  
**Solution:** C'est normal, le serveur continue de fonctionner

---

## 🔄 Migrer de SQLite3 à MySQL

Si vous aviez une base SQLite3 :

```bash
# 1. Exporter les données SQLite
sqlite3 casibio.db ".dump" > backup.sql

# 2. Adapter les données pour MySQL
# 3. Importer dans MySQL
mysql -u casibio_user -p casibio < backup.sql

# 4. Vérifier les données
mysql -u casibio_user -p casibio
SELECT * FROM users;
SELECT * FROM projects;
```

---

## 📚 Ressources

- [MySQL Documentation](https://dev.mysql.com/doc/)
- [mysql2 Documentation](https://github.com/sidorares/node-mysql2)
- [XAMPP](https://www.apachefriends.org/)
- [AlwaysData MySQL](https://www.alwaysdata.com/fr/databases/mysql/)
