const express = require("express");
const router = express.Router();
const db = require("../db/database");
const bcrypt = require("bcryptjs");
const { generateToken, authenticateToken, requireAdmin } = require("../middleware/auth");

const SALT_ROUNDS = 10;

// Log pour déboguer
router.use((req, res, next) => {
  console.log("Auth route received:", req.method, req.path);
  next();
});

// Helper: Vérifier si premier admin
const checkFirstUser = async () => {
  const stmt = db.prepare("SELECT COUNT(*) as count FROM users");
  const row = await stmt.get();
  return row.count === 0;
};

// REGISTER - POST /api/auth/register
router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: "Champs requis manquants" });
  }

  try {
    // Vérifier si c'est le premier utilisateur
    const isFirstUser = await checkFirstUser();
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
    return res.status(500).json({ error: err.message || "Erreur serveur" });
  }
});

// LOGIN - POST /api/auth/login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  console.log("\n" + "=".repeat(60));
  console.log("🔐 TENTATIVE DE CONNEXION");
  console.log("=".repeat(60));
  console.log(`📥 Données reçues:`);
  console.log(`   Username: ${username || "(vide)"}`);
  console.log(`   Password: ${password ? "***" : "(vide)"}`);

  if (!username || !password) {
    console.log("❌ Erreur: Champs manquants\n");
    return res.status(400).json({ error: "Utilisateur et mot de passe requis" });
  }

  try {
    console.log(`\n⏳ Recherche de l'utilisateur '${username}' dans la base de données...`);
    const stmt = db.prepare("SELECT * FROM users WHERE username = ?");
    const user = await stmt.get(username);

    if (!user) {
      console.log(`❌ Utilisateur '${username}' non trouvé dans la base de données`);
      console.log(`\n💡 Utilisateurs disponibles dans MySQL:`);
      const allUsers = await db.prepare("SELECT id, username, email, role FROM users").all();
      if (allUsers.length === 0) {
        console.log("   ⚠️  Aucun utilisateur enregistré!");
      } else {
        allUsers.forEach(u => {
          console.log(`   • ${u.username} (${u.role})`);
        });
      }
      console.log("");
      return res.status(401).json({ error: "Utilisateur non trouvé" });
    }

    console.log(`✓ Utilisateur trouvé:`);
    console.log(`   ID: ${user.id}`);
    console.log(`   Username: ${user.username}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Role: ${user.role}`);
    console.log(`   Password hash: ${user.password_hash.substring(0, 20)}...`);

    console.log(`\n⏳ Comparaison du mot de passe...`);
    const isMatch = await bcrypt.compare(password, user.password_hash);
    
    if (!isMatch) {
      console.log(`❌ Mot de passe INCORRECT`);
      console.log(`   Votre mot de passe: ${password}`);
      console.log(`   Hash stocké: ${user.password_hash}`);
      console.log("");
      return res.status(401).json({ error: "Mot de passe incorrect" });
    }

    console.log(`✓ Mot de passe CORRECT!`);
    console.log(`\n⏳ Génération du token JWT...`);
    const token = generateToken(user.id, user.username, user.role);
    
    console.log(`✅ CONNEXION RÉUSSIE!`);
    console.log(`   Token généré: ${token.substring(0, 30)}...`);
    console.log("=".repeat(60) + "\n");

    res.json({
      message: "Connexion réussie",
      token,
      user: { id: user.id, username: user.username, email: user.email, role: user.role }
    });
  } catch (error) {
    console.error("❌ Erreur serveur:", error.message);
    console.error(error);
    console.log("=".repeat(60) + "\n");
    return res.status(500).json({ error: error.message });
  }
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
    return res.status(500).json({ error: err.message });
  }
});

// UPDATE USER ROLE - PUT /api/auth/users/:id (admin only)
router.put("/users/:id", authenticateToken, requireAdmin, async (req, res) => {
  const { role } = req.body;
  const { id } = req.params;
  const validRoles = ["admin", "member"];

  if (!validRoles.includes(role)) {
    return res.status(400).json({ error: "Rôle invalide" });
  }

  try {
    const sql = "UPDATE users SET role = ? WHERE id = ?";
    const stmt = db.prepare(sql);
    await stmt.run(role, id);

    res.json({ message: "Rôle mis à jour" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// DELETE USER - DELETE /api/auth/users/:id (admin only)
router.delete("/users/:id", authenticateToken, requireAdmin, async (req, res) => {
  const { id } = req.params;

  try {
    const sql = "DELETE FROM users WHERE id = ?";
    const stmt = db.prepare(sql);
    await stmt.run(id);

    res.json({ message: "Utilisateur supprimé" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;
