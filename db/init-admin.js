const bcrypt = require("bcryptjs");
const db = require("./database");

const SALT_ROUNDS = 10;

/**
 * Initialise le compte admin par défaut s'il n'existe pas
 */
const initializeAdmin = async () => {
  const adminUsername = process.env.ADMIN_USERNAME || "admin";
  const adminEmail = process.env.ADMIN_EMAIL || "admin@test.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123";

  try {
    // Vérifier si l'admin existe déjà
    const existingUser = await db.get(
      "SELECT * FROM users WHERE username = ? OR email = ?",
      adminUsername,
      adminEmail
    );

    if (existingUser) {
      console.log("✓ Admin existe déjà");
      return;
    }

    // Hash le mot de passe
    const passwordHash = await bcrypt.hash(adminPassword, SALT_ROUNDS);

    // Créer l'admin
    const stmt = db.prepare(
      `INSERT INTO users (username, email, password_hash, role)
       VALUES (?, ?, ?, ?)`
    );
    
    await stmt.run(adminUsername, adminEmail, passwordHash, "admin");

    console.log(
      `✓ Admin créé avec succès\n  Username: ${adminUsername}\n  Email: ${adminEmail}\n  Password: ${adminPassword}`
    );
  } catch (error) {
    console.error("Erreur initialization admin:", error.message);
  }
};

module.exports = initializeAdmin;
