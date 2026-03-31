const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');

const db = new sqlite3.Database('./database.db', (err) => {
  if (err) {
    console.error(err.message);
  } else {
    console.log('Connected to SQLite');
  }
});

const createAdmin = async () => {
  db.run(
    `CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT DEFAULT 'member',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`,
    async (err) => {
      if (err) {
        console.error('Erreur création table:', err.message);
        db.close();
        return;
      }
      console.log('Table créée');

      const username = 'testuser';
      const email = 'admin@example.com';
      const password = 'AdminPassword123';
      const hashedPassword = await bcrypt.hash(password, 10);

      db.run(
        `INSERT INTO users (username, email, password_hash, role) VALUES (?, ?, ?, ?)`,
        [username, email, hashedPassword, 'admin'],
        (err) => {
          if (err) {
            console.error('Erreur insertion:', err.message);
          } else {
            console.log(`✓ Compte admin créé: ${username} / ${email}`);
          }
          db.close();
        }
      );
    }
  );
};

createAdmin();