import { useState, useEffect } from "react";
import { Navigation } from "../../components/Navigation.tsx";
import { Footer } from "../../components/Footer.tsx";
import { ArticleCard } from "../../components/ArticleCard.tsx";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback.tsx";

interface Article {
  id: number;
  title_fr: string;
  date: string;
  status: string;
  image: string;
  code_anr?: string;
}

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch("/api/projects");
        if (!response.ok) {
          throw new Error("Erreur lors du chargement des articles");
        }
        const data = await response.json();
        setArticles(data);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur inconnue");
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);
  return (
    <div className="bg-white content-stretch flex flex-col items-center relative size-full">
      <Navigation />
      <div className="bg-[#183542] content-stretch flex flex-col gap-[20px] items-start px-[50px] py-[50px] relative shrink-0 w-full">
        <p className="font-['Inter:Bold',sans-serif] font-bold leading-[normal] not-italic relative shrink-0 text-[96px] text-[#ff404a] w-full">
          Articles
        </p>
        <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[32px] text-white w-full">
          Voici tout nos articles
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
            <div className="grid grid-cols-3 gap-[40px] w-full">
              {loading && (
                <div className="col-span-3 text-center py-[50px]">
                  <p className="font-['Inter:Regular',sans-serif] font-normal text-[24px] text-gray-500">
                    Chargement des articles...
                  </p>
                </div>
              )}
              {error && (
                <div className="col-span-3 text-center py-[50px]">
                  <p className="font-['Inter:Regular',sans-serif] font-normal text-[24px] text-red-500">
                    {error}
                  </p>
                </div>
              )}
              {!loading && !error && articles.length === 0 && (
                <div className="col-span-3 text-center py-[50px]">
                  <p className="font-['Inter:Regular',sans-serif] font-normal text-[24px] text-gray-500">
                    Aucun article trouvé
                  </p>
                </div>
              )}
              {!loading &&
                !error &&
                articles.map((article) => (
                  <ArticleCard
                    key={article.id}
                    id={article.id}
                    title={article.title_fr}
                    date={article.date}
                    status={article.status}
                    description={article.title_fr}
                    image={article.image}
                  />
                ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}



