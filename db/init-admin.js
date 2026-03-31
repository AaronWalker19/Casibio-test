const bcrypt = require("bcrypt");
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
    db.get(
      "SELECT * FROM users WHERE username = ? OR email = ?",
      [adminUsername, adminEmail],
      async (err, row) => {
        if (err) {
          console.error("Erreur vérification admin:", err.message);
          return;
        }

        if (row) {
          console.log("✓ Admin existe déjà");
          return;
        }

        // Créer le nouvel admin
        try {
          const passwordHash = await bcrypt.hash(adminPassword, SALT_ROUNDS);

          db.run(
            `INSERT INTO users (username, email, password_hash, role)
             VALUES (?, ?, ?, ?)`,
            [adminUsername, adminEmail, passwordHash, "admin"],
            function (err) {
              if (err) {
                console.error("Erreur création admin:", err.message);
              } else {
                console.log(
                  `✓ Admin créé avec succès\n  Username: ${adminUsername}\n  Email: ${adminEmail}`
                );
              }
            }
          );
        } catch (hashErr) {
          console.error("Erreur hash password:", hashErr.message);
        }
      }
    );
  } catch (error) {
    console.error("Erreur initialization admin:", error.message);
  }
};

module.exports = initializeAdmin;
