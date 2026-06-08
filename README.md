# CASiBIO - Assemblage Complet du Projet

Application web complète pour la gestion de contenu, d'articles et de galeries avec authentification utilisateur et paiement.

---

## 📋 Table des matières

- [Stack Technologique](#-stack-technologique)
- [Frontend](#-frontend)
- [Backend](#-backend)
- [Infrastructure & DevOps](#-infrastructure--devops)
- [Installation](#-installation)
- [Utilisation](#-utilisation)
- [Architecture](#-architecture)

---

## 🏗️ Stack Technologique

### Vue d'ensemble

| Catégorie | Technologies |
|-----------|--------------|
| **Frontend** | React 19, TypeScript, React Router |
| **Backend** | Node.js, Express.js |
| **Base de données** | MySQL |
| **Authentification** | JWT, Bcryptjs |
| **Styling** | Tailwind CSS, PostCSS |
| **UI Components** | Radix UI, Shadcn/ui |
| **Formulaires** | React Hook Form, Zod |
| **Éditeur texte** | Tiptap |
| **Emails** | Nodemailer |
| **Upload de fichiers** | Multer |
| **Graphiques** | Recharts |
| **PDF** | PDFKit |
| **Compression** | Archiver |
| **Sécurité** | Helmet, Express Rate Limit |
| **Containerization** | Docker |

---

## 🎨 Frontend

### Technologies principales

- **React** `^19.2.4` - Bibliothèque JavaScript pour construire des interfaces utilisateur
- **TypeScript** `^4.9.5` - Superset typé de JavaScript
- **React Router** `^7.1.0` - Routeur côté client
- **Tailwind CSS** `^3.4.19` - Framework CSS utility-first
- **PostCSS** `^8.5.8` - Outil de transformation CSS

### Composants UI et Formulaires

- **Radix UI** - Composants headless et non stylisés
  - `@radix-ui/react-accordion` - Accordéons
  - `@radix-ui/react-alert-dialog` - Dialogues d'alerte
  - `@radix-ui/react-avatar` - Avatars utilisateur
  - `@radix-ui/react-checkbox` - Cases à cocher
  - `@radix-ui/react-dialog` - Dialogues modaux
  - `@radix-ui/react-dropdown-menu` - Menus déroulants
  - `@radix-ui/react-tabs` - Onglets
  - `@radix-ui/react-tooltip` - Infobulles
  - Et 15+ autres composants Radix UI

- **React Hook Form** `^7.72.1` - Gestion des formulaires avec hooks
- **@hookform/resolvers** `^5.2.2` - Intégration avec validateurs
- **Zod** `^4.3.6` - Validation de schémas TypeScript-first

### Éditeur et Contenu

- **@tiptap/react** `^3.22.3` - Éditeur WYSIWYG riche
- **@tiptap/starter-kit** `^3.22.3` - Extension de base pour Tiptap
- **@tiptap/extension-text-align** `^3.22.3` - Alignement du texte
- **Recharts** `^3.8.1` - Graphiques réactifs

### Utilitaires et Autres

- **React Router DOM** - Navigation côté client
- **Lucide React** `^1.8.0` - Icônes SVG
- **Clsx** `^2.1.1` - Gestion conditionnelle des classes CSS
- **Tailwind Merge** `^3.5.0` - Fusion intelligente des classes Tailwind
- **Embla Carousel** `^8.6.0` - Carrousel/slider
- **React Day Picker** `^9.14.0` - Sélecteur de date
- **Sonner** `^2.0.7` - Notifications toast
- **Vaul** `^1.1.2` - Drawer/tiroir
- **Input OTP** `^1.4.2` - Entrée OTP
- **cmdk** `^1.1.1` - Palette de commandes
- **Class Variance Authority** `^0.7.1` - Gestion des variantes CSS
- **React Resizable Panels** `^4.10.0` - Panneaux redimensionnables

### Scripts

```json
{
  "start": "react-scripts start",
  "build": "react-scripts build",
  "test": "react-scripts test",
  "eject": "react-scripts eject"
}
```

---

## 🖥️ Backend

### Serveur et Framework

- **Node.js** - Runtime JavaScript côté serveur
- **Express.js** `^5.2.1` - Framework web minimaliste et flexible

### Base de données

- **MySQL** `^3.6.5` - Système de gestion de base de données relationnelle
- **Schema SQL** - Structure définie dans `db/schema.sql`

### Authentification & Sécurité

- **jsonwebtoken** `^9.0.3` - Génération et vérification de JWT
- **bcryptjs** `^3.0.3` - Hachage sécurisé des mots de passe
- **helmet** `^7.1.0` - Headers de sécurité HTTP
- **express-rate-limit** `^7.1.5` - Limitation du débit des requêtes
- **express-validator** `^7.0.0` - Validation des entrées
- **sanitize-html** `^2.17.2` - Nettoyage du HTML pour prévenir les XSS
- **strip-html** `^1.0.2` - Suppression des tags HTML

### Middleware & Utilitaires

- **cors** `^2.8.6` - Gestion du partage des ressources cross-origin
- **cookie-parser** `^1.4.7` - Parsing des cookies
- **dotenv** `^16.3.1` - Variables d'environnement
- **multer** `^2.1.1` - Gestion des uploads de fichiers
- **form-data** `^4.0.5` - Construction de formulaires multipart

### Emails & Fichiers

- **nodemailer** `^8.0.5` - Envoi d'emails SMTP
- **pdfkit** `^0.18.0` - Génération de PDF
- **archiver** `^7.0.1` - Création d'archives (ZIP, TAR, etc.)
- **node-fetch** `^2.7.0` - Requêtes HTTP côté serveur

### Scripts d'Administration

```json
{
  "start": "node server.js",
  "setup-db": "node setup-db.js",
  "create-admin": "node createAdmin.js",
  "init-db": "node init-database.js",
  "check-db": "node check-db.js",
  "quick-start": "node QUICK_START.js",
  "test-api": "node test-api.js http://localhost:3000",
  "test-api-prod": "node test-api.js https://casibio.alwaysdata.net"
}
```

### Structure du Backend

```
├── server.js                  # Point d'entrée du serveur
├── setup-db.js               # Configuration initiale de la BD
├── createAdmin.js            # Script de création d'administrateur
├── db/
│   ├── database.js           # Configuration MySQL
│   ├── schema.sql            # Schéma de la base de données
│   └── migrations/           # Scripts de migration
├── middleware/
│   ├── auth.js               # Middleware d'authentification JWT
│   └── security.js           # Middleware de sécurité
├── routes/
│   ├── auth.js               # Routes d'authentification
│   └── projects.js           # Routes des projets
├── services/
│   └── emailService.js       # Service d'envoi d'emails
└── uploads/                  # Dossier d'uploads de fichiers
```

---

## 🚀 Infrastructure & DevOps

### Containerization

- **Docker** - Conteneurisation de l'application
  - **Image de base:** Node.js 18
  - **Port exposé:** 8080
  - **Build:** Multistage avec React pre-build

### Dockerfile

```dockerfile
FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 8080
CMD ["node", "server.js"]
```

### Configuration

- **Fichiers d'environnement:** `.env` pour les variables d'environnement
- **Déploiement:** Compatible avec alwaysdata.net et autres plateformes

---

## 📦 Installation

### Prérequis

- Node.js 18+
- npm ou yarn
- MySQL 5.7+
- Docker (optionnel)

### Installation locale

#### 1. Cloner le projet

```bash
git clone <repository-url>
cd test\ d\'assemblage
```

#### 2. Installation du serveur

```bash
npm install
npm run setup-db
npm run create-admin
```

#### 3. Installation du client

```bash
cd client
npm install
npm run build
cd ..
```

#### 4. Configuration d'environnement

Créez un fichier `.env` à la racine:

```env
NODE_ENV=development
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=casibio
JWT_SECRET=your_jwt_secret
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email
SMTP_PASSWORD=your_password
```

#### 5. Démarrage

```bash
npm start
```

### Avec Docker

```bash
docker build -t casibio .
docker run -p 8080:8080 casibio
```

---

## 🔧 Utilisation

### Scripts disponibles

#### Serveur

```bash
# Démarrer le serveur
npm start

# Configuration de la base de données
npm run setup-db

# Créer un administrateur
npm run create-admin

# Tester l'API (local)
npm run test-api

# Tester l'API (production)
npm run test-api-prod
```

#### Client

```bash
# Démarrage en développement
cd client && npm start

# Build de production
cd client && npm run build

# Tests
cd client && npm test
```

---

## 🏛️ Architecture

### Architecture générale

```
┌─────────────────────────────────────────┐
│         Frontend (React + TS)            │
│  ├── Pages (Articles, Galeries, etc.)   │
│  ├── Composants UI (Radix UI)           │
│  ├── Éditeur de texte (Tiptap)          │
│  └── Gestion d'état (Context API)       │
└─────────────────────────────────────────┘
                    ↓
           (REST API via Express)
                    ↓
┌─────────────────────────────────────────┐
│      Backend (Node.js + Express)        │
│  ├── Routes d'authentification (JWT)    │
│  ├── Gestion des uploads (Multer)       │
│  ├── Génération de PDF (PDFKit)         │
│  ├── Envoi d'emails (Nodemailer)        │
│  └── Rate limiting (express-rate-limit) │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│     Base de données (MySQL)              │
│  ├── Utilisateurs & Authentification    │
│  ├── Articles & Galeries                │
│  ├── Projets & Contenu                  │
│  └── Logs & Audit                       │
└─────────────────────────────────────────┘
```

### Flux d'authentification

1. Utilisateur se connecte → React Hook Form
2. Envoi des identifiants au backend → Express
3. Vérification avec bcryptjs → MySQL
4. Génération JWT → jsonwebtoken
5. Stockage du token → Cookies sécurisés
6. Requêtes authentifiées → Middleware JWT

### Sécurité

- **CSP Headers** - Politique de sécurité du contenu (Helmet)
- **Rate Limiting** - Protection contre les attaques par force brute
- **CORS** - Contrôle d'accès cross-origin
- **Validation des entrées** - Express Validator + Zod
- **Sanitisation HTML** - Prévention des injections XSS
- **Hashage des mots de passe** - Bcryptjs avec salt

---

## 📝 Variables d'environnement

```env
# Serveur
NODE_ENV=production|development
PORT=3000
HOST=0.0.0.0

# Base de données
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=password
DB_NAME=casibio

# Authentification
JWT_SECRET=your_secret_key
JWT_EXPIRY=7d

# Email (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password
SMTP_FROM=noreply@casibio.com

# Fichiers
UPLOAD_DIR=/uploads
MAX_FILE_SIZE=10485760

# CORS
CORS_ORIGIN=http://localhost:3000

# API
API_URL=http://localhost:3000
```

---

## 📊 Structure de la Base de Données

- **users** - Comptes utilisateurs et authentification
- **articles** - Articles de contenu
- **galleries** - Galeries d'images
- **projects** - Projets
- **files** - Gestion des fichiers uploadés
- **logs** - Journalisation des actions

---

## 🔗 Ressources

- [Express.js Documentation](https://expressjs.com/)
- [React Documentation](https://react.dev/)
- [MySQL Documentation](https://dev.mysql.com/doc/)
- [Radix UI](https://www.radix-ui.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Tiptap Editor](https://tiptap.dev/)
- [Docker Documentation](https://docs.docker.com/)

---

## 📄 Licence

ISC

---

**Dernier mise à jour:** Juin 2026
