const mysql = require("mysql2/promise");
require("dotenv").config();

/**
 * Script d'installation de la base de données MySQL
 * Crée automatiquement la base de données et les tables
 */

const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  port: process.env.DB_PORT || 3306
};

const dbName = process.env.DB_NAME || "casibio";

async function setupDatabase() {
  let connection;

  try {
    console.log("🔧 Installation CASiBIO - Base de données MySQL\n");
    console.log(`📊 Configuration:`);
    console.log(`   Host: ${dbConfig.host}:${dbConfig.port}`);
    console.log(`   User: ${dbConfig.user}`);
    console.log(`   Base: ${dbName}\n`);

    // Connexion sans spécifier la base de données
    console.log("⏳ Connexion à MySQL...");
    connection = await mysql.createConnection(dbConfig);
    console.log("✓ Connexion réussie\n");

    // Créer la base de données
    console.log(`⏳ Création de la base de données '${dbName}'...`);
    await connection.query(
      `CREATE DATABASE IF NOT EXISTS ${dbName} 
       CHARACTER SET utf8mb4 
       COLLATE utf8mb4_unicode_ci`
    );
    console.log(`✓ Base de données '${dbName}' créée\n`);

    // Cliquer sur la base
    await connection.query(`USE ${dbName}`);

    // Créer les tables
    console.log("⏳ Création des tables...\n");

    // Table users
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(100) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role ENUM('admin', 'member') DEFAULT 'member',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_username (username),
        INDEX idx_email (email)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log("  ✓ Table 'users' créée");

    // Table projects
    await connection.query(`
      CREATE TABLE IF NOT EXISTS projects (
        id INT AUTO_INCREMENT PRIMARY KEY,
        code_anr VARCHAR(100),
        title_fr VARCHAR(255),
        title_en VARCHAR(255),
        summary_fr TEXT,
        summary_en TEXT,
        methods_fr TEXT,
        methods_en TEXT,
        results_fr TEXT,
        results_en TEXT,
        perspectives_fr TEXT,
        perspectives_en TEXT,
        created_by INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
        INDEX idx_code_anr (code_anr),
        INDEX idx_created_by (created_by),
        INDEX idx_created_at (created_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log("  ✓ Table 'projects' créée");

    // Table project_files
    await connection.query(`
      CREATE TABLE IF NOT EXISTS project_files (
        id INT AUTO_INCREMENT PRIMARY KEY,
        project_id INT NOT NULL,
        file_path VARCHAR(500),
        file_name VARCHAR(255),
        file_display_name VARCHAR(255),
        file_type VARCHAR(100),
        file_desc VARCHAR(150),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
        INDEX idx_project_id (project_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log("  ✓ Table 'project_files' créée\n");

    console.log("═".repeat(60));
    console.log("✅ Installation réussie !\n");
    console.log("📋 Prochaines étapes:");
    console.log("   1. npm install");
    console.log("   2. npm start\n");
    console.log("🌐 Accès:");
    console.log("   - Frontend: http://localhost:3000");
    console.log("   - phpMyAdmin: http://localhost/phpmyadmin\n");
    console.log("👤 Identifiant admin:");
    console.log("   - Username: admin");
    console.log("   - Password: admin123\n");
    console.log("═".repeat(60));

    await connection.end();
    process.exit(0);

  } catch (err) {
    console.error("\n❌ Erreur lors de l'installation:");
    console.error(`   ${err.message}\n`);

    if (err.code === "ER_ACCESS_DENIED_ERROR") {
      console.log("💡 Conseil: Vérifiez les identifiants MySQL dans .env");
      console.log("   - DB_HOST: " + dbConfig.host);
      console.log("   - DB_USER: " + dbConfig.user);
      console.log("   - DB_PASSWORD: " + (dbConfig.password ? "***" : "(vide)"));
    } else if (err.code === "ECONNREFUSED") {
      console.log("💡 Conseil: MySQL n'est pas démarré");
      console.log("   - Windows XAMPP: Démarrer MySQL dans le Control Panel");
      console.log("   - macOS: brew services start mysql");
      console.log("   - Linux: sudo systemctl start mysql");
    } else if (err.code === "ENOTFOUND") {
      console.log("💡 Conseil: Hôte MySQL introuvable (" + dbConfig.host + ")");
    }

    process.exit(1);
  }
}

setupDatabase();
