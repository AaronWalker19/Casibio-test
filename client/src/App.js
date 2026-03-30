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
  const [file, setFile] = useState(null);
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

  const handleFileChange = (e) => {
    setFile(e.target.files[0] || null);
  };

  const handleAddProject = (e) => {
    e.preventDefault();
    
    const data = new FormData();
    data.append("code_anr", formData.code_anr);
    data.append("title_fr", formData.title_fr);
    data.append("title_en", formData.title_en);
    data.append("summary_fr", formData.summary_fr);
    data.append("summary_en", formData.summary_en);
    
    if (file) {
      data.append("file", file);
    }

    fetch("http://localhost:3000/api/projects", {
      method: "POST",
      body: data
    })
      .then((res) => res.json())
      .then(() => {
        setFormData({ code_anr: "", title_fr: "", title_en: "", summary_fr: "", summary_en: "" });
        setFile(null);
        loadProjects();
      })
      .catch(err => console.error("Erreur ajout:", err));
  };

  const downloadFile = (id, fileName) => {
    window.location.href = `http://localhost:3000/api/projects/${id}/download`;
  };

  const getFileType = (fileName) => {
    if (!fileName) return null;
    const ext = fileName.split('.').pop().toLowerCase();
    
    const imageExts = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'];
    const videoExts = ['mp4', 'webm', 'ogg', 'mov', 'avi', 'mkv'];
    const audioExts = ['mp3', 'wav', 'ogg', 'm4a', 'aac', 'flac'];
    const pdfExts = ['pdf'];
    
    if (imageExts.includes(ext)) return 'image';
    if (videoExts.includes(ext)) return 'video';
    if (audioExts.includes(ext)) return 'audio';
    if (pdfExts.includes(ext)) return 'pdf';
    return 'file';
  };

  const renderFilePreview = (project) => {
    if (!project.file_name) return null;
    
    const fileType = getFileType(project.file_name);
    const fileUrl = `http://localhost:3000/api/projects/${project.id}/file`;

    return (
      <div className="mt-4 p-4 bg-blue-50 rounded border-2 border-blue-200">
        {fileType === 'image' && (
          <div>
            <p className="font-bold mb-2">📷 Image attachée:</p>
            <img src={fileUrl} alt={project.file_name} className="max-w-md rounded shadow" />
          </div>
        )}
        {fileType === 'video' && (
          <div>
            <p className="font-bold mb-2">🎬 Vidéo attachée:</p>
            <video width="400" controls className="rounded shadow">
              <source src={fileUrl} type={project.file_type} />
              Votre navigateur ne supporte pas la vidéo.
            </video>
          </div>
        )}
        {fileType === 'audio' && (
          <div>
            <p className="font-bold mb-2">🎵 Audio attaché:</p>
            <audio controls className="w-full rounded shadow">
              <source src={fileUrl} type={project.file_type} />
              Votre navigateur ne supporte pas l'audio.
            </audio>
          </div>
        )}
        {fileType === 'pdf' && (
          <div>
            <p className="font-bold mb-2">📄 PDF attaché:</p>
            <iframe src={fileUrl} width="100%" height="400" className="rounded shadow"></iframe>
          </div>
        )}
        {fileType === 'file' && (
          <div>
            <p className="font-bold mb-2">📎 Fichier attaché:</p>
            <p className="text-gray-600 mb-2">{project.file_name} ({project.file_type})</p>
            <button 
              onClick={() => downloadFile(project.id, project.file_name)}
              className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
            >
              ⬇️ Télécharger
            </button>
          </div>
        )}
      </div>
    );
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
        
        {/* Upload de fichier */}
        <label className="block mb-2 font-bold">📎 Joindre un fichier (optionnel)</label>
        <input type="file" onChange={handleFileChange} className="block w-full mb-2 p-2 border" />
        {file && <p className="text-blue-600 mb-2">✅ Fichier sélectionné: {file.name}</p>}
        
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Ajouter</button>
      </form>

      {/* Liste des projets */}
      <h2 className="text-2xl font-bold mb-4">Liste des projets</h2>
      {loading ? <p>Chargement...</p> : projects && projects.length > 0 ? (
        <ul className="space-y-4">
          {projects.map((project) => (
            <li key={project.id} className="border p-4 rounded bg-white shadow">
              <h3 className="text-xl font-semibold">{project.title_fr}</h3>
              <p className="text-gray-600"><strong>Code:</strong> {project.code_anr}</p>
              <p className="text-gray-600"><strong>Résumé:</strong> {project.summary_fr}</p>
              {renderFilePreview(project)}
            </li>
          ))}
        </ul>
      ) : <p className="text-red-500">Aucun projet trouvé</p>}
    </div>
  );
}

export default ProjectsPage;
