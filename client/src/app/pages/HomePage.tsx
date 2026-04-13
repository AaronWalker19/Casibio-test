import { useState, useEffect } from "react";
import { Link } from "react-router";
import { Navigation } from "../components/Navigation.tsx";
import { Footer } from "../components/Footer.tsx";
import { ArticleCard } from "../components/ArticleCard.tsx";
import { GalleryCard } from "../components/GalleryCard.tsx";
import { GalleryLightbox } from "../components/GalleryLightbox.tsx";
import { useLanguage } from "../../contexts/LanguageContext.tsx";
import { t } from "../../contexts/translations.tsx";
import svgPaths from "../../imports/Home/svg-1u6sm0pn16.ts";
import { ImageWithFallback } from "../components/figma/ImageWithFallback.tsx";
import { IMAGE_PLACEHOLDER_LARGE_SVG } from "../../constants/placeholders.ts";

interface Article {
  id: number;
  title_fr: string;
  title_en: string;
  created_at: string;
  status: string;
  summary_fr: string | null;
  summary_en: string | null;
  methods_fr: string | null;
  methods_en: string | null;
  results_fr: string | null;
  results_en: string | null;
  perspectives_fr: string | null;
  perspectives_en: string | null;
  code_anr?: string;
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

function Frame4() {
  return (
    <div className="flex gap-[10px] items-start justify-center p-[5px] rounded-[4px] border border-white">
      <div className="size-[16px] relative">
        <svg className="w-full h-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11.7984 14.375">
          <path d={svgPaths.p83c3df0} fill="white" id="Vector" />
        </svg>
      </div>
      <p className="font-['Inter:Regular',sans-serif] font-normal text-[16px] text-white whitespace-nowrap">
        ANR-23-CE08-0002
      </p>
    </div>
  );
}

function Group1() {
  return (
    <div className="h-full flex-1 relative">
      <svg className="w-full h-full" fill="none" preserveAspectRatio="none" viewBox="0 0 25.835 25.8345">
        <g id="Group">
          <path d={svgPaths.p2fe8e000} id="Vector" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.52618" />
          <path d={svgPaths.p3650c900} id="Vector_2" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.52618" />
        </g>
      </svg>
    </div>
  );
}

export default function HomePage() {
  const { language } = useLanguage();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loadingArticles, setLoadingArticles] = useState(true);
  const [errorArticles, setErrorArticles] = useState<string | null>(null);

  const [galleryImagesFetched, setGalleryImagesFetched] = useState<GalleryImage[]>([]);
  const [loadingGallery, setLoadingGallery] = useState(true);
  const [errorGallery, setErrorGallery] = useState<string | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [articleImages, setArticleImages] = useState<{ [key: number]: string }>({});

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch("/api/projects");
        if (!response.ok) {
          throw new Error(t(language, "erreurChargementArticles"));
        }
        const data = await response.json();
        
        // Enrichir les articles avec le statut calculé et prendre les 3 premiers
        const enrichedArticles = data
          .slice(0, 3)
          .map((article: Article) => ({
            ...article,
            status: calculateStatus(article, language),
          }));
        
        setArticles(enrichedArticles);
        
        // Récupérer les images liées à chaque article
        const imagesMap: { [key: number]: string } = {};
        for (const article of enrichedArticles) {
          try {
            const filesResponse = await fetch(`/api/projects/${article.id}/files`);
            if (filesResponse.ok) {
              const files = await filesResponse.json();
              if (files.length > 0) {
                // Prendre la première image
                const firstImage = files.find((f: any) => 
                  f.file_type?.toLowerCase().includes('image') ||
                  f.file_path?.match(/\.(jpg|jpeg|png|gif|webp)$/i)
                );
                if (firstImage) {
                  imagesMap[article.id] = firstImage.file_path;
                }
              }
            }
          } catch (err) {
            console.error(`Erreur lors du chargement des images pour l'article ${article.id}:`, err);
          }
        }
        setArticleImages(imagesMap);
        setLoadingArticles(false);
      } catch (err) {
        setErrorArticles(err instanceof Error ? err.message : t(language, "erreurInconnue"));
        setLoadingArticles(false);
      }
    };

    fetchArticles();
  }, [language]);

  useEffect(() => {
    const fetchGalleryImages = async () => {
      try {
        const response = await fetch("/api/projects/files/all");
        if (!response.ok) {
          throw new Error(t(language, "erreurChargementImages"));
        }
        const data = await response.json();
        // Filtrer les images (exclure les vidéos) et trier par date décroissante
        const imagesOnly = data.filter((file: GalleryImage) => {
          const isImage = file.file_type?.toLowerCase().includes('image') ||
                         file.file_path?.match(/\.(jpg|jpeg|png|gif|webp)$/i);
          return isImage;
        });
        
        // Trier par date décroissante (plus récent en premier)
        const sortedImages = imagesOnly.sort((a: GalleryImage, b: GalleryImage) => {
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        });
        
        // Prendre les 3 premières images triées par date
        const recentImages = sortedImages.slice(0, 3);
        setGalleryImagesFetched(recentImages);
        setLoadingGallery(false);
      } catch (err) {
        setErrorGallery(err instanceof Error ? err.message : t(language, "erreurInconnue"));
        setLoadingGallery(false);
      }
    };

    fetchGalleryImages();
  }, [language]);
  // L'image la plus récente est maintenant la première du tableau (déjà triée et filtrée)
  const latestImage = galleryImagesFetched.length > 0 ? galleryImagesFetched[0] : null;

  return (
    <div className="bg-white flex flex-col items-center size-full">
      <Navigation />
      <div className="bg-primary flex flex-col gap-4 sm:gap-5 md:gap-6 items-center justify-center py-16 sm:py-24 md:py-32 lg:py-40 w-full px-4">
        <div className="flex flex-col gap-2 sm:gap-3 md:gap-4 items-center max-w-full">
          <Frame4 />
          <p className="font-['Inter:Bold',sans-serif] font-bold text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-error-accent break-words text-center">
            {t(language, "projetANRCasibio")}
          </p>
          <p className="font-['Inter:Regular',sans-serif] font-normal opacity-70 text-xs sm:text-sm md:text-base text-center text-white max-w-xs sm:max-w-md md:max-w-2xl lg:max-w-4xl">
            {t(language, "projectDescription")}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-5 items-center justify-center w-full">
          <Link
            to="/articles"
            className="bg-primary flex gap-1.5 sm:gap-2 h-9 sm:h-10 md:h-11 items-center justify-center px-3 sm:px-4 md:px-5 rounded-sm hover:bg-primary-dark transition w-full sm:w-auto"
          >
            <div className="flex items-center justify-center p-1 size-6 sm:size-7 md:size-8 flex-shrink-0">
              <Group1 />
            </div>
            <p className="font-['Inter:Regular',sans-serif] font-normal text-base sm:text-lg md:text-xl text-white whitespace-nowrap">
              {t(language, "articles")}
            </p>
            <div className="h-6 sm:h-7 md:h-8 w-3 sm:w-4 md:w-5 flex-shrink-0 relative">
              <svg className="w-full h-full" fill="none" preserveAspectRatio="none" viewBox="0 0 9.5595 16.5232">
                <path clipRule="evenodd" d={svgPaths.p4cfaf00} fill="white" fillRule="evenodd" id="Vector" />
              </svg>
            </div>
          </Link>
          <Link
            to="/histoire"
            className="bg-white flex gap-1.5 sm:gap-2 h-9 sm:h-10 md:h-11 items-center justify-center px-3 sm:px-4 md:px-5 rounded-sm hover:bg-gray-100 transition w-full sm:w-auto"
          >
            <p className="font-['Inter:Regular',sans-serif] font-normal text-primary text-base sm:text-lg md:text-xl whitespace-nowrap">
              {t(language, "enSavoirPlus")}
            </p>
            <div className="h-6 sm:h-7 md:h-8 w-3 sm:w-4 md:w-5 flex-shrink-0 relative">
              <svg className="w-full h-full" fill="none" preserveAspectRatio="none" viewBox="0 0 9.5595 16.5232">
                <path clipRule="evenodd" d={svgPaths.p4cfaf00} fill="var(--color-primary)" fillRule="evenodd" id="Vector" />
              </svg>
            </div>
          </Link>
        </div>
      </div>
      <div className="w-full border-t border-b border-gray-50">
        <div className="flex flex-col items-center">
          <div className="flex flex-col gap-8 sm:gap-10 md:gap-12 items-center px-4 sm:px-6 md:px-8 lg:px-12 py-8 sm:py-12 md:py-16 w-full">
            <div className="flex flex-col gap-6 sm:gap-7 md:gap-8 items-start w-full">
              <p className="font-['Inter:Bold',sans-serif] font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-black w-full">
                {t(language, "dernieresPublications")}
              </p>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6 w-full">
                <p className="font-['Inter:Regular',sans-serif] font-normal text-xl sm:text-2xl md:text-3xl lg:text-4xl text-black">
                  {t(language, "decouvrezNosTravaux")}
                </p>
                <Link to="/articles" className="flex gap-2 sm:gap-3 items-center hover:opacity-70 transition whitespace-nowrap">
                  <p className="font-['Inter:Regular',sans-serif] font-normal text-xl sm:text-2xl md:text-3xl lg:text-4xl text-black">
                    {t(language, "voirTout")}
                  </p>
                  <div className="size-6 sm:size-7 md:size-8 lg:size-10 relative flex-shrink-0">
                    <svg className="w-full h-full" fill="none" preserveAspectRatio="none" viewBox="0 0 27.9996 21.975">
                      <path d={svgPaths.p14b61a80} fill="black" id="Vector" />
                    </svg>
                  </div>
                </Link>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 md:gap-10 w-full justify-items-center">
              {loadingArticles ? (
                <p className="font-['Inter:Regular',sans-serif] font-normal text-sm sm:text-base text-gray-500 col-span-full">
                  {t(language, "chargementArticles")}
                </p>
              ) : errorArticles ? (
                <p className="font-['Inter:Regular',sans-serif] font-normal text-sm sm:text-base text-red-500 col-span-full">
                  {errorArticles}
                </p>
              ) : articles.length === 0 ? (
                <p className="font-['Inter:Regular',sans-serif] font-normal text-sm sm:text-base text-gray-500 col-span-full">
                  {t(language, "aucunArticleTrouve")}
                </p>
              ) : (
                articles.map((article) => (
                  <ArticleCard
                    key={article.id}
                    id={article.id}
                    title={language === 'FR' ? article.title_fr : article.title_en}
                    date={new Date(article.created_at).toLocaleDateString(language === 'FR' ? 'fr-FR' : 'en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                    status={calculateStatus(article, language)}
                    description={language === 'FR' ? article.title_fr : article.title_en}
                    image={articleImages[article.id]}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="bg-primary flex flex-col sm:flex-row gap-6 sm:gap-8 md:gap-12 lg:gap-16 items-center justify-center py-12 sm:py-16 md:py-20 lg:py-24 px-4 w-full">
        <div className="flex flex-col items-center text-center">
          <p className="font-['Inter:Bold',sans-serif] font-bold text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl text-white whitespace-nowrap">
            25
          </p>
          <p className="font-['Inter:Bold',sans-serif] font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-white whitespace-nowrap">
            {t(language, "articles")}
          </p>
        </div>
        <Link to="/gallerie" className="flex flex-col items-center sm:items-end justify-center relative w-full sm:w-1/2">
          <div className="relative w-full max-w-md sm:max-w-none">
            <ImageWithFallback 
              src={latestImage && latestImage.file_path ? 
                (latestImage.file_path.startsWith('http') || latestImage.file_path.startsWith('/') 
                  ? latestImage.file_path 
                  : `/uploads/${latestImage.file_path}`) 
                : IMAGE_PLACEHOLDER_LARGE_SVG}
              alt="Latest gallery image"
              className="w-full max-h-48 sm:max-h-64 md:max-h-80 lg:max-h-96 object-cover rounded-md transition-transform duration-300 hover:scale-105"
            />
          </div>
          <div className="bg-white flex gap-2 sm:gap-3 h-12 sm:h-14 items-center justify-center px-3 sm:px-4 py-2 rounded-sm relative -mt-6 sm:-mt-7 md:-mt-8 z-10">
            <p className="font-['Inter:Regular',sans-serif] font-normal text-primary text-base sm:text-lg md:text-xl lg:text-2xl whitespace-nowrap">
              {t(language, "enSavoirPlus")}
            </p>
            <div className="h-6 sm:h-7 md:h-8 w-3 sm:w-4 md:w-5 relative flex-shrink-0">
              <svg className="w-full h-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.2647 22.9275">
                <path clipRule="evenodd" d={svgPaths.p34a05400} fill="var(--color-primary)" fillRule="evenodd" id="Vector" />
              </svg>
            </div>
          </div>
        </Link>
      </div>
      <div className="w-full border-t border-b border-gray-50">
        <div className="flex flex-col items-center">
          <div className="flex flex-col gap-8 sm:gap-10 md:gap-12 items-center px-4 sm:px-6 md:px-8 lg:px-12 py-8 sm:py-12 md:py-16 w-full">
            <div className="flex flex-col gap-6 sm:gap-7 md:gap-8 items-start w-full">
              <p className="font-['Inter:Bold',sans-serif] font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-black w-full">
                {t(language, "derniereImageAjoutee")}
              </p>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6 w-full">
                <p className="font-['Inter:Regular',sans-serif] font-normal text-xl sm:text-2xl md:text-3xl lg:text-4xl text-black">
                  {t(language, "decouvrezDerniereImage")}
                </p>
                <div className="flex gap-2 sm:gap-3 items-center hover:opacity-70 transition whitespace-nowrap">
                  <Link to="/gallerie" className="font-['Inter:Regular',sans-serif] font-normal text-xl sm:text-2xl md:text-3xl lg:text-4xl text-black">
                    {t(language, "voirTout")}
                  </Link>
                  <div className="size-6 sm:size-7 md:size-8 lg:size-10 relative flex-shrink-0">
                    <svg className="w-full h-full" fill="none" preserveAspectRatio="none" viewBox="0 0 27.9996 21.975">
                      <path d={svgPaths.p14b61a80} fill="black" id="Vector" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 md:gap-10 w-full justify-items-center">
              {loadingGallery ? (
                <p className="font-['Inter:Regular',sans-serif] font-normal text-sm sm:text-base text-gray-500 col-span-full">
                  {t(language, "chargementImages")}
                </p>
              ) : errorGallery ? (
                <p className="font-['Inter:Regular',sans-serif] font-normal text-sm sm:text-base text-red-500 col-span-full">
                  {t(language, "erreurChargementImages")}
                </p>
              ) : galleryImagesFetched.length === 0 ? (
                <p className="font-['Inter:Regular',sans-serif] font-normal text-sm sm:text-base text-gray-500 col-span-full">
                  {t(language, "aucuneImageTrouvee")}
                </p>
              ) : (
                galleryImagesFetched.map((image, index) => (
                  <GalleryCard
                    key={image.id}
                    id={image.id}
                    title={image.file_display_name}
                    date={new Date(image.created_at).toLocaleDateString(language === 'FR' ? 'fr-FR' : 'en-US')}
                    filePath={image.file_path}
                    fileType={image.file_type}
                    onImageClick={() => {
                      setSelectedImageIndex(index);
                      setLightboxOpen(true);
                    }}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </div>
      <GalleryLightbox
        isOpen={lightboxOpen}
        files={galleryImagesFetched}
        initialIndex={selectedImageIndex}
        onClose={() => setLightboxOpen(false)}
      />
      <Footer />
    </div>
  );
}



