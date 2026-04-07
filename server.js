const express = require("express");
const path = require("path");
const cors = require("cors");
require("dotenv").config(); // Charger les variables d'environnement

const app = express();

console.log("🚀 SERVER START - MYSQL VERSION");

// ===== CONFIGURATION MYSQL =====
const mysqlConfig = {
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "casibio"
};

console.log(`\n📊 MySQL Configuration:`);
console.log(`   Host: ${mysqlConfig.host}:${mysqlConfig.port}`);
console.log(`   User: ${mysqlConfig.user}`);
console.log(`   Database: ${mysqlConfig.database}`);
console.log(`   💡 Gérer via phpMyAdmin: http://localhost/phpmyadmin\n`);

// ===== CORS =====
app.use(cors({
  origin: true,
  credentials: true
}));

// ===== SAFE IMPORTS =====
let initializeAdmin, db;

try {
  initializeAdmin = require("./db/init-admin");
  db = require("./db/database");
} catch (err) {
  console.error("❌ Erreur import DB:", err.message);
}

// ===== MIDDLEWARE =====
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// ===== ROUTES API =====
try {
  const authRoutes = require("./routes/auth");
  const projectRoutes = require("./routes/projects");

  app.use("/api/auth", authRoutes);
  app.use("/api/projects", projectRoutes);
  console.log("✓ Routes API enregistrées");

} catch (err) {
  console.error("❌ Erreur import routes:", err.message);
}

// ===== HEALTH CHECK =====
app.get("/api/health", (req, res) => {
  res.json({ 
    status: "OK",
    database: "MySQL",
    config: {
      host: mysqlConfig.host,
      database: mysqlConfig.database
    }
  });
});

// ===== SERVE FRONTEND =====
app.use(express.static(path.join(__dirname, "client/build")));

// ===== CATCH ALL (IMPORTANT FIX) =====
app.use((req, res, next) => {
  // 🔥 NE PAS intercepter les routes API
  if (req.path.startsWith("/api")) {
    return res.status(404).json({ error: "API route not found" });
  }

  res.sendFile(path.join(__dirname, "client/build/index.html"));
});

// ===== ERROR HANDLER =====
app.use((err, req, res, next) => {
  console.error("❌ Erreur serveur:", err);
  res.status(500).json({
    error: err.message || "Erreur interne du serveur",
  });
});

// ===== PORT =====
const port = process.env.PORT || 3000;

// ===== START SERVER =====
async function startServer() {
  try {
    console.log("\n⏳ Initialisation de la base de données...\n");

    if (db && db.init) {
      await db.init();
      console.log("✓ Base de données MySQL initialisée");
    }

    if (initializeAdmin) {
      await initializeAdmin();
      console.log("✓ Admin initialization complete");
    }

    // ===== AFFICHER LES COMPTES =====
    if (db && db.prepare) {
      try {
        const usersStmt = db.prepare("SELECT id, username, email, role FROM users ORDER BY created_at DESC");
        const users = await usersStmt.all();
        console.log("\n📋 COMPTES UTILISATEURS :");
        console.log("═".repeat(70));
        if (users.length > 0) {
          users.forEach(user => {
            const roleEmoji = user.role === "admin" ? "👑" : "👤";
            console.log(`  ${roleEmoji} ${user.username.padEnd(20)} | Email: ${user.email.padEnd(25)} | Role: ${user.role}`);
          });
        } else {
          console.log("  (Aucun compte créé)");
        }
        console.log("═".repeat(70));
      } catch (err) {
        console.error("❌ Erreur lecture comptes:", err.message);
      }

      // ===== AFFICHER LES PROJETS =====
      try {
        const projectsStmt = db.prepare("SELECT id, code_anr, title_fr, title_en FROM projects ORDER BY created_at DESC LIMIT 50");
        const projects = await projectsStmt.all();
        console.log("\n📚 PROJETS :");
        console.log("═".repeat(70));
        if (projects.length > 0) {
          projects.forEach(project => {
            const code = project.code_anr || "N/A";
            console.log(`  📌 [${code.padEnd(15)}] ${project.title_fr}`);
            console.log(`     └─ ${project.title_en}`);
          });
        } else {
          console.log("  (Aucun projet créé)");
        }
        console.log("═".repeat(70) + "\n");
      } catch (err) {
        console.error("❌ Erreur lecture projets:", err.message);
      }
    }

    app.listen(port, () => {
      console.log(`\n✓ Server running on port ${port}`);
      console.log(`🌐 Access: http://localhost:${port}`);
      console.log(`🔗 API: http://localhost:${port}/api/health\n`);
    });

  } catch (err) {
    console.error("\n❌ Erreur au démarrage:", err.message);
    console.error("\n💡 Conseil: Vérifier que MySQL est bien démarré et que les identifiants .env sont corrects");
    process.exit(1);
  }
}

startServer();