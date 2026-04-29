#!/usr/bin/env node

const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config();

async function diagnoseContents() {
  let connection;
  
  try {
    console.log("\n📊 DIAGNOSTIC DES CONTENUS D'ARTICLES\n");
    console.log("═".repeat(50));

    // Créer une connexion MySQL
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || "localhost",
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "",
      database: process.env.DB_NAME || "casibio"
    });

    console.log("✅ Connecté à la base de données\n");

    // 1. Compter les projets
    const [projectRows] = await connection.execute("SELECT COUNT(*) as count FROM projects");
    const projectCount = projectRows[0].count;
    console.log(`📦 Projets: ${projectCount}`);

    // 2. Récupérer les projets
    const [projects] = await connection.execute(
      "SELECT id, title_fr, title_en FROM projects ORDER BY id DESC LIMIT 5"
    );

    if (!projects || projects.length === 0) {
      console.log("❌ Aucun projet trouvé!");
      await connection.end();
      process.exit(0);
    }

    // 3. Pour chaque projet, afficher les contenus
    for (const project of projects) {
      console.log(`\n\n📄 Projet: ${project.title_fr} (ID: ${project.id})`);
      console.log(`   Titre EN: ${project.title_en}`);
      console.log("   " + "─".repeat(45));

      // Récupérer les contenus
      const [contents] = await connection.execute(
        `SELECT id, title_fr, title_en, content_fr, content_en, position 
         FROM project_contents 
         WHERE project_id = ? 
         ORDER BY position ASC`,
        [project.id]
      );

      if (!contents || contents.length === 0) {
        console.log("   ⚠️  AUCUN CONTENU trouvé pour ce projet!");
      } else {
        console.log(`   ✅ ${contents.length} contenu(s) trouvé(s):`);

        for (let i = 0; i < contents.length; i++) {
          const content = contents[i];
          console.log(`\n   Contenu #${i + 1}:`);
          console.log(`     - ID: ${content.id}`);
          console.log(`     - Position: ${content.position}`);
          console.log(`     - Titre FR: ${content.title_fr || "(null)"}`);
          console.log(`     - Titre EN: ${content.title_en || "(null)"}`);
          const contentPreview = content.content_fr 
            ? `${content.content_fr.substring(0, 80)}${content.content_fr.length > 80 ? '...' : ''}`
            : "(null)";
          console.log(`     - Contenu FR: ${contentPreview}`);
          const contentPreviewEn = content.content_en 
            ? `${content.content_en.substring(0, 80)}${content.content_en.length > 80 ? '...' : ''}`
            : "(null)";
          console.log(`     - Contenu EN: ${contentPreviewEn}`);
        }
      }
    }

    // 4. Statistiques globales
    console.log("\n\n📊 STATISTIQUES GLOBALES");
    console.log("═".repeat(50));

    const [contentsCount] = await connection.execute("SELECT COUNT(*) as count FROM project_contents");
    const totalContents = contentsCount[0].count;
    console.log(`   Total contenus: ${totalContents}`);

    const [emptyTitle] = await connection.execute(
      "SELECT COUNT(*) as count FROM project_contents WHERE title_fr IS NULL OR title_fr = ''"
    );
    console.log(`   Contenus sans titre: ${emptyTitle[0].count}`);

    const [emptyContent] = await connection.execute(
      "SELECT COUNT(*) as count FROM project_contents WHERE content_fr IS NULL OR content_fr = ''"
    );
    console.log(`   Contenus sans texte: ${emptyContent[0].count}`);

    console.log("\n✅ Diagnostic terminé!\n");

    // Recommandations
    if (totalContents === 0) {
      console.log("⚠️  ATTENTION: Aucun contenu dans la base!");
      console.log("   → Les articles n'ont pas de contenu enregistré");
      console.log("   → Vérifier que les contenus sont bien sauvegardés lors de la création d'articles");
    }

    if (emptyContent[0].count > 0) {
      console.log(`⚠️  ATTENTION: ${emptyContent[0].count} contenu(s) sans texte!`);
      console.log("   → Ces contenus n'apparaîtront pas dans l'export");
    }

    await connection.end();

  } catch (err) {
    console.error("❌ Erreur:", err.message);
    if (connection) await connection.end();
    process.exit(1);
  }
}

diagnoseContents();
