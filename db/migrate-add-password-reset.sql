-- ============================================
-- Migration: Ajouter la table password_resets
-- ============================================

CREATE TABLE IF NOT EXISTS password_resets (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL COMMENT 'ID de l\'utilisateur',
  email VARCHAR(100) NOT NULL COMMENT 'Email de l\'utilisateur',
  token VARCHAR(255) UNIQUE NOT NULL COMMENT 'Token de réinitialisation unique',
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
COMMENT='Table des tokens de réinitialisation de mot de passe';
