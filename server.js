const express = require("express");
const cors = require("cors");
const path = require("path");
const db = require("./db/database");
const initializeAdmin = require("./db/init-admin");
const projectsRoutes = require("./routes/projects");
const authRoutes = require("./routes/auth");

// Initialize admin account on startup
setTimeout(() => {
  initializeAdmin();
}, 500);

console.log("All routes loaded successfully");

const app = express();

app.use(cors());
app.use(express.json());

// Logging middleware  
app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.path} - Content-Type: ${req.headers['content-type']}`);
  next();
});

// routes API PRIORITAIRE
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectsRoutes);

app.get("/api/test", (req, res) => {
  res.json({ message: "Backend OK" });
});

// servir React (après les routes API)
app.use(express.static(path.join(__dirname, "client/build")));

// catch-all pour React (DOIT ÊTRE DERNIER)
app.use((req, res) => {
  res.sendFile(path.join(__dirname, "client/build/index.html"));
});

// PORT dynamique
const PORT = process.env.PORT || 8080;

const server = app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});

// Garder le processus vivant
process.on('uncaughtException', (err) => {
  console.error("Uncaught Exception:", err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});