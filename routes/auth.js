const express = require("express");
const router = express.Router();
const db = require("../db/database");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const { check, validationResult } = require("express-validator");
const { loginLimiter } = require("../middleware/security");
const { generateToken, authenticateToken, requireAdmin } = require("../middleware/auth");

// Service d'emails (optionnel)
let sendInvitationEmail;
try {
  sendInvitationEmail = require("../services/emailService").sendInvitationEmail;
} catch (err) {
  console.warn("⚠️  Service d'email non disponible. Les emails ne seront pas envoyés.");
  console.error("❌ Erreur détail:", err.message);
  console.error("Stack:", err.stack);
  sendInvitationEmail = async () => {
    console.log("📧 Service d'email désactivé. Email non envoyé.");
    return true; // On continue même sans email
  };
}

const SALT_ROUNDS = 10;

// ============================================
// Utilitaires pour les tokens d'invitation
// ============================================

// Générer un token d'invitation
const generateInvitationToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

// Hasher le token pour la BD
const hashToken = (token) => {
  return crypto.createHash('sha256').update(token).digest('hex');
};

// Envoyer un email d'invitation (stub - à intégrer avec un vrai service d'email)
const sendInvitationEmailNotification = async (email, token, frontendUrl) => {
  return await sendInvitationEmail(email, token, frontendUrl);
};

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
    check('username').trim().notEmpty().withMessage('Username ou email requis'),
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

      // Chercher l'utilisateur par username OU email
      const stmt = db.prepare("SELECT * FROM users WHERE username = ? OR email = ?");
      const user = await stmt.get(username, username);

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
    const stmt = db.prepare("SELECT id, username, email, name, role, created_at FROM users");
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

// ============================================
// NOUVELLES ROUTES: Invitation et Activation
// ============================================

// INVITE MEMBER - POST /api/auth/invite (admin only)
// Envoie une invitation par email pour créer un compte
router.post("/invite", 
  authenticateToken,
  requireAdmin,
  [
    check('email').isEmail().withMessage('Email invalide'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email } = req.body;
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';

    try {
      // Vérifier si l'email existe déjà
      const existingUser = await db.prepare("SELECT id FROM users WHERE email = ?").get(email);
      if (existingUser) {
        return res.status(400).json({ error: "Cet email est déjà utilisé" });
      }

      // Vérifier si l'invitation existe déjà et n'est pas expirée
      const existingInvite = await db.prepare(
        "SELECT id FROM user_invitations WHERE email = ? AND activated_at IS NULL AND expires_at > NOW()"
      ).get(email);
      
      if (existingInvite) {
        return res.status(400).json({ error: "Une invitation active existe déjà pour cet email" });
      }

      // Générer le token
      const token = generateInvitationToken();
      const tokenHash = hashToken(token);
      
      // Calculer l'expiration (48 heures)
      const expiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000);

      // Insérer l'invitation en BD
      const sql = `
        INSERT INTO user_invitations (email, token_hash, invited_by, expires_at)
        VALUES (?, ?, ?, ?)
      `;
      const stmt = db.prepare(sql);
      await stmt.run(email, tokenHash, req.user.userId, expiresAt.toISOString());

      // Envoyer l'email
      await sendInvitationEmailNotification(email, token, frontendUrl);

      res.json({
        message: "Invitation envoyée avec succès",
        email,
        expiresAt
      });
    } catch (err) {
      console.error("Invite member error:", err);
      return res.status(500).json({ error: "Erreur lors de l'envoi de l'invitation" });
    }
  }
);

// VERIFY INVITATION TOKEN - GET /api/auth/invite/:token
// Vérifie que le token est valide avant activation
router.get("/invite/:token", async (req, res) => {
  const { token } = req.params;

  try {
    const tokenHash = hashToken(token);
    
    // Chercher l'invitation
    const invitation = await db.prepare(
      "SELECT email, expires_at, activated_at FROM user_invitations WHERE token_hash = ?"
    ).get(tokenHash);

    if (!invitation) {
      return res.status(404).json({ error: "Token d'invitation invalide" });
    }

    // Vérifier que le token n'a pas expiré
    if (new Date(invitation.expires_at) < new Date()) {
      return res.status(400).json({ error: "Token d'invitation expiré" });
    }

    // Vérifier que le token n'a pas déjà été utilisé
    if (invitation.activated_at) {
      return res.status(400).json({ error: "Token d'invitation déjà utilisé" });
    }

    res.json({
      valid: true,
      email: invitation.email
    });
  } catch (err) {
    console.error("Verify invitation error:", err);
    return res.status(500).json({ error: "Erreur lors de la vérification" });
  }
});

// ACTIVATE ACCOUNT - POST /api/auth/activate
// Finaliser la création du compte avec password, username, et name
router.post("/activate",
  [
    check('token').notEmpty().withMessage('Token requis'),
    check('username').trim().isLength({ min: 3, max: 100 }).notEmpty().withMessage('Username doit faire 3-100 caractères'),
    check('name').trim().notEmpty().isLength({ min: 2 }).withMessage('Nom complet requis (min 2 caractères)'),
    check('password').isLength({ min: 8 }).withMessage('Mot de passe doit faire au moins 8 caractères'),
    check('passwordConfirm').notEmpty().withMessage('Confirmation du mot de passe requise'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { token, username, name, password, passwordConfirm } = req.body;

    // Vérifier que les deux mots de passe correspondent
    if (password !== passwordConfirm) {
      return res.status(400).json({ error: "Les mots de passe ne correspondent pas" });
    }

    try {
      const tokenHash = hashToken(token);

      // Chercher et valider l'invitation
      const invitation = await db.prepare(
        "SELECT id, email, expires_at, activated_at FROM user_invitations WHERE token_hash = ?"
      ).get(tokenHash);

      if (!invitation) {
        return res.status(404).json({ error: "Token d'invitation invalide" });
      }

      if (new Date(invitation.expires_at) < new Date()) {
        return res.status(400).json({ error: "Token d'invitation expiré" });
      }

      if (invitation.activated_at) {
        return res.status(400).json({ error: "Token d'invitation déjà utilisé" });
      }

      // Vérifier que username et email ne sont pas déjà pris
      const existingUsername = await db.prepare("SELECT id FROM users WHERE username = ?").get(username);
      if (existingUsername) {
        return res.status(400).json({ error: "Ce nom d'utilisateur est déjà utilisé" });
      }

      const existingEmail = await db.prepare("SELECT id FROM users WHERE email = ?").get(invitation.email);
      if (existingEmail) {
        return res.status(400).json({ error: "Cet email est déjà utilisé" });
      }

      // Hash le mot de passe
      const hash = await bcrypt.hash(password, SALT_ROUNDS);

      // Vérifier si c'est le premier utilisateur
      const userCount = await db.prepare("SELECT COUNT(*) as count FROM users").get();
      const isFirstUser = userCount && userCount.count === 0;
      const userRole = isFirstUser ? "admin" : "member";

      // Créer l'utilisateur
      const sql = `
        INSERT INTO users (username, email, password_hash, name, role)
        VALUES (?, ?, ?, ?, ?)
      `;
      const stmt = db.prepare(sql);
      const result = await stmt.run(
        username,
        invitation.email,
        hash,
        name,
        userRole
      );

      // Marquer l'invitation comme utilisée
      const updateStmt = db.prepare("UPDATE user_invitations SET activated_at = NOW() WHERE id = ?");
      await updateStmt.run(invitation.id);

      // Générer le token JWT
      const newUserId = result.lastInsertRowid || result.changes;
      const tokenJwt = generateToken(newUserId, username, userRole);

      res.json({
        message: "Compte créé et activé avec succès",
        token: tokenJwt,
        user: {
          id: newUserId,
          username,
          email: invitation.email,
          name,
          role: userRole
        }
      });
    } catch (err) {
      console.error("Activate account error:", err);
      
      if (err.message && err.message.includes("UNIQUE")) {
        return res.status(400).json({ error: "Username ou email déjà existant" });
      }

      return res.status(500).json({ error: "Erreur lors de l'activation du compte" });
    }
  }
);

// GET PENDING INVITATIONS - GET /api/auth/invitations (admin only)
// Récupère les invitations en attente (non activées)
router.get("/invitations", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const stmt = db.prepare(`
      SELECT 
        id,
        email,
        token_hash,
        invited_by,
        created_at,
        expires_at,
        activated_at
      FROM user_invitations 
      WHERE activated_at IS NULL
      ORDER BY created_at DESC
    `);
    const invitations = await stmt.all();
    res.json(invitations || []);
  } catch (err) {
    console.error("Get invitations error:", err);
    return res.status(500).json({ error: "Erreur lors de la récupération des invitations" });
  }
});

// DELETE INVITATION - DELETE /api/auth/invitations/:id (admin only)
// Annule une invitation en attente
router.delete("/invitations/:id", authenticateToken, requireAdmin, async (req, res) => {
  const { id } = req.params;

  // Sécurité: Valider que l'ID est numérique
  if (!/^\d+$/.test(id)) {
    return res.status(400).json({ error: "ID invalide" });
  }

  try {
    const sql = "DELETE FROM user_invitations WHERE id = ? AND activated_at IS NULL";
    const stmt = db.prepare(sql);
    const result = await stmt.run(id);

    if (!result.changes) {
      return res.status(404).json({ error: "Invitation introuvable ou déjà activée" });
    }

    res.json({ message: "Invitation annulée avec succès" });
  } catch (err) {
    console.error("Delete invitation error:", err);
    return res.status(500).json({ error: "Erreur lors de l'annulation de l'invitation" });
  }
});

module.exports = router;
