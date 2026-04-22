import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useLanguage } from "../../contexts/LanguageContext.tsx";
import { ImageWithFallback } from "./figma/ImageWithFallback.tsx";
import { t } from "../../contexts/translations.tsx";

interface GalleryFile {
  id: number;
  file_name: string;
  file_display_name: string;
  file_path: string;
  file_type: string;
  created_at: string;
  project_id?: number;
  file_desc?: string;
  is_present_image?: boolean;
}

interface GalleryLightboxProps {
  isOpen: boolean;
  files: GalleryFile[];
  initialIndex: number;
  onClose: () => void;
  currentArticleId?: number;
  pageType?: "home" | "gallery" | "article";
}

export function GalleryLightbox({ isOpen, files, initialIndex, onClose, currentArticleId, pageType }: GalleryLightboxProps) {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex, isOpen]);

  if (!isOpen || files.length === 0) return null;

  const currentFile = files[currentIndex];
  const isFirstImage = currentIndex === 0;
  const isLastImage = currentIndex === files.length - 1;
  const isVideo = currentFile.file_type?.toLowerCase().includes('video') || currentFile.file_type?.toLowerCase().includes('mp4') || currentFile.file_type?.toLowerCase().includes('webm');

  // Déterminer si on doit afficher le bouton de navigation vers l'article
  const showArticleButton = 
    currentFile.project_id !== undefined && 
    (pageType === "home" || pageType === "gallery") &&
    currentFile.project_id !== currentArticleId;

  const handleNavigateToArticle = () => {
    if (currentFile.project_id) {
      navigate(`/articles/${currentFile.project_id}`);
      onClose();
    }
  };

  const handlePrevious = () => {
    if (!isFirstImage) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleNext = () => {
    if (!isLastImage) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") handlePrevious();
    if (e.key === "ArrowRight") handleNext();
    if (e.key === "Escape") onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-[#00000080] flex items-center justify-center z-50"
      onClick={onClose}
      onKeyDown={handleKeyDown}
      role="dialog"
      aria-modal="true"
      tabIndex={-1}
    >
      <div
        className="relative max-w-4xl max-h-[90vh] w-full h-full flex flex-col items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Media (Image ou Vidéo) */}
        <div className="relative w-full h-full flex items-center justify-center">
          {isVideo ? (
            <video
              src={currentFile.file_path}
              className="w-full h-full object-contain"
              controls
              autoPlay
            />
          ) : (
            <ImageWithFallback
              src={currentFile.file_path}
              alt={currentFile.file_display_name}
              className="w-full h-full object-contain"
            />
          )}
        </div>

        {/* Info */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-primary via-primary to-transparent p-[30px]">
          <div className="bg-error content-stretch flex items-center justify-center p-[5px] mb-[12px] relative rounded-[4px] shrink-0 w-fit">
            <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[14px] text-white whitespace-nowrap">
              {new Date(currentFile.created_at).toLocaleDateString(language === 'FR' ? 'fr-FR' : 'en-US')}
            </p>
          </div>
          <p className="font-['Inter:Bold',sans-serif] font-bold leading-[normal] not-italic relative shrink-0 text-[18px] text-white">
            {currentFile.file_display_name}
          </p>
          {currentFile.file_desc_fr && (
            <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[14px] text-white mt-[8px] opacity-90">
              {currentFile.file_desc}
            </p>
          )}
          <div className="flex items-center gap-[10px] mt-[8px]">
            <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[12px] text-white opacity-70">
              {currentIndex + 1} / {files.length}
            </p>
            {isVideo && (
              <span className="bg-error-accent px-2 py-1 rounded text-white text-xs font-bold">
                VIDÉO
              </span>
            )}
          </div>
        </div>

        {/* Navigation Flèche Gauche */}
        <button
          onClick={handlePrevious}
          disabled={isFirstImage}
          className={`absolute left-[20px] top-1/2 transform -translate-y-1/2 p-[15px] rounded-full transition-all ${
            isFirstImage
              ? "bg-gray-500 opacity-30 cursor-not-allowed"
              : "bg-white hover:bg-error-accent text-black hover:text-white cursor-pointer"
          }`}
          aria-label="Image précédente"
        >
          <svg className="w-[24px] h-[24px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Navigation Flèche Droite */}
        <button
          onClick={handleNext}
          disabled={isLastImage}
          className={`absolute right-[20px] top-1/2 transform -translate-y-1/2 p-[15px] rounded-full transition-all ${
            isLastImage
              ? "bg-gray-500 opacity-30 cursor-not-allowed"
              : "bg-white hover:bg-error-accent text-black hover:text-white cursor-pointer"
          }`}
          aria-label="Image suivante"
        >
          <svg className="w-[24px] h-[24px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Bouton Fermer */}
        <button
          onClick={onClose}
          className="absolute top-[20px] right-[20px] p-[10px] bg-white hover:bg-error-accent text-black hover:text-white rounded-full transition-all"
          aria-label="Fermer"
        >
          <svg className="w-[24px] h-[24px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Bouton Aller à l'article */}
        {showArticleButton && (
          <button
            onClick={handleNavigateToArticle}
            className="absolute top-[20px] right-[70px] p-[10px] bg-error-accent hover:bg-error text-white rounded-full transition-all flex items-center gap-2"
            aria-label={t(language, "allerArticle")}
            title={t(language, "allerArticle")}
          >
            <svg className="w-[24px] h-[24px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm font-semibold">{t(language, "allerArticle")}</span>
          </button>
        )}
      </div>
    </div>
  );
}
