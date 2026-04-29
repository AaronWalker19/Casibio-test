import { ImageWithFallback } from "./figma/ImageWithFallback.tsx";

interface GalleryCardProps {
  id: number;
  title: string;
  date: string;
  filePath: string;
  fileType: string;
  onImageClick: () => void;
}

export function GalleryCard({ title, date, filePath, fileType, onImageClick }: GalleryCardProps) {
  const isVideo = fileType?.toLowerCase().includes('video') || fileType?.toLowerCase().includes('mp4') || fileType?.toLowerCase().includes('webm');

  return (
    <div
      className="relative group cursor-pointer overflow-hidden rounded-[4px] w-full h-full"
      onClick={onImageClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          onImageClick();
        }
      }}
    >
      <div className="aspect-[4/3] w-full bg-gray-200 relative">
        {isVideo ? (
          <div className="w-full h-full flex items-center justify-center bg-black">
            <video
              src={filePath}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
            {/* Badge VIDÉO */}
            <div className="absolute top-2 right-2 bg-error-accent px-2 py-1 rounded text-white text-xs font-bold">
              VIDÉO
            </div>
          </div>
        ) : (
          <ImageWithFallback
            src={filePath}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
        )}
      </div>
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-primary to-transparent p-[15px]">
        <div className="bg-error content-stretch flex items-center justify-center p-[5px] mb-[8px] relative rounded-[4px] shrink-0 w-fit">
          <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[12px] text-white whitespace-nowrap">
            {date}
          </p>
        </div>
        <p className="font-['Inter:Bold',sans-serif] font-bold leading-[normal] not-italic relative shrink-0 text-[14px] text-white">
          {title}
        </p>
      </div>
    </div>
  );
}
