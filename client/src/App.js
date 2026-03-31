import { useEffect, useState } from "react";

function App() {
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [currentView, setCurrentView] = useState("projects"); // "projects" | "users"
  
  // Form states
  const [loginForm, setLoginForm] = useState({ username: "", password: "" });
  const [registerForm, setRegisterForm] = useState({ username: "", email: "", password: "" });
  const [projectForm, setProjectForm] = useState({
    code_anr: "",
    title_fr: "",
    title_en: "",
    summary_fr: "",
    summary_en: ""
  });
  const [projectFormFiles, setProjectFormFiles] = useState([]); // Fichiers à ajouter lors de la création
  const [projectFiles, setProjectFiles] = useState({});
  const [editingFile, setEditingFile] = useState(null);
  const [newFileName, setNewFileName] = useState("");
  const [selectedProject, setSelectedProject] = useState(null);
  const [uploadingFiles, setUploadingFiles] = useState({});
  const [editingProject, setEditingProject] = useState(null);

  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    // Récupérer user du localStorage
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      const savedUser = JSON.parse(localStorage.getItem("user"));
      setUser(savedUser);
      loadProjects(savedToken);
      if (savedUser.role === "admin") {
        loadUsers(savedToken);
      }
    } else {
      // Toujours charger les projets pour les visiteurs
      loadProjects(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadProjects = (token) => {
    fetch("http://localhost:3000/api/projects", {
      headers: token ? { "Authorization": `Bearer ${token}` } : {}
    })
      .then(res => res.json())
      .then(data => {
        setProjects(data || []);
      })
      .catch(err => console.error("Erreur chargement projets:", err));
  };

  const loadUsers = (token) => {
    fetch("http://localhost:3000/api/auth/users", {
      headers: { "Authorization": `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setUsers(data || []))
      .catch(err => console.error("Erreur chargement users:", err));
  };

  // AUTHENTIFICATION
  const handleLogin = (e) => {
    e.preventDefault();
    fetch("http://localhost:3000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(loginForm)
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          alert(data.error);
        } else {
          localStorage.setItem("token", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));
          setUser(data.user);
          setLoginForm({ username: "", password: "" });
          loadProjects(data.token);
          if (data.user.role === "admin") {
            loadUsers(data.token);
          }
          setShowLoginModal(false);
        }
      })
      .catch(err => console.error("Erreur login:", err));
  };

  const handleRegister = (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    
    fetch("http://localhost:3000/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { "Authorization": `Bearer ${token}` } : {})
      },
      body: JSON.stringify(registerForm)
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          alert(data.error);
        } else {
          if (!user) {
            // Première inscription
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));
            setUser(data.user);
            loadProjects(data.token);
            setShowLoginModal(false);
          } else {
            // Admin ajoute un user
            alert("Utilisateur créé: " + data.user.username);
            loadUsers(localStorage.getItem("token"));
          }
          setRegisterForm({ username: "", email: "", password: "" });
          setShowLoginModal(false);
        }
      })
      .catch(err => console.error("Erreur register:", err));
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setUsers([]);
    setProjects([]);
    setCurrentView("projects");
  };

  // PROJETS
  const handleAddProject = (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    // Préparer FormData avec les données du projet et les fichiers
    const formData = new FormData();
    formData.append("code_anr", projectForm.code_anr);
    formData.append("title_fr", projectForm.title_fr);
    formData.append("title_en", projectForm.title_en);
    formData.append("summary_fr", projectForm.summary_fr);
    formData.append("summary_en", projectForm.summary_en);

    // Ajouter les fichiers s'il y en a
    if (projectFormFiles.length > 0) {
      for (let i = 0; i < projectFormFiles.length; i++) {
        formData.append("files", projectFormFiles[i]);
      }
    }

    fetch("http://localhost:3000/api/projects", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`
      },
      body: formData
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          alert(data.error);
        } else {
          setProjectForm({ code_anr: "", title_fr: "", title_en: "", summary_fr: "", summary_en: "" });
          setProjectFormFiles([]);
          loadProjects(token);
        }
      })
      .catch(err => console.error("Erreur ajout projet:", err));
  };

  // GESTION DES FICHIERS
  const loadProjectFiles = (projectId, token) => {
    fetch(`http://localhost:3000/api/projects/${projectId}/files`, {
      headers: token ? { "Authorization": `Bearer ${token}` } : {}
    })
      .then(res => res.json())
      .then(data => {
        setProjectFiles(prev => ({
          ...prev,
          [projectId]: data || []
        }));
      })
      .catch(err => console.error("Erreur chargement fichiers:", err));
  };

  const handleFileUpload = async (projectId, files) => {
    if (!files || files.length === 0) return;

    const token = localStorage.getItem("token");
    const formData = new FormData();
    
    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]);
    }

    try {
      setUploadingFiles(prev => ({ ...prev, [projectId]: true }));
      
      const response = await fetch(`http://localhost:3000/api/projects/${projectId}/upload`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        },
        body: formData
      });

      const data = await response.json();
      if (data.error) {
        alert("Erreur: " + data.error);
      } else {
        alert(data.message);
        loadProjectFiles(projectId, token);
      }
    } catch (err) {
      console.error("Erreur upload:", err);
      alert("Erreur lors de l'upload");
    } finally {
      setUploadingFiles(prev => ({ ...prev, [projectId]: false }));
    }
  };

  const getFileType = (mimeType, fileName) => {
    // Déterminer le type de fichier pour affichage approprié
    if (!mimeType && fileName) {
      const ext = fileName.split('.').pop().toLowerCase();
      // Images
      if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp'].includes(ext)) return 'image';
      // Vidéos
      if (['mp4', 'webm', 'ogg', 'avi', 'mov', 'mkv'].includes(ext)) return 'video';
      // Audio
      if (['mp3', 'wav', 'ogg', 'flac', 'm4a', 'aac'].includes(ext)) return 'audio';
      return 'download';
    }
    
    if (mimeType.startsWith('image/')) return 'image';
    if (mimeType.startsWith('video/')) return 'video';
    if (mimeType.startsWith('audio/')) return 'audio';
    if (mimeType === 'application/pdf') return 'pdf';
    return 'download';
  };

  const handleDownloadFile = (projectId, fileId, fileName) => {
    fetch(`http://localhost:3000/api/projects/${projectId}/file/${fileId}/download`)
      .then(res => res.blob())
      .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      })
      .catch(err => console.error("Erreur téléchargement:", err));
  };

  const handleRenameFile = (projectId, fileId) => {
    if (!newFileName.trim()) return;

    const token = localStorage.getItem("token");
    fetch(`http://localhost:3000/api/projects/${projectId}/file/${fileId}/rename`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ new_name: newFileName })
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          alert(data.error);
        } else {
          alert("Fichier renommé");
          setEditingFile(null);
          setNewFileName("");
          loadProjectFiles(projectId, token);
        }
      })
      .catch(err => console.error("Erreur renommage:", err));
  };

  const handleDeleteFile = (projectId, fileId) => {
    if (!window.confirm("Confirmer la suppression du fichier?")) return;

    const token = localStorage.getItem("token");
    fetch(`http://localhost:3000/api/projects/${projectId}/file/${fileId}`, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          alert(data.error);
        } else {
          alert("Fichier supprimé");
          loadProjectFiles(projectId, token);
        }
      })
      .catch(err => console.error("Erreur suppression:", err));
  };

  // SUPPRESSION ET MODIFICATION DE PROJETS
  const handleDeleteProject = (projectId) => {
    if (!window.confirm("Confirmer la suppression du projet?")) return;

    const token = localStorage.getItem("token");
    fetch(`http://localhost:3000/api/projects/${projectId}`, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          alert(data.error);
        } else {
          alert("Projet supprimé");
          loadProjects(token);
        }
      })
      .catch(err => console.error("Erreur suppression:", err));
  };

  const handleUpdateProject = (projectId) => {
    const project = projects.find(p => p.id === projectId);
    if (!project) return;

    setEditingProject(projectId);
    setProjectForm({
      code_anr: project.code_anr || "",
      title_fr: project.title_fr || "",
      title_en: project.title_en || "",
      summary_fr: project.summary_fr || "",
      summary_en: project.summary_en || ""
    });
  };

  const handleSaveProject = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!editingProject) return;

    const token = localStorage.getItem("token");
    fetch(`http://localhost:3000/api/projects/${editingProject}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(projectForm)
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          alert(data.error);
        } else {
          alert("Projet modifié");
          setEditingProject(null);
          setProjectForm({ code_anr: "", title_fr: "", title_en: "", summary_fr: "", summary_en: "" });
          loadProjects(token);
        }
      })
      .catch(err => console.error("Erreur modification:", err));
  };

  // GESTION UTILISATEURS
  const handleChangeRole = (userId, newRole) => {
    const token = localStorage.getItem("token");
    fetch(`http://localhost:3000/api/auth/users/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ role: newRole })
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          alert(data.error);
        } else {
          loadUsers(token);
        }
      })
      .catch(err => console.error("Erreur:", err));
  };

  const handleDeleteUser = (userId) => {
    if (!window.confirm("Confirmer la suppression?")) return;
    
    const token = localStorage.getItem("token");
    fetch(`http://localhost:3000/api/auth/users/${userId}`, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          alert(data.error);
        } else {
          loadUsers(token);
        }
      })
      .catch(err => console.error("Erreur:", err));
  };

  // UI - PRINCIPALE
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-indigo-600 text-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">CASiBIO</h1>
            <div className="flex items-center gap-4">
              {user ? (
                <>
                  <span className="text-sm">
                    👤 {user.username} 
                    {user.role === "admin" && <span className="ml-2 bg-red-500 px-2 py-1 rounded text-xs font-semibold">ADMIN</span>}
                    {user.role === "member" && <span className="ml-2 bg-blue-500 px-2 py-1 rounded text-xs font-semibold">MEMBER</span>}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                  >
                    Déconnexion
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setShowLoginModal(true)}
                  className="bg-white text-indigo-600 px-4 py-2 rounded font-semibold hover:bg-gray-100 transition"
                >
                  Se connecter
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation - visible seulement si connecté */}
        {user && (
          <div className="flex gap-4 mb-8">
            <button
              onClick={() => setCurrentView("projects")}
              className={`px-4 py-2 rounded font-semibold transition ${
                currentView === "projects"
                  ? "bg-indigo-600 text-white"
                  : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              📋 Projets
            </button>
            {user.role === "admin" && (
              <button
                onClick={() => setCurrentView("users")}
                className={`px-4 py-2 rounded font-semibold transition ${
                  currentView === "users"
                    ? "bg-indigo-600 text-white"
                    : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                👥 Utilisateurs
              </button>
            )}
          </div>
        )}

        {/* PROJETS */}
        {(!user || currentView === "projects") && (
          <div>
            {/* Formulaire d'ajout/modification (membres et admins) */}
            {user && (user.role === "member" || user.role === "admin") && (
              <form onSubmit={editingProject ? handleSaveProject : handleAddProject} className="bg-white p-6 rounded-lg shadow mb-8">
                <h2 className="text-2xl font-bold mb-4">{editingProject ? "✏️ Modifier un projet" : "➕ Ajouter un projet"}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Code ANR"
                    value={projectForm.code_anr}
                    onChange={(e) => setProjectForm({ ...projectForm, code_anr: e.target.value })}
                    className="p-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-600"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Titre FR"
                    value={projectForm.title_fr}
                    onChange={(e) => setProjectForm({ ...projectForm, title_fr: e.target.value })}
                    className="p-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-600"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Titre EN"
                    value={projectForm.title_en}
                    onChange={(e) => setProjectForm({ ...projectForm, title_en: e.target.value })}
                    className="p-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-600"
                    required
                  />
                </div>
                <textarea
                  placeholder="Résumé FR"
                  value={projectForm.summary_fr}
                  onChange={(e) => setProjectForm({ ...projectForm, summary_fr: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded mt-4 focus:outline-none focus:border-indigo-600"
                  required
                ></textarea>
                <textarea
                  placeholder="Résumé EN"
                  value={projectForm.summary_en}
                  onChange={(e) => setProjectForm({ ...projectForm, summary_en: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded mt-2 focus:outline-none focus:border-indigo-600"
                  required
                ></textarea>
                
                {/* Upload de fichiers dans le formulaire */}
                {!editingProject && (
                  <div className="mt-4">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">📎 Ajouter des fichiers (optionnel)</label>
                    <input
                      type="file"
                      multiple
                      onChange={(e) => setProjectFormFiles(Array.from(e.target.files || []))}
                      className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer"
                    />
                    {projectFormFiles.length > 0 && (
                      <div className="mt-2 p-2 bg-blue-50 rounded text-sm">
                        <p className="font-semibold text-blue-700">{projectFormFiles.length} fichier(s) sélectionné(s)</p>
                        <ul className="mt-1 text-blue-600 list-disc list-inside">
                          {projectFormFiles.map((file, idx) => (
                            <li key={idx} className="text-xs">{file.name}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
                
                <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded mt-4 font-semibold hover:bg-indigo-700">
                  {editingProject ? "Sauvegarder" : "Ajouter"}
                </button>
                {editingProject && (
                  <button 
                    type="button"
                    onClick={() => {
                      setEditingProject(null);
                      setProjectForm({ code_anr: "", title_fr: "", title_en: "", summary_fr: "", summary_en: "" });
                    }}
                    className="w-full bg-gray-500 text-white py-2 rounded mt-2 font-semibold hover:bg-gray-600"
                  >
                    Annuler
                  </button>
                )}
              </form>
            )}

            {/* Liste des projets */}
            <div>
              <h2 className="text-2xl font-bold mb-4">📚 Projets</h2>
              {projects.length === 0 ? (
                <p className="text-gray-500">Aucun projet</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {projects.map(project => (
                    <div key={project.id} className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
                      {/* Mode édition - Afficher les champs de modification */}
                      {editingProject === project.id ? (
                        <div className="space-y-4">
                          <h3 className="text-lg font-bold text-indigo-600 mb-6">✏️ Modifier le projet</h3>
                          
                          {/* Code ANR */}
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">📌 Code ANR</label>
                            <input
                              type="text"
                              placeholder="Entrez le code ANR"
                              value={projectForm.code_anr}
                              onChange={(e) => setProjectForm({ ...projectForm, code_anr: e.target.value })}
                              className="w-full p-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-indigo-600"
                            />
                          </div>
                          
                          {/* Titre FR/EN */}
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">📝 Titre du projet</label>
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label className="text-xs text-gray-600 mb-1 block">FR Français</label>
                                <input
                                  type="text"
                                  placeholder="Titre FR"
                                  value={projectForm.title_fr}
                                  onChange={(e) => setProjectForm({ ...projectForm, title_fr: e.target.value })}
                                  className="w-full p-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-indigo-600"
                                />
                              </div>
                              <div>
                                <label className="text-xs text-gray-600 mb-1 block">EN English</label>
                                <input
                                  type="text"
                                  placeholder="Titre EN"
                                  value={projectForm.title_en}
                                  onChange={(e) => setProjectForm({ ...projectForm, title_en: e.target.value })}
                                  className="w-full p-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-indigo-600"
                                />
                              </div>
                            </div>
                          </div>
                          
                          {/* Résumé FR/EN */}
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">📄 Résumé du projet</label>
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label className="text-xs text-gray-600 mb-1 block">FR Français</label>
                                <textarea
                                  placeholder="Résumé FR"
                                  value={projectForm.summary_fr}
                                  onChange={(e) => setProjectForm({ ...projectForm, summary_fr: e.target.value })}
                                  className="w-full p-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-indigo-600"
                                  rows="3"
                                ></textarea>
                              </div>
                              <div>
                                <label className="text-xs text-gray-600 mb-1 block">EN English</label>
                                <textarea
                                  placeholder="Résumé EN"
                                  value={projectForm.summary_en}
                                  onChange={(e) => setProjectForm({ ...projectForm, summary_en: e.target.value })}
                                  className="w-full p-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-indigo-600"
                                  rows="3"
                                ></textarea>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex gap-2 pt-4">
                            <button
                              onClick={handleSaveProject}
                              className="flex-1 bg-green-600 text-white py-2 rounded font-semibold hover:bg-green-700"
                            >
                              ✓ Sauvegarder
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setEditingProject(null);
                                setProjectForm({ code_anr: "", title_fr: "", title_en: "", summary_fr: "", summary_en: "" });
                              }}
                              className="flex-1 bg-gray-500 text-white py-2 rounded font-semibold hover:bg-gray-600"
                            >
                              ✕ Annuler
                            </button>
                          </div>
                        </div>
                      ) : (
                        /* Mode affichage normal */
                        <>
                          <h3 className="text-xl font-semibold text-indigo-600 mb-2">{project.title_fr}</h3>
                          <p className="text-sm text-gray-600 mb-2">
                            <strong>Code:</strong> {project.code_anr}
                          </p>
                          <p className="text-gray-700 mb-4">{project.summary_fr}</p>
                        </>
                      )}
                      
                      {/* Afficher les boutons et fichiers uniquement si pas en édition */}
                      {editingProject !== project.id && (
                        <>
                          {/* Boutons d'action - Voir fichiers et Upload rapide */}
                          <div className="flex gap-2 mb-3">
                        <button
                          onClick={() => {
                            setSelectedProject(selectedProject === project.id ? null : project.id);
                            if (selectedProject !== project.id) {
                              loadProjectFiles(project.id, localStorage.getItem("token"));
                            }
                          }}
                          className="flex-1 bg-indigo-500 text-white px-3 py-2 rounded text-sm hover:bg-indigo-600"
                        >
                          {selectedProject === project.id ? "➖ Masquer" : "➕ Voir fichiers"}
                        </button>
                        
                        {/* Bouton upload rapide - Seulement si connecté */}
                        {user && (user.role === "member" || user.role === "admin") && (
                          <label className="bg-green-500 text-white px-3 py-2 rounded text-sm hover:bg-green-600 cursor-pointer inline-flex items-center">
                            <span>📤 Upload</span>
                            <input
                              type="file"
                              multiple
                              onChange={(e) => handleFileUpload(project.id, e.target.files)}
                              disabled={uploadingFiles[project.id]}
                              className="hidden"
                            />
                          </label>
                        )}
                      </div>

                      {/* Détails du projet (fichiers) - Visible pour TOUS */}
                      {selectedProject === project.id && (
                        <div className="border-t pt-4 mt-4">
                          <h4 className="font-semibold mb-3">📁 Fichiers</h4>
                          
                          {/* Upload de fichiers - Seulement si connecté */}
                          {user && (user.role === "member" || user.role === "admin") && (
                            <div className="mb-4">
                              <input
                                type="file"
                                multiple
                                onChange={(e) => handleFileUpload(project.id, e.target.files)}
                                disabled={uploadingFiles[project.id]}
                                className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700 cursor-pointer"
                              />
                              {uploadingFiles[project.id] && <p className="text-sm text-gray-500 mt-2">Upload en cours...</p>}
                            </div>
                          )}

                          {/* Liste des fichiers */}
                          {projectFiles[project.id] && projectFiles[project.id].length > 0 ? (
                            <div className="space-y-3">
                              {projectFiles[project.id].map(file => {
                                const fileType = getFileType(file.file_type, file.file_display_name);
                                const viewUrl = `http://localhost:3000/api/projects/${project.id}/file/${file.id}/view`;
                                
                                return (
                                  <div key={file.id} className="bg-gray-50 p-3 rounded border border-gray-200">
                                    {/* Édition du nom - Seulement si connecté */}
                                    {user && (user.role === "member" || user.role === "admin") && editingFile === file.id ? (
                                      <div className="flex gap-2 mb-2">
                                        <input
                                          type="text"
                                          value={newFileName}
                                          onChange={(e) => setNewFileName(e.target.value)}
                                          className="flex-1 p-1 border border-gray-300 rounded text-sm"
                                        />
                                        <button onClick={() => handleRenameFile(project.id, file.id)} className="text-green-600 hover:text-green-700 text-xs px-2 py-1 bg-green-50 rounded">✓ Valider</button>
                                        <button onClick={() => setEditingFile(null)} className="text-gray-600 hover:text-gray-700 text-xs px-2 py-1 bg-gray-200 rounded">✕ Annuler</button>
                                      </div>
                                    ) : null}
                                    
                                    {/* Affichage selon le type de fichier */}
                                    {fileType === 'image' && (
                                      <div className="mb-2">
                                        <img src={viewUrl} alt={file.file_display_name} className="max-w-full h-auto rounded border border-gray-300" style={{ maxHeight: '300px' }} />
                                        <p className="text-xs text-gray-600 mt-1">🖼️ {file.file_display_name}</p>
                                      </div>
                                    )}
                                    
                                    {fileType === 'video' && (
                                      <div className="mb-2">
                                        <video controls className="max-w-full h-auto rounded border border-gray-300" style={{ maxHeight: '300px' }}>
                                          <source src={viewUrl} type={file.file_type} />
                                          Votre navigateur ne supporte pas la lecture vidéo.
                                        </video>
                                        <p className="text-xs text-gray-600 mt-1">🎬 {file.file_display_name}</p>
                                      </div>
                                    )}
                                    
                                    {fileType === 'audio' && (
                                      <div className="mb-2">
                                        <audio controls className="w-full rounded">
                                          <source src={viewUrl} type={file.file_type} />
                                          Votre navigateur ne supporte pas la lecture audio.
                                        </audio>
                                        <p className="text-xs text-gray-600 mt-1">🎵 {file.file_display_name}</p>
                                      </div>
                                    )}
                                    
                                    {fileType === 'pdf' && (
                                      <div className="mb-2">
                                        <iframe src={viewUrl} className="w-full rounded border border-gray-300" style={{ height: '400px' }} title={file.file_display_name}></iframe>
                                        <p className="text-xs text-gray-600 mt-1">📄 {file.file_display_name}</p>
                                      </div>
                                    )}
                                    
                                    {fileType === 'download' && (
                                      <div className="flex items-center justify-between p-2 bg-white rounded">
                                        <span className="text-sm text-gray-700">📦 {file.file_display_name}</span>
                                        <button 
                                          onClick={() => handleDownloadFile(project.id, file.id, file.file_display_name)}
                                          className="bg-indigo-600 text-white px-3 py-1 rounded text-xs hover:bg-indigo-700"
                                        >
                                          ⬇️ Télécharger
                                        </button>
                                      </div>
                                    )}
                                    
                                    {/* Actions d'édition - Seulement si connecté */}
                                    {user && (user.role === "member" || user.role === "admin") && (
                                      <div className="flex gap-2 mt-2 pt-2 border-t border-gray-200">
                                        <button 
                                          onClick={() => { setEditingFile(file.id); setNewFileName(file.file_display_name); }}
                                          className="text-blue-600 hover:text-blue-700 text-xs px-2 py-1 bg-blue-50 rounded"
                                        >
                                          ✏️ Renommer
                                        </button>
                                        <button 
                                          onClick={() => handleDeleteFile(project.id, file.id)}
                                          className="text-red-600 hover:text-red-700 text-xs px-2 py-1 bg-red-50 rounded"
                                        >
                                          🗑️ Supprimer
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          ) : (
                            <p className="text-sm text-gray-500">Aucun fichier</p>
                          )}
                        </div>
                      )}

                      {user && (user.role === "member" || user.role === "admin") && selectedProject !== project.id && (
                        <div className="flex gap-2">
                          <button 
                            type="button"
                            onClick={() => handleUpdateProject(project.id)}
                            className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600">
                            ✏️ Modifier
                          </button>
                          <button 
                            type="button"
                            onClick={() => handleDeleteProject(project.id)}
                            className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600">
                            🗑️ Supprimer
                          </button>
                        </div>
                      )}
                        </>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* UTILISATEURS (admin only) */}
        {currentView === "users" && user.role === "admin" && (
          <div>
            <h2 className="text-2xl font-bold mb-4">👥 Gestion des utilisateurs</h2>
            
            {/* Ajouter utilisateur */}
            <form onSubmit={handleRegister} className="bg-white p-6 rounded-lg shadow mb-8">
              <h3 className="text-xl font-bold mb-4">➕ Ajouter un utilisateur</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input
                  type="text"
                  placeholder="Nom d'utilisateur"
                  value={registerForm.username}
                  onChange={(e) => setRegisterForm({ ...registerForm, username: e.target.value })}
                  className="p-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-600"
                  required
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={registerForm.email}
                  onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                  className="p-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-600"
                  required
                />
                <input
                  type="password"
                  placeholder="Mot de passe"
                  value={registerForm.password}
                  onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                  className="p-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-600"
                  required
                />
              </div>
              <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded mt-4 font-semibold hover:bg-indigo-700">
                Ajouter
              </button>
            </form>

            {/* Liste des utilisateurs */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-100 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left font-semibold">Utilisateur</th>
                    <th className="px-6 py-3 text-left font-semibold">Email</th>
                    <th className="px-6 py-3 text-left font-semibold">Rôle</th>
                    <th className="px-6 py-3 text-left font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.id} className="border-b hover:bg-gray-50">
                      <td className="px-6 py-3 font-semibold">{u.username}</td>
                      <td className="px-6 py-3">{u.email}</td>
                      <td className="px-6 py-3">
                        <select
                          value={u.role}
                          onChange={(e) => handleChangeRole(u.id, e.target.value)}
                          className="p-1 border border-gray-300 rounded text-sm"
                        >
                          <option value="member">Member</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                      <td className="px-6 py-3">
                        <button
                          onClick={() => handleDeleteUser(u.id)}
                          className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                        >
                          Supprimer
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* Modal de connexion */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-indigo-600">Se connecter</h2>
              <button
                onClick={() => setShowLoginModal(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <input
                type="text"
                placeholder="Nom d'utilisateur"
                value={loginForm.username}
                onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-600"
                required
              />
              <input
                type="password"
                placeholder="Mot de passe"
                value={loginForm.password}
                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-600"
                required
              />
              <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded font-semibold hover:bg-indigo-700">
                Se connecter
              </button>
            </form>

            <p className="text-center text-xs text-gray-500 mt-6">
              Pour créer un compte, veuillez contacter un administrateur.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
