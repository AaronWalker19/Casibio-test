import requests
import os

# URL de l'API
url = "http://localhost:3000/api/projects"

# Créer un fichier test
test_file_path = "test_image.png"
with open(test_file_path, 'wb') as f:
    # Créer une petite image PNG (1x1 pixel, rouge)
    f.write(b'\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01\x08\x02\x00\x00\x00\x90wS\xde\x00\x00\x00\x0cIDATx\x9cc\xf8\x0f\x00\x00\x01\x01\x00\x05\xc1\x88d\xb8\x00\x00\x00\x00IEND\xaeB`\x82')

print(f"✅ Fichier test créé: {test_file_path}")

# Données du formulaire
data = {
    "code_anr": "ANR-2024-FILE-001",
    "title_fr": "Projet avec Image",
    "title_en": "Project with Image",
    "summary_fr": "Projet de test avec fichier PNG attaché",
    "summary_en": "Test project with attached PNG file"
}

# Upload du fichier
with open(test_file_path, 'rb') as f:
    files = {'file': (test_file_path, f, 'image/png')}
    response = requests.post(url, data=data, files=files)

print(f"\n📤 Résultat de l'upload:")
print(f"Status Code: {response.status_code}")
print(f"Réponse: {response.json()}")

# Récupérer tous les projets
response = requests.get(url)
projects = response.json()
print(f"\n📋 Total des projets: {len(projects)}")

# Afficher le dernier projet
if projects:
    last = projects[-1]
    print(f"\n✅ Dernier projet créé:")
    print(f"  ID: {last.get('id')}")
    print(f"  Titre: {last.get('title_fr')}")
    print(f"  Fichier: {last.get('file_name')}")
    print(f"  Type: {last.get('file_type')}")

# Nettoyer
os.remove(test_file_path)
print(f"\n✅ Fichier test supprimé")
