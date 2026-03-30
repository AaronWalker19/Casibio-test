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
      file_data BLOB,
      file_name TEXT,
      file_type TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Ajouter les colonnes si elles n'existent pas (pour les BD existantes)
  db.run(`ALTER TABLE projects ADD COLUMN file_data BLOB`, (err) => {
    if (err && !err.message.includes("duplicate column")) console.log("file_data ajoutée");
  });
  db.run(`ALTER TABLE projects ADD COLUMN file_name TEXT`, (err) => {
    if (err && !err.message.includes("duplicate column")) console.log("file_name ajoutée");
  });
  db.run(`ALTER TABLE projects ADD COLUMN file_type TEXT`, (err) => {
    if (err && !err.message.includes("duplicate column")) console.log("file_type ajoutée");
  });
});

module.exports = db;