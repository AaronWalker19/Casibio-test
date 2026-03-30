const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const dbPath = path.join(__dirname, "database.sqlite");

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Erreur connexion DB:", err.message);
  } else {
    console.log("Connecté à SQLite");
  }
});

// Création des tables
db.serialize(() => {
  // Table des utilisateurs
  db.run(`
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
  db.run(`
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
});

module.exports = db;