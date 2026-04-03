const sqlite3 = require("sqlite3").verbose();
const path = require("path");

// Chemin vers la base de données SQLite
const dbPath = path.join(__dirname, "../casibio.db");

let db = null;

/**
 * Initialise la connexion à la base de données SQLite
 */
function initializeDB() {
  return new Promise((resolve, reject) => {
    db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error("Erreur connexion DB:", err.message);
        reject(err);
      } else {
        console.log("✓ Database connectée:", dbPath);

        // Créer les tables si elles n'existent pas
        db.serialize(() => {
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

          db.run(`
            CREATE TABLE IF NOT EXISTS projects (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              name TEXT NOT NULL,
              description TEXT,
              created_by INTEGER,
              created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
              updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
              FOREIGN KEY (created_by) REFERENCES users(id)
            )
          `);

          db.run(`
            CREATE TABLE IF NOT EXISTS project_files (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              project_id INTEGER NOT NULL,
              filename TEXT NOT NULL,
              filepath TEXT NOT NULL,
              file_size INTEGER,
              uploaded_by INTEGER,
              deleted BOOLEAN DEFAULT 0,
              created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
              FOREIGN KEY (project_id) REFERENCES projects(id),
              FOREIGN KEY (uploaded_by) REFERENCES users(id)
            )
          `, (err) => {
            if (err) {
              console.error("Erreur création tables:", err.message);
              reject(err);
            } else {
              console.log("✓ Tables créées/vérifiées");
              resolve();
            }
          });
        });
      }
    });
  });
}

/**
 * Wrapper Promise pour db.run()
 */
function dbRun(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) reject(err);
      else resolve({ lastID: this.lastID, changes: this.changes });
    });
  });
}

/**
 * Wrapper Promise pour db.get()
 */
function dbGet(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row || null);
    });
  });
}

/**
 * Wrapper Promise pour db.all()
 */
function dbAll(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows || []);
    });
  });
}

/**
 * Retourne les méthodes de la base de données
 */
module.exports = {
  init: initializeDB,
  
  prepare: (sql) => {
    return {
      run: (...params) => dbRun(sql, params),
      get: (...params) => dbGet(sql, params),
      all: (...params) => dbAll(sql, params)
    };
  },

  get: (sql, ...params) => dbGet(sql, params),

  all: (sql, ...params) => dbAll(sql, params),

  run: (sql, ...params) => dbRun(sql, params),

  exec: (sql) => {
    return new Promise((resolve, reject) => {
      db.exec(sql, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  },

  getDb: () => db
};