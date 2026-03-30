import { useEffect, useState } from "react";


function App() {
  const [data, setData] = useState("");

  useEffect(() => {
    fetch("http://localhost:3000/api/test")
      .then(res => res.json())
      .then(data => setData(data.message));
  }, []);

  return (
    <div>
      <h1 className="text-4xl font-bold text-blue-200">CASiBIO</h1>
      <p>{data}</p>
      <div className="bg-red-500 text-white text-4xl">
      TEST TAILWIND
    </div>
    </div>
    
  );
}

function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    code_anr: "",
    title_fr: "",
    title_en: "",
    summary_fr: "",
    summary_en: ""
  });

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = () => {
    fetch("http://localhost:3000/api/projects")
      .then((res) => res.json())
      .then((data) => {
        setProjects(data || []);
        setLoading(false);
      })
      .catch(err => console.error("Erreur chargement:", err));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddProject = (e) => {
    e.preventDefault();
    fetch("http://localhost:3000/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData)
    })
      .then((res) => res.json())
      .then(() => {
        setFormData({ code_anr: "", title_fr: "", title_en: "", summary_fr: "", summary_en: "" });
        loadProjects();
      })
      .catch(err => console.error("Erreur ajout:", err));
  };

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold mb-8">Gestion des Projets</h1>
      
      {/* Formulaire d'ajout */}
      <form onSubmit={handleAddProject} className="bg-gray-100 p-6 rounded mb-8">
        <h2 className="text-2xl font-bold mb-4">Ajouter un projet</h2>
        <input type="text" name="code_anr" placeholder="Code ANR" value={formData.code_anr} onChange={handleInputChange} className="block w-full mb-2 p-2 border" required />
        <input type="text" name="title_fr" placeholder="Titre FR" value={formData.title_fr} onChange={handleInputChange} className="block w-full mb-2 p-2 border" required />
        <input type="text" name="title_en" placeholder="Titre EN" value={formData.title_en} onChange={handleInputChange} className="block w-full mb-2 p-2 border" required />
        <textarea name="summary_fr" placeholder="Résumé FR" value={formData.summary_fr} onChange={handleInputChange} className="block w-full mb-2 p-2 border" required></textarea>
        <textarea name="summary_en" placeholder="Résumé EN" value={formData.summary_en} onChange={handleInputChange} className="block w-full mb-2 p-2 border" required></textarea>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Ajouter</button>
      </form>

      {/* Liste des projets */}
      <h2 className="text-2xl font-bold mb-4">Liste des projets</h2>
      {loading ? <p>Chargement...</p> : projects && projects.length > 0 ? (
        <ul className="space-y-4">
          {projects.map((project) => (
            <li key={project.id} className="border p-4 rounded bg-white">
              <h3 className="text-xl font-semibold">{project.title_fr}</h3>
              <p className="text-gray-600"><strong>Code:</strong> {project.code_anr}</p>
              <p className="text-gray-600"><strong>Résumé:</strong> {project.summary_fr}</p>
            </li>
          ))}
        </ul>
      ) : <p className="text-red-500">Aucun projet trouvé</p>}
    </div>
  );
}

export default ProjectsPage;
