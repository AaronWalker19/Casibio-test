-- ============================================
-- CASiBIO - Base de données MySQL
-- ============================================

-- Créer la base de données
CREATE DATABASE IF NOT EXISTS casibio 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE casibio;

-- ============================================
-- Table: users (Comptes utilisateurs)
-- ============================================
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) UNIQUE,
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255),
  name VARCHAR(255),
  role ENUM('admin', 'member') DEFAULT 'member',
  is_active BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  activated_at TIMESTAMP NULL,
  
  INDEX idx_username (username),
  INDEX idx_email (email),
  INDEX idx_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Table: user_invitations
-- ============================================
CREATE TABLE IF NOT EXISTS user_invitations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(100) NOT NULL,
  token VARCHAR(255) UNIQUE NOT NULL,
  token_hash VARCHAR(255),
  invited_by INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP NOT NULL,
  activated_at TIMESTAMP NULL,
  
  INDEX idx_email (email),
  INDEX idx_token_hash (token_hash),
  INDEX idx_expires_at (expires_at),
  FOREIGN KEY (invited_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Table: projects
-- ============================================
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Table: project_files
-- ============================================
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
  INDEX idx_project_id (project_id),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Table: project_contents (Contenus/sections d'un projet)
-- ============================================
CREATE TABLE IF NOT EXISTS project_contents (
  id INT AUTO_INCREMENT PRIMARY KEY,
  project_id INT NOT NULL COMMENT 'ID du projet',
  title_fr VARCHAR(255) COMMENT 'Titre en français',
  title_en VARCHAR(255) COMMENT 'Titre en anglais',
  content_fr LONGTEXT COMMENT 'Contenu en français',
  content_en LONGTEXT COMMENT 'Contenu en anglais',
  position INT DEFAULT 1 COMMENT 'Position de la section (ordre)',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Date de création',
  
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  INDEX idx_project_id (project_id),
  INDEX idx_position (position)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Table des contenus/sections des projets';

-- ============================================
-- Table: user_participation (Historique des participants d'un projet)
-- ============================================
CREATE TABLE IF NOT EXISTS user_participation (
  id INT AUTO_INCREMENT PRIMARY KEY,
  project_id INT NOT NULL COMMENT 'ID du projet',
  user_id INT NOT NULL COMMENT 'ID de l\'utilisateur participant',
  added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Date de cette participation/modification',
  
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_project_id (project_id),
  INDEX idx_user_id (user_id),
  INDEX idx_added_at (added_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Table de l\'historique de participation/modifications aux projets (chaque modification crée une nouvelle ligne)';

-- ============================================
-- Insertions de données initiales (optionnel)
-- ============================================

-- Créer un utilisateur admin (password: admin123)
-- Le hash est généré avec bcryptjs
INSERT INTO users (username, email, password_hash, role)
SELECT 'admin', 'admin@test.com', '$2a$10$8Y9.h8aMW9JqCdS.H8v5CON5HhTqGVBhGME8rI/7E.JZBjG7k7z3e', 'admin'
WHERE NOT EXISTS (SELECT 1 FROM users WHERE username = 'admin');

-- ============================================
-- Vues (optionnel - pour faciliter les requêtes)
-- ============================================

-- Vue: Projets avec info créateur
CREATE OR REPLACE VIEW v_projects_with_creator AS
SELECT 
  p.id,
  p.code_anr,
  p.title_fr,
  p.title_en,
  p.summary_fr,
  p.summary_en,
  p.created_by,
  u.username as creator_name,
  u.email as creator_email,
  p.created_at,
  p.updated_at,
  (SELECT COUNT(*) FROM project_files WHERE project_id = p.id) as file_count
FROM projects p
LEFT JOIN users u ON p.created_by = u.id;

-- ============================================
-- Procédures stockées (optionnel)
-- ============================================

-- Proc: Créer un nouveau projet
DELIMITER $$

CREATE PROCEDURE IF NOT EXISTS sp_create_project(
  IN p_code_anr VARCHAR(100),
  IN p_title_fr VARCHAR(255),
  IN p_title_en VARCHAR(255),
  IN p_summary_fr TEXT,
  IN p_summary_en TEXT,
  IN p_created_by INT,
  OUT p_project_id INT
)
BEGIN
  INSERT INTO projects (code_anr, title_fr, title_en, summary_fr, summary_en, created_by)
  VALUES (p_code_anr, p_title_fr, p_title_en, p_summary_fr, p_summary_en, p_created_by);
  
  SET p_project_id = LAST_INSERT_ID();
END$$

DELIMITER ;

-- ============================================
-- Statistiques et maintenance
-- ============================================

-- Afficher le nombre d'utilisateurs
-- SELECT COUNT(*) as total_users FROM users;

-- Afficher le nombre de projets
-- SELECT COUNT(*) as total_projects FROM projects;

-- Afficher l'espace disque utilisé par les fichiers
-- SELECT SUM(CHAR_LENGTH(file_path)) as total_chars FROM project_files;
