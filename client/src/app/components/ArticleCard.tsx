import { useState } from "react";
import { Link } from "react-router";
import { ImageWithFallback } from "./figma/ImageWithFallback.tsx";
import HtmlContent from "./HtmlContent.tsx";

interface ArticleCardProps {
  id: number;
  title: string;
  date: string;
  status: string;
  description: string;
  image?: string;
  onEdit?: () => void;
  onDelete?: (id: number, title: string) => void;
  onView?: (id: number) => void;
  isEditable?: boolean;
}

export function ArticleCard({ id, title, date, status, description, image, onEdit, onDelete, onView, isEditable = false }: ArticleCardProps) {
  const isComplete = status === "Complet" || status === "Complété";
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  const handleViewClick = (e: React.MouseEvent) => {
    if (isEditable && onView) {
      e.preventDefault();
      onView(id);
    }
  };

  const handleDeleteConfirm = () => {
    setShowDeleteConfirm(false);
    if (onDelete) {
      onDelete(id, title);
    }
  };
  
  return (
    <>
      <Link
        to={`/articles/${id}`}
        onClick={handleViewClick}
        className="bg-primary flex flex-col items-center relative rounded-sm w-full sm:w-72 md:w-80 lg:w-auto lg:min-w-96 hover:opacity-90 transition-opacity cursor-pointer"
        data-name="article"
      >
        {/* Boutons d'édition et suppression pour les membres */}
        {isEditable && (onEdit || onDelete) && (
          <div className="absolute right-[10px] top-[10px] z-10 flex gap-[8px]">
            {onEdit && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onEdit();
                }}
                className="bg-blue-500 p-[8px] rounded-[4px] cursor-pointer hover:bg-blue-600 transition-colors"
                title="Modifier l'article"
              >
                <svg className="size-[24px]" fill="none" viewBox="0 0 24 24">
                  <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25Z" fill="white" />
                  <path d="M20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83Z" fill="white" />
                </svg>
              </button>
            )}
            {onDelete && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowDeleteConfirm(true);
                }}
                className="bg-[#c9232c] p-[8px] rounded-[4px] cursor-pointer hover:bg-[#a01f26] transition-colors"
                title="Supprimer l'article"
              >
                <svg className="size-[24px]" fill="none" viewBox="0 0 24 24">
                  <path d="M6 19C6 20.1 6.9 21 8 21H16C17.1 21 18 20.1 18 19V7H6V19ZM8 9H16V19H8V9ZM15.5 4L14.5 3H9.5L8.5 4H5V6H19V4H15.5Z" fill="white" />
                </svg>
              </button>
            )}
          </div>
        )}
        <div className="h-40 sm:h-48 md:h-56 lg:h-72 pb-5 relative  w-full">
          {image ? (
            <ImageWithFallback src={image} alt={title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-primary" />
          )}
        </div>
        <div className="flex flex-col gap-1 sm:gap-2 items-end absolute bottom-3  w-11/12">
          <div className="flex gap-1 sm:gap-2 items-center relative  w-full flex-wrap">
            <div className="bg-error flex items-center justify-center px-2 sm:px-3 py-0.5 sm:py-1 relative rounded-sm ">
              <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative  text-xs sm:text-sm text-white whitespace-nowrap">
                date: {date}
              </p>
            </div>
            <div className={`flex items-center justify-center px-2 sm:px-3 py-0.5 sm:py-1 relative rounded-sm  ${
              isComplete ? "bg-success" : "bg-warning"
            }`}>
              <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative  text-xs sm:text-sm text-white whitespace-nowrap">
                {status}
              </p>
            </div>
          </div>
          <div className="bg-gray-50 relative rounded-sm  w-full">
            <div className="flex flex-col items-center justify-center size-full">
              <div className="flex flex-col gap-2 sm:gap-3 md:gap-4 items-center justify-center leading-[normal] not-italic px-2 sm:px-3 py-3 sm:py-4 relative text-primary text-center w-full">
                <p className="font-['Inter:Bold',sans-serif] font-bold relative  text-lg sm:text-xl md:text-2xl lg:text-3xl w-full line-clamp-2">
                  {title}
                </p>
                <div className="font-['Inter:Regular',sans-serif] font-normal opacity-70 relative  text-xs sm:text-sm w-full line-clamp-2">
                  <HtmlContent html={description} className="text-xs sm:text-sm" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>

      {/* Popup de confirmation de suppression */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-[#00000080] flex items-center justify-center z-50">
          <div className="bg-white rounded-sm p-6 sm:p-8 max-w-sm mx-4 shadow-lg">
            <p className="font-['Inter:Bold',sans-serif] font-bold text-lg sm:text-xl text-black mb-4">
              Confirmation de suppression
            </p>
            <p className="font-['Inter:Regular',sans-serif] font-normal text-sm sm:text-base text-gray-700 mb-6">
              Êtes-vous sûr de vouloir supprimer l'article "<span className="font-bold">{title}</span>" ? Cette action est irréversible.
            </p>
            <div className="flex gap-3 sm:gap-4">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 sm:px-6 py-2 sm:py-3 bg-gray-200 hover:bg-gray-300 text-black rounded-sm font-['Inter:Regular',sans-serif] font-normal text-sm sm:text-base transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="flex-1 px-4 sm:px-6 py-2 sm:py-3 bg-[#c9232c] hover:bg-[#a01f26] text-white rounded-sm font-['Inter:Regular',sans-serif] font-normal text-sm sm:text-base transition-colors"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
