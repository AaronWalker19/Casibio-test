import { useEffect, useState } from "react";

function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    code_anr: "",
    title_fr: "",
    title_en: "",
    summary_fr: "",
    summary_en: ""
  });
  const [projectFiles, setProjectFiles] = useState({});
  const [editingFile, setEditingFile] = useState(null);
  const [newFileName, setNewFileName] = useState("");

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = () => {
    fetch("http://localhost:3000/api/projects")
      .then((res) => res.json())
      .then((data) => {
        setProjects(data || []);
        // Charger les fichiers de chaque projet
        data.forEach(project => {
          fetch(`http://localhost:3000/api/projects/${project.id}/files`)
            .then(res => res.json())
            .then(files => {
              setProjectFiles(prev => ({ ...prev, [project.id]: files }));
            });
        });
        setLoading(false);
      })
      .catch(err => console.error("Erreur chargement:", err));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files || []));
  };

  const handleAddProject = (e) => {
    e.preventDefault();
    
    const data = new FormData();
    data.append("code_anr", formData.code_anr);
    data.append("title_fr", formData.title_fr);
    data.append("title_en", formData.title_en);
    data.append("summary_fr", formData.summary_fr);
    data.append("summary_en", formData.summary_en);
    
    // Ajouter tous les fichiers
    files.forEach((file) => {
      data.append("files", file);
    });

    fetch("http://localhost:3000/api/projects", {
      method: "POST",
      body: data
    })
      .then((res) => res.json())
      .then(() => {
        setFormData({ code_anr: "", title_fr: "", title_en: "", summary_fr: "", summary_en: "" });
        setFiles([]);
        loadProjects();
      })
      .catch(err => console.error("Erreur ajout:", err));
  };

  const downloadFile = (projectId, fileId, fileName) => {
    window.location.href = `http://localhost:3000/api/projects/${projectId}/file/${fileId}/download`;
  };

  const deleteFile = (projectId, fileId) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce fichier ?")) {
      fetch(`http://localhost:3000/api/projects/${projectId}/file/${fileId}`, {
        method: "DELETE"
      })
        .then(res => res.json())
        .then(() => {
          alert("Fichier supprimé");
          loadProjects();
        })
        .catch(err => console.error("Erreur suppression:", err));
    }
  };

  const renameFile = (projectId, fileId, oldName) => {
    setEditingFile({ projectId, fileId });
    setNewFileName(oldName);
  };

  const saveRename = (projectId, fileId) => {
    fetch(`http://localhost:3000/api/projects/${projectId}/file/${fileId}/rename`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ new_name: newFileName })
    })
      .then(res => res.json())
      .then(() => {
        alert("Fichier renommé");
        setEditingFile(null);
        loadProjects();
      })
      .catch(err => console.error("Erreur renommage:", err));
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

  const renderFilePreview = (project, projFiles) => {
    if (!projFiles || projFiles.length === 0) return null;

    return (
      <div className="mt-4 p-4 bg-blue-50 rounded border-2 border-blue-200">
        <h4 className="font-bold mb-3">📁 Fichiers attachés ({projFiles.length}):</h4>
        <div className="space-y-3">
          {projFiles.map((file) => {
            const fileType = getFileType(file.file_name);
            const fileUrl = `http://localhost:3000/api/projects/${project.id}/file/${file.id}/view`;

            return (
              <div key={file.id} className="border rounded p-2 bg-white">
                <div className="flex justify-between items-center mb-2">
                  {editingFile && editingFile.fileId === file.id ? (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newFileName}
                        onChange={(e) => setNewFileName(e.target.value)}
                        className="border rounded px-2 py-1 flex-1"
                      />
                      <button
                        onClick={() => saveRename(project.id, file.id)}
                        className="bg-blue-500 text-white px-2 py-1 rounded text-sm"
                      >
                        ✓
                      </button>
                      <button
                        onClick={() => setEditingFile(null)}
                        className="bg-gray-500 text-white px-2 py-1 rounded text-sm"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <>
                      <span className="font-semibold text-sm">{file.file_display_name || file.file_name}</span>
                      <div className="flex gap-1">
                        <button
                          onClick={() => renameFile(project.id, file.id, file.file_display_name || file.file_name)}
                          className="bg-yellow-500 text-white px-2 py-1 rounded text-xs hover:bg-yellow-600"
                        >
                          ✎
                        </button>
                        <button
                          onClick={() => deleteFile(project.id, file.id)}
                          className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600"
                        >
                          ✕
                        </button>
                      </div>
                    </>
                  )}
                </div>

                {fileType === 'image' && (
                  <img src={fileUrl} alt={file.file_name} className="max-w-xs rounded shadow" />
                )}
                {fileType === 'video' && (
                  <video width="300" controls className="rounded shadow">
                    <source src={fileUrl} type={file.file_type} />
                  </video>
                )}
                {fileType === 'audio' && (
                  <audio controls className="w-full rounded shadow">
                    <source src={fileUrl} type={file.file_type} />
                  </audio>
                )}
                {fileType === 'pdf' && (
                  <iframe src={fileUrl} title={file.file_name} width="100%" height="300" className="rounded shadow"></iframe>
                )}
                {fileType === 'file' && (
                  <div className="flex gap-2">
                    <span className="text-gray-600 text-sm">{file.file_type}</span>
                    <button
                      onClick={() => downloadFile(project.id, file.id, file.file_name)}
                      className="bg-green-500 text-white px-2 py-1 rounded text-sm hover:bg-green-600"
                    >
                      ⬇️ Télécharger
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
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
        
        {/* Upload de fichiers MULTIPLES */}
        <label className="block mb-2 font-bold">📎 Joindre des fichiers (optionnel - plusieurs fichiers acceptés)</label>
        <input type="file" onChange={handleFileChange} multiple className="block w-full mb-2 p-2 border" />
        {files.length > 0 && (
          <div className="bg-green-100 p-2 rounded mb-2">
            <p className="text-green-700">✅ {files.length} fichier(s) sélectionné(s):</p>
            <ul className="text-sm">
              {files.map((f, idx) => (
                <li key={idx}>• {f.name}</li>
              ))}
            </ul>
          </div>
        )}
        
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
              {renderFilePreview(project, projectFiles[project.id])}
            </li>
          ))}
        </ul>
      ) : <p className="text-red-500">Aucun projet trouvé</p>}
    </div>
  );
}

export default ProjectsPage;
