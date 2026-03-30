const express = require("express");
const router = express.Router();
const db = require("../db/database");
const multer = require("multer");

// Configuration de multer pour garder les fichiers en mémoire
const upload = multer({ 
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB max
});

// Log pour déboguer les requêtes
router.use((req, res, next) => {
  console.log("Requête reçue sur /api/projects :", req.method, req.path);
  next();
});

// CREATE - POST /api/projects (avec fichier optionnel)
router.post("/", upload.single("file"), (req, res) => {
  const {
    code_anr,
    title_fr,
    title_en,
    summary_fr,
    summary_en
  } = req.body;

  const file = req.file;
  const fileData = file ? file.buffer : null;
  const fileName = file ? file.originalname : null;
  const fileType = file ? file.mimetype : null;

  const sql = `
    INSERT INTO projects
    (code_anr, title_fr, title_en, summary_fr, summary_en, file_data, file_name, file_type)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.run(sql, [code_anr, title_fr, title_en, summary_fr, summary_en, fileData, fileName, fileType], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    res.json({ id: this.lastID, message: "Projet créé avec succès" });
  });
});

// GET ALL - GET /api/projects
router.get("/", (req, res) => {
  db.all("SELECT id, code_anr, title_fr, title_en, summary_fr, summary_en, file_name, file_type, created_at FROM projects", [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    res.json(rows);
  });
});

// GET ONE - GET /api/projects/:id
router.get("/:id", (req, res) => {
  db.get("SELECT * FROM projects WHERE id = ?", [req.params.id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    res.json(row);
  });
});

// DOWNLOAD FILE - GET /api/projects/:id/download
router.get("/:id/download", (req, res) => {
  db.get("SELECT file_data, file_name, file_type FROM projects WHERE id = ?", [req.params.id], (err, row) => {
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

// VIEW FILE - GET /api/projects/:id/file (pour affichage direct)
router.get("/:id/file", (req, res) => {
  db.get("SELECT file_data, file_name, file_type FROM projects WHERE id = ?", [req.params.id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (!row || !row.file_data) {
      return res.status(404).json({ error: "Fichier non trouvé" });
    }

    // Servir le fichier sans attachment (pour affichage dans le navigateur)
    res.setHeader("Content-Type", row.file_type);
    res.setHeader("Cache-Control", "public, max-age=3600");
    res.send(row.file_data);
  });
});

module.exports = router;