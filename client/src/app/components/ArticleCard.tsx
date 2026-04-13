import { Link } from "react-router";
import { ImageWithFallback } from "./figma/ImageWithFallback.tsx";

interface ArticleCardProps {
  id: number;
  title: string;
  date: string;
  status: string;
  description: string;
  image?: string;
}

export function ArticleCard({ id, title, date, status, description, image }: ArticleCardProps) {
  const isComplete = status === "Complet" || status === "Complete";
  
  return (
    <Link
      to={`/articles/${id}`}
      className="bg-primary flex flex-col items-center relative rounded-sm w-full sm:w-72 md:w-80 lg:w-96 hover:opacity-90 transition-opacity cursor-pointer"
      data-name="article"
    >
      <div className="h-40 sm:h-48 md:h-56 lg:h-64 relative  w-full">
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
              <p className="font-['Inter:Regular',sans-serif] font-normal opacity-70 relative  text-xs sm:text-sm w-full line-clamp-2">
                {description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
