# ✅ CONFIGURATION DE DÉPLOIEMENT - CasiBio

## 📋 Résumé des problèmes résolus

### 1. **Erreur 404 lors du login** 
**Cause:** L'API backend n'était pas accessible ou incorrectement déployée sur AlwaysData.

**Solution:** 
- Fixed the database layer to use `sqlite3` with Promise wrappers for consistency
- Ensured the backend API endpoints are properly accessible

### 2. **Incohérence sqlite3 vs better-sqlite3**
**Cause:** Le code mélangeait deux libraires SQLite différentes.

**Solution:**
- Unified all database access to use `sqlite3` with custom Promise wrappers
- Updated `database.js` to wrap async operations properly
- Updated all routes (`auth.js`, `projects.js`) to await Promise-based DB calls

### 3. **Incompatibilité Express 5.x**
**Cause:** Express version 5.2.1 nécessite une syntaxe différente pour les routes catch-all.

**Solution:**
- Changed from `app.get("*", ...)` to `app.use((req, res) => ...)`

---

## 🔐 Compte Admin Créé

**Identifiants de connexion:**
- **Username:** `admin`
- **Email:** `admin@test.com`  
- **Password:** `admin123`

*Note: Ces identifiants sont les valeurs par défaut. Ils peuvent être personnalisés via les variables d'environnement:*
- `ADMIN_USERNAME`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`

---

## 📦 Scripts npm disponibles

```bash
# Démarrer le serveur
npm start

# Créer un compte admin
npm run create-admin
```

---

## 🚀 Déploiement sur AlwaysData

### Étapes de déploiement:

1. **Upload les fichiers via FileZilla:**
   - Tout le contenu du projet (excepté `node_modules`)
   - Incluez le fichier `.env` si vous utiliser des variables custom

2. **Configuration du serveur Node sur AlwaysData:**
   - Accédez au panneau de contrôle AlwaysData
   - Créez une application Node.js
   - Définissez le point d'entrée comme `server.js`
   - Définissez le port (normalement 3000 ou celui fourni par AlwaysData)

3. **Variables d'environnement (optionnel):**
   ```
   PORT=xxxxx (fourni par AlwaysData)
   ADMIN_USERNAME=admin
   ADMIN_EMAIL=admin@test.com
   ADMIN_PASSWORD=admin123
   ```

4. **Vérification:**
   - L'API devrait être accessible sur `https://casibio.alwaysdata.net/api/health`
   - Le login devrait fonctionner sur `https://casibio.alwaysdata.net/api/auth/login`
   - L'interface React devrait être accessible sur `https://casibio.alwaysdata.net`

---

## ✅ Vérification locale

Pour tester localement avant de redéployer:

```bash
# Terminal 1: Démarrer le serveur
npm start

# Terminal 2: Tester l'API (exemple avec curl)
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

Expected response:
```json
{
  "message": "Connexion réussie",
  "token": "eyJhbGc...",
  "user": {
    "id": 1,
    "username": "admin",
    "email": "admin@test.com",
    "role": "admin"
  }
}
```

---

## 📝 Fichiers modifiés

- ✅ `package.json` - Ajout du script `create-admin`
- ✅ `db/database.js` - Réécriture avec Promises
- ✅ `db/init-admin.js` - Correction pour utiliser les Promises
- ✅ `createAdmin.js` - Nouvel script pour créer admin facilement
- ✅ `routes/auth.js` - Ajout des await pour les appels DB
- ✅ `routes/projects.js` - Ajout des await pour les appels DB
- ✅ `server.js` - Correction de la syntaxe Express 5.x

---

## 🔗 URLs importantes

**Local:** http://localhost:3000  
**Production:** https://casibio.alwaysdata.net  
**API:** https://casibio.alwaysdata.net/api/

### Endpoints API

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| POST | `/api/auth/login` | Connexion utilisateur |
| POST | `/api/auth/register` | Création de compte |
| GET | `/api/auth/me` | Info utilisateur courant |
| GET | `/api/health` | Vérifier que l'API répond |

---

*Configuration mise à jour: 7 avril 2026*