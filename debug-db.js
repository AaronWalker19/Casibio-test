// Script de debug - À exécuter pour vérifier la structure de la base de données
const mysql = require("mysql2/promise");

async function debugDatabase() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "",
      database: process.env.DB_NAME || "casibio_data"
    });

    // Vérifier la structure de la table users
    console.log("\n========== STRUCTURE TABLE USERS ==========");
    const [usersColumns] = await connection.execute("DESC users");
    console.table(usersColumns);

    // Vérifier la structure de la table password_resets
    console.log("\n========== STRUCTURE TABLE PASSWORD_RESETS ==========");
    try {
      const [resetColumns] = await connection.execute("DESC password_resets");
      console.table(resetColumns);
    } catch (err) {
      console.error("❌ Table password_resets n'existe pas:", err.message);
    }

    // Vérifier les utilisateurs
    console.log("\n========== UTILISATEURS ==========");
    const [users] = await connection.execute("SELECT id, email, username, password_hash FROM users LIMIT 5");
    console.table(users);

    // Vérifier les tokens
    console.log("\n========== TOKENS DE RÉINITIALISATION ==========");
    try {
      const [tokens] = await connection.execute("SELECT id, user_id, email, expires_at, reset_at FROM password_resets ORDER BY created_at DESC LIMIT 5");
      console.table(tokens);
    } catch (err) {
      console.error("❌ Erreur lors de la requête:", err.message);
    }

    await connection.end();
  } catch (err) {
    console.error("❌ Erreur de debug:", err);
  }
}

debugDatabase();
