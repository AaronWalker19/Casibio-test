-- ============================================
-- Migration: Ajouter support d'activation d'utilisateurs
-- ============================================

-- 1. Ajouter colonnes à la table users
ALTER TABLE users 
ADD COLUMN is_active BOOLEAN DEFAULT FALSE AFTER role,
ADD COLUMN activated_at TIMESTAMP NULL AFTER created_at,
ADD INDEX idx_is_active (is_active);

-- 2. Modifier colonne username - rendre NULLABLE
ALTER TABLE users 
MODIFY username VARCHAR(100) UNIQUE NULL COMMENT 'Nom d\'utilisateur unique - NULL jusqu\'à activation';

-- 3. Modifier colonne password_hash - rendre NULLABLE  
ALTER TABLE users 
MODIFY password_hash VARCHAR(255) NULL COMMENT 'Hash du mot de passe (bcryptjs) - NULL avant activation';

-- 4. Créer table des invitations
CREATE TABLE IF NOT EXISTS user_invitations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(100) NOT NULL COMMENT 'Email de la personne invitée',
  token VARCHAR(255) UNIQUE NOT NULL COMMENT 'Token d\'activation unique',
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
COMMENT='Table des invitations d\'activation de compte';
