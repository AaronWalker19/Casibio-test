const Database = require("better-sqlite3");
const path = require("path");

const dbPath = path.join(__dirname, "database.sqlite");

let db;

try {
  db = new Database(dbPath);
  console.log("Connecté à SQLite");
} catch (err) {
  console.error("Erreur connexion DB:", err.message);
  process.exit(1);
}

// Création des tables
try {
  // Table des utilisateurs
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT DEFAULT 'member',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Table des projets
  db.exec(`
    CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      code_anr TEXT,
      title_fr TEXT,
      title_en TEXT,
      summary_fr TEXT,
      summary_en TEXT,
      methods_fr TEXT,
      methods_en TEXT,
      results_fr TEXT,
      results_en TEXT,
      perspectives_fr TEXT,
      perspectives_en TEXT,
      created_by INTEGER,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (created_by) REFERENCES users(id)
    )
  `);

  // Table séparée pour les fichiers (supports plusieurs fichiers par projet)
  db.exec(`
    CREATE TABLE IF NOT EXISTS project_files (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      project_id INTEGER NOT NULL,
      file_data BLOB,
      file_name TEXT,
      file_display_name TEXT,
      file_type TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(project_id) REFERENCES projects(id) ON DELETE CASCADE
    )
  `);

  // Ajouter les colonnes si elles n'existent pas (pour les BD existantes)
  try {
    db.exec(`ALTER TABLE projects ADD COLUMN file_data BLOB`);
    console.log("file_data ajoutée");
  } catch (err) {
    if (!err.message.includes("duplicate column")) console.log("file_data existe déjà");
  }
  try {
    db.exec(`ALTER TABLE projects ADD COLUMN file_name TEXT`);
    console.log("file_name ajoutée");
  } catch (err) {
    if (!err.message.includes("duplicate column")) console.log("file_name existe déjà");
  }
  try {
    db.exec(`ALTER TABLE projects ADD COLUMN file_type TEXT`);
    console.log("file_type ajoutée");
  } catch (err) {
    if (!err.message.includes("duplicate column")) console.log("file_type existe déjà");
  }
} catch (err) {
  console.error("Erreur création tables:", err.message);
}

module.exports = db;