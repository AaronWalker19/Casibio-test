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
import HtmlContent from "../../components/HtmlContent.tsx";

// Ensure Tailwind CSS variables are available
if (
  typeof document !== "undefined" &&
  !document.documentElement.style.getPropertyValue("--color-primary")
) {
  document.documentElement.style.setProperty("--color-primary", "#183542");
}

interface Article {
  id: number;
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
  contents?: ProjectContent[];
}

interface ProjectContent {
  id: number;
  project_id: number;
  title_fr: string;
  title_en: string;
  content_fr: string;
  content_en: string;
  position: number;
}

interface GalleryImage {
  id: number;
  file_name: string;
  file_display_name: string;
  file_path: string;
  file_type: string;
  created_at: string;
}

// Fonction pour formater les dates correctement
const formatDate = (dateString: string | null | undefined, language: "FR" | "EN" | "fr" | "en"): string => {
  if (!dateString) {
    return "";
  }
  try {
    // Normaliser la date SQLite au format ISO
    const normalizedDate = dateString.includes("T")
      ? dateString
      : dateString.replace(" ", "T");
    const lang = language.toUpperCase() as "FR" | "EN";
    const date = new Date(normalizedDate);
    
    // Vérifier si la date est valide
    if (isNaN(date.getTime())) {
      return dateString;
    }
    
    return date.toLocaleDateString(
      lang === "FR" ? "fr-FR" : "en-US",
      {
        year: "numeric",
        month: "long",
        day: "numeric",
      },
    );
  } catch {
    return dateString || "";
  }
};

// Fonction pour parser correctement une date SQLite
const parseDate = (dateString: string): Date => {
  try {
    // Remplacer l'espace par "T" pour le format ISO si nécessaire
    const normalizedDate = dateString.includes("T")
      ? dateString
      : dateString.replace(" ", "T");
    return new Date(normalizedDate);
  } catch {
    return new Date(); // Retourner la date actuelle en cas d'erreur au lieu d'epoch
  }
};

// Fonction pour obtenir le contenu avec fallback
const getContent = (content: string | null): string => {
  return content && content.trim() ? content : "";
};

export default function ArticlePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { isAuthenticated } = useAuth();
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
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

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

        setArticle(data);
      } catch (err) {
        console.error(err);
        setError(
          err instanceof Error ? err.message : t(language, "erreurInconnue"),
        );
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

  // Fonction pour ouvrir le modal de confirmation
  const handleDeleteArticle = () => {
    setShowDeleteConfirm(true);
  };

  // Fonction pour confirmer la suppression
  const handleConfirmDelete = async () => {
    setShowDeleteConfirm(false);

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        alert("Vous n'êtes pas authentifié");
        return;
      }

      const response = await fetch(`/api/projects/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la suppression");
      }

      navigate("/membres/articles");
    } catch (err) {
      alert(
        err instanceof Error ? err.message : "Erreur lors de la suppression",
      );
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
          {error && (
            <p className="text-red-600 mt-3 sm:mt-4 text-sm sm:text-base">
              {error}
            </p>
          )}
        </div>
        <Footer />
      </div>
    );
  }

  // Construire les sections dynamiquement à partir des contenus ou des données statiques
  const sections = (article.contents && article.contents.length > 0)
    ? article.contents
        .map(content => ({
          id: `section-${content.id}`,
          title: language === "FR" ? content.title_fr : content.title_en,
          content: getContent(
            language === "FR" ? content.content_fr : content.content_en,
          ),
        }))
        .filter(section => section.content) // Filtrer les sections vides
    : [];

  return (
    <div className="bg-white content-stretch flex flex-col items-center relative size-full">
      <Navigation />

      {/* Header */}
      <div className="bg-primary content-stretch flex flex-col gap-4 sm:gap-5 md:gap-6 items-start px-4 sm:px-6 md:px-8 lg:px-12 py-8 sm:py-12 md:py-16 w-full">
        <p className="font-['Inter:Bold',sans-serif] font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-white w-full">
          {language === "FR" ? article.title_fr : article.title_en}
        </p>
        <div className="flex gap-4 sm:gap-5 md:gap-6 items-center w-full">
          <Link
            to={isAuthenticated ? "/membres/articles" : "/articles"}
            className="content-stretch flex gap-2 sm:gap-3 items-center"
          >
            <div className="relative size-6 sm:size-7 md:size-8">
              <svg
                className="block size-full"
                fill="none"
                preserveAspectRatio="none"
                viewBox="0 0 30 30"
              >
                <g>
                  <path
                    d="M6.25 5.625V24.375M6.25 5.625C6.25 5.625 8.75 3.75 12.5 3.75C16.25 3.75 18.75 5.625 18.75 5.625M6.25 5.625C6.25 5.625 3.75 3.75 0 3.75V24.375C3.75 24.375 6.25 26.25 6.25 26.25M18.75 5.625V24.375M18.75 5.625C18.75 5.625 21.25 3.75 25 3.75C28.75 3.75 30 5.625 30 5.625V24.375C30 24.375 28.75 22.5 25 22.5C21.25 22.5 18.75 24.375 18.75 24.375M18.75 24.375C18.75 24.375 16.25 22.5 12.5 22.5C8.75 22.5 6.25 24.375 6.25 24.375"
                    stroke="white"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                  />
                </g>
              </svg>
            </div>
            <p className="font-['Inter:Regular',sans-serif] font-normal text-lg sm:text-xl md:text-2xl text-white whitespace-nowrap">
              {t(language, "retourArticles")}
            </p>
            <div className="relative size-6 sm:size-7 md:size-8">
              <svg
                className="block size-full"
                fill="none"
                preserveAspectRatio="none"
                viewBox="0 0 30 30"
              >
                <path
                  clipRule="evenodd"
                  d="M12.2344 7.73438L18.5156 14.0156C18.6719 14.1719 18.75 14.375 18.75 14.625C18.75 14.875 18.6719 15.0781 18.5156 15.2344L12.2344 21.5156C11.9219 21.8281 11.4531 21.8281 11.1406 21.5156C10.8281 21.2031 10.8281 20.7344 11.1406 20.4219L16.9375 14.625L11.1406 8.82812C10.8281 8.51562 10.8281 8.04688 11.1406 7.73438C11.4531 7.42188 11.9219 7.42188 12.2344 7.73438Z"
                  fill="white"
                  fillRule="evenodd"
                />
              </svg>
            </div>
          </Link>
        </div>
      </div>

      {/* Image et infos */}
      <div className="bg-white content-stretch flex flex-col items-center gap-4 sm:gap-5 md:gap-6 px-4 sm:px-6 md:px-8 lg:px-12 py-8 sm:py-10 md:py-12 w-full border-b border-gray-50">
        <div className="h-40 sm:h-56 md:h-64 lg:h-80 w-full rounded-sm overflow-hidden">
          <ImageWithFallback
            src={
              projectFiles.filter((f) =>
                f.file_type?.toLowerCase().startsWith("image/"),
              ).sort(
                (a, b) =>
                  parseDate(b.created_at).getTime() -
                  parseDate(a.created_at).getTime(),
              ).length > 0
                ? projectFiles
                    .filter((f) =>
                      f.file_type?.toLowerCase().startsWith("image/"),
                    )
                    .sort(
                      (a, b) =>
                        parseDate(b.created_at).getTime() -
                        parseDate(a.created_at).getTime(),
                    )[0].file_path
                : "https://images.unsplash.com/photo-1581093449818-2655b2467fd6?w=400&h=300&fit=crop"
            }
            alt={article.title_fr}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex gap-3 sm:gap-4 md:gap-5 items-start w-full">
          <div className="flex gap-2 sm:gap-2.5 items-center">
            <div className="bg-error content-stretch flex items-center justify-center p-2 sm:p-2.5 rounded-sm">
              <p className="font-['Inter:Regular',sans-serif] font-normal text-xs sm:text-sm text-white whitespace-nowrap">
                {formatDate(article.created_at, language)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Contenu */}
      <div className="relative w-full">
        <div
          aria-hidden="true"
          className="absolute border-gray-50 border-b inset-0 pointer-events-none"
        />
        <div className="flex flex-col items-center size-full">
          {(sections.length > 0 || isAuthenticated) && (
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
                    <HtmlContent html={section.content} />
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
                    <svg
                      className="size-[24px]"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25Z"
                        fill="white"
                      />
                      <path
                        d="M20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83Z"
                        fill="white"
                      />
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
                    <svg
                      className="size-[24px]"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M6 19C6 20.1 6.9 21 8 21H16C17.1 21 18 20.1 18 19V7H6V19ZM8 9H16V19H8V9ZM15.5 4L14.5 3H9.5L8.5 4H5V6H19V4H15.5Z"
                        fill="white"
                      />
                    </svg>
                    <p className="font-['Inter:Regular',sans-serif] font-normal text-[18px] h-full text-white whitespace-nowrap flex items-center">
                      {t(language, "supprimer")}
                    </p>
                  </button>
                </div>
              )}
              {/* Sommaire - Afficher seulement si sections ne sont pas vides */}
              {sections.length > 0 && (
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
              )}

              {/* Galerie d'images - Afficher seulement si sections ne sont pas vides */}
              {sections.length > 0 && (
                <div className="bg-gray-50 content-stretch flex flex-col gap-2.5 sm:gap-3 md:gap-4 items-start p-4 sm:p-5 md:p-6 rounded-sm w-full">
                <p className="font-['Inter:Bold',sans-serif] font-bold text-lg sm:text-xl md:text-2xl text-black w-full">
                  {t(language, "galerie")}
                </p>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 sm:gap-2.5 md:gap-3 w-full">
                  {projectFiles
                    .filter((f) => f.file_type?.toLowerCase().startsWith("image/"))
                    .slice(0, 8)
                    .map((image, index) => (
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
                  {projectFiles.filter((f) =>
                    f.file_type?.toLowerCase().startsWith("image/"),
                  ).length > 8 && !showFullGallery && (
                    <button
                      onClick={() => setShowFullGallery(true)}
                      className="aspect-square rounded-sm bg-primary flex items-center justify-center hover:bg-primary-dark transition-colors"
                    >
                      <span className="text-white text-lg sm:text-2xl md:text-3xl font-bold">
                        +
                      </span>
                    </button>
                  )}
                </div>
                {showFullGallery &&
                  projectFiles.filter((f) =>
                    f.file_type?.toLowerCase().startsWith("image/"),
                  ).length > 8 && (
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 sm:gap-2.5 md:gap-3 w-full mt-2 sm:mt-3 md:mt-4">
                      {projectFiles
                        .filter((f) =>
                          f.file_type?.toLowerCase().startsWith("image/"),
                        )
                        .slice(8)
                        .map((image, index) => (
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
              )}
            </div>
          </div>
          )}
        </div>
      </div>

      {/* Fichiers téléchargeables */}
      {projectFiles.filter(
        (f) =>
          f.file_type?.toLowerCase().includes("pdf") ||
          f.file_type?.toLowerCase().includes("doc"),
      ).length > 0 && (
        <div className="content-stretch flex flex-col gap-4 sm:gap-5 md:gap-6 items-start px-4 sm:px-6 md:px-8 lg:px-12 py-8 sm:py-12 md:py-16 relative shrink-0 w-full border-b border-gray-50">
          <p className="font-['Inter:Bold',sans-serif] font-bold leading-[normal] not-italic relative shrink-0 text-xl sm:text-2xl md:text-3xl lg:text-4xl text-black w-full">
            {t(language, "fichierLie")}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6 w-full">
            {projectFiles
              .filter(
                (f) =>
                  f.file_type?.toLowerCase().includes("pdf") ||
                  f.file_type?.toLowerCase().includes("doc"),
              )
              .map((file) => (
                <a
                  key={file.id}
                  href={file.file_path}
                  download
                  className="bg-gray-50 content-stretch flex gap-3 sm:gap-4 md:gap-5 items-center p-4 sm:p-5 md:p-6 relative rounded-sm shrink-0 hover:bg-gray-300 transition-colors"
                >
                  <div className="flex flex-col gap-1 sm:gap-1.5">
                    <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-xs sm:text-sm md:text-base text-black">
                      {file.file_display_name}
                    </p>
                    <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-xs text-gray-600">
                      date: {formatDate(file.created_at, language)}
                    </p>
                  </div>
                  <svg
                    width={60}
                    height={60}
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g id="SVGRepo_bgCarrier" stroke-width="0" />

                    <g
                      id="SVGRepo_tracerCarrier"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />

                    <g id="SVGRepo_iconCarrier">
                      {" "}
                      <path
                        opacity="0.5"
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M3 14.25C3.41421 14.25 3.75 14.5858 3.75 15C3.75 16.4354 3.75159 17.4365 3.85315 18.1919C3.9518 18.9257 4.13225 19.3142 4.40901 19.591C4.68577 19.8678 5.07435 20.0482 5.80812 20.1469C6.56347 20.2484 7.56459 20.25 9 20.25H15C16.4354 20.25 17.4365 20.2484 18.1919 20.1469C18.9257 20.0482 19.3142 19.8678 19.591 19.591C19.8678 19.3142 20.0482 18.9257 20.1469 18.1919C20.2484 17.4365 20.25 16.4354 20.25 15C20.25 14.5858 20.5858 14.25 21 14.25C21.4142 14.25 21.75 14.5858 21.75 15V15.0549C21.75 16.4225 21.75 17.5248 21.6335 18.3918C21.5125 19.2919 21.2536 20.0497 20.6517 20.6516C20.0497 21.2536 19.2919 21.5125 18.3918 21.6335C17.5248 21.75 16.4225 21.75 15.0549 21.75H8.94513C7.57754 21.75 6.47522 21.75 5.60825 21.6335C4.70814 21.5125 3.95027 21.2536 3.34835 20.6517C2.74643 20.0497 2.48754 19.2919 2.36652 18.3918C2.24996 17.5248 2.24998 16.4225 2.25 15.0549C2.25 15.0366 2.25 15.0183 2.25 15C2.25 14.5858 2.58579 14.25 3 14.25Z"
                        fill="#1C274C"
                      />{" "}
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M12 16.75C12.2106 16.75 12.4114 16.6615 12.5535 16.5061L16.5535 12.1311C16.833 11.8254 16.8118 11.351 16.5061 11.0715C16.2004 10.792 15.726 10.8132 15.4465 11.1189L12.75 14.0682V3C12.75 2.58579 12.4142 2.25 12 2.25C11.5858 2.25 11.25 2.58579 11.25 3V14.0682L8.55353 11.1189C8.27403 10.8132 7.79963 10.792 7.49393 11.0715C7.18823 11.351 7.16698 11.8254 7.44648 12.1311L11.4465 16.5061C11.5886 16.6615 11.7894 16.75 12 16.75Z"
                        fill="#1C274C"
                      />{" "}
                    </g>
                  </svg>
                </a>
              ))}
          </div>
        </div>
      )}

      {/* Image et vidéos lier a l'article */}
      {projectFiles.filter((f) =>
        f.file_type?.toLowerCase().startsWith("image/"),
      ).length > 0 && (
        <div className="content-stretch flex flex-col gap-4 sm:gap-5 md:gap-6 items-start px-4 sm:px-6 md:px-8 lg:px-12 py-8 sm:py-12 md:py-16 relative shrink-0 w-full border-b border-gray-50">
          <p className="font-['Inter:Bold',sans-serif] font-bold leading-[normal] not-italic relative shrink-0 text-xl sm:text-2xl md:text-3xl lg:text-4xl text-black w-full">
            {t(language, "imageEtVideos")}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6 w-full">
            {projectFiles
              .filter((f) => f.file_type?.toLowerCase().startsWith("image/"))
              .slice(0, 8)
              .map((item, index) => (
                <GalleryCard
                  key={item.id}
                  id={item.id}
                  title={item.file_display_name}
                  date={formatDate(item.created_at, language)}
                  filePath={item.file_path}
                  fileType={item.file_type}
                  onImageClick={() => {
                    setSelectedMediaIndex(index);
                    setLightboxOpen(true);
                  }}
                />
              ))}
            {projectFiles.filter((f) =>
              f.file_type?.toLowerCase().startsWith("image/"),
            ).length > 8 &&
              !showFullMedia && (
                <button
                  onClick={() => setShowFullMedia(true)}
                  className="aspect-square rounded-sm bg-primary flex items-center justify-center hover:bg-primary-dark transition-colors h-40 sm:h-56 md:h-64 w-full"
                >
                  <span className="text-white text-lg sm:text-2xl md:text-3xl font-bold">
                    +
                  </span>
                </button>
              )}
          </div>
          {showFullMedia &&
            projectFiles.filter((f) =>
              f.file_type?.toLowerCase().startsWith("image/"),
            ).length > 8 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6 w-full mt-4 sm:mt-6 md:mt-8">
                {projectFiles
                  .filter((f) =>
                    f.file_type?.toLowerCase().startsWith("image/"),
                  )
                  .slice(8)
                  .map((item, index) => (
                    <GalleryCard
                      key={item.id}
                      id={item.id}
                      title={item.file_display_name}
                      date={formatDate(item.created_at, language)}
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
        files={projectFiles.filter((f) =>
          f.file_type?.toLowerCase().startsWith("image/"),
        )}
        initialIndex={
          selectedImageIndex >= 0 &&
          selectedImageIndex <
            projectFiles.filter((f) =>
              f.file_type?.toLowerCase().startsWith("image/"),
            ).length
            ? selectedImageIndex
            : selectedMediaIndex
        }
        onClose={() => setLightboxOpen(false)}
      />

      {/* Popup de confirmation de suppression */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-[#00000080] flex items-center justify-center z-50">
          <div className="bg-white rounded-sm p-6 sm:p-8 max-w-sm mx-4 shadow-lg">
            <p className="font-['Inter:Bold',sans-serif] font-bold text-lg sm:text-xl text-black mb-4">
              Confirmation de suppression
            </p>
            <p className="font-['Inter:Regular',sans-serif] font-normal text-sm sm:text-base text-gray-700 mb-6">
              Êtes-vous sûr de vouloir supprimer l'article "<span className="font-bold">{language === "FR" ? article?.title_fr : article?.title_en}</span>" ? Cette action est irréversible.
            </p>
            <div className="flex gap-3 sm:gap-4">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 sm:px-6 py-2 sm:py-3 bg-gray-200 hover:bg-gray-300 text-black rounded-sm font-['Inter:Regular',sans-serif] font-normal text-sm sm:text-base transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleConfirmDelete}
                className="flex-1 px-4 sm:px-6 py-2 sm:py-3 bg-[#c9232c] hover:bg-[#a01f26] text-white rounded-sm font-['Inter:Regular',sans-serif] font-normal text-sm sm:text-base transition-colors"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
    
  );
}
