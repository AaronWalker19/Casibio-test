const express = require("express");
const path = require("path");
const cors = require("cors");

const app = express();

console.log("🚀 SERVER START");

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
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ===== ROUTES API =====
try {
  const authRoutes = require("./routes/auth");
  const projectRoutes = require("./routes/projects");

  app.use("/api/auth", authRoutes);
  app.use("/api/projects", projectRoutes);

} catch (err) {
  console.error("❌ Erreur import routes:", err.message);
}

// ===== HEALTH CHECK =====
app.get("/api/health", (req, res) => {
  res.json({ status: "OK" });
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
    if (db && db.init) {
      await db.init();
      console.log("✓ Base de données initialisée");
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
        console.log("═".repeat(60));
        if (users.length > 0) {
          users.forEach(user => {
            console.log(`  👤 ${user.username.padEnd(20)} | Email: ${user.email.padEnd(25)} | Rôle: ${user.role}`);
          });
        } else {
          console.log("  (Aucun compte créé)");
        }
        console.log("═".repeat(60) + "\n");
      } catch (err) {
        console.error("❌ Erreur lecture comptes:", err.message);
      }

      // ===== AFFICHER LES PROJETS =====
      try {
        const projectsStmt = db.prepare("SELECT id, code_anr, title_fr, title_en FROM projects ORDER BY created_at DESC");
        const projects = await projectsStmt.all();
        console.log("\n📚 PROJETS :");
        console.log("═".repeat(60));
        if (projects.length > 0) {
          projects.forEach(project => {
            console.log(`  📌 [${project.code_anr}] ${project.title_fr}`);
            console.log(`     └─ ${project.title_en}`);
          });
        } else {
          console.log("  (Aucun projet créé)");
        }
        console.log("═".repeat(60) + "\n");
      } catch (err) {
        console.error("❌ Erreur lecture projets:", err.message);
      }
    }

    app.listen(port, () => {
      console.log(`✓ Server running on port ${port}`);
    });

  } catch (err) {
    console.error("❌ Erreur au démarrage:", err.message);
  }
}

startServer();