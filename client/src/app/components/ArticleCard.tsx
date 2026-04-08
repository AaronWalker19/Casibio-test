import { Link } from "react-router";
import { ImageWithFallback } from "./figma/ImageWithFallback.tsx";

interface ArticleCardProps {
  id: number;
  title: string;
  date: string;
  status: string;
  description: string;
  image: string;
}

export function ArticleCard({ id, title, date, status, description, image }: ArticleCardProps) {
  return (
    <Link
      to={`/articles/${id}`}
      className="bg-[#183542] content-stretch flex flex-col items-center pb-[113px] relative rounded-[4px] shrink-0 w-[476px] hover:opacity-90 transition-opacity cursor-pointer"
      data-name="article"
    >
      <div className="h-[312px] mb-[-103px] relative shrink-0 w-[476px]">
        <ImageWithFallback src={image} alt={title} className="w-full h-full object-cover" />
      </div>
      <div className="content-stretch flex flex-col gap-[5px] items-end mb-[-103px] relative shrink-0 w-[450px]">
        <div className="content-stretch flex gap-[5px] items-center relative shrink-0 w-full">
          <div className="bg-[#c9232c] content-stretch flex items-center justify-center p-[5px] relative rounded-[4px] shrink-0">
            <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[12px] text-white whitespace-nowrap">
              date: {date}
            </p>
          </div>
          <div className={`content-stretch flex items-center justify-center p-[5px] relative rounded-[4px] shrink-0 ${
            status === "Complet" ? "bg-[#137300]" : "bg-[#ff9500]"
          }`}>
            <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[12px] text-white whitespace-nowrap">
              {status}
            </p>
          </div>
        </div>
        <div className="bg-[#f3f3f5] relative rounded-[4px] shrink-0 w-full">
          <div className="flex flex-col items-center justify-center size-full">
            <div className="content-stretch flex flex-col gap-[10px] items-center justify-center leading-[normal] not-italic p-[5px] relative text-[#183542] text-center w-full">
              <p className="font-['Inter:Bold',sans-serif] font-bold relative shrink-0 text-[32px] w-full">
                {title}
              </p>
              <p className="font-['Inter:Regular',sans-serif] font-normal opacity-70 relative shrink-0 text-[14px] w-full">
                {description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
