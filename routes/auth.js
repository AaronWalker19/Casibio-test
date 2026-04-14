const express = require("express");
const router = express.Router();
const db = require("../db/database");
const bcrypt = require("bcryptjs");
const { check, validationResult } = require("express-validator");
const { loginLimiter } = require("../middleware/security");
const { generateToken, authenticateToken, requireAdmin } = require("../middleware/auth");

const SALT_ROUNDS = 10;

// Log pour déboguer
router.use((req, res, next) => {
  console.log("Auth route received:", req.method, req.path);
  next();
});

// REGISTER - POST /api/auth/register
router.post("/register", 
  [
    check('username').trim().isLength({ min: 3, max: 100 }).notEmpty().withMessage('Username doit faire 3-100 caractères'),
    check('email').isEmail().withMessage('Email invalide'),
    check('password').isLength({ min: 8 }).withMessage('Mot de passe doit faire au moins 8 caractères'),
  ],
  async (req, res) => {
    // Validation des erreurs
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password } = req.body;

    try {
      // Vérifier si c'est le premier utilisateur
      const checkStmt = db.prepare("SELECT COUNT(*) as count FROM users");
      const row = await checkStmt.get();
      const isFirstUser = row && row.count === 0;
      const userRole = isFirstUser ? "admin" : "member";

      // Hash password
      const hash = await bcrypt.hash(password, SALT_ROUNDS);

      const sql = `
        INSERT INTO users (username, email, password_hash, role)
        VALUES (?, ?, ?, ?)
      `;

      const stmt = db.prepare(sql);
      const result = await stmt.run(username, email, hash, userRole);

      const newUserId = result.lastInsertRowid || 1;
      const tokenJwt = generateToken(newUserId, username, userRole);
      
      res.json({
        message: "Utilisateur créé",
        token: tokenJwt,
        user: { id: newUserId, username, email, role: userRole }
      });
    } catch (err) {
      if (err.message && err.message.includes("UNIQUE")) {
        return res.status(400).json({ error: "Utilisateur ou email déjà existant" });
      }
      console.error("Register error:", err);
      // SÉCURITÉ: Ne pas exposer les détails d'erreur
      return res.status(500).json({ error: "Erreur lors de l'enregistrement" });
    }
  }
);

// LOGIN - POST /api/auth/login avec protection brute force
router.post("/login", 
  loginLimiter, // SÉCURITÉ: Rate limiting
  [
    check('username').trim().notEmpty().withMessage('Username requis'),
    check('password').notEmpty().withMessage('Mot de passe requis'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, password } = req.body;

    try {
      // Vérifier que le pool est initialisé
      const dbPool = db && typeof db.pool === 'function' ? db.pool() : null;
      if (!dbPool) {
        console.error("❌ DB Pool not initialized on login attempt");
        return res.status(503).json({ 
          error: "Service indisponible - base de données non connectée" 
        });
      }

      const stmt = db.prepare("SELECT * FROM users WHERE username = ?");
      const user = await stmt.get(username);

      if (!user) {
        // SÉCURITÉ: Message d'erreur générique pour ne pas révéler si l'utilisateur existe
        return res.status(401).json({ error: "Identifiants invalides" });
      }

      // Vérifier le mot de passe
      const isPasswordValid = await bcrypt.compare(password, user.password_hash);
      if (!isPasswordValid) {
        return res.status(401).json({ error: "Identifiants invalides" });
      }

      // Générer le token
      const token = generateToken(user.id, user.username, user.role);
      
      // Définir le cookie httpOnly et secure
      res.cookie('authToken', token, {
        httpOnly: true,           // ✅ Pas accessible en JS (protection XSS)
        secure: process.env.NODE_ENV === 'production', // HTTPS seulement en production
        sameSite: 'strict',       // Protection CSRF
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 jours
      });
      
      res.json({
        message: "Connexion réussie",
        token,
        user: { id: user.id, username: user.username, email: user.email, role: user.role }
      });
    } catch (err) {
      console.error("❌ Login error:", {
        message: err.message,
        stack: err.stack,
        name: err.name,
        code: err.code
      });
      
      // Erreur spécifique pour MySQL
      if (err.code === 'PROTOCOL_CONNECTION_LOST' || err.code === 'ER_ACCESS_DENIED_ERROR') {
        return res.status(503).json({ 
          error: "Erreur de connexion à la base de données"
        });
      }
      
      // Ne pas exposer les détails d'erreur en production
      const isDevMode = process.env.NODE_ENV === "development";
      return res.status(500).json({ 
        error: "Erreur lors de la connexion",
        ...(isDevMode && { details: err.message })
      });
    }
  }
);

// VERIFY TOKEN - GET /api/auth/verify
router.get("/verify", (req, res) => {
  const jwt = require("jsonwebtoken");
  const SECRET_KEY = process.env.JWT_SECRET;
  
  // Chercher le token dans le header Authorization ou dans le cookie
  const authHeader = req.headers["authorization"];
  const tokenFromHeader = authHeader && authHeader.split(" ")[1]; // "Bearer TOKEN"
  const tokenFromCookie = req.cookies?.authToken;
  const token = tokenFromHeader || tokenFromCookie;

  if (!token) {
    return res.json({ valid: false });
  }

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      return res.json({ valid: false });
    }
    res.json({ valid: true, user });
  });
});

// LOGOUT - POST /api/auth/logout
router.post("/logout", (req, res) => {
  res.clearCookie('authToken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  });
  res.json({ message: "Déconnexion réussie" });
});

// GET CURRENT USER - GET /api/auth/me
router.get("/me", authenticateToken, (req, res) => {
  res.json({ user: req.user });
});

// GET ALL USERS - GET /api/auth/users (admin only)
router.get("/users", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const stmt = db.prepare("SELECT id, username, email, role, created_at FROM users");
    const rows = await stmt.all();
    res.json(rows);
  } catch (err) {
    console.error("Get users error:", err);
    return res.status(500).json({ error: "Erreur lors de la récupération des utilisateurs" });
  }
});

// UPDATE USER ROLE - PUT /api/auth/users/:id (admin only)
router.put("/users/:id", 
  authenticateToken, 
  requireAdmin,
  [
    check('role').isIn(['admin', 'member']).withMessage('Rôle invalide'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { role } = req.body;
    const { id } = req.params;

    // SÉCURITÉ: Valider que l'ID est numérique
    if (!/^\d+$/.test(id)) {
      return res.status(400).json({ error: "ID invalide" });
    }

    try {
      const sql = "UPDATE users SET role = ? WHERE id = ?";
      const stmt = db.prepare(sql);
      await stmt.run(role, id);

      res.json({ message: "Rôle mis à jour" });
    } catch (err) {
      console.error("Update user role error:", err);
      return res.status(500).json({ error: "Erreur lors de la mise à jour" });
    }
  }
);

// DELETE USER - DELETE /api/auth/users/:id (admin only)
router.delete("/users/:id", authenticateToken, requireAdmin, async (req, res) => {
  const { id } = req.params;

  // SÉCURITÉ: Valider que l'ID est numérique
  if (!/^\d+$/.test(id)) {
    return res.status(400).json({ error: "ID invalide" });
  }

  try {
    const sql = "DELETE FROM users WHERE id = ?";
    const stmt = db.prepare(sql);
    await stmt.run(id);

    res.json({ message: "Utilisateur supprimé" });
  } catch (err) {
    console.error("Delete user error:", err);
    return res.status(500).json({ error: "Erreur lors de la suppression" });
  }
});

module.exports = router;
