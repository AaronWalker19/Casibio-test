const Database = require('better-sqlite3');
const bcrypt = require('bcrypt');
const path = require('path');

const dbPath = path.join(__dirname, 'db', 'database.sqlite');
const db = new Database(dbPath);

console.log('Connecté à SQLite');

const createAdmin = async () => {
  try {
    // Créer la table des utilisateurs
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
    console.log('Table créée');

    const username = 'testuser';
    const email = 'admin@example.com';
    const password = 'AdminPassword123';
    const hashedPassword = await bcrypt.hash(password, 10);

    const stmt = db.prepare(
      `INSERT INTO users (username, email, password_hash, role) VALUES (?, ?, ?, ?)`
    );
    stmt.run(username, email, hashedPassword, 'admin');

    console.log(`✓ Compte admin créé: ${username} / ${email}`);
    db.close();
  } catch (err) {
    console.error('Erreur:', err.message);
    db.close();
    process.exit(1);
  }
};

createAdmin();