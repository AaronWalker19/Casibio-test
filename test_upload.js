const fs = require('fs');
const path = require('path');
const FormData = require('form-data');
const fetch = require('node-fetch');

async function testUpload() {
  try {
    // Créer un fichier test
    const testFilePath = 'test_file.txt';
    fs.writeFileSync(testFilePath, 'Ceci est un fichier de test\nVers 2.0 avec fichiers!\n');
    console.log('✅ Fichier test créé:', testFilePath);

    // Créer FormData
    const form = new FormData();
    form.append('code_anr', 'ANR-2024-FILE-001');
    form.append('title_fr', 'Projet avec Fichier');
    form.append('title_en', 'Project with File');
    form.append('summary_fr', 'Test avec fichier txt');
    form.append('summary_en', 'Test with txt file');
    form.append('file', fs.createReadStream(testFilePath));

    // Upload
    console.log('\n📤 Upload du projet avec fichier...');
    const response = await fetch('http://localhost:3000/api/projects', {
      method: 'POST',
      body: form,
      headers: form.getHeaders()
    });

    const result = await response.json();
    console.log('✅ Réponse:', result);

    // Récupérer les projets
    console.log('\n📋 Récupération des projets...');
    const listResponse = await fetch('http://localhost:3000/api/projects');
    const projects = await listResponse.json();
    
    const lastProject = projects[projects.length - 1];
    console.log('\n✅ Dernier projet créé:');
    console.log(`  ID: ${lastProject.id}`);
    console.log(`  Titre: ${lastProject.title_fr}`);
    console.log(`  Fichier: ${lastProject.file_name}`);
    console.log(`  Type: ${lastProject.file_type}`);
    console.log(`  Total de projets: ${projects.length}`);

    // Nettoyer
    fs.unlinkSync(testFilePath);
    console.log('\n✅ Fichier test supprimé');

  } catch (error) {
    console.error('❌ Erreur:', error.message);
  }
}

testUpload();
