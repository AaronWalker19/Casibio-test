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
  username VARCHAR(100) UNIQUE NOT NULL COMMENT 'Nom d\'utilisateur unique',
  email VARCHAR(100) UNIQUE NOT NULL COMMENT 'Email unique',
  password_hash VARCHAR(255) NOT NULL COMMENT 'Hash du mot de passe (bcryptjs)',
  role ENUM('admin', 'member') DEFAULT 'member' COMMENT 'Rôle: admin ou member',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Date de création',
  
  INDEX idx_username (username),
  INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Table des utilisateurs du système';

-- ============================================
-- Table: projects (Projets)
-- ============================================
CREATE TABLE IF NOT EXISTS projects (
  id INT AUTO_INCREMENT PRIMARY KEY,
  code_anr VARCHAR(100) COMMENT 'Code ANR du projet',
  title_fr VARCHAR(255) COMMENT 'Titre en français',
  title_en VARCHAR(255) COMMENT 'Titre en anglais',
  summary_fr TEXT COMMENT 'Résumé en français',
  summary_en TEXT COMMENT 'Résumé en anglais',
  methods_fr TEXT COMMENT 'Méthodes en français',
  methods_en TEXT COMMENT 'Méthodes en anglais',
  results_fr TEXT COMMENT 'Résultats en français',
  results_en TEXT COMMENT 'Résultats en anglais',
  perspectives_fr TEXT COMMENT 'Perspectives en français',
  perspectives_en TEXT COMMENT 'Perspectives en anglais',
  created_by INT COMMENT 'ID de l\'utilisateur qui a créé le projet',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Date de création',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Date de mise à jour',
  
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_code_anr (code_anr),
  INDEX idx_created_by (created_by),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Table des projets de recherche';

-- ============================================
-- Table: project_files (Fichiers des projets)
-- ============================================
CREATE TABLE IF NOT EXISTS project_files (
  id INT AUTO_INCREMENT PRIMARY KEY,
  project_id INT NOT NULL COMMENT 'ID du projet',
  file_path VARCHAR(500) COMMENT 'Chemin du fichier sur le serveur',
  file_name VARCHAR(255) COMMENT 'Nom du fichier stocké',
  file_display_name VARCHAR(255) COMMENT 'Nom du fichier affichable',
  file_type VARCHAR(100) COMMENT 'Type MIME du fichier (image/png, application/pdf, etc)',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Date d\'upload',
  
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  INDEX idx_project_id (project_id),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Table des fichiers associés aux projets';

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
