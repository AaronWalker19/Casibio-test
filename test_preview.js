const fs = require('fs');
const FormData = require('form-data');
const fetch = require('node-fetch');

async function testMultipleFiles() {
  try {
    // 1. Créer une petite image PNG (1x1, rouge)
    const imagePath = 'test_image.png';
    const pngData = Buffer.from([
      0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 0x00, 0x00, 0x00, 0x0D, 0x49, 0x48, 0x44, 0x52,
      0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01, 0x08, 0x02, 0x00, 0x00, 0x00, 0x90, 0x77, 0x53,
      0xDE, 0x00, 0x00, 0x00, 0x0C, 0x49, 0x44, 0x41, 0x54, 0x78, 0x9C, 0x63, 0xF8, 0x0F, 0x00, 0x00,
      0x01, 0x01, 0x00, 0x05, 0xC1, 0x88, 0x64, 0xB8, 0x00, 0x00, 0x00, 0x00, 0x49, 0x45, 0x4E, 0x44,
      0xAE, 0x42, 0x60, 0x82
    ]);
    fs.writeFileSync(imagePath, pngData);
    console.log('✅ Image PNG créée');

    // 2. Créer un fichier audio WAV simple
    const audioPath = 'test_audio.wav';
    // WAV header for a 1-second silence at 44.1kHz
    const wavData = Buffer.from([
      0x52, 0x49, 0x46, 0x46, 0x24, 0xF0, 0x00, 0x00, 0x57, 0x41, 0x56, 0x45,
      0x66, 0x6D, 0x74, 0x20, 0x10, 0x00, 0x00, 0x00, 0x01, 0x00, 0x02, 0x00,
      0x44, 0xAC, 0x00, 0x00, 0x10, 0xB1, 0x02, 0x00, 0x04, 0x00, 0x10, 0x00,
      0x64, 0x61, 0x74, 0x61, 0x00, 0xF0, 0x00, 0x00
    ]);
    fs.writeFileSync(audioPath, wavData);
    console.log('✅ Fichier audio WAV créé');

    // 3. Créer un fichier texte
    const textPath = 'test_document.txt';
    fs.writeFileSync(textPath, 'Ceci est un document texte\nC\'est un exemple de fichier pour téléchargement');
    console.log('✅ Document texte créé');

    // Upload les fichiers
    const files = [
      { path: imagePath, name: 'Projet Image', code: 'ANR-IMG-001' },
      { path: audioPath, name: 'Projet Audio', code: 'ANR-AUS-001' },
      { path: textPath, name: 'Projet Document', code: 'ANR-DOC-001' }
    ];

    for (const file of files) {
      const form = new FormData();
      form.append('code_anr', file.code);
      form.append('title_fr', file.name);
      form.append('title_en', file.name);
      form.append('summary_fr', `Test de ${file.path}`);
      form.append('summary_en', `Test of ${file.path}`);
      form.append('file', fs.createReadStream(file.path));

      console.log(`\n📤 Upload de ${file.path}...`);
      const response = await fetch('http://localhost:3000/api/projects', {
        method: 'POST',
        body: form,
        headers: form.getHeaders()
      });

      const result = await response.json();
      console.log(`✅ Uploaded (ID: ${result.id})`);
    }

    // Récupérer et afficher les derniers projets
    console.log('\n📋 Vérification des fichiers en BD...');
    const listResponse = await fetch('http://localhost:3000/api/projects');
    const projects = await listResponse.json();
    
    const recent = projects.slice(-3);
    recent.forEach(p => {
      console.log(`\n  ID: ${p.id}`);
      console.log(`  Titre: ${p.title_fr}`);
      console.log(`  Fichier: ${p.file_name}`);
      console.log(`  Type: ${p.file_type}`);
    });

    // Nettoyer
    fs.unlinkSync(imagePath);
    fs.unlinkSync(audioPath);
    fs.unlinkSync(textPath);
    console.log('\n✅ Fichiers test supprimés');

  } catch (error) {
    console.error('❌ Erreur:', error.message);
  }
}

testMultipleFiles();
