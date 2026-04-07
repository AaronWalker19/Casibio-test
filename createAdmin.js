const db = require('./db/database');
const bcrypt = require('bcryptjs');

const SALT_ROUNDS = 10;

const createAdmin = async () => {
  try {
    // Initialise la base de données
    await db.init();
    console.log('✓ Base de données initialisée');

    const username = process.env.ADMIN_USERNAME || 'admin';
    const email = process.env.ADMIN_EMAIL || 'admin@test.com';
    const password = process.env.ADMIN_PASSWORD || 'admin123';

    // Vérifier si l'admin existe déjà
    const existingUser = await db.get(
      'SELECT * FROM users WHERE username = ? OR email = ?',
      username,
      email
    );

    if (existingUser) {
      console.log('✓ Admin existe déjà');
      process.exit(0);
    }

    // Hash le mot de passe
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    // Créer l'admin
    const stmt = db.prepare(
      `INSERT INTO users (username, email, password_hash, role)
       VALUES (?, ?, ?, ?)`
    );
    
    await stmt.run(username, email, passwordHash, 'admin');

    console.log('\n✓✓✓ COMPTE ADMIN CRÉÉ AVEC SUCCÈS ✓✓✓');
    console.log(`  Username: ${username}`);
    console.log(`  Email: ${email}`);
    console.log(`  Password: ${password}`);
    console.log('');

    process.exit(0);
  } catch (err) {
    console.error('❌ Erreur:', err.message);
    process.exit(1);
  }
};

createAdmin();