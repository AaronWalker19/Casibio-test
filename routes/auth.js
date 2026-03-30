const express = require("express");
const router = express.Router();
const db = require("../db/database");
const bcrypt = require("bcrypt");
const { generateToken, authenticateToken, requireAdmin } = require("../middleware/auth");

const SALT_ROUNDS = 10;

// Log pour déboguer
router.use((req, res, next) => {
  console.log("Auth route received:", req.method, req.path);
  next();
});

// Helper: Vérifier si premier admin
const checkFirstUser = (callback) => {
  db.get("SELECT COUNT(*) as count FROM users", [], (err, row) => {
    callback(!err && row.count === 0);
  });
};

// REGISTER - POST /api/auth/register
// Premier utilisateur = admin automatiquement (pas d'auth requise)
// Autres = admin only (auth requise)
router.post("/register", (req, res) => {
  const { username, email, password, role } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: "Champs requis manquants" });
  }

  checkFirstUser((isFirstUser) => {
    // Si ce n'est pas le premier user, vérifier l'authentification admin
    if (!isFirstUser) {
      const authHeader = req.headers["authorization"];
      const token = authHeader && authHeader.split(" ")[1];

      if (!token) {
        return res.status(403).json({ error: "Accès refusé - Admin requis" });
      }

      const jwt = require("jsonwebtoken");
      const { SECRET_KEY } = require("../middleware/auth");
      
      jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err || user.role !== "admin") {
          return res.status(403).json({ error: "Accès refusé - Admin requis" });
        }
        continueRegister();
      });
    } else {
      continueRegister();
    }

    function continueRegister() {
      const userRole = isFirstUser ? "admin" : "member";

      bcrypt.hash(password, SALT_ROUNDS, (err, hash) => {
        if (err) {
          return res.status(500).json({ error: "Erreur hachage" });
        }

        const sql = `
          INSERT INTO users (username, email, password_hash, role)
          VALUES (?, ?, ?, ?)
        `;

        db.run(sql, [username, email, hash, userRole], function(err) {
          if (err) {
            if (err.message.includes("UNIQUE")) {
              return res.status(400).json({ error: "Utilisateur ou email déjà existant" });
            }
            return res.status(500).json({ error: err.message });
          }

          const token = generateToken(this.lastID, username, userRole);
          res.json({
            message: "Utilisateur créé",
            token,
            user: { id: this.lastID, username, email, role: userRole }
          });
        });
      });
    }
  });
});

// LOGIN - POST /api/auth/login
router.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Utilisateur et mot de passe requis" });
  }

  db.get("SELECT * FROM users WHERE username = ?", [username], (err, user) => {
    if (err || !user) {
      return res.status(401).json({ error: "Utilisateur non trouvé" });
    }

    bcrypt.compare(password, user.password_hash, (err, isMatch) => {
      if (err || !isMatch) {
        return res.status(401).json({ error: "Mot de passe incorrect" });
      }

      const token = generateToken(user.id, user.username, user.role);
      res.json({
        message: "Connexion réussie",
        token,
        user: { id: user.id, username: user.username, email: user.email, role: user.role }
      });
    });
  });
});

// GET CURRENT USER - GET /api/auth/me
router.get("/me", authenticateToken, (req, res) => {
  res.json({ user: req.user });
});

// GET ALL USERS - GET /api/auth/users (admin only)
router.get("/users", authenticateToken, requireAdmin, (req, res) => {
  db.all("SELECT id, username, email, role, created_at FROM users", [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// UPDATE USER ROLE - PUT /api/auth/users/:id (admin only)
router.put("/users/:id", authenticateToken, requireAdmin, (req, res) => {
  const { role } = req.body;
  const validRoles = ["admin", "member"];

  if (!validRoles.includes(role)) {
    return res.status(400).json({ error: "Rôle invalide" });
  }

  const sql = "UPDATE users SET role = ? WHERE id = ?";
  db.run(sql, [role, req.params.id], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: "Rôle mis à jour" });
  });
});

// DELETE USER - DELETE /api/auth/users/:id (admin only)
router.delete("/users/:id", authenticateToken, requireAdmin, (req, res) => {
  db.run("DELETE FROM users WHERE id = ?", [req.params.id], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: "Utilisateur supprimé" });
  });
});

module.exports = router;
