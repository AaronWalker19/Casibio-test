import { useState, useEffect } from "react";
import { useParams, Link } from "react-router";
import { Navigation } from "../../components/Navigation.tsx";
import { Footer } from "../../components/Footer.tsx";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback.tsx";
import { GalleryCard } from "../../components/GalleryCard.tsx";
import { GalleryLightbox } from "../../components/GalleryLightbox.tsx";
import { useLanguage } from "../../../contexts/LanguageContext.tsx";
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
  const { language } = useLanguage();
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

  if (loading) {
    return (
      <div className="bg-white content-stretch flex flex-col items-center relative size-full">
        <Navigation />
        <div className="flex flex-col items-center justify-center size-full py-[50px]">
          <p className="font-['Inter:Bold',sans-serif] font-bold text-[32px] text-black">
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
        <div className="flex flex-col items-center justify-center size-full py-[50px]">
          <p className="font-['Inter:Bold',sans-serif] font-bold text-[32px] text-black">
            {t(language, "articleNonTrouve")}
          </p>
          {error && <p className="text-red-600 mt-[10px]">{error}</p>}
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
      <div className="bg-primary content-stretch flex flex-col gap-[20px] items-start px-[50px] py-[50px] relative shrink-0 w-full">
        <div className="flex gap-[15px] items-center">
          <div className="bg-error-accent px-[12px] py-[6px] rounded-[4px]">
            <p className="font-['Inter:Bold',sans-serif] font-bold text-[14px] text-white">
              {article.code_anr}
            </p>
          </div>
        </div>
        <p className="font-['Inter:Bold',sans-serif] font-bold leading-[normal] w-[50rem] not-italic relative shrink-0 text-[48px] text-white w-full">
          {language === 'FR' ? article.title_fr : article.title_en}
        </p>
        <Link to="/articles" className="content-stretch flex gap-[10px] items-center relative shrink-0">
          <div className="relative shrink-0 size-[30px]" data-name="tabler:books">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 30 30">
              <g>
                <path d="M6.25 5.625V24.375M6.25 5.625C6.25 5.625 8.75 3.75 12.5 3.75C16.25 3.75 18.75 5.625 18.75 5.625M6.25 5.625C6.25 5.625 3.75 3.75 0 3.75V24.375C3.75 24.375 6.25 26.25 6.25 26.25M18.75 5.625V24.375M18.75 5.625C18.75 5.625 21.25 3.75 25 3.75C28.75 3.75 30 5.625 30 5.625V24.375C30 24.375 28.75 22.5 25 22.5C21.25 22.5 18.75 24.375 18.75 24.375M18.75 24.375C18.75 24.375 16.25 22.5 12.5 22.5C8.75 22.5 6.25 24.375 6.25 24.375" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
              </g>
            </svg>
          </div>
          <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[32px] text-white whitespace-nowrap">
            {t(language, "articles")}
          </p>
          <div className="relative shrink-0 size-[30px]" data-name="weui:arrow-filled">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 30 30">
              <path clipRule="evenodd" d="M12.2344 7.73438L18.5156 14.0156C18.6719 14.1719 18.75 14.375 18.75 14.625C18.75 14.875 18.6719 15.0781 18.5156 15.2344L12.2344 21.5156C11.9219 21.8281 11.4531 21.8281 11.1406 21.5156C10.8281 21.2031 10.8281 20.7344 11.1406 20.4219L16.9375 14.625L11.1406 8.82812C10.8281 8.51562 10.8281 8.04688 11.1406 7.73438C11.4531 7.42188 11.9219 7.42188 12.2344 7.73438Z" fill="white" fillRule="evenodd" />
            </svg>
          </div>
        </Link>
      </div>

      {/* Image et infos */}
      <div className="bg-white content-stretch flex flex-col items-center gap-[20px] px-[50px] py-[30px] relative shrink-0 w-full border-b border-gray-50">
        <div className="h-[300px] w-full rounded-[4px] overflow-hidden">
          <ImageWithFallback 
            src={projectFiles.length > 0 && projectFiles[0].file_path ? projectFiles[0].file_path : "https://images.unsplash.com/photo-1581093449818-2655b2467fd6?w=400&h=300&fit=crop"} 
            alt={article.title_fr} 
            className="w-full h-full object-cover" 
          />
        </div>
        <div className="flex gap-[20px] items-start w-full">
          <div className="flex gap-[10px] items-center">
            <div className="bg-error content-stretch flex items-center justify-center p-[8px] relative rounded-[4px] shrink-0">
              <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[12px] text-white whitespace-nowrap">
                {new Date(article.created_at).toLocaleDateString(language === 'FR' ? 'fr-FR' : 'en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
            <div className={`content-stretch flex items-center justify-center p-[8px] relative rounded-[4px] shrink-0 ${
              article.status === t(language, "complet") ? "bg-success" : "bg-warning"
            }`}>
              <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[12px] text-white whitespace-nowrap">
                {article.status}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Contenu */}
      <div className="relative shrink-0 w-full">
        <div aria-hidden="true" className="absolute border-gray-50 border-b border-solid inset-0 pointer-events-none" />
        <div className="flex flex-col items-center size-full">
          <div className="content-stretch flex gap-[50px] items-start p-[50px] relative w-full">
            {/* Contenu principal */}
            <div className="flex-1 content-stretch flex flex-col gap-[40px] items-start relative">
              {sections.map((section) => (
                <div
                  key={section.id}
                  id={section.id}
                  className={`content-stretch flex flex-col gap-[20px] items-start relative shrink-0 w-full scroll-mt-[100px]`}
                >
                  <p className="font-['Inter:Bold',sans-serif] font-bold leading-[normal] not-italic relative shrink-0 text-[40px] text-black w-full">
                    {section.title}
                  </p>
                  <p className="font-['Inter:Regular',sans-serif] font-normal leading-[24px] not-italic relative shrink-0 text-[16px] text-black text-justify w-full">
                    {section.content}
                  </p>
                </div>
              ))}
            </div>

            {/* Sidebar */}
            <div className="content-stretch flex flex-col gap-[20px] items-start relative shrink-0 w-[400px] sticky top-[50px]">
              {/* Sommaire */}
              <div className="bg-gray-50 content-stretch flex flex-col gap-[10px] items-start p-[20px] relative rounded-[4px] shrink-0 w-full ">
                <p className="font-['Inter:Bold',sans-serif] font-bold leading-[normal] not-italic relative shrink-0 text-[24px] text-black w-full">
                  {t(language, "sommaire")}
                </p>
                <div className="content-stretch flex flex-col gap-[5px] items-start relative shrink-0 w-full">
                  {sections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => {
                        setActiveSection(section.id);
                        const element = document.getElementById(section.id);
                        element?.scrollIntoView({ behavior: "smooth" });
                      }}
                      className={`font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[16px] w-full text-left p-[8px] rounded-[4px] transition-colors ${
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
              <div className="bg-gray-50 content-stretch flex flex-col gap-[10px] items-start p-[20px] relative rounded-[4px] shrink-0 w-full">
                <p className="font-['Inter:Bold',sans-serif] font-bold leading-[normal] not-italic relative shrink-0 text-[24px] text-black w-full">
                  {t(language, "galerie")}
                </p>
                <div className="grid grid-cols-4 gap-[8px] w-full">
                  {projectFiles.slice(0, 8).map((image, index) => (
                    <button
                      key={image.id}
                      onClick={() => {
                        setSelectedImageIndex(index);
                        setLightboxOpen(true);
                      }}
                      className="aspect-square rounded-[4px] overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
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
                      className="aspect-square rounded-[4px] bg-primary flex items-center justify-center hover:bg-primary-dark transition-colors"
                    >
                      <span className="text-white text-[32px] font-bold">+</span>
                    </button>
                  )}
                </div>
                {showFullGallery && projectFiles.length > 8 && (
                  <div className="grid grid-cols-4 gap-[8px] w-full mt-[10px]">
                    {projectFiles.slice(8).map((image, index) => (
                      <button
                        key={image.id}
                        onClick={() => {
                          setSelectedImageIndex(index + 8);
                          setLightboxOpen(true);
                        }}
                        className="aspect-square rounded-[4px] overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
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
        <div className="content-stretch flex flex-col gap-[20px] items-start px-[50px] py-[50px] relative shrink-0 w-full border-b border-gray-50">
          <p className="font-['Inter:Bold',sans-serif] font-bold leading-[normal] not-italic relative shrink-0 text-[40px] text-black w-full">
            {t(language, "fichierLie")}
          </p>
          <div className="grid grid-cols-3 gap-[20px] w-full">
            {projectFiles.filter(f => f.file_type?.toLowerCase().includes('pdf') || f.file_type?.toLowerCase().includes('doc')).map((file) => (
              <a
                key={file.id}
                href={file.file_path}
                download
                className="bg-gray-50 content-stretch flex gap-[15px] items-center p-[20px] relative rounded-[4px] shrink-0 hover:bg-gray-300 transition-colors"
              >
                <div className="relative shrink-0 size-[60px] bg-primary rounded-[4px] flex items-center justify-center">
                  <svg className="block size-[30px]" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5h4V9h2v3h4l-5 5z" fill="white" />
                  </svg>
                </div>
                <div className="flex flex-col gap-[5px]">
                  <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[14px] text-black">
                    {file.file_display_name}
                  </p>
                  <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[12px] text-gray-600">
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
        <div className="content-stretch flex flex-col gap-[20px] items-start px-[50px] py-[50px] relative shrink-0 w-full border-b border-gray-50">
          <p className="font-['Inter:Bold',sans-serif] font-bold leading-[normal] not-italic relative shrink-0 text-[40px] text-black w-full">
            {t(language, "imageEtVideos")}
          </p>
          <div className="grid grid-cols-3 gap-[20px] w-full">
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
                className="aspect-square rounded-[4px] bg-primary flex items-center justify-center hover:bg-primary-dark transition-colors h-[200px] w-full"
              >
                <span className="text-white text-[32px] font-bold">+</span>
              </button>
            )}
          </div>
          {showFullMedia && projectFiles.length > 8 && (
            <div className="grid grid-cols-3 gap-[20px] w-full mt-[10px]">
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
