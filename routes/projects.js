const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { check, validationResult } = require("express-validator");
const sanitizeHtml = require("sanitize-html");
let db;

// ✅ Helper: Sanitize HTML content from React Quill
const sanitizeContent = (html) => {
  if (!html || typeof html !== 'string') return null;
  
  return sanitizeHtml(html, {
    allowedTags: [
      'b', 'i', 'em', 'strong', 'u', 's', 'del', 
      'p', 'br', 'ul', 'ol', 'li', 
      'h1', 'h2', 'h3', 'blockquote', 'pre', 'code',
      'a', 'span'
    ],
    allowedAttributes: {
      'a': ['href', 'title'],
      'span': ['style'],
      '*': ['class']
    },
    allowedStyles: {
      '*': {
        'color': [/^#(0x)?[0-9a-f]{3}([0-9a-f]{3})?$/i, /^rgb/, /^hsl/],
        'background-color': [/^#(0x)?[0-9a-f]{3}([0-9a-f]{3})?$/i, /^rgb/, /^hsl/],
        'text-align': [/^(left|right|center|justify)$/]
      }
    },
    disallowedTagsMode: 'discard'
  });
};

// ✅ Helper: Convertir les strings vides en null + Sanitize HTML si nécessaire
const cleanParam = (value) => {
  if (!value || typeof value !== 'string') return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  
  // Si c'est du HTML (contient des balises), le nettoyer
  if (/<[^>]*>/.test(trimmed)) {
    return sanitizeContent(trimmed);
  }
  return trimmed;
};

// SÉCURITÉ: Validateur de chemin de fichier
const validateFilePath = (filePath, baseDir) => {
  const resolvedPath = path.resolve(baseDir, filePath);
  const resolvedBase = path.resolve(baseDir);
  return resolvedPath.startsWith(resolvedBase);
};

// SÉCURITÉ: Middleware pour valider les IDs numériques
const validateNumericId = (paramName) => {
  return (req, res, next) => {
    const id = req.params[paramName];
    if (!/^\d+$/.test(id)) {
      return res.status(400).json({ error: "ID invalide" });
    }
    next();
  };
};

// Fonction pour transformer un chemin de fichier en URL
const getFileUrl = (filePath) => {
  // Si c'est déjà une URL, la retourner
  if (filePath && (filePath.startsWith('http://') || filePath.startsWith('https://'))) {
    return filePath;
  }
  // Si c'est un chemin du système, extraire juste le nom du fichier
  if (filePath) {
    const fileName = path.basename(filePath);
    return `/uploads/${fileName}`;
  }
  return null;
};

try {
  db = require("../db/database");
  console.log("✅ DB chargée");
} catch (err) {
  console.error("❌ DB FAILED:", err.message);
  db = null; // Explicitement à null
}

// Middleware pour vérifier la disponibilité de la DB
const requireDB = (req, res, next) => {
  if (!db) {
    return res.status(503).json({ 
      error: "Service indisponible",
      message: "Base de données non initialisée. Vérifiez les logs du serveur."
    });
  }
  next();
};

// Si la DB n'est pas disponible, enregistrer les routes avec le middleware requireDB
if (!db) {
  console.warn("⚠️  Database not initialized - routes will require it");
}


// Créer le dossier uploads s'il n'existe pas
const uploadsDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log("Dossier uploads créé");
}

// Configuration de multer pour garder les fichiers en mémoire
const upload = multer({ 
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB max
});
const { authenticateToken, requireAdmin } = require("../middleware/auth");

// Fonction pour générer un nom de fichier unique
const generateUniqueFileName = (originalName) => {
  const ext = path.extname(originalName);
  const basename = path.basename(originalName, ext);
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000);
  return `${basename}_${timestamp}_${random}${ext}`;
};

// Log pour déboguer les requêtes
router.use((req, res, next) => {
  console.log("Requête reçue sur /api/projects :", req.method, req.path);
  next();
});

// CREATE - POST /api/projects
router.post("/", 
  requireDB, 
  authenticateToken, 
  upload.any(),  // ✅ Utiliser upload.any() pour parser les fichiers ET les champs textes du FormData
  [
    check('code_anr').trim().isLength({ max: 100 }).optional(),
    check('title_fr').trim().isLength({ max: 255 }).notEmpty(),
    check('title_en').trim().isLength({ max: 255 }).notEmpty(),
    check('summary_fr').trim().isLength({ max: 50000 }).notEmpty(),
    check('summary_en').trim().isLength({ max: 50000 }).notEmpty(),
    check('methods_fr').trim().isLength({ max: 50000 }).optional(),
    check('methods_en').trim().isLength({ max: 50000 }).optional(),
    check('results_fr').trim().isLength({ max: 50000 }).optional(),
    check('results_en').trim().isLength({ max: 50000 }).optional(),
    check('perspectives_fr').trim().isLength({ max: 50000 }).optional(),
    check('perspectives_en').trim().isLength({ max: 50000 }).optional(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      code_anr,
      title_fr,
      title_en,
      summary_fr,
      summary_en,
      methods_fr,
      methods_en,
      results_fr,
      results_en,
      perspectives_fr,
      perspectives_en
    } = req.body;

    try {
    const sql = `
      INSERT INTO projects
      (code_anr, title_fr, title_en, summary_fr, summary_en, methods_fr, methods_en, results_fr, results_en, perspectives_fr, perspectives_en, created_by)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const stmt = db.prepare(sql);
    const result = await stmt.run(
      cleanParam(code_anr),
      cleanParam(title_fr),
      cleanParam(title_en),
      cleanParam(summary_fr),
      cleanParam(summary_en),
      cleanParam(methods_fr),
      cleanParam(methods_en),
      cleanParam(results_fr),
      cleanParam(results_en),
      cleanParam(perspectives_fr),
      cleanParam(perspectives_en),
      req.user.userId
    );
    const projectId = result.lastInsertRowid;

    // Save files to uploads directory and insert paths into database
    if (req.files && req.files.length > 0) {
      const fileSql = `
        INSERT INTO project_files
        (project_id, file_path, file_name, file_display_name, file_type)
        VALUES (?, ?, ?, ?, ?)
      `;

      // ✅ Filtrer pour ne garder que les fichiers du champ "files"
      const filesFromField = req.files.filter(file => file.fieldname === 'files');
      
      for (const file of filesFromField) {
        const uniqueFileName = generateUniqueFileName(file.originalname);
        const uploadPath = path.join(uploadsDir, uniqueFileName);
        fs.writeFileSync(uploadPath, file.buffer);
        
        const fileStmt = db.prepare(fileSql);
        // Stocker seulement le nom du fichier, pas le chemin complet
        await fileStmt.run(projectId, uniqueFileName, uniqueFileName, file.originalname, file.mimetype);
        console.log(`Fichier sauvegardé: ${uploadPath}`);
      }
    }

    res.json({ id: projectId, message: "Projet créé avec succès" });
  } catch (err) {
    console.error("Create project error:", err);
    return res.status(500).json({ error: "Erreur lors de la création du projet" });
  }
});

// UPLOAD FILES TO EXISTING PROJECT - POST /api/projects/:projectId/upload
router.post("/:projectId/upload", 
  requireDB, 
  authenticateToken,
  validateNumericId('projectId'),
  upload.array("files"), 
  async (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: "Aucun fichier fourni" });
  }

  const projectId = req.params.projectId;

  try {
    // Vérifier que le projet existe
    const checkStmt = db.prepare("SELECT id FROM projects WHERE id = ?");
    const project = await checkStmt.get(projectId);

    if (!project) {
      return res.status(404).json({ error: "Projet non trouvé" });
    }

    const fileSql = `
      INSERT INTO project_files
      (project_id, file_path, file_name, file_display_name, file_type)
      VALUES (?, ?, ?, ?, ?)
    `;

    for (const file of req.files) {
      const uniqueFileName = generateUniqueFileName(file.originalname);
      const uploadPath = path.join(uploadsDir, uniqueFileName);
      fs.writeFileSync(uploadPath, file.buffer);
      
      const fileStmt = db.prepare(fileSql);
      // Stocker seulement le nom du fichier, pas le chemin complet
      await fileStmt.run(projectId, uniqueFileName, uniqueFileName, file.originalname, file.mimetype);
      console.log(`Fichier sauvegardé: ${uploadPath}`);
    }

    res.json({ message: "Fichiers uploadés avec succès" });
  } catch (err) {
    console.error("Upload files error:", err);
    return res.status(500).json({ error: err.message });
  }
});

// GET ALL PROJECT FILES - GET /api/projects/files/all (DOIT VENIR AVANT /:projectId)
router.get("/files/all", requireDB, async (req, res) => {
  try {
    const stmt = db.prepare("SELECT id, file_name, file_display_name, file_type, file_path, created_at, project_id FROM project_files ORDER BY created_at DESC");
    const rows = await stmt.all();
    console.log("📁 Fichiers récupérés de la DB:", JSON.stringify(rows.slice(0, 3), null, 2));
    
    const filesWithUrls = rows.map(row => {
      const url = getFileUrl(row.file_path);
      const fileName = path.basename(row.file_path || '');
      const filePath = path.join(uploadsDir, fileName);
      const fileExists = fs.existsSync(filePath);
      
      console.log(`  → file_path: ${row.file_path} => URL: ${url} [Existe: ${fileExists}]`);
      
      return {
        ...row,
        file_path: url,
        file_exists: fileExists
      };
    }).filter(file => file.file_exists); // Filter out files that don't exist
    
    res.json(filesWithUrls);
  } catch (err) {
    console.error("Get all files error:", err);
    return res.status(500).json({ error: "Erreur lors de la récupération des fichiers" });
  }
});

// GET ALL - GET /api/projects
router.get("/", requireDB, async (req, res) => {
  try {
    const stmt = db.prepare("SELECT * FROM projects ORDER BY created_at DESC");
    const rows = await stmt.all();
    res.json(rows);
  } catch (err) {
    console.error("Get projects error:", err);
    return res.status(500).json({ error: err.message });
  }
});

// GET ONE - GET /api/projects/:projectId
router.get("/:projectId", requireDB, validateNumericId('projectId'), async (req, res) => {
  try {
    const stmt = db.prepare("SELECT * FROM projects WHERE id = ?");
    const row = await stmt.get(req.params.projectId);
    if (!row) {
      return res.status(404).json({ error: "Projet non trouvé" });
    }
    res.json(row);
  } catch (err) {
    console.error("Get project error:", err);
    return res.status(500).json({ error: "Erreur lors de la récupération du projet" });
  }
});

// GET FILES OF PROJECT - GET /api/projects/:projectId/files
router.get("/:projectId/files", requireDB, validateNumericId('projectId'), async (req, res) => {
  try {
    const stmt = db.prepare("SELECT id, file_name, file_display_name, file_type, file_path FROM project_files WHERE project_id = ? ORDER BY created_at");
    const rows = await stmt.all(req.params.projectId);
    const filesWithUrls = rows.map(row => ({
      ...row,
      file_path: getFileUrl(row.file_path)
    }));
    res.json(filesWithUrls);
  } catch (err) {
    console.error("Get files error:", err);
    return res.status(500).json({ error: "Erreur lors de la récupération des fichiers" });
  }
});

// DOWNLOAD FILE - GET /api/projects/:projectId/file/:fileId/download
router.get("/:projectId/file/:fileId/download", 
  requireDB, 
  validateNumericId('projectId'),
  validateNumericId('fileId'),
  async (req, res) => {
    try {
      const stmt = db.prepare("SELECT file_path, file_name, file_type FROM project_files WHERE id = ? AND project_id = ?");
      const row = await stmt.get(req.params.fileId, req.params.projectId);

      if (!row || !row.file_path) {
        return res.status(404).json({ error: "Fichier non trouvé" });
      }

      // SÉCURITÉ: Valider le chemin pour éviter path traversal
      if (!validateFilePath(row.file_path, uploadsDir)) {
        console.warn(`⚠️ Tentative de path traversal: ${row.file_path}`);
        return res.status(403).json({ error: "Accès refusé" });
      }

      const fullFilePath = path.join(uploadsDir, row.file_path);
      
      res.setHeader("Content-Type", row.file_type);
      res.setHeader("Content-Disposition", `attachment; filename="${row.file_name}"`);
      res.download(fullFilePath, row.file_name);
    } catch (err) {
      console.error("Download file error:", err);
      return res.status(500).json({ error: "Erreur lors du téléchargement" });
    }
  }
);

// VIEW FILE - GET /api/projects/:projectId/file/:fileId/view
router.get("/:projectId/file/:fileId/view", 
  requireDB,
  validateNumericId('projectId'),
  validateNumericId('fileId'),
  async (req, res) => {
    try {
      const stmt = db.prepare("SELECT file_path, file_name, file_type FROM project_files WHERE id = ? AND project_id = ?");
      const row = await stmt.get(req.params.fileId, req.params.projectId);

      if (!row || !row.file_path) {
        return res.status(404).json({ error: "Fichier non trouvé" });
      }

      // SÉCURITÉ: Valider le chemin
      if (!validateFilePath(row.file_path, uploadsDir)) {
        console.warn(`⚠️ Tentative de path traversal: ${row.file_path}`);
        return res.status(403).json({ error: "Accès refusé" });
      }

      const fullFilePath = path.join(uploadsDir, row.file_path);

      res.setHeader("Content-Type", row.file_type);
      res.setHeader("Cache-Control", "public, max-age=3600");
      res.sendFile(fullFilePath);
    } catch (err) {
      console.error("View file error:", err);
      return res.status(500).json({ error: "Erreur lors de la consultation du fichier" });
    }
  }
);

// RENAME FILE - PUT /api/projects/:projectId/file/:fileId/rename
router.put("/:projectId/file/:fileId/rename", 
  requireDB, 
  authenticateToken,
  validateNumericId('projectId'),
  validateNumericId('fileId'),
  [
    check('new_name').trim().isLength({ min: 1, max: 255 }).notEmpty()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { new_name } = req.body;

    try {
      const stmt = db.prepare("UPDATE project_files SET file_display_name = ? WHERE id = ? AND project_id = ?");
      await stmt.run(new_name, req.params.fileId, req.params.projectId);
      res.json({ message: "Fichier renommé avec succès" });
    } catch (err) {
      console.error("Rename file error:", err);
      return res.status(500).json({ error: "Erreur lors du renommage" });
    }
  }
);

// DELETE FILE - DELETE /api/projects/:projectId/file/:fileId
router.delete("/:projectId/file/:fileId", 
  requireDB, 
  authenticateToken,
  validateNumericId('projectId'),
  validateNumericId('fileId'),
  async (req, res) => {
    try {
      const getStmt = db.prepare("SELECT file_path FROM project_files WHERE id = ? AND project_id = ?");
      const row = await getStmt.get(req.params.fileId, req.params.projectId);

      // SÉCURITÉ: Vérifier le chemin avant suppression
      if (row && row.file_path && !validateFilePath(row.file_path, uploadsDir)) {
        console.warn(`⚠️ Tentative de path traversal lors de suppression: ${row.file_path}`);
        return res.status(403).json({ error: "Accès refusé" });
      }

      const delStmt = db.prepare("DELETE FROM project_files WHERE id = ? AND project_id = ?");
      await delStmt.run(req.params.fileId, req.params.projectId);

      if (row && row.file_path) {
        const fullFilePath = path.join(uploadsDir, row.file_path);
        if (fs.existsSync(fullFilePath)) {
          try {
            fs.unlinkSync(fullFilePath);
            console.log(`Fichier supprimé du disque: ${fullFilePath}`);
          } catch (fsErr) {
            console.error("Erreur suppression fichier disque:", fsErr);
          }
        }
      }

      res.json({ message: "Fichier supprimé avec succès" });
    } catch (err) {
      console.error("Delete file error:", err);
      return res.status(500).json({ error: "Erreur lors de la suppression" });
    }
  }
);

// UPDATE PROJECT - PUT /api/projects/:projectId
router.put("/:projectId", 
  requireDB, 
  authenticateToken,
  validateNumericId('projectId'),
  upload.any(),  // ✅ Ajouter upload.any() pour parser FormData avec champs textes ET fichiers
  [
    check('code_anr').trim().isLength({ max: 100 }).optional(),
    check('title_fr').trim().isLength({ max: 255 }).notEmpty(),
    check('title_en').trim().isLength({ max: 255 }).notEmpty(),
    check('summary_fr').trim().isLength({ max: 50000 }).notEmpty(),
    check('summary_en').trim().isLength({ max: 50000 }).notEmpty(),
    check('methods_fr').trim().isLength({ max: 50000 }).optional(),
    check('methods_en').trim().isLength({ max: 50000 }).optional(),
    check('results_fr').trim().isLength({ max: 50000 }).optional(),
    check('results_en').trim().isLength({ max: 50000 }).optional(),
    check('perspectives_fr').trim().isLength({ max: 50000 }).optional(),
    check('perspectives_en').trim().isLength({ max: 50000 }).optional(),
  ],
  async (req, res) => {
    // LOG: Voir exactement ce que le serveur reçoit
    console.log("🔍 [PUT] Données reçues après multer parsing:");
    console.log("  title_fr:", req.body.title_fr, "| type:", typeof req.body.title_fr);
    console.log("  title_en:", req.body.title_en, "| type:", typeof req.body.title_en);
    console.log("  summary_fr:", req.body.summary_fr ? req.body.summary_fr.substring(0, 50) + "..." : "undefined", "| type:", typeof req.body.summary_fr);
    console.log("  summary_en:", req.body.summary_en ? req.body.summary_en.substring(0, 50) + "..." : "undefined", "| type:", typeof req.body.summary_en);
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log("❌ Erreurs de validation:", errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    const { 
      code_anr, 
      title_fr, 
      title_en, 
      summary_fr, 
      summary_en,
      methods_fr,
      methods_en,
      results_fr,
      results_en,
      perspectives_fr,
      perspectives_en
    } = req.body;
    
    try {
      // Gérer la suppression des fichiers existants
      let deletedFileIds = [];
      if (req.body.deleted_file_ids) {
        try {
          deletedFileIds = JSON.parse(req.body.deleted_file_ids);
          console.log("🗑️  Fichiers à supprimer:", deletedFileIds);

          // Pour chaque fichier à supprimer
          const getFilesStmt = db.prepare("SELECT id, file_path FROM project_files WHERE id = ? AND project_id = ?");
          
          for (const fileId of deletedFileIds) {
            const file = await getFilesStmt.get(fileId, req.params.projectId);
            
            if (file) {
              // Vérifier la sécurité du chemin
              if (!validateFilePath(file.file_path, uploadsDir)) {
                console.warn(`⚠️ Fichier suspect: ${file.file_path}`);
                continue;
              }

              // Supprimer le fichier du système
              const fullFilePath = path.join(uploadsDir, file.file_path);
              if (fs.existsSync(fullFilePath)) {
                try {
                  fs.unlinkSync(fullFilePath);
                  console.log(`✅ Fichier supprimé: ${fullFilePath}`);
                } catch (fsErr) {
                  console.error("❌ Erreur lors de la suppression du fichier:", fsErr);
                }
              }

              // Supprimer l'entrée de la base de données
              const deleteStmt = db.prepare("DELETE FROM project_files WHERE id = ? AND project_id = ?");
              await deleteStmt.run(fileId, req.params.projectId);
              console.log(`✅ Fichier supprimé de la BD: ID ${fileId}`);
            }
          }
        } catch (parseErr) {
          console.warn("Erreur parsing deleted_file_ids:", parseErr);
        }
      }

      const sql = `
        UPDATE projects 
        SET code_anr = ?, title_fr = ?, title_en = ?, summary_fr = ?, summary_en = ?, 
            methods_fr = ?, methods_en = ?, results_fr = ?, results_en = ?, 
            perspectives_fr = ?, perspectives_en = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `;

      const stmt = db.prepare(sql);
      await stmt.run(
        cleanParam(code_anr),
        cleanParam(title_fr),
        cleanParam(title_en),
        cleanParam(summary_fr),
        cleanParam(summary_en),
        cleanParam(methods_fr),
        cleanParam(methods_en),
        cleanParam(results_fr),
        cleanParam(results_en),
        cleanParam(perspectives_fr),
        cleanParam(perspectives_en),
        req.params.projectId
      );

      // Traiter les nouveaux fichiers uploadés lors de la mise à jour
      if (req.files && req.files.length > 0) {
        const fileSql = `
          INSERT INTO project_files
          (project_id, file_path, file_name, file_display_name, file_type)
          VALUES (?, ?, ?, ?, ?)
        `;

        const filesFromField = req.files.filter(file => file.fieldname === 'files');
        
        for (const file of filesFromField) {
          const uniqueFileName = generateUniqueFileName(file.originalname);
          const uploadPath = path.join(uploadsDir, uniqueFileName);
          fs.writeFileSync(uploadPath, file.buffer);
          
          const fileStmt = db.prepare(fileSql);
          await fileStmt.run(req.params.projectId, uniqueFileName, uniqueFileName, file.originalname, file.mimetype);
          console.log(`✅ Fichier ajouté lors de la mise à jour: ${uploadPath}`);
        }
      }

      res.json({ message: "Projet modifié avec succès" });
    } catch (err) {
      console.error("Update project error:", err);
      return res.status(500).json({ error: "Erreur lors de la modification" });
    }
  }
);

// DELETE PROJECT - DELETE /api/projects/:projectId
router.delete("/:projectId", 
  requireDB, 
  authenticateToken,
  validateNumericId('projectId'),
  async (req, res) => {
    try {
      const getFilesStmt = db.prepare("SELECT file_path FROM project_files WHERE project_id = ?");
      const files = await getFilesStmt.all(req.params.projectId);

      // SÉCURITÉ: Vérifier tous les chemins avant suppression
      for (const file of files) {
        if (file.file_path && !validateFilePath(file.file_path, uploadsDir)) {
          console.warn(`⚠️ Fichier suspect: ${file.file_path}`);
          return res.status(403).json({ error: "Accès refusé" });
        }
      }

      const delStmt = db.prepare("DELETE FROM projects WHERE id = ?");
      await delStmt.run(req.params.projectId);

      files.forEach(file => {
        if (file.file_path) {
          const fullFilePath = path.join(uploadsDir, file.file_path);
          if (fs.existsSync(fullFilePath)) {
            try {
              fs.unlinkSync(fullFilePath);
              console.log(`Fichier supprimé: ${fullFilePath}`);
            } catch (fsErr) {
              console.error("Erreur suppression:", fsErr);
            }
          }
        }
      });

      res.json({ message: "Projet supprimé avec succès" });
    } catch (err) {
      console.error("Delete project error:", err);
      return res.status(500).json({ error: "Erreur lors de la suppression" });
    }
  }
);

module.exports = router;