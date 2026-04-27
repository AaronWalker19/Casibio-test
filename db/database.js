const mysql = require("mysql2/promise");

// Configuration MySQL
const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "casibio",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelayMs: 0
};

let pool = null;

/**
 * Initialise le pool de connexions MySQL
 */
async function initializeDB() {
  try {
    pool = mysql.createPool(dbConfig);
    console.log("✓ Pool MySQL créé");

    // Tester la connexion
    const connection = await pool.getConnection();
    await connection.ping();
    connection.release();
    console.log("✓ Connexion à MySQL réussie");

    // Créer les tables
    await createTables();
  } catch (err) {
    console.error("❌ Erreur connexion MySQL:", err.message);
    throw err;
  }
}

/**
 * Crée les tables si elles n'existent pas
 */
async function createTables() {
  if (!pool) return;

  const connection = await pool.getConnection();

  try {
    // Table users
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(100) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password_hash VARCHAR(255),
        name VARCHAR(255),
        role ENUM('admin', 'member') DEFAULT 'member',
        is_active BOOLEAN DEFAULT FALSE COMMENT 'Compte activé ou non',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        activated_at TIMESTAMP NULL COMMENT 'Date d\'activation du compte'
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    
    // Ajouter la colonne name si elle n'existe pas (pour les bases existantes)
    try {
      await connection.execute(`ALTER TABLE users ADD COLUMN name VARCHAR(255)`);
    } catch (err) {
      // La colonne existe déjà, c'est normal
      if (err.code !== 'ER_DUP_FIELDNAME') throw err;
    }

    // Ajouter la colonne is_active si elle n'existe pas
    try {
      await connection.execute(`ALTER TABLE users ADD COLUMN is_active BOOLEAN DEFAULT FALSE`);
    } catch (err) {
      if (err.code !== 'ER_DUP_FIELDNAME') throw err;
    }

    // Ajouter la colonne activated_at si elle n'existe pas
    try {
      await connection.execute(`ALTER TABLE users ADD COLUMN activated_at TIMESTAMP NULL`);
    } catch (err) {
      if (err.code !== 'ER_DUP_FIELDNAME') throw err;
    }

    // Table projects
    await connection.execute(`
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
        INDEX idx_created_by (created_by)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // Table project_files
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS project_files (
        id INT AUTO_INCREMENT PRIMARY KEY,
        project_id INT NOT NULL,
        file_path VARCHAR(500),
        file_name VARCHAR(255),
        file_display_name VARCHAR(255),
        file_type VARCHAR(100),
        file_desc_fr VARCHAR(150),
        file_desc_en VARCHAR(150),
        is_present_image BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
        INDEX idx_project_id (project_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // Table project_contents - Contenus/sections d'un projet
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS project_contents (
        id INT AUTO_INCREMENT PRIMARY KEY,
        project_id INT NOT NULL,
        title_fr VARCHAR(255),
        title_en VARCHAR(255),
        content_fr LONGTEXT,
        content_en LONGTEXT,
        position INT DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
        INDEX idx_project_id (project_id),
        INDEX idx_position (position)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // Table user_participation - Historique des participants d'un projet
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS user_participation (
        id INT AUTO_INCREMENT PRIMARY KEY,
        project_id INT NOT NULL,
        user_id INT NOT NULL,
        added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_project_id (project_id),
        INDEX idx_user_id (user_id),
        INDEX idx_added_at (added_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log("✓ Table 'user_participation' créée/vérifiée");

    // Table user_invitations - Tokens d'invitation pour activation de compte
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS user_invitations (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(100) NOT NULL COMMENT 'Email de la personne invitée',
        token_hash VARCHAR(255) COMMENT 'Hash du token pour la BD',
        invited_by INT COMMENT 'ID de l\'admin qui a envoyé l\'invitation',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Date d\'envoi de l\'invitation',
        expires_at TIMESTAMP NOT NULL COMMENT 'Date d\'expiration du token',
        activated_at TIMESTAMP NULL COMMENT 'Date d\'activation (NULL si pas encore activé)',
        INDEX idx_email (email),
        INDEX idx_token_hash (token_hash),
        INDEX idx_expires_at (expires_at),
        FOREIGN KEY (invited_by) REFERENCES users(id) ON DELETE SET NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log("✓ Table 'user_invitations' créée/vérifiée");

    // Table password_resets - Tokens de réinitialisation de mot de passe
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS password_resets (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL COMMENT 'ID de l\'utilisateur',
        email VARCHAR(100) NOT NULL COMMENT 'Email de l\'utilisateur',
        token_hash VARCHAR(255) COMMENT 'Hash du token pour la sécurité',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Date de création',
        expires_at TIMESTAMP NOT NULL COMMENT 'Date d\'expiration du token',
        reset_at TIMESTAMP NULL COMMENT 'Date de réinitialisation (NULL si pas utilisé)',
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_email (email),
        INDEX idx_token_hash (token_hash),
        INDEX idx_expires_at (expires_at),
        INDEX idx_user_id (user_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    console.log("✓ Table 'password_resets' créée/vérifiée");

    // Ajouter la colonne file_desc_fr si elle n'existe pas (migration)
    try {
      const [columns] = await connection.execute(
        `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS 
         WHERE TABLE_SCHEMA = DATABASE() 
         AND TABLE_NAME = 'project_files' 
         AND COLUMN_NAME = 'file_desc'`
      );
      
      if (columns.length === 0) {
        // La colonne n'existe pas, on la crée
        await connection.execute(
          "ALTER TABLE project_files ADD COLUMN file_desc_fr VARCHAR(150) AFTER file_type"
        );
        console.log("✓ Colonne 'file_desc_fr' ajoutée à la table 'project_files'");
      }
    } catch (err) {
      console.warn("⚠️ Impossible de vérifier/ajouter la colonne file_desc_fr:", err.message);
    }

    // Ajouter la colonne file_desc_en si elle n'existe pas
    try {
      const [columns] = await connection.execute(
        `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS 
         WHERE TABLE_SCHEMA = DATABASE() 
         AND TABLE_NAME = 'project_files' 
         AND COLUMN_NAME = 'file_desc_en'`
      );
      
      if (columns.length === 0) {
        // La colonne n'existe pas, on la crée
        await connection.execute(
          "ALTER TABLE project_files ADD COLUMN file_desc_en VARCHAR(150) AFTER file_desc_fr"
        );
        console.log("✓ Colonne 'file_desc_en' ajoutée à la table 'project_files'");
      }
    } catch (err) {
      console.warn("⚠️ Impossible de vérifier/ajouter la colonne file_desc_en:", err.message);
    }

    // Ajouter la colonne is_present_image si elle n'existe pas (migration)
    try {
      const [columns] = await connection.execute(
        `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS 
         WHERE TABLE_SCHEMA = DATABASE() 
         AND TABLE_NAME = 'project_files' 
         AND COLUMN_NAME = 'is_present_image'`
      );
      
      if (columns.length === 0) {
        // La colonne n'existe pas, on la crée
        await connection.execute(
          "ALTER TABLE project_files ADD COLUMN is_present_image BOOLEAN DEFAULT FALSE AFTER file_desc"
        );
        console.log("✓ Colonne 'is_present_image' ajoutée à la table 'project_files'");
      }
    } catch (err) {
      console.warn("⚠️ Impossible de vérifier/ajouter la colonne is_present_image:", err.message);
    }

    console.log("✓ Tables créées/vérifiées");
  } catch (err) {
    console.error("❌ Erreur création tables:", err.message);
  } finally {
    connection.release();
  }
}

/**
 * Prépare une requête SQL
 */
function prepare(sql) {
  return {
    run: async function(...params) {
      if (!pool) throw new Error("Pool MySQL non initialisé");
      const connection = await pool.getConnection();
      try {
        const [result] = await connection.execute(sql, params);
        return {
          lastInsertRowid: result.insertId,
          changes: result.affectedRows
        };
      } finally {
        connection.release();
      }
    },

    get: async function(...params) {
      if (!pool) throw new Error("Pool MySQL non initialisé");
      const connection = await pool.getConnection();
      try {
        const [rows] = await connection.execute(sql, params);
        return rows[0] || null;
      } finally {
        connection.release();
      }
    },

    all: async function(...params) {
      if (!pool) throw new Error("Pool MySQL non initialisé");
      const connection = await pool.getConnection();
      try {
        const [rows] = await connection.execute(sql, params);
        return rows;
      } finally {
        connection.release();
      }
    }
  };
}

/**
 * Exécute une requête directe
 */
async function execute(sql, params = []) {
  if (!pool) throw new Error("Pool MySQL non initialisé");
  const connection = await pool.getConnection();
  try {
    const [result] = await connection.execute(sql, params);
    return result;
  } finally {
    connection.release();
  }
}

/**
 * Ferme le pool
 */
async function closePool() {
  if (pool) {
    await pool.end();
    console.log("✓ Pool MySQL fermé");
  }
}

module.exports = {
  init: initializeDB,
  prepare,
  execute,
  closePool,
  pool: () => pool
};