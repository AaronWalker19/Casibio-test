-- Migration: Ajouter la colonne file_desc_en à la table project_files
-- Date: 2026-04-23
-- Description: Ajoute le support pour les descriptions de fichiers en anglais

ALTER TABLE project_files 
ADD COLUMN IF NOT EXISTS file_desc_en VARCHAR(150) COMMENT 'Description du fichier en anglais (max 150 caractères)' AFTER file_desc_fr;

-- Vérifier que la colonne a bien été ajoutée
SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_NAME = 'project_files' AND TABLE_SCHEMA = DATABASE();
