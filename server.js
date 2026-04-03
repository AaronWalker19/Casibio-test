const express = require("express");
const app = express();
const initializeAdmin = require("./db/init-admin");
const db = require("./db/database");

console.log("🚀 SERVER START");

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import routes
const authRoutes = require("./routes/auth");
const projectRoutes = require("./routes/projects");

// Use routes
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);

app.get("/", (req, res) => {
  res.send("OK CLEAN");
});

// Gestion des erreurs globales
app.use((err, req, res, next) => {
  console.error("❌ Erreur serveur:", err);
  res.status(500).json({ error: err.message || "Erreur interne du serveur" });
});

const port = process.env.PORT || 3000;

// Initialiser la base de données puis démarrer le serveur
async function startServer() {
  try {
    // Initialiser la BD
    await db.init();
    console.log("✓ Base de données initialisée");
    
    // Initialiser l'admin
    await initializeAdmin();
    console.log("✓ Admin initialization complete");
    
    // Démarrer le serveur
    app.listen(port, () => {
      console.log(`✓ Server running on port ${port}`);
    });
  } catch (err) {
    console.error("❌ Erreur au démarrage:", err.message);
    process.exit(1);
  }
}

startServer();