// Test avec un token valide
const jwt = require("jsonwebtoken");
const http = require("http");
require("dotenv").config();

const SECRET_KEY = process.env.JWT_SECRET || "test-secret";
const API_URL = "http://localhost:3000";

// Générer un token pour l'admin avec ID 1
const validToken = jwt.sign(
  { userId: 1, username: "admin", role: "admin" },
  SECRET_KEY,
  { expiresIn: "7d" }
);

console.log("Generated token:", validToken.substring(0, 50) + "...\n");

async function testEndpoint(path, name, token) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, API_URL);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    };

    console.log(`\n📍 ${name}`);
    console.log(`   URL: ${path}`);

    const req = http.request(options, (res) => {
      let data = "";

      res.on("data", (chunk) => {
        data += chunk;
      });

      res.on("end", () => {
        console.log(`   Status: ${res.statusCode}`);
        if (data) {
          try {
            const json = JSON.parse(data);
            if (Array.isArray(json)) {
              console.log(`   Response: Array with ${json.length} items`);
              if (json.length > 0) {
                console.log(`   First item:`, JSON.stringify(json[0], null, 2).substring(0, 300));
              }
            } else {
              console.log(`   Response:`, JSON.stringify(json, null, 2).substring(0, 300));
            }
          } catch (e) {
            console.log(`   Response:`, data.substring(0, 200));
          }
        }
        resolve(res.statusCode);
      });
    });

    req.on("error", (err) => {
      console.log(`   Error: ${err.message}`);
      reject(err);
    });

    req.end();
  });
}

async function runTests() {
  try {
    console.log("✅ Testing API Endpoints with Valid Admin Token\n");
    
    const status1 = await testEndpoint("/api/auth/users", "GET /api/auth/users", validToken);
    const status2 = await testEndpoint("/api/auth/invitations", "GET /api/auth/invitations", validToken);
    
    console.log("\n\n📊 Results:");
    console.log(`   /api/auth/users: ${status1 === 200 ? "✅ OK (200)" : `❌ ${status1}`}`);
    console.log(`   /api/auth/invitations: ${status2 === 200 ? "✅ OK (200)" : `❌ ${status2}`}`);
    
    process.exit(0);
  } catch (err) {
    console.error("❌ Test error:", err.message);
    process.exit(1);
  }
}

// Attendre que le serveur soit prêt
setTimeout(runTests, 1000);
