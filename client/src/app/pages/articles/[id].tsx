import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router";
import { Navigation } from "../../components/Navigation.tsx";
import { Footer } from "../../components/Footer.tsx";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback.tsx";
import { GalleryCard } from "../../components/GalleryCard.tsx";
import { GalleryLightbox } from "../../components/GalleryLightbox.tsx";
import { useLanguage } from "../../../contexts/LanguageContext.tsx";
import { useAuth } from "../../../contexts/AuthContext.tsx";
import { t } from "../../../contexts/translations.tsx";

// Ensure Tailwind CSS variables are available
if (typeof document !== "undefined" && !document.documentElement.style.getPropertyValue('--color-primary')) {
  document.documentElement.style.setProperty('--color-primary', '#183542');
}

interface Article {
  id: number;
  code_anr: string;
  title_fr: string;
  title_en: string;
  created_at: string;
  status: string;
  image?: string;
  summary_fr: string | null;
  summary_en: string | null;
  methods_fr: string | null;
  methods_en: string | null;
  results_fr: string | null;
  results_en: string | null;
  perspectives_fr: string | null;
  perspectives_en: string | null;
}

interface GalleryImage {
  id: number;
  file_name: string;
  file_display_name: string;
  file_path: string;
  file_type: string;
  created_at: string;
}

// Fonction pour calculer le statut basé sur la complétude des champs
const calculateStatus = (article: Article, language: 'FR' | 'EN'): string => {
  const importantFields = language === 'FR' ? [
    article.summary_fr,
    article.methods_fr,
    article.results_fr,
    article.perspectives_fr,
  ] : [
    article.summary_en,
    article.methods_en,
    article.results_en,
    article.perspectives_en,
  ];
  
  const hasEmptyField = importantFields.some(field => !field || field.trim() === "");
  return hasEmptyField ? t(language, "inCours") : t(language, "complet");
};

// Fonction pour obtenir le contenu avec fallback
const getContent = (content: string | null, language: 'FR' | 'EN'): string => {
  return content && content.trim() ? content : t(language, "nonCompletee");
};

export default function ArticlePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { user, isAuthenticated } = useAuth();
  const [activeSection, setActiveSection] = useState("resume");
  const [showFullGallery, setShowFullGallery] = useState(false);
  const [showFullMedia, setShowFullMedia] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedMediaIndex, setSelectedMediaIndex] = useState(0);
  const [projectFiles, setProjectFiles] = useState<GalleryImage[]>([]);
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Récupérer les données du projet
  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/projects/${id}`);
        if (!response.ok) {
          throw new Error(t(language, "erreurChargementArticles"));
        }
        const data = await response.json();
        
        // Ajouter le statut calculé
        const calculatedStatus = calculateStatus(data, language);
        const enrichedArticle = {
          ...data,
          status: calculatedStatus,
        };
        
        setArticle(enrichedArticle);
      } catch (err) {
        console.error(err);
        setError(err instanceof Error ? err.message : t(language, "erreurInconnue"));
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchArticle();
    }
  }, [id, language]);

  // Récupérer les fichiers du projet
  useEffect(() => {
    const fetchProjectFiles = async () => {
      try {
        const response = await fetch(`/api/projects/${id}/files`);
        if (!response.ok) {
          throw new Error("Erreur lors du chargement des fichiers");
        }
        const data = await response.json();
        setProjectFiles(data);
      } catch (err) {
        console.error(err);
        setProjectFiles([]);
      }
    };

    if (id) {
      fetchProjectFiles();
    }
  }, [id]);

  // Fonction pour modifier l'article
  const handleEditArticle = () => {
    if (article) {
      navigate("/formulaire", { state: { editingArticle: article } });
    }
  };

  // Fonction pour supprimer l'article
  const handleDeleteArticle = async () => {
    if (!window.confirm(`Êtes-vous sûr de vouloir supprimer cet article ?`)) {
      return;
    }

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        alert("Vous n'êtes pas authentifié");
        return;
      }

      const response = await fetch(`/api/projects/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la suppression");
      }

      navigate("/membres/articles");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erreur lors de la suppression");
      console.error("Error deleting article:", err);
    }
  };

  if (loading) {
    return (
      <div className="bg-white content-stretch flex flex-col items-center relative size-full">
        <Navigation />
        <div className="flex flex-col items-center justify-center size-full py-12 sm:py-16 md:py-20">
          <p className="font-['Inter:Bold',sans-serif] font-bold text-lg sm:text-xl md:text-2xl text-black">
            {t(language, "chargement")}
          </p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="bg-white content-stretch flex flex-col items-center relative size-full">
        <Navigation />
        <div className="flex flex-col items-center justify-center size-full py-12 sm:py-16 md:py-20">
          <p className="font-['Inter:Bold',sans-serif] font-bold text-lg sm:text-xl md:text-2xl text-black">
            {t(language, "articleNonTrouve")}
          </p>
          {error && <p className="text-red-600 mt-3 sm:mt-4 text-sm sm:text-base">{error}</p>}
        </div>
        <Footer />
      </div>
    );
  }

  const sections = [
    { id: "resume", title: t(language, "resume"), content: getContent(language === 'FR' ? article.summary_fr : article.summary_en, language) },
    { id: "methodes", title: t(language, "methodes"), content: getContent(language === 'FR' ? article.methods_fr : article.methods_en, language) },
    { id: "resultats", title: t(language, "resultats"), content: getContent(language === 'FR' ? article.results_fr : article.results_en, language) },
    { id: "perspectives", title: t(language, "perspectives"), content: getContent(language === 'FR' ? article.perspectives_fr : article.perspectives_en, language) },
  ];

  return (
    <div className="bg-white content-stretch flex flex-col items-center relative size-full">
      <Navigation />
      
      {/* Header */}
      <div className="bg-primary content-stretch flex flex-col gap-4 sm:gap-5 md:gap-6 items-start px-4 sm:px-6 md:px-8 lg:px-12 py-8 sm:py-12 md:py-16 w-full">
        <p className="font-['Inter:Bold',sans-serif] font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-white w-full">
          {language === 'FR' ? article.title_fr : article.title_en}
        </p>
        <div className="flex gap-4 sm:gap-5 md:gap-6 items-center w-full">
          <Link to={isAuthenticated ? "/membres/articles" : "/articles"} className="content-stretch flex gap-2 sm:gap-3 items-center">
            <div className="relative size-6 sm:size-7 md:size-8">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 30 30">
                <g>
                  <path d="M6.25 5.625V24.375M6.25 5.625C6.25 5.625 8.75 3.75 12.5 3.75C16.25 3.75 18.75 5.625 18.75 5.625M6.25 5.625C6.25 5.625 3.75 3.75 0 3.75V24.375C3.75 24.375 6.25 26.25 6.25 26.25M18.75 5.625V24.375M18.75 5.625C18.75 5.625 21.25 3.75 25 3.75C28.75 3.75 30 5.625 30 5.625V24.375C30 24.375 28.75 22.5 25 22.5C21.25 22.5 18.75 24.375 18.75 24.375M18.75 24.375C18.75 24.375 16.25 22.5 12.5 22.5C8.75 22.5 6.25 24.375 6.25 24.375" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                </g>
              </svg>
            </div>
            <p className="font-['Inter:Regular',sans-serif] font-normal text-lg sm:text-xl md:text-2xl text-white whitespace-nowrap">
              {t(language, "retourArticles")}
            </p>
            <div className="relative size-6 sm:size-7 md:size-8">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 30 30">
                <path clipRule="evenodd" d="M12.2344 7.73438L18.5156 14.0156C18.6719 14.1719 18.75 14.375 18.75 14.625C18.75 14.875 18.6719 15.0781 18.5156 15.2344L12.2344 21.5156C11.9219 21.8281 11.4531 21.8281 11.1406 21.5156C10.8281 21.2031 10.8281 20.7344 11.1406 20.4219L16.9375 14.625L11.1406 8.82812C10.8281 8.51562 10.8281 8.04688 11.1406 7.73438C11.4531 7.42188 11.9219 7.42188 12.2344 7.73438Z" fill="white" fillRule="evenodd" />
              </svg>
            </div>
          </Link>
        </div>
      </div>

      {/* Image et infos */}
      <div className="bg-white content-stretch flex flex-col items-center gap-4 sm:gap-5 md:gap-6 px-4 sm:px-6 md:px-8 lg:px-12 py-8 sm:py-10 md:py-12 w-full border-b border-gray-50">
        <div className="h-40 sm:h-56 md:h-64 lg:h-80 w-full rounded-sm overflow-hidden">
          <ImageWithFallback 
            src={projectFiles.length > 0 && projectFiles[0].file_path ? projectFiles[0].file_path : "https://images.unsplash.com/photo-1581093449818-2655b2467fd6?w=400&h=300&fit=crop"} 
            alt={article.title_fr} 
            className="w-full h-full object-cover" 
          />
        </div>
        <div className="flex gap-3 sm:gap-4 md:gap-5 items-start w-full">
          <div className="flex gap-2 sm:gap-2.5 items-center">
            <div className="bg-error content-stretch flex items-center justify-center p-2 sm:p-2.5 rounded-sm">
              <p className="font-['Inter:Regular',sans-serif] font-normal text-xs sm:text-sm text-white whitespace-nowrap">
                {new Date(article.created_at).toLocaleDateString(language === 'FR' ? 'fr-FR' : 'en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
            <div className={`content-stretch flex items-center justify-center p-2 sm:p-2.5 rounded-sm ${
              article.status === t(language, "complet") ? "bg-success" : "bg-warning"
            }`}>
              <p className="font-['Inter:Regular',sans-serif] font-normal text-xs sm:text-sm text-white whitespace-nowrap">
                {article.status}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Contenu */}
      <div className="relative w-full">
        <div aria-hidden="true" className="absolute border-gray-50 border-b inset-0 pointer-events-none" />
        <div className="flex flex-col items-center size-full">
          <div className="content-stretch flex flex-col lg:flex-row gap-8 sm:gap-10 md:gap-12 lg:gap-16 items-start p-4 sm:p-6 md:p-8 lg:p-12 relative w-full">
            {/* Contenu principal */}
            <div className="flex-1 content-stretch flex flex-col gap-6 sm:gap-8 md:gap-10 items-start relative">
              {sections.map((section) => (
                <div
                  key={section.id}
                  id={section.id}
                  className={`content-stretch flex flex-col gap-4 sm:gap-5 md:gap-6 items-start w-full scroll-mt-[100px] sm:scroll-mt-[120px] md:scroll-mt-[140px]`}
                >
                  <p className="font-['Inter:Bold',sans-serif] font-bold text-xl sm:text-2xl md:text-3xl lg:text-4xl text-black w-full">
                    {section.title}
                  </p>
                  <p className="font-['Inter:Regular',sans-serif] font-normal leading-6 sm:leading-7 text-sm sm:text-base md:text-base text-black text-justify w-full">
                    {section.content}
                  </p>
                </div>
              ))}
            </div>

            {/* Sidebar */}
            <div className="content-stretch flex flex-col gap-4 sm:gap-5 md:gap-6 items-start w-full lg:w-80 lg:sticky lg:top-20">
              {/* Action Buttons for Authenticated Users */}
              {isAuthenticated && (
                <div className="flex gap-[8px] w-full">
                  <button
                    onClick={handleEditArticle}
                    className="bg-blue-500 p-[8px] rounded-[4px] cursor-pointer h-fit hover:bg-blue-600 transition-colors flex justify-between items-center flex-1"
                    title="Modifier l'article"
                  >
                    <svg className="size-[24px]" fill="none" viewBox="0 0 24 24">
                      <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25Z" fill="white" />
                      <path d="M20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83Z" fill="white" />
                    </svg>
                    <p className="font-['Inter:Regular',sans-serif] font-normal text-[18px] h-full text-white whitespace-nowrap flex items-center">
                      {t(language, "modifier")}
                    </p>
                  </button>
                  <button
                    onClick={handleDeleteArticle}
                    className="bg-[#c9232c] p-[8px] rounded-[4px] cursor-pointer h-fit hover:bg-[#a01f26] transition-colors flex justify-between items-center flex-1"
                    title="Supprimer l'article"
                  >
                    <svg className="size-[24px]" fill="none" viewBox="0 0 24 24">
                      <path d="M6 19C6 20.1 6.9 21 8 21H16C17.1 21 18 20.1 18 19V7H6V19ZM8 9H16V19H8V9ZM15.5 4L14.5 3H9.5L8.5 4H5V6H19V4H15.5Z" fill="white" />
                    </svg>
                    <p className="font-['Inter:Regular',sans-serif] font-normal text-[18px] h-full text-white whitespace-nowrap flex items-center">
                      {t(language, "supprimer")}
                    </p>
                  </button>
                </div>
              )}
              {/* Sommaire */}
              <div className="bg-gray-50 content-stretch flex flex-col gap-2.5 sm:gap-3 md:gap-4 items-start p-4 sm:p-5 md:p-6 rounded-sm w-full ">
                <p className="font-['Inter:Bold',sans-serif] font-bold text-lg sm:text-xl md:text-2xl text-black w-full">
                  {t(language, "sommaire")}
                </p>
                <div className="content-stretch flex flex-col gap-1 sm:gap-1.5 items-start w-full">
                  {sections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => {
                        setActiveSection(section.id);
                        const element = document.getElementById(section.id);
                        element?.scrollIntoView({ behavior: "smooth" });
                      }}
                      className={`font-['Inter:Regular',sans-serif] font-normal text-xs sm:text-sm md:text-base w-full text-left p-2 sm:p-2.5 md:p-3 rounded-sm transition-colors ${
                        activeSection === section.id
                          ? "bg-error-accent text-white"
                          : "text-black hover:bg-gray-200"
                      }`}
                    >
                      {section.title}
                    </button>
                  ))}
                </div>
              </div>

              {/* Galerie d'images */}
              <div className="bg-gray-50 content-stretch flex flex-col gap-2.5 sm:gap-3 md:gap-4 items-start p-4 sm:p-5 md:p-6 rounded-sm w-full">
                <p className="font-['Inter:Bold',sans-serif] font-bold text-lg sm:text-xl md:text-2xl text-black w-full">
                  {t(language, "galerie")}
                </p>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 sm:gap-2.5 md:gap-3 w-full">
                  {projectFiles.slice(0, 8).map((image, index) => (
                    <button
                      key={image.id}
                      onClick={() => {
                        setSelectedImageIndex(index);
                        setLightboxOpen(true);
                      }}
                      className="aspect-square rounded-sm overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
                    >
                      <ImageWithFallback
                        src={image.file_path}
                        alt={image.file_display_name}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                  {projectFiles.length > 8 && !showFullGallery && (
                    <button
                      onClick={() => setShowFullGallery(true)}
                      className="aspect-square rounded-sm bg-primary flex items-center justify-center hover:bg-primary-dark transition-colors"
                    >
                      <span className="text-white text-lg sm:text-2xl md:text-3xl font-bold">+</span>
                    </button>
                  )}
                </div>
                {showFullGallery && projectFiles.length > 8 && (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 sm:gap-2.5 md:gap-3 w-full mt-2 sm:mt-3 md:mt-4">
                    {projectFiles.slice(8).map((image, index) => (
                      <button
                        key={image.id}
                        onClick={() => {
                          setSelectedImageIndex(index + 8);
                          setLightboxOpen(true);
                        }}
                        className="aspect-square rounded-sm overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
                      >
                        <ImageWithFallback
                          src={image.file_path}
                          alt={image.file_display_name}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fichiers téléchargeables */}
      {projectFiles.filter(f => f.file_type?.toLowerCase().includes('pdf') || f.file_type?.toLowerCase().includes('doc')).length > 0 && (
        <div className="content-stretch flex flex-col gap-4 sm:gap-5 md:gap-6 items-start px-4 sm:px-6 md:px-8 lg:px-12 py-8 sm:py-12 md:py-16 relative shrink-0 w-full border-b border-gray-50">
          <p className="font-['Inter:Bold',sans-serif] font-bold leading-[normal] not-italic relative shrink-0 text-xl sm:text-2xl md:text-3xl lg:text-4xl text-black w-full">
            {t(language, "fichierLie")}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6 w-full">
            {projectFiles.filter(f => f.file_type?.toLowerCase().includes('pdf') || f.file_type?.toLowerCase().includes('doc')).map((file) => (
              <a
                key={file.id}
                href={file.file_path}
                download
                className="bg-gray-50 content-stretch flex gap-3 sm:gap-4 md:gap-5 items-center p-4 sm:p-5 md:p-6 relative rounded-sm shrink-0 hover:bg-gray-300 transition-colors"
              >
                <div className="relative shrink-0 size-12 sm:size-14 md:size-16 bg-primary rounded-sm flex items-center justify-center">
                  <svg className="block size-6 sm:size-7 md:size-8" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5h4V9h2v3h4l-5 5z" fill="white" />
                  </svg>
                </div>
                <div className="flex flex-col gap-1 sm:gap-1.5">
                  <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-xs sm:text-sm md:text-base text-black">
                    {file.file_display_name}
                  </p>
                  <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-xs text-gray-600">
                    date: {new Date(file.created_at).toLocaleDateString(language === 'FR' ? 'fr-FR' : 'en-US')}
                  </p>
                </div>
                <svg className="ml-auto" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5h4V9h2v3h4l-5 5z" fill="var(--color-primary)" />
                </svg>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Image et vidéos lier a l'article */}
      {projectFiles.length > 0 && (
        <div className="content-stretch flex flex-col gap-4 sm:gap-5 md:gap-6 items-start px-4 sm:px-6 md:px-8 lg:px-12 py-8 sm:py-12 md:py-16 relative shrink-0 w-full border-b border-gray-50">
          <p className="font-['Inter:Bold',sans-serif] font-bold leading-[normal] not-italic relative shrink-0 text-xl sm:text-2xl md:text-3xl lg:text-4xl text-black w-full">
            {t(language, "imageEtVideos")}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6 w-full">
            {projectFiles.slice(0, 8).map((item, index) => (
              <GalleryCard
                key={item.id}
                id={item.id}
                title={item.file_display_name}
                date={new Date(item.created_at).toLocaleDateString('fr-FR')}
                filePath={item.file_path}
                fileType={item.file_type}
                onImageClick={() => {
                  setSelectedMediaIndex(index);
                  setLightboxOpen(true);
                }}
              />
            ))}
            {projectFiles.length > 8 && !showFullMedia && (
              <button
                onClick={() => setShowFullMedia(true)}
                className="aspect-square rounded-sm bg-primary flex items-center justify-center hover:bg-primary-dark transition-colors h-40 sm:h-56 md:h-64 w-full"
              >
                <span className="text-white text-lg sm:text-2xl md:text-3xl font-bold">+</span>
              </button>
            )}
          </div>
          {showFullMedia && projectFiles.length > 8 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6 w-full mt-4 sm:mt-6 md:mt-8">
              {projectFiles.slice(8).map((item, index) => (
                <GalleryCard
                  key={item.id}
                  id={item.id}
                  title={item.file_display_name}
                  date={new Date(item.created_at).toLocaleDateString('fr-FR')}
                  filePath={item.file_path}
                  fileType={item.file_type}
                  onImageClick={() => {
                    setSelectedMediaIndex(index + 8);
                    setLightboxOpen(true);
                  }}
                />
              ))}
            </div>
          )}
        </div>
      )}

      <GalleryLightbox
        isOpen={lightboxOpen}
        files={projectFiles}
        initialIndex={selectedImageIndex >= 0 && selectedImageIndex < projectFiles.length ? selectedImageIndex : selectedMediaIndex}
        onClose={() => setLightboxOpen(false)}
      />

      <Footer />
    </div>
  );
}
