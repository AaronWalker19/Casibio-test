import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router";
import { Navigation } from "../components/Navigation.tsx";
import { Footer } from "../components/Footer.tsx";
import { useAuth } from "../../contexts/AuthContext.tsx";
import { useLanguage } from "../../contexts/LanguageContext.tsx";
import { t } from "../../contexts/translations.tsx";
import RichTextEditor from "../components/RichTextEditor.tsx";

interface ContentBlock {
  id?: number;
  position: number;
  title_fr: string;
  title_en: string;
  content_fr: string;
  content_en: string;
}

export default function FormulairePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, loading } = useAuth();
  const { language } = useLanguage();
  const [currentStep, setCurrentStep] = useState(1);
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState("");
  const [editingArticleId, setEditingArticleId] = useState<number | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [presentImageFile, setPresentImageFile] = useState<string | null>(null);
  const [existingFiles, setExistingFiles] = useState<any[]>([]);
  const [deletedFileIds, setDeletedFileIds] = useState<number[]>([]);
  const [expandedContent, setExpandedContent] = useState<number | null>(null);
  const [editingFileId, setEditingFileId] = useState<number | null>(null);
  const [editingFileData, setEditingFileData] = useState({ name: "", description_fr: "", description_en: "" });
  const [formData, setFormData] = useState({
    titreFr: "",
    titreEn: "",
    contents: [] as ContentBlock[],
  });

  // Vérifier si l'utilisateur est authentifié et rediriger vers l'accueil sinon
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, loading, navigate]);

  // Vérifier si on est en mode édition et pré-remplir les données
  useEffect(() => {
    const state = location.state as any;
    if (state?.editingArticle) {
      const article = state.editingArticle;
      setEditingArticleId(article.id);
      const newFormData = {
        titreFr: article.title_fr || "",
        titreEn: article.title_en || "",
        contents: (article.contents || []).map((content: any) => ({
          id: content.id,
          position: content.position,
          title_fr: content.title_fr || "",
          title_en: content.title_en || "",
          content_fr: content.content_fr || "",
          content_en: content.content_en || "",
        })),
      };
      setFormData(newFormData);

      // Récupérer les fichiers liés à l'article
      const fetchArticleFiles = async () => {
        try {
          const token = sessionStorage.getItem('authToken');
          if (!token) return;

          const response = await fetch(`/api/projects/${article.id}/files`, {
            method: 'GET',
            credentials: 'include',
            headers: {
              "Authorization": `Bearer ${token}`
            }
          });

          if (response.ok) {
            const filesData = await response.json();
            setExistingFiles(Array.isArray(filesData) ? filesData : filesData.files || []);
            
            // Trouver l'image de présentation existante
            const presentFile = filesData.find((file: any) => file.is_present_image);
            if (presentFile) {
              setPresentImageFile(presentFile.file_name);
            }
          } else {
            console.warn("Impossible de récupérer les fichiers");
          }
        } catch (err) {
          console.error("Erreur lors de la récupération des fichiers:", err);
        }
      };

      fetchArticleFiles();
    }
  }, [location]);

  // Afficher un message de chargement pendant la vérification de l'authentification
  if (loading) {
    return (
      <div className="bg-white content-stretch flex flex-col items-center relative size-full">
        <Navigation />
        <div className="flex-1 flex items-center justify-center w-full">
          <p className="text-lg text-gray-500">Vérification de l'authentification...</p>
        </div>
        <Footer />
      </div>
    );
  }

  // Si l'utilisateur n'est pas authentifié, afficher un message
  if (!isAuthenticated) {
    return (
      <div className="bg-white content-stretch flex flex-col items-center relative size-full">
        <Navigation />
        <div className="flex-1 flex items-center justify-center w-full bg-gray-50">
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <p className="text-lg mb-4">Vous devez être connecté pour créer un projet</p>
            <button
              onClick={() => navigate("/")}
              className="bg-primary text-white px-6 py-2 rounded"
            >
              Retour à l'accueil
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
  
  const steps = [
    { number: 1, title: "Titre et Contenu", key: "content" },
    { number: 2, title: "Fichiers et Image", key: "files" },
  ];

  // Ajouter une nouvelle zone titre/contenu
  const addContent = () => {
    const newContent: ContentBlock = {
      position: formData.contents.length + 1,
      title_fr: "",
      title_en: "",
      content_fr: "",
      content_en: "",
    };
    setFormData({
      ...formData,
      contents: [...formData.contents, newContent],
    });
  };

  // Supprimer une zone titre/contenu
  const removeContent = (index: number) => {
    setFormData({
      ...formData,
      contents: formData.contents.filter((_, i) => i !== index),
    });
  };

  // Mettre à jour une zone titre/contenu
  const updateContent = (index: number, updates: Partial<ContentBlock>) => {
    const newContents = [...formData.contents];
    newContents[index] = { ...newContents[index], ...updates };
    setFormData({
      ...formData,
      contents: newContents,
    });
  };

  // Gestion de l'upload de fichiers
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setUploadedFiles([...uploadedFiles, ...newFiles]);
    }
  };

  // Supprimer un fichier uploadé
  const handleRemoveFile = (index: number) => {
    setUploadedFiles(uploadedFiles.filter((_, i) => i !== index));
    // Si le fichier supprimé était marqué comme image de présentation, le démarquer
    if (presentImageFile === uploadedFiles[index].name) {
      setPresentImageFile(null);
    }
  };

  // Marquer/démarquer une image comme image de présentation
  const togglePresentImage = (fileName: string) => {
    if (presentImageFile === fileName) {
      setPresentImageFile(null);
    } else {
      // Vérifier que c'est une image
      if (fileName.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
        setPresentImageFile(fileName);
      } else {
        setError("Seules les images peuvent être marquées comme image de présentation (jpg, png, gif, webp)");
      }
    }
  };

  // Supprimer un fichier existant
  const handleRemoveExistingFile = (fileId: number) => {
    // Tracker ce fichier comme supprimé pour le serveur
    setDeletedFileIds([...deletedFileIds, fileId]);
    
    setExistingFiles(existingFiles.filter((file) => file.id !== fileId));
    // Si le fichier supprimé était marqué comme image de présentation, le démarquer
    const removedFile = existingFiles.find((file) => file.id === fileId);
    if (removedFile && presentImageFile === removedFile.file_name) {
      setPresentImageFile(null);
    }
  };

  // Marquer/démarquer une image existante comme image de présentation
  const togglePresentImageExisting = async (fileName: string, fileId: number) => {
    try {
      const token = sessionStorage.getItem('authToken');
      if (!token) {
        setError("Vous n'êtes pas authentifié");
        return;
      }

      const isCurrentlyPresent = presentImageFile === fileName;
      
      // Appel API pour mettre à jour la base de données
      const response = await fetch(`/api/projects/${editingArticleId}/set-present-image`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          file_name: isCurrentlyPresent ? null : fileName,
          file_id: isCurrentlyPresent ? null : fileId
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erreur lors de la mise à jour");
      }

      // Mettre à jour l'état local
      if (isCurrentlyPresent) {
        setPresentImageFile(null);
      } else {
        // Vérifier que c'est une image
        if (fileName.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
          setPresentImageFile(fileName);
        } else {
          setError("Seules les images peuvent être marquées comme image de présentation (jpg, png, gif, webp)");
          return;
        }
      }

      setError("");
      console.log(`✅ Image de présentation mise à jour: ${isCurrentlyPresent ? "désactivée" : "activée"}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de la mise à jour");
      console.error("Erreur toggle présentation:", err);
    }
  };

  // Ouvrir le formulaire d'édition d'un fichier
  const handleEditFile = (file: any) => {
    setEditingFileId(file.id);
    setEditingFileData({
      name: file.file_display_name || "",
      description_fr: file.file_desc_fr || "",
      description_en: file.file_desc_en || ""
    });
  };

  // Sauvegarder les modifications d'un fichier
  const handleSaveFileEdit = async () => {
    if (!editingFileData.name.trim()) {
      setError("Le nom du fichier est obligatoire");
      return;
    }

    if (editingFileData.description_fr.length > 150) {
      setError("La description FR ne doit pas dépasser 150 caractères");
      return;
    }

    if (editingFileData.description_en.length > 150) {
      setError("La description EN ne doit pas dépasser 150 caractères");
      return;
    }

    try {
      const token = sessionStorage.getItem('authToken');
      if (!token) {
        setError("Vous n'êtes pas authentifié");
        return;
      }

      const response = await fetch(`/api/projects/${editingArticleId}/file/${editingFileId}/rename`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          new_name: editingFileData.name,
          file_desc_fr: editingFileData.description_fr || null,
          file_desc_en: editingFileData.description_en || null
        })
      });

      if (response.ok) {
        // Mettre à jour le fichier dans la liste
        const updatedFiles = existingFiles.map((file) =>
          file.id === editingFileId
            ? { ...file, file_display_name: editingFileData.name, file_desc_fr: editingFileData.description_fr, file_desc_en: editingFileData.description_en }
            : file
        );
        setExistingFiles(updatedFiles);
        setEditingFileId(null);
        setEditingFileData({ name: "", description_fr: "", description_en: "" });
        setError("");
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Erreur lors de la modification du fichier");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de la modification du fichier");
    }
  };

  const validateStep = (step: number): boolean => {
    if (step === 1) {
      // Titre obligatoire
      if (!formData.titreFr.trim() || !formData.titreEn.trim()) {
        setError("Le titre est obligatoire (FR et EN)");
        return false;
      }
    }
    setError("");
    return true;
  };

  // Vérifier si on a au minimum une section ou un fichier
  const hasMinimumContent = () => {
    const hasContent = formData.contents.length > 0;
    const hasFiles = uploadedFiles.length > 0 || existingFiles.length > 0;
    return hasContent || hasFiles;
  };

  // ✅ Vérifier si les champs obligatoires sont remplis ET au minimum une section ou un fichier
  const canSubmit = () => {
    return (
      formData.titreFr.trim() &&
      formData.titreEn.trim() &&
      hasMinimumContent() &&
      !formLoading
    );
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < steps.length) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // ✅ Vérifier les champs obligatoires et le contenu minimum avant de soumettre
    if (!validateStep(1)) return;
    
    if (!hasMinimumContent()) {
      setError("Vous devez avoir au minimum une section de contenu ou un fichier pour sauvegarder");
      return;
    }

    setFormLoading(true);
    try {
      const token = sessionStorage.getItem('authToken');
      
      if (!token) {
        setError("Token d'authentification manquant. Reconnectez-vous SVP.");
        setFormLoading(false);
        return;
      }

      // Utiliser FormData pour gérer les fichiers
      const formDataToSend = new FormData();
      formDataToSend.append("title_fr", formData.titreFr);
      formDataToSend.append("title_en", formData.titreEn);
      
      // Ajouter les contenus
      formDataToSend.append("contents", JSON.stringify(formData.contents));
      
      // Ajouter les fichiers uploadés
      uploadedFiles.forEach((file) => {
        formDataToSend.append("files", file);
      });
      
      // Ajouter le nom du fichier marqué comme image de présentation
      if (presentImageFile) {
        formDataToSend.append("file_present", presentImageFile);
      }

      // Ajouter les IDs des fichiers à supprimer
      if (deletedFileIds.length > 0) {
        formDataToSend.append("deleted_file_ids", JSON.stringify(deletedFileIds));
      }

      // Déterminer si c'est une création ou une modification
      const isEditing = editingArticleId !== null;
      const url = isEditing ? `/api/projects/${editingArticleId}` : "/api/projects";
      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method: method,
        credentials: 'include',
        headers: {
          "Authorization": `Bearer ${token}`
          // Ne pas définir Content-Type pour FormData - le navegateur le fera automatiquement
        },
        body: formDataToSend,
      });
      
      let responseData;
      const contentType = response.headers.get('content-type');
      
      // Essayer de parser le JSON si le Content-Type indique du JSON
      if (contentType && contentType.includes('application/json')) {
        responseData = await response.json();
      } else {
        // Sinon, lire comme texte
        const text = await response.text();
        responseData = { text };
      }

      if (!response.ok) {
        const errorMessage = responseData.error || responseData.text || JSON.stringify(responseData.errors) || "Erreur lors de la sauvegarde";
        throw new Error(errorMessage);
      }

      navigate("/membres/articles");
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Erreur inconnue";
      console.error("Erreur complète:", errorMsg);
      setError("Erreur: " + errorMsg);
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="bg-white content-stretch flex flex-col items-center relative size-full">
      <Navigation />
      <div className="bg-gray-50 content-stretch flex items-center gap-3 sm:gap-4 md:gap-5 px-4 sm:px-6 md:px-8 lg:px-12 py-4 sm:py-5 md:py-6 relative shrink-0 w-full flex-wrap">
        <Link to="/membres/articles" className="content-stretch flex gap-2 sm:gap-3 items-center">
          <div className="relative size-6 sm:size-7 md:size-8">
            <svg className="block size-full" fill="none" viewBox="0 0 32 32">
              <path d="M20 26L10 16L20 6" stroke="black" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            </svg>
          </div>
          <p className="font-['Inter:Regular',sans-serif] font-normal text-lg sm:text-xl md:text-2xl text-black whitespace-nowrap">
            Retour
          </p>
        </Link>
        <div className="flex-1" />
        <button
          type="button"
          disabled={!canSubmit()}
          onClick={() => {
            if (canSubmit()) {
              const form = document.querySelector('form');
              form?.requestSubmit();
            }
          }}
          className={`content-stretch flex gap-2 sm:gap-3 items-center justify-center px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 md:py-3 rounded-sm ${
            !canSubmit() ? "bg-gray-400 cursor-not-allowed opacity-50" : "bg-success"
          }`}
        >
          <p className="font-['Inter:Regular',sans-serif] font-normal text-sm sm:text-base md:text-lg text-white whitespace-nowrap">
            Sauvegarder
          </p>
          <div className="relative shrink-0 size-4 sm:size-5 md:size-6">
            <svg className="block size-full" fill="none" viewBox="0 0 24 24">
              <path d="M17 3H5C3.89 3 3 3.9 3 5V19C3 20.1 3.89 21 5 21H19C20.1 21 21 20.1 21 19V7L17 3ZM19 19H5V5H16.17L19 7.83V19ZM12 12C10.34 12 9 13.34 9 15C9 16.66 10.34 18 12 18C13.66 18 15 16.66 15 15C15 13.34 13.66 12 12 12ZM6 6H15V10H6V6Z" fill="white" />
            </svg>
          </div>
        </button>
        <button 
          type="button"
          onClick={() => navigate("/membres/articles")}
          className="bg-gray-50 border-2 border-gray-200 content-stretch flex gap-2 sm:gap-3 items-center justify-center px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 md:py-3 rounded-sm hover:bg-gray-100"
        >
          <p className="font-['Inter:Regular',sans-serif] font-normal text-sm sm:text-base md:text-lg text-black whitespace-nowrap">
            {t(language, "annuler")}
          </p>
          <div className="relative size-4 sm:size-5 md:size-6">
            <svg className="block size-full" fill="none" viewBox="0 0 24 24">
              <path d="M19 6.4L17.6 5L12 10.6L6.4 5L5 6.4L10.6 12L5 17.6L6.4 19L12 13.4L17.6 19L19 17.6L13.4 12L19 6.4Z" fill="black" />
            </svg>
          </div>
        </button>
      </div>
      <div className="relative shrink-0 w-full">
        <div className="flex flex-col items-center size-full">
          <div className="content-stretch flex flex-col gap-6 sm:gap-8 md:gap-10 items-center p-4 sm:p-6 md:p-8 lg:p-12 relative w-full max-w-4xl">
            <form 
              onSubmit={handleSubmit}
              className="w-full">
              <div className="bg-white content-stretch flex flex-col gap-6 sm:gap-8 md:gap-10 p-6 sm:p-8 md:p-10 lg:p-12 relative rounded-lg w-full">
                <div aria-hidden="true" className="absolute border-gray-50 border-2 inset-0 pointer-events-none rounded-lg" />
                
                {/* Progress Header */}
                <div className="content-stretch flex flex-col gap-2 sm:gap-3 md:gap-4 items-start w-full">
                  <div className="flex items-center gap-3">
                    <p className="font-['Inter:Bold',sans-serif] font-bold text-lg sm:text-2xl md:text-3xl text-black">
                      {steps[currentStep - 1].title}
                    </p>
                    {editingArticleId && (
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded text-sm font-medium">
                        Édition
                      </span>
                    )}
                  </div>
                  <div className="h-1 w-full bg-gray-50 rounded-full relative">
                    <div 
                      className="h-full bg-primary rounded-full transition-all duration-300"
                      style={{ width: `${(currentStep / steps.length) * 100}%` }}
                    />
                  </div>
                  <p className="text-sm text-gray-500">Étape {currentStep} sur {steps.length}</p>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="bg-red-50 border-2 border-red-200 p-3 sm:p-4 md:p-5 rounded-sm w-full">
                    <p className="text-red-600 font-normal text-sm sm:text-base">{error}</p>
                  </div>
                )}

                {/* Step 1: Titre et Contenu */}
                {currentStep === 1 && (
                  <div className="content-stretch flex flex-col gap-4 sm:gap-5 md:gap-6 items-start w-full">
                    {/* Titre Principal */}
                    <div className="content-stretch flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-6 items-start relative shrink-0 w-full">
                      <div className="content-stretch flex flex-col flex-1 gap-2 sm:gap-3 md:gap-4 items-start relative w-full sm:w-auto">
                        <label className="font-['Inter:Regular',sans-serif] font-normal text-base sm:text-lg md:text-xl text-black w-full">
                          Titre <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={formData.titreFr}
                          onChange={(e) => setFormData({ ...formData, titreFr: e.target.value })}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                            }
                          }}
                          placeholder="Français"
                          className="bg-white border-gray-50 border-2 content-stretch flex items-center p-3 sm:p-4 md:p-5 rounded-sm w-full font-['Inter:Regular',sans-serif] font-normal text-sm sm:text-base md:text-lg text-black placeholder:text-gray-300"
                        />
                      </div>
                      <div className="content-stretch flex flex-col flex-1 gap-2 sm:gap-3 md:gap-4 items-start relative w-full sm:w-auto">
                        <label className="font-['Inter:Regular',sans-serif] font-normal text-base sm:text-lg md:text-xl text-transparent w-full">
                          .
                        </label>
                        <input
                          type="text"
                          value={formData.titreEn}
                          onChange={(e) => setFormData({ ...formData, titreEn: e.target.value })}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                            }
                          }}
                          placeholder="English"
                          className="bg-white border-gray-50 border-2 content-stretch flex items-center p-3 sm:p-4 md:p-5 rounded-sm w-full font-['Inter:Regular',sans-serif] font-normal text-sm sm:text-base md:text-lg text-black placeholder:text-gray-300"
                        />
                      </div>
                    </div>

                    {/* Zones de Contenu avec Accordéons */}
                    <div className="content-stretch flex flex-col gap-3 sm:gap-4 md:gap-5 items-start w-full mt-4">
                      <h3 className="font-['Inter:Bold',sans-serif] font-bold text-base sm:text-lg md:text-xl text-black">
                        Sections du contenu
                      </h3>
                      
                      {formData.contents.length === 0 ? (
                        <div className="bg-gray-50 p-4 sm:p-5 md:p-6 rounded-sm w-full text-center">
                          <p className="text-gray-500 text-sm sm:text-base">
                            Aucune section pour le moment. Cliquez sur le bouton ci-dessous pour en ajouter une.
                          </p>
                        </div>
                      ) : (
                        <div className="w-full space-y-2">
                          {formData.contents.map((content, index) => (
                            <div key={index} className="bg-white border-2 border-gray-200 rounded-sm overflow-hidden">
                              {/* Accordéon Header */}
                              <button
                                type="button"
                                onClick={() => setExpandedContent(expandedContent === index ? null : index)}
                                className="w-full px-4 sm:px-5 md:px-6 py-3 sm:py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                              >
                                <div className="flex-1 text-left">
                                  <p className="font-['Inter:Bold',sans-serif] font-bold text-sm sm:text-base text-black">
                                    {content.title_fr || content.title_en || `Section ${index + 1}`}
                                  </p>
                                </div>
                                <div className={`transform transition-transform ${expandedContent === index ? 'rotate-180' : ''}`}>
                                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                                  </svg>
                                </div>
                              </button>

                              {/* Accordéon Content */}
                              {expandedContent === index && (
                                <div className="border-t-2 border-gray-200 p-4 sm:p-5 md:p-6 bg-gray-50">
                                  <div className="space-y-4">
                                    {/* Titres */}
                                    <div className="content-stretch flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-6 items-start relative shrink-0 w-full">
                                      <div className="content-stretch flex flex-col flex-1 gap-2 sm:gap-3 md:gap-4 items-start relative w-full sm:w-auto">
                                        <label className="font-['Inter:Regular',sans-serif] font-normal text-sm sm:text-base text-black w-full">
                                          Titre FR
                                        </label>
                                        <input
                                          type="text"
                                          value={content.title_fr}
                                          onChange={(e) => updateContent(index, { title_fr: e.target.value })}
                                          placeholder="Titre en français"
                                          className="bg-white border-gray-50 border-2 content-stretch flex items-center p-3 sm:p-4 md:p-5 rounded-sm w-full font-['Inter:Regular',sans-serif] font-normal text-sm text-black placeholder:text-gray-300"
                                        />
                                      </div>
                                      <div className="content-stretch flex flex-col flex-1 gap-2 sm:gap-3 md:gap-4 items-start relative w-full sm:w-auto">
                                        <label className="font-['Inter:Regular',sans-serif] font-normal text-sm sm:text-base text-black w-full">
                                          Titre EN
                                        </label>
                                        <input
                                          type="text"
                                          value={content.title_en}
                                          onChange={(e) => updateContent(index, { title_en: e.target.value })}
                                          placeholder="Title in English"
                                          className="bg-white border-gray-50 border-2 content-stretch flex items-center p-3 sm:p-4 md:p-5 rounded-sm w-full font-['Inter:Regular',sans-serif] font-normal text-sm text-black placeholder:text-gray-300"
                                        />
                                      </div>
                                    </div>

                                    {/* Contenus */}
                                    <div className="content-stretch flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-6 items-start relative shrink-0 w-full">
                                      <div className="content-stretch flex flex-col flex-1 gap-2 sm:gap-3 md:gap-4 items-start relative w-full sm:w-auto">
                                        <label className="font-['Inter:Regular',sans-serif] font-normal text-sm sm:text-base text-black w-full">
                                          Contenu FR
                                        </label>
                                        <RichTextEditor
                                          value={content.content_fr}
                                          onChange={(value) => updateContent(index, { content_fr: value })}
                                          placeholder="Contenu en français"
                                        />
                                      </div>
                                      <div className="content-stretch flex flex-col flex-1 gap-2 sm:gap-3 md:gap-4 items-start relative w-full sm:w-auto">
                                        <label className="font-['Inter:Regular',sans-serif] font-normal text-sm sm:text-base text-black w-full">
                                          Contenu EN
                                        </label>
                                        <RichTextEditor
                                          value={content.content_en}
                                          onChange={(value) => updateContent(index, { content_en: value })}
                                          placeholder="Content in English"
                                        />
                                      </div>
                                    </div>

                                    {/* Bouton Supprimer */}
                                    <button
                                      type="button"
                                      onClick={() => removeContent(index)}
                                      className="bg-red-100 hover:bg-red-200 text-red-600 px-4 sm:px-5 md:px-6 py-2 sm:py-3 rounded-sm text-sm sm:text-base font-medium transition-colors"
                                    >
                                      Supprimer cette section
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Bouton Ajouter */}
                      <button
                        type="button"
                        onClick={addContent}
                        className="bg-primary text-white px-4 sm:px-5 md:px-6 py-2 sm:py-3 rounded-sm text-sm sm:text-base font-medium hover:opacity-90 transition-opacity w-full sm:w-auto"
                      >
                        + Ajouter une section
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 2: Fichiers et Image de présentation */}
                {currentStep === 2 && (
                  <div className="content-stretch flex flex-col gap-4 sm:gap-5 md:gap-6 items-start w-full">
                    {/* Existing Files Section */}
                    {existingFiles.length > 0 && (
                      <div className="content-stretch flex flex-col gap-2 sm:gap-3 md:gap-4 items-start w-full">
                        <label className="font-['Inter:Regular',sans-serif] font-normal text-base sm:text-lg md:text-xl text-black w-full">
                          Fichiers existants ({existingFiles.length})
                        </label>
                        <div className="w-full space-y-2">
                          {existingFiles.map((file) => {
                            const isImage = file.file_type.startsWith('image/');
                            const isPresent = presentImageFile === file.file_name;
                            const isEditing = editingFileId === file.id;
                            
                            if (isEditing) {
                              return (
                                <div
                                  key={file.id}
                                  className="bg-gray-50 border-2 border-blue-400 p-4 sm:p-5 rounded-sm w-full flex flex-col gap-4"
                                >
                                  <div className="flex-1">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                      Nom du fichier *
                                    </label>
                                    <input
                                      type="text"
                                      value={editingFileData.name}
                                      onChange={(e) => setEditingFileData({ ...editingFileData, name: e.target.value })}
                                      maxLength={255}
                                      className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                                      placeholder="Nom du fichier"
                                    />
                                  </div>
                                  <div className="flex-1">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                      Description FR (max 150 caractères)
                                    </label>
                                    <textarea
                                      value={editingFileData.description_fr}
                                      onChange={(e) => setEditingFileData({ ...editingFileData, description_fr: e.target.value.slice(0, 150) })}
                                      maxLength={150}
                                      rows={3}
                                      className="w-full px-3 py-2 border border-gray-300 rounded text-sm resize-none"
                                      placeholder="Description en français (optionnelle)"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                      {editingFileData.description_fr.length}/150 caractères
                                    </p>
                                  </div>
                                  <div className="flex-1">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                      Description EN (max 150 caractères)
                                    </label>
                                    <textarea
                                      value={editingFileData.description_en}
                                      onChange={(e) => setEditingFileData({ ...editingFileData, description_en: e.target.value.slice(0, 150) })}
                                      maxLength={150}
                                      rows={3}
                                      className="w-full px-3 py-2 border border-gray-300 rounded text-sm resize-none"
                                      placeholder="Description in English (optional)"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                      {editingFileData.description_en.length}/150 caractères
                                    </p>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <button
                                      type="button"
                                      onClick={handleSaveFileEdit}
                                      className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded text-sm font-medium transition-colors"
                                    >
                                      Sauvegarder
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setEditingFileId(null);
                                        setEditingFileData({ name: "", description_fr: "", description_en: "" });
                                      }}
                                      className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded text-sm font-medium transition-colors"
                                    >
                                      Annuler
                                    </button>
                                  </div>
                                </div>
                              );
                            }
                            
                            return (
                              <div
                                key={file.id}
                                className="bg-white border-2 border-gray-200 p-3 sm:p-4 rounded-sm w-full flex items-center justify-between"
                              >
                                <div className="flex items-center gap-3 flex-1">
                                  <div className="flex-1">
                                    <p className="text-sm sm:text-base font-medium text-gray-700 truncate">
                                      {file.file_display_name}
                                    </p>
                                    <p className="text-xs sm:text-sm text-gray-500">
                                      {file.file_type}
                                    </p>
                                    {file.file_desc_fr && (
                                      <p className="text-xs text-gray-600 mt-1">
                                        <span className="font-semibold">FR:</span> {file.file_desc_fr}
                                      </p>
                                    )}
                                    {file.file_desc_en && (
                                      <p className="text-xs text-gray-600 mt-1">
                                        <span className="font-semibold">EN:</span> {file.file_desc_en}
                                      </p>
                                    )}
                                  </div>
                                </div>
                                <div className="flex items-center gap-2 ml-2 flex-wrap">
                                  <button
                                    type="button"
                                    onClick={() => handleEditFile(file)}
                                    className="bg-blue-100 hover:bg-blue-200 text-blue-600 px-3 py-1 rounded text-sm font-medium transition-colors"
                                  >
                                    Modifier
                                  </button>
                                  {isImage && (
                                    <button
                                      type="button"
                                      onClick={() => togglePresentImageExisting(file.file_name, file.id)}
                                      className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                                        isPresent
                                          ? "bg-blue-500 text-white"
                                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                      }`}
                                    >
                                      {isPresent ? "✓ Présentation" : "Présentation"}
                                    </button>
                                  )}
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveExistingFile(file.id)}
                                    className="bg-red-100 hover:bg-red-200 text-red-600 px-3 py-1 rounded text-sm font-medium transition-colors"
                                  >
                                    Supprimer
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Upload Section */}
                    <div className="content-stretch flex flex-col gap-2 sm:gap-3 md:gap-4 items-start w-full">
                      <label className="font-['Inter:Regular',sans-serif] font-normal text-base sm:text-lg md:text-xl text-black w-full">
                        Ajouter des fichiers
                      </label>
                      <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-sm p-6 sm:p-8 md:p-10 w-full">
                        <label className="cursor-pointer flex flex-col items-center justify-center gap-2">
                          <svg className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                          <p className="text-sm sm:text-base text-gray-600 text-center">
                            Cliquez pour sélectionner des fichiers
                          </p>
                          <input
                            type="file"
                            multiple
                            onChange={handleFileUpload}
                            className="hidden"
                            accept="*/*"
                          />
                        </label>
                      </div>
                    </div>

                    {/* Uploaded Files List */}
                    {uploadedFiles.length > 0 && (
                      <div className="content-stretch flex flex-col gap-2 sm:gap-3 md:gap-4 items-start w-full">
                        <label className="font-['Inter:Regular',sans-serif] font-normal text-base sm:text-lg md:text-xl text-black w-full">
                          Fichiers uploadés ({uploadedFiles.length})
                        </label>
                        <div className="w-full space-y-2">
                          {uploadedFiles.map((file, index) => {
                            const isImage = file.type.startsWith('image/');
                            const isPresent = presentImageFile === file.name;
                            
                            return (
                              <div
                                key={index}
                                className="bg-white border-2 border-gray-200 p-3 sm:p-4 rounded-sm w-full flex items-center justify-between"
                              >
                                <div className="flex items-center gap-3 flex-1">
                                  <div className="flex-1">
                                    <p className="text-sm sm:text-base font-medium text-gray-700 truncate">
                                      {file.name}
                                    </p>
                                    <p className="text-xs sm:text-sm text-gray-500">
                                      {(file.size / 1024).toFixed(2)} KB
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2 ml-2">
                                  {isImage && (
                                    <button
                                      type="button"
                                      onClick={() => togglePresentImage(file.name)}
                                      className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                                        isPresent
                                          ? "bg-blue-500 text-white"
                                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                      }`}
                                    >
                                      {isPresent ? "✓ Présentation" : "Présentation"}
                                    </button>
                                  )}
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveFile(index)}
                                    className="bg-red-100 hover:bg-red-200 text-red-600 px-3 py-1 rounded text-sm font-medium transition-colors"
                                  >
                                    Supprimer
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Presentation Image Info */}
                    {presentImageFile && (
                      <div className="bg-blue-50 border-2 border-blue-200 p-3 sm:p-4 md:p-5 rounded-sm w-full">
                        <p className="text-blue-600 font-normal text-sm sm:text-base">
                          ✓ Image de présentation sélectionnée : <span className="font-medium">{presentImageFile}</span>
                        </p>
                      </div>
                    )}

                    {uploadedFiles.length === 0 && (
                      <div className="bg-gray-50 p-4 sm:p-5 md:p-6 rounded-sm w-full text-center">
                        <p className="text-gray-500 text-sm sm:text-base">
                          Aucun fichier uploadé. Les fichiers sont optionnels.
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="content-stretch flex gap-3 sm:gap-4 md:gap-6 items-center w-full">
                  <button
                    type="button"
                    onClick={handlePrevious}
                    disabled={currentStep === 1}
                    className={`content-stretch flex items-center justify-center px-6 sm:px-8 md:px-10 py-3 sm:py-4 md:py-5 rounded-sm flex-1 ${
                      currentStep === 1
                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                        : "bg-gray-50 border-2 border-gray-200 text-black hover:bg-gray-100"
                    }`}
                  >
                    <p className="font-['Inter:Regular',sans-serif] font-normal text-base sm:text-lg md:text-xl whitespace-nowrap">
                      Précédent
                    </p>
                  </button>
                  {currentStep < steps.length && (
                    <button
                      type="button"
                      onClick={handleNext}
                      disabled={formLoading}
                      className="bg-primary content-stretch flex items-center justify-center px-6 sm:px-8 md:px-10 py-3 sm:py-4 md:py-5 rounded-sm flex-1 hover:opacity-90"
                    >
                      <p className="font-['Inter:Regular',sans-serif] font-normal text-base sm:text-lg md:text-xl text-white whitespace-nowrap">
                        Suivant
                      </p>
                    </button>
                  )}
                  {currentStep === steps.length && (
                    <button
                      type="button"
                      onClick={() => {
                        const form = document.querySelector('form');
                        form?.requestSubmit();
                      }}
                      disabled={formLoading}
                      className="bg-success content-stretch flex items-center justify-center px-6 sm:px-8 md:px-10 py-3 sm:py-4 md:py-5 rounded-sm flex-1 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <p className="font-['Inter:Regular',sans-serif] font-normal text-base sm:text-lg md:text-xl text-white whitespace-nowrap">
                        Sauvegarder
                      </p>
                    </button>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}



