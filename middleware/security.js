/**
 * Middleware de sécurité supplémentaire
 */

const rateLimit = require("express-rate-limit");

// Rate limiter pour le login (brute force protection)
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // max 5 tentatives par IP
  message: "Trop de tentatives de connexion. Réessayez plus tard.",
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiter pour l'API (global)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // max 100 requêtes par IP
  message: "Trop de requêtes. Réessayez plus tard.",
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = {
  loginLimiter,
  apiLimiter
};
