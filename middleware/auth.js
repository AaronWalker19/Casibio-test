const jwt = require("jsonwebtoken");

// SÉCURITÉ: Le JWT_SECRET DOIT être défini dans .env
const SECRET_KEY = process.env.JWT_SECRET;

if (!SECRET_KEY) {
  console.error("❌ ERREUR CRITIQUE: JWT_SECRET n'est pas défini dans .env");
  console.error("⚠️ Ajouter JWT_SECRET=<une-clé-très-sécurisée> dans votre fichier .env");
  process.exit(1);
}

// Middleware: Vérifier JWT
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // "Bearer TOKEN"

  if (!token) {
    return res.status(401).json({ error: "Token manquant" });
  }

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Token invalide" });
    }
    req.user = user;
    next();
  });
};

// Middleware: Vérifier rôle admin
const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ error: "Accès refusé - Admin requis" });
  }
  next();
};

// Générer token
const generateToken = (userId, username, role) => {
  return jwt.sign(
    { userId, username, role },
    SECRET_KEY,
    { expiresIn: "7d" }
  );
};

module.exports = {
  authenticateToken,
  requireAdmin,
  generateToken,
  SECRET_KEY
};
