// Test les endpoints GET /api/auth/users et GET /api/auth/invitations
const http = require("http");

// Récupérer les variables d'environnement
require("dotenv").config();

const API_URL = "http://localhost:3000";
const JWT_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInVzZXJuYW1lIjoiYWRtaW4iLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3MTEwMDAwMDAsImV4cCI6MTc0MjUzNjAwMH0.test"; // Un token invalide pour tester

async function testEndpoint(path, name) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, API_URL);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: "GET",
      headers: {
        "Authorization": `Bearer ${JWT_TOKEN}`,
        "Content-Type": "application/json"
      }
    };

    console.log(`\n📍 Testing: ${name}`);
    console.log(`   URL: ${path}`);
    console.log(`   Method: ${options.method}`);

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
            console.log(`   Response:`, JSON.stringify(json, null, 2).substring(0, 200));
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
    console.log("🧪 Testing API Endpoints\n");
    
    const status1 = await testEndpoint("/api/auth/users", "GET /api/auth/users");
    const status2 = await testEndpoint("/api/auth/invitations", "GET /api/auth/invitations");
    
    console.log("\n\n📊 Results:");
    console.log(`   /api/auth/users: ${status1 === 200 ? "✅ OK" : `❌ ${status1}`}`);
    console.log(`   /api/auth/invitations: ${status2 === 200 ? "✅ OK" : `❌ ${status2}`}`);
    
    process.exit(0);
  } catch (err) {
    console.error("❌ Test error:", err.message);
    process.exit(1);
  }
}

// Attendre que le serveur soit prêt
setTimeout(runTests, 1000);
