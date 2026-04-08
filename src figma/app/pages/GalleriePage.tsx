import { Navigation } from "../components/Navigation";
import { Footer } from "../components/Footer";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

const galleryImages = [
  {
    id: 1,
    title: "Polymer ajouter au contour de céramique",
    date: "date: 17 Mars 2026",
    image: "https://images.unsplash.com/photo-1630959305529-67447c685b9e?w=400&h=300&fit=crop",
  },
  {
    id: 2,
    title: "Polymer ajouter au contour de céramique",
    date: "date: 17 Mars 2026",
    image: "https://images.unsplash.com/photo-1758467033682-6cd6e3c841d8?w=400&h=300&fit=crop",
  },
  {
    id: 3,
    title: "Polymer ajouter au contour de céramique",
    date: "date: 17 Mars 2026",
    image: "https://images.unsplash.com/photo-1673760768593-da653fe4acd1?w=400&h=300&fit=crop",
  },
  {
    id: 4,
    title: "Polymer ajouter au contour de céramique",
    date: "date: 17 Mars 2026",
    image: "https://images.unsplash.com/photo-1668511237388-404cc7e56e9d?w=400&h=300&fit=crop",
  },
  {
    id: 5,
    title: "Polymer ajouter au contour de céramique",
    date: "date: 17 Mars 2026",
    image: "https://images.unsplash.com/photo-1576669801838-1b1c52121e6a?w=400&h=300&fit=crop",
  },
  {
    id: 6,
    title: "Polymer ajouter au contour de céramique",
    date: "date: 17 Mars 2026",
    image: "https://images.unsplash.com/photo-1736098687629-a9abff3e03ab?w=400&h=300&fit=crop",
  },
  {
    id: 7,
    title: "Polymer ajouter au contour de céramique",
    date: "date: 17 Mars 2026",
    image: "https://images.unsplash.com/photo-1768498950658-87ecfe232b59?w=400&h=300&fit=crop",
  },
  {
    id: 8,
    title: "Polymer ajouter au contour de céramique",
    date: "date: 17 Mars 2026",
    image: "https://images.unsplash.com/photo-1758685734156-3c5d35bae1d1?w=400&h=300&fit=crop",
  },
  {
    id: 9,
    title: "Polymer ajouter au contour de céramique",
    date: "date: 17 Mars 2026",
    image: "https://images.unsplash.com/photo-1581093449818-2655b2467fd6?w=400&h=300&fit=crop",
  },
  {
    id: 10,
    title: "Polymer ajouter au contour de céramique",
    date: "date: 17 Mars 2026",
    image: "https://images.unsplash.com/photo-1707863080643-2a7dc1f8486f?w=400&h=300&fit=crop",
  },
  {
    id: 11,
    title: "Polymer ajouter au contour de céramique",
    date: "date: 17 Mars 2026",
    image: "https://images.unsplash.com/photo-1766297247072-93fd815afef3?w=400&h=300&fit=crop",
  },
  {
    id: 12,
    title: "Polymer ajouter au contour de céramique",
    date: "date: 17 Mars 2026",
    image: "https://images.unsplash.com/photo-1770320742275-2ad1714ab774?w=400&h=300&fit=crop",
  },
  {
    id: 13,
    title: "Polymer ajouter au contour de céramique",
    date: "date: 17 Mars 2026",
    image: "https://images.unsplash.com/photo-1761095596584-34731de3e568?w=400&h=300&fit=crop",
  },
];

export default function GalleriePage() {
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
              <button className="content-stretch flex gap-[10px] items-center p-[5px] relative rounded-[4px] shrink-0">
                <div aria-hidden="true" className="absolute border border-black border-solid inset-0 pointer-events-none rounded-[4px]" />
                <div className="relative shrink-0 size-[32px]" data-name="material-symbols:search-rounded">
                  <div className="absolute inset-[12.5%_14.27%_14.27%_12.5%]" data-name="Vector">
                    <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 23.4526 23.4526">
                      <path d="M19.6914 20.9531L13.168 14.4297C12.6758 14.8438 12.1152 15.168 11.4863 15.4023C10.8574 15.6367 10.1895 15.7539 9.48242 15.7539C7.72852 15.7539 6.22852 15.1582 5.04102 13.9668C3.84375 12.7852 3.24023 11.2852 3.24023 9.53125C3.24023 7.77734 3.8418 6.27734 5.04102 5.08594C6.23047 3.88477 7.73047 3.28516 9.48242 3.28516C11.2441 3.28516 12.7441 3.88477 13.9355 5.08594C15.1367 6.27734 15.7363 7.77734 15.7363 9.53125C15.7363 10.2383 15.6191 10.9062 15.3848 11.5352C15.1504 12.1641 14.8262 12.7305 14.4121 13.2227L20.9551 19.7656L19.6914 20.9531ZM9.48242 14.0039C10.7461 14.0039 11.8184 13.5527 12.6895 12.6621C13.5703 11.7617 14.0156 10.6895 14.0156 9.42578C14.0156 8.16211 13.5703 7.08984 12.6895 6.19922C11.8184 5.29883 10.7461 4.84766 9.48242 4.84766C8.20898 4.84766 7.13086 5.29883 6.25977 6.19922C5.37891 7.08984 4.93359 8.16211 4.93359 9.42578C4.93359 10.6895 5.37891 11.7617 6.25977 12.6621C7.13086 13.5527 8.20898 14.0039 9.48242 14.0039Z" fill="black" id="Vector" />
                    </svg>
                  </div>
                </div>
              </button>
              <button className="content-stretch flex gap-[10px] items-center p-[5px] relative rounded-[4px] shrink-0">
                <div aria-hidden="true" className="absolute border border-black border-solid inset-0 pointer-events-none rounded-[4px]" />
                <div className="relative shrink-0 size-[32px]" data-name="mi:filter">
                  <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
                    <path d="M4 8H28V10.6667H4V8ZM8 14.6667H24V17.3333H8V14.6667ZM12 21.3333H20V24H12V21.3333Z" fill="black" />
                  </svg>
                </div>
                <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[32px] text-black whitespace-nowrap">
                  Filtre
                </p>
              </button>
            </div>
            <div className="grid grid-cols-4 gap-[30px] w-full">
              {galleryImages.map((image) => (
                <div key={image.id} className="relative group cursor-pointer overflow-hidden rounded-[4px]">
                  <div className="aspect-[4/3] w-full">
                    <ImageWithFallback 
                      src={image.image} 
                      alt={image.title} 
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" 
                    />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#183542] to-transparent p-[15px]">
                    <div className="bg-[#c9232c] content-stretch flex items-center justify-center p-[5px] mb-[8px] relative rounded-[4px] shrink-0 w-fit">
                      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[12px] text-white whitespace-nowrap">
                        {image.date}
                      </p>
                    </div>
                    <p className="font-['Inter:Bold',sans-serif] font-bold leading-[normal] not-italic relative shrink-0 text-[14px] text-white">
                      {image.title}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
