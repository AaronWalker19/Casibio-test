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

  const sql = `
    INSERT INTO projects
    (code_anr, title_fr, title_en, summary_fr, summary_en)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.run(sql, [code_anr, title_fr, title_en, summary_fr, summary_en], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    const projectId = this.lastID;

    // Si des fichiers sont attachés, les insérer
    if (req.files && req.files.length > 0) {
      const fileSql = `
        INSERT INTO project_files
        (project_id, file_data, file_name, file_display_name, file_type)
        VALUES (?, ?, ?, ?, ?)
      `;

      req.files.forEach((file) => {
        db.run(fileSql, [projectId, file.buffer, file.originalname, file.originalname, file.mimetype], (err) => {
          if (err) console.error("Erreur insertion fichier:", err);
        });
      });
    }

    res.json({ id: projectId, message: "Projet créé avec succès" });
  });
});

// UPLOAD FILES TO EXISTING PROJECT - POST /api/projects/:projectId/upload
router.post("/:projectId/upload", authenticateToken, upload.array("files"), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: "Aucun fichier fourni" });
  }

  const projectId = req.params.projectId;

  // Vérifier que le projet existe
  db.get("SELECT id FROM projects WHERE id = ?", [projectId], (err, project) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (!project) {
      return res.status(404).json({ error: "Projet non trouvé" });
    }

    const fileSql = `
      INSERT INTO project_files
      (project_id, file_data, file_name, file_display_name, file_type)
      VALUES (?, ?, ?, ?, ?)
    `;

    let uploadedCount = 0;
    let errorCount = 0;

    req.files.forEach((file) => {
      db.run(fileSql, [projectId, file.buffer, file.originalname, file.originalname, file.mimetype], (err) => {
        if (err) {
          errorCount++;
          console.error("Erreur insertion fichier:", err);
        } else {
          uploadedCount++;
        }

        if (uploadedCount + errorCount === req.files.length) {
          if (errorCount === 0) {
            res.json({ message: `${uploadedCount} fichier(s) ajouté(s) avec succès` });
          } else {
            res.status(207).json({ 
              message: `${uploadedCount} fichier(s) ajouté(s), ${errorCount} erreur(s)`,
              uploaded: uploadedCount,
              errors: errorCount
            });
          }
        }
      });
    });
  });
});

// GET ALL - GET /api/projects
router.get("/", (req, res) => {
  db.all("SELECT * FROM projects ORDER BY created_at DESC", [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    res.json(rows);
  });
});

// GET ONE - GET /api/projects/:projectId
router.get("/:projectId", (req, res) => {
  db.get("SELECT * FROM projects WHERE id = ?", [req.params.projectId], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    res.json(row);
  });
});

// GET FILES OF PROJECT - GET /api/projects/:projectId/files
router.get("/:projectId/files", (req, res) => {
  db.all("SELECT id, file_name, file_display_name, file_type FROM project_files WHERE project_id = ? ORDER BY created_at", [req.params.projectId], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    res.json(rows);
  });
});

// DOWNLOAD FILE - GET /api/projects/:projectId/file/:fileId/download
router.get("/:projectId/file/:fileId/download", (req, res) => {
  db.get("SELECT file_data, file_name, file_type FROM project_files WHERE id = ? AND project_id = ?", [req.params.fileId, req.params.projectId], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (!row || !row.file_data) {
      return res.status(404).json({ error: "Fichier non trouvé" });
    }

    res.setHeader("Content-Type", row.file_type);
    res.setHeader("Content-Disposition", `attachment; filename="${row.file_name}"`);
    res.send(row.file_data);
  });
});

// VIEW FILE - GET /api/projects/:projectId/file/:fileId/view
router.get("/:projectId/file/:fileId/view", (req, res) => {
  db.get("SELECT file_data, file_name, file_type FROM project_files WHERE id = ? AND project_id = ?", [req.params.fileId, req.params.projectId], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (!row || !row.file_data) {
      return res.status(404).json({ error: "Fichier non trouvé" });
    }

    res.setHeader("Content-Type", row.file_type);
    res.setHeader("Cache-Control", "public, max-age=3600");
    res.send(row.file_data);
  });
});

// RENAME FILE - PUT /api/projects/:projectId/file/:fileId/rename
router.put("/:projectId/file/:fileId/rename", (req, res) => {
  const { new_name } = req.body;

  if (!new_name) {
    return res.status(400).json({ error: "Le nouveau nom est requis" });
  }

  db.run("UPDATE project_files SET file_display_name = ? WHERE id = ? AND project_id = ?", [new_name, req.params.fileId, req.params.projectId], (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    res.json({ message: "Fichier renommé avec succès" });
  });
});

// DELETE FILE - DELETE /api/projects/:projectId/file/:fileId
router.delete("/:projectId/file/:fileId", (req, res) => {
  db.run("DELETE FROM project_files WHERE id = ? AND project_id = ?", [req.params.fileId, req.params.projectId], (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    res.json({ message: "Fichier supprimé avec succès" });
  });
});

// UPDATE PROJECT - PUT /api/projects/:projectId
router.put("/:projectId", authenticateToken, (req, res) => {
  const { code_anr, title_fr, title_en, summary_fr, summary_en } = req.body;
  
  const sql = `
    UPDATE projects 
    SET code_anr = ?, title_fr = ?, title_en = ?, summary_fr = ?, summary_en = ?
    WHERE id = ?
  `;

  db.run(sql, [code_anr, title_fr, title_en, summary_fr, summary_en, req.params.projectId], (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    res.json({ message: "Projet modifié avec succès" });
  });
});

// DELETE PROJECT - DELETE /api/projects/:projectId
router.delete("/:projectId", authenticateToken, (req, res) => {
  db.run("DELETE FROM projects WHERE id = ?", [req.params.projectId], (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    res.json({ message: "Projet supprimé avec succès" });
  });
});

module.exports = router;