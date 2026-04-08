const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
let db;

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
router.post("/", requireDB, authenticateToken, upload.array("files"), async (req, res) => {
  const {
    code_anr,
    title_fr,
    title_en,
    summary_fr,
    summary_en
  } = req.body;

  try {
    const sql = `
      INSERT INTO projects
      (code_anr, title_fr, title_en, summary_fr, summary_en, created_by)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    const stmt = db.prepare(sql);
    const result = await stmt.run(code_anr, title_fr, title_en, summary_fr, summary_en, req.user.userId);
    const projectId = result.lastInsertRowid;

    // Save files to uploads directory and insert paths into database
    if (req.files && req.files.length > 0) {
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
    }

    res.json({ id: projectId, message: "Projet créé avec succès" });
  } catch (err) {
    console.error("Create project error:", err);
    return res.status(500).json({ error: err.message });
  }
});

// UPLOAD FILES TO EXISTING PROJECT - POST /api/projects/:projectId/upload
router.post("/:projectId/upload", requireDB, authenticateToken, upload.array("files"), async (req, res) => {
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
    // Transformer les chemins en URLs
    const filesWithUrls = rows.map(row => ({
      ...row,
      file_path: getFileUrl(row.file_path)
    }));
    res.json(filesWithUrls);
  } catch (err) {
    console.error("Get all files error:", err);
    return res.status(500).json({ error: err.message });
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
router.get("/:projectId", requireDB, async (req, res) => {
  try {
    const stmt = db.prepare("SELECT * FROM projects WHERE id = ?");
    const row = await stmt.get(req.params.projectId);
    res.json(row);
  } catch (err) {
    console.error("Get project error:", err);
    return res.status(500).json({ error: err.message });
  }
});

// GET FILES OF PROJECT - GET /api/projects/:projectId/files
router.get("/:projectId/files", requireDB, async (req, res) => {
  try {
    const stmt = db.prepare("SELECT id, file_name, file_display_name, file_type, file_path FROM project_files WHERE project_id = ? ORDER BY created_at");
    const rows = await stmt.all(req.params.projectId);
    // Transformer les chemins en URLs
    const filesWithUrls = rows.map(row => ({
      ...row,
      file_path: getFileUrl(row.file_path)
    }));
    res.json(filesWithUrls);
  } catch (err) {
    console.error("Get files error:", err);
    return res.status(500).json({ error: err.message });
  }
});

// DOWNLOAD FILE - GET /api/projects/:projectId/file/:fileId/download
router.get("/:projectId/file/:fileId/download", requireDB, async (req, res) => {
  try {
    const stmt = db.prepare("SELECT file_path, file_name, file_type FROM project_files WHERE id = ? AND project_id = ?");
    const row = await stmt.get(req.params.fileId, req.params.projectId);

    if (!row || !row.file_path) {
      return res.status(404).json({ error: "Fichier non trouvé" });
    }

    // Reconstruire le chemin complet du fichier
    const fullFilePath = path.join(uploadsDir, row.file_path);
    
    res.setHeader("Content-Type", row.file_type);
    res.setHeader("Content-Disposition", `attachment; filename="${row.file_name}"`);
    res.download(fullFilePath, row.file_name);
  } catch (err) {
    console.error("Download file error:", err);
    return res.status(500).json({ error: err.message });
  }
});

// VIEW FILE - GET /api/projects/:projectId/file/:fileId/view
router.get("/:projectId/file/:fileId/view", requireDB, async (req, res) => {
  try {
    const stmt = db.prepare("SELECT file_path, file_name, file_type FROM project_files WHERE id = ? AND project_id = ?");
    const row = await stmt.get(req.params.fileId, req.params.projectId);

    if (!row || !row.file_path) {
      return res.status(404).json({ error: "Fichier non trouvé" });
    }

    // Reconstruire le chemin complet du fichier
    const fullFilePath = path.join(uploadsDir, row.file_path);

    res.setHeader("Content-Type", row.file_type);
    res.setHeader("Cache-Control", "public, max-age=3600");
    res.sendFile(fullFilePath);
  } catch (err) {
    console.error("View file error:", err);
    return res.status(500).json({ error: err.message });
  }
});

// RENAME FILE - PUT /api/projects/:projectId/file/:fileId/rename
router.put("/:projectId/file/:fileId/rename", requireDB, authenticateToken, async (req, res) => {
  const { new_name } = req.body;

  if (!new_name) {
    return res.status(400).json({ error: "Le nouveau nom est requis" });
  }

  try {
    const stmt = db.prepare("UPDATE project_files SET file_display_name = ? WHERE id = ? AND project_id = ?");
    await stmt.run(new_name, req.params.fileId, req.params.projectId);
    res.json({ message: "Fichier renommé avec succès" });
  } catch (err) {
    console.error("Rename file error:", err);
    return res.status(500).json({ error: err.message });
  }
});

// DELETE FILE - DELETE /api/projects/:projectId/file/:fileId
router.delete("/:projectId/file/:fileId", requireDB, authenticateToken, async (req, res) => {
  try {
    // Récupérer le chemin du fichier avant suppression
    const getStmt = db.prepare("SELECT file_path FROM project_files WHERE id = ? AND project_id = ?");
    const row = await getStmt.get(req.params.fileId, req.params.projectId);

    // Supprimer de la base de données
    const delStmt = db.prepare("DELETE FROM project_files WHERE id = ? AND project_id = ?");
    await delStmt.run(req.params.fileId, req.params.projectId);

    // Supprimer le fichier du disque s'il existe
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
    return res.status(500).json({ error: err.message });
  }
});

// UPDATE PROJECT - PUT /api/projects/:projectId
router.put("/:projectId", requireDB, authenticateToken, async (req, res) => {
  const { code_anr, title_fr, title_en, summary_fr, summary_en } = req.body;
  
  try {
    const sql = `
      UPDATE projects 
      SET code_anr = ?, title_fr = ?, title_en = ?, summary_fr = ?, summary_en = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;

    const stmt = db.prepare(sql);
    await stmt.run(code_anr, title_fr, title_en, summary_fr, summary_en, req.params.projectId);
    res.json({ message: "Projet modifié avec succès" });
  } catch (err) {
    console.error("Update project error:", err);
    return res.status(500).json({ error: err.message });
  }
});

// DELETE PROJECT - DELETE /api/projects/:projectId
router.delete("/:projectId", requireDB, authenticateToken, async (req, res) => {
  try {
    // Récupérer tous les fichiers du projet
    const getFilesStmt = db.prepare("SELECT file_path FROM project_files WHERE project_id = ?");
    const files = await getFilesStmt.all(req.params.projectId);

    // Supprimer le projet (et ses fichiers grâce à ON DELETE CASCADE)
    const delStmt = db.prepare("DELETE FROM projects WHERE id = ?");
    await delStmt.run(req.params.projectId);

    // Supprimer les fichiers du disque
    files.forEach(file => {
      if (file.file_path && fs.existsSync(file.file_path)) {
        try {
          fs.unlinkSync(file.file_path);
          console.log(`Fichier supprimé du disque: ${file.file_path}`);
        } catch (fsErr) {
          console.error("Erreur suppression fichier disque:", fsErr);
        }
      }
    });

    res.json({ message: "Projet supprimé avec succès" });
  } catch (err) {
    console.error("Delete project error:", err);
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;