const express = require("express");
const router = express.Router();
const db = require("../db/database");

// Log pour déboguer les requêtes
router.use((req, res, next) => {
  console.log("Requête reçue sur /api/projects :", req.method, req.path);
  next();
});

// CREATE - POST /api/projects
router.post("/", (req, res) => {
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

    res.json({ id: this.lastID, message: "Projet créé avec succès" });
  });
});

// GET ALL - GET /api/projects
router.get("/", (req, res) => {
  db.all("SELECT * FROM projects", [], (err, rows) => {
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

module.exports = router;