import { useState, useEffect } from "react";
import { Navigation } from "../components/Navigation.tsx";
import { Footer } from "../components/Footer.tsx";
import { GalleryCard } from "../components/GalleryCard.tsx";
import { GalleryLightbox } from "../components/GalleryLightbox.tsx";

interface GalleryFile {
  id: number;
  file_name: string;
  file_display_name: string;
  file_path: string;
  file_type: string;
  created_at: string;
}

export default function GalleriePage() {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"date-asc" | "date-desc">("date-desc");
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [galleryFiles, setGalleryFiles] = useState<GalleryFile[]>([]);
  const [loadingGallery, setLoadingGallery] = useState(true);
  const [errorGallery, setErrorGallery] = useState<string | null>(null);

  useEffect(() => {
    const fetchGalleryFiles = async () => {
      try {
        const response = await fetch("/api/projects/files/all");
        if (!response.ok) {
          throw new Error("Erreur lors du chargement des fichiers");
        }
        const data = await response.json();
        setGalleryFiles(data);
        setLoadingGallery(false);
      } catch (err) {
        setErrorGallery(err instanceof Error ? err.message : "Erreur inconnue");
        setLoadingGallery(false);
      }
    };

    fetchGalleryFiles();
  }, []);

  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index);
    setLightboxOpen(true);
  };

  // Filtrer les images par terme de recherche
  const filteredImages = galleryFiles.filter((file) =>
    file.file_display_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    file.created_at.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Trier les images
  const sortedImages = [...filteredImages].sort((a, b) => {
    if (sortBy === "date-asc") {
      return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
    }
    if (sortBy === "date-desc") {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }
    return 0;
  });

  return (
    <div className="bg-white content-stretch flex flex-col items-center relative size-full">
      <Navigation />
      <div className="bg-[#183542] content-stretch flex flex-col gap-[20px] items-start px-[50px] py-[50px] relative shrink-0 w-full">
        <p className="font-['Inter:Bold',sans-serif] font-bold leading-[normal] not-italic relative shrink-0 text-[96px] text-[#ff404a] w-full">
          Gallerie
        </p>
        <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[32px] text-white w-full">
          Parcourez toutes les photos de notre projet
        </p>
      </div>
      <div className="relative shrink-0 w-full">
        <div aria-hidden="true" className="absolute border-[#f3f3f5] border-b border-solid inset-0 pointer-events-none" />
        <div className="flex flex-col items-center size-full">
          <div className="content-stretch flex flex-col gap-[40px] items-center p-[50px] relative w-full">
            <div className="content-stretch flex items-center justify-end gap-[20px] relative shrink-0 w-full">
              {/* Barre de recherche */}
              <div className="relative flex items-center h-[40px]">
                <input
                  type="text"
                  placeholder="Rechercher..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="p-[10px] pl-[40px] rounded-[4px] border border-black w-[200px] font-['Inter:Regular',sans-serif] h-full"
                />
                <div className="absolute left-[10px] top-1/2 transform -translate-y-1/2 shrink-0 size-[18px]">
                  <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 23.4526 23.4526">
                    <path d="M19.6914 20.9531L13.168 14.4297C12.6758 14.8438 12.1152 15.168 11.4863 15.4023C10.8574 15.6367 10.1895 15.7539 9.48242 15.7539C7.72852 15.7539 6.22852 15.1582 5.04102 13.9668C3.84375 12.7852 3.24023 11.2852 3.24023 9.53125C3.24023 7.77734 3.8418 6.27734 5.04102 5.08594C6.23047 3.88477 7.73047 3.28516 9.48242 3.28516C11.2441 3.28516 12.7441 3.88477 13.9355 5.08594C15.1367 6.27734 15.7363 7.77734 15.7363 9.53125C15.7363 10.2383 15.6191 10.9062 15.3848 11.5352C15.1504 12.1641 14.8262 12.7305 14.4121 13.2227L20.9551 19.7656L19.6914 20.9531ZM9.48242 14.0039C10.7461 14.0039 11.8184 13.5527 12.6895 12.6621C13.5703 11.7617 14.0156 10.6895 14.0156 9.42578C14.0156 8.16211 13.5703 7.08984 12.6895 6.19922C11.8184 5.29883 10.7461 4.84766 9.48242 4.84766C8.20898 4.84766 7.13086 5.29883 6.25977 6.19922C5.37891 7.08984 4.93359 8.16211 4.93359 9.42578C4.93359 10.6895 5.37891 11.7617 6.25977 12.6621C7.13086 13.5527 8.20898 14.0039 9.48242 14.0039Z" fill="black" />
                  </svg>
                </div>
              </div>

              {/* Bouton Filtre avec menu déroulant */}
              <div className="relative">
                <button
                  onClick={() => setShowSortMenu(!showSortMenu)}
                  className="flex gap-[10px] items-center p-[10px] relative rounded-[4px] shrink-0 h-[40px] border border-black"
                >
                  <div className="relative shrink-0 size-[20px]" data-name="mi:filter">
                    <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
                      <path d="M4 8H28V10.6667H4V8ZM8 14.6667H24V17.3333H8V14.6667ZM12 21.3333H20V24H12V21.3333Z" fill="black" />
                    </svg>
                  </div>
                  <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[14px] text-black whitespace-nowrap">
                    {sortBy === "date-asc"
                      ? "Date (Plus ancien)"
                      : "Date (Plus récent)"}
                  </p>
                </button>

                {/* Menu déroulant */}
                {showSortMenu && (
                  <div className="absolute right-0 mt-[5px] bg-white border border-black rounded-[4px] z-10 shadow-lg">
                    <button
                      onClick={() => {
                        setSortBy("date-asc");
                        setShowSortMenu(false);
                      }}
                      className={`block w-full text-left px-[20px] py-[10px] hover:bg-gray-100 ${
                        sortBy === "date-asc" ? "bg-[#ff404a] text-white" : ""
                      }`}
                    >
                      Date (Plus ancien)
                    </button>
                    <button
                      onClick={() => {
                        setSortBy("date-desc");
                        setShowSortMenu(false);
                      }}
                      className={`block w-full text-left px-[20px] py-[10px] hover:bg-gray-100 ${
                        sortBy === "date-desc" ? "bg-[#ff404a] text-white" : ""
                      }`}
                    >
                      Date (Plus récent)
                    </button>
                  </div>
                )}
              </div>
            </div>
            {loadingGallery ? (
              <div className="col-span-4 text-center py-[50px]">
                <p className="font-['Inter:Regular',sans-serif] font-normal text-[24px] text-gray-500">
                  Chargement des fichiers...
                </p>
              </div>
            ) : errorGallery ? (
              <div className="col-span-4 text-center py-[50px]">
                <p className="font-['Inter:Regular',sans-serif] font-normal text-[24px] text-red-500">
                  Erreur lors du chargement des fichiers
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-4 gap-[30px] w-full">
                {sortedImages.length > 0 ? (
                  sortedImages.map((file, index) => (
                    <GalleryCard
                      key={file.id}
                      id={file.id}
                      title={file.file_display_name}
                      date={new Date(file.created_at).toLocaleDateString('fr-FR')}
                      filePath={file.file_path}
                      fileType={file.file_type}
                      onImageClick={() => handleImageClick(index)}
                    />
                  ))
                ) : (
                  <div className="col-span-4 text-center py-[50px]">
                    <p className="font-['Inter:Regular',sans-serif] font-normal text-[24px] text-gray-500">
                      Aucun fichier trouvé
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <GalleryLightbox
        isOpen={lightboxOpen}
        files={sortedImages}
        initialIndex={selectedImageIndex}
        onClose={() => setLightboxOpen(false)}
      />

      <Footer />
    </div>
  );
}



