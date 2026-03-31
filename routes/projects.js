const express = require("express");
const router = express.Router();
const db = require("../db/database");
const multer = require("multer");

// Configuration de multer pour garder les fichiers en mémoire
const upload = multer({ 
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB max
});
const { authenticateToken, requireAdmin } = require("../middleware/auth");

// Log pour déboguer les requêtes
router.use((req, res, next) => {
  console.log("Requête reçue sur /api/projects :", req.method, req.path);
  next();
});


// CREATE - POST /api/projects (members and admins)
router.post("/", authenticateToken, upload.array("files"), (req, res) => {
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
      (code_anr, title_fr, title_en, summary_fr, summary_en)
      VALUES (?, ?, ?, ?, ?)
    `;

    const stmt = db.prepare(sql);
    const result = stmt.run(code_anr, title_fr, title_en, summary_fr, summary_en);
    const projectId = result.lastInsertRowid;

    // Si des fichiers sont attachés, les insérer
    if (req.files && req.files.length > 0) {
      const fileSql = `
        INSERT INTO project_files
        (project_id, file_data, file_name, file_display_name, file_type)
        VALUES (?, ?, ?, ?, ?)
      `;

      const fileStmt = db.prepare(fileSql);
      req.files.forEach((file) => {
        try {
          fileStmt.run(projectId, file.buffer, file.originalname, file.originalname, file.mimetype);
        } catch (err) {
          console.error("Erreur insertion fichier:", err);
        }
      });
    }

    res.json({ id: projectId, message: "Projet créé avec succès" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// UPLOAD FILES TO EXISTING PROJECT - POST /api/projects/:projectId/upload
router.post("/:projectId/upload", authenticateToken, upload.array("files"), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: "Aucun fichier fourni" });
  }

  const projectId = req.params.projectId;

  try {
    // Vérifier que le projet existe
    const checkStmt = db.prepare("SELECT id FROM projects WHERE id = ?");
    const project = checkStmt.get(projectId);

    if (!project) {
      return res.status(404).json({ error: "Projet non trouvé" });
    }

    const fileSql = `
      INSERT INTO project_files
      (project_id, file_data, file_name, file_display_name, file_type)
      VALUES (?, ?, ?, ?, ?)
    `;

    const fileStmt = db.prepare(fileSql);
    let uploadedCount = 0;
    let errorCount = 0;

    req.files.forEach((file) => {
      try {
        fileStmt.run(projectId, file.buffer, file.originalname, file.originalname, file.mimetype);
        uploadedCount++;
      } catch (err) {
        errorCount++;
        console.error("Erreur insertion fichier:", err);
      }
    });

    if (errorCount === 0) {
      res.json({ message: `${uploadedCount} fichier(s) ajouté(s) avec succès` });
    } else {
      res.status(207).json({ 
        message: `${uploadedCount} fichier(s) ajouté(s), ${errorCount} erreur(s)`,
        uploaded: uploadedCount,
        errors: errorCount
      });
    }
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// GET ALL - GET /api/projects
router.get("/", (req, res) => {
  try {
    const stmt = db.prepare("SELECT * FROM projects ORDER BY created_at DESC");
    const rows = stmt.all();
    res.json(rows);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// GET ONE - GET /api/projects/:projectId
router.get("/:projectId", (req, res) => {
  try {
    const stmt = db.prepare("SELECT * FROM projects WHERE id = ?");
    const row = stmt.get(req.params.projectId);
    res.json(row);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// GET FILES OF PROJECT - GET /api/projects/:projectId/files
// PUBLIC - accessible à tous (visiteurs et authentifiés)
router.get("/:projectId/files", (req, res) => {
  try {
    const stmt = db.prepare("SELECT id, file_name, file_display_name, file_type FROM project_files WHERE project_id = ? ORDER BY created_at");
    const rows = stmt.all(req.params.projectId);
    res.json(rows);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// DOWNLOAD FILE - GET /api/projects/:projectId/file/:fileId/download
// PUBLIC - accessible à tous (visiteurs et authentifiés)
router.get("/:projectId/file/:fileId/download", (req, res) => {
  try {
    const stmt = db.prepare("SELECT file_data, file_name, file_type FROM project_files WHERE id = ? AND project_id = ?");
    const row = stmt.get(req.params.fileId, req.params.projectId);

    if (!row || !row.file_data) {
      return res.status(404).json({ error: "Fichier non trouvé" });
    }

    res.setHeader("Content-Type", row.file_type);
    res.setHeader("Content-Disposition", `attachment; filename="${row.file_name}"`);
    res.send(row.file_data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// VIEW FILE - GET /api/projects/:projectId/file/:fileId/view
// PUBLIC - accessible à tous pour consultation (images, vidéos, audio, PDFs)
router.get("/:projectId/file/:fileId/view", (req, res) => {
  try {
    const stmt = db.prepare("SELECT file_data, file_name, file_type FROM project_files WHERE id = ? AND project_id = ?");
    const row = stmt.get(req.params.fileId, req.params.projectId);

    if (!row || !row.file_data) {
      return res.status(404).json({ error: "Fichier non trouvé" });
    }

    res.setHeader("Content-Type", row.file_type);
    res.setHeader("Cache-Control", "public, max-age=3600");
    res.send(row.file_data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// RENAME FILE - PUT /api/projects/:projectId/file/:fileId/rename
// PROTECTED - authentification requise
router.put("/:projectId/file/:fileId/rename", authenticateToken, (req, res) => {
  const { new_name } = req.body;

  if (!new_name) {
    return res.status(400).json({ error: "Le nouveau nom est requis" });
  }

  try {
    const stmt = db.prepare("UPDATE project_files SET file_display_name = ? WHERE id = ? AND project_id = ?");
    stmt.run(new_name, req.params.fileId, req.params.projectId);
    res.json({ message: "Fichier renommé avec succès" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// DELETE FILE - DELETE /api/projects/:projectId/file/:fileId
// PROTECTED - authentification requise
router.delete("/:projectId/file/:fileId", authenticateToken, (req, res) => {
  try {
    const stmt = db.prepare("DELETE FROM project_files WHERE id = ? AND project_id = ?");
    stmt.run(req.params.fileId, req.params.projectId);
    res.json({ message: "Fichier supprimé avec succès" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// UPDATE PROJECT - PUT /api/projects/:projectId
router.put("/:projectId", authenticateToken, (req, res) => {
  const { code_anr, title_fr, title_en, summary_fr, summary_en } = req.body;
  
  try {
    const sql = `
      UPDATE projects 
      SET code_anr = ?, title_fr = ?, title_en = ?, summary_fr = ?, summary_en = ?
      WHERE id = ?
    `;

    const stmt = db.prepare(sql);
    stmt.run(code_anr, title_fr, title_en, summary_fr, summary_en, req.params.projectId);
    res.json({ message: "Projet modifié avec succès" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// DELETE PROJECT - DELETE /api/projects/:projectId
router.delete("/:projectId", authenticateToken, (req, res) => {
  try {
    const stmt = db.prepare("DELETE FROM projects WHERE id = ?");
    stmt.run(req.params.projectId);
    res.json({ message: "Projet supprimé avec succès" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;