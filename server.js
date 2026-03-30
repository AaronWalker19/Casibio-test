const express = require("express");
const cors = require("cors");
const path = require("path");
const db = require("./db/database");
const projectsRoutes = require("./routes/projects");

const app = express();

app.use(cors());
app.use(express.json());

// routes API PRIORITAIRE
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
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});