import { useState, useEffect } from "react";
import { Navigation } from "../../components/Navigation.tsx";
import { Footer } from "../../components/Footer.tsx";
import { ArticleCard } from "../../components/ArticleCard.tsx";
import { useLanguage } from "../../../contexts/LanguageContext.tsx";

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
  return hasEmptyField ? (language === 'FR' ? "En cours" : "In progress") : (language === 'FR' ? "Complet" : "Complete");
};

export default function ArticlesPage() {
  const { language } = useLanguage();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"date-asc" | "date-desc">("date-desc");
  const [showSortMenu, setShowSortMenu] = useState(false);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch("/api/projects");
        if (!response.ok) {
          throw new Error(language === 'FR' ? "Erreur lors du chargement des articles" : "Error loading articles");
        }
        const data = await response.json();
        
        // Enrichir les articles avec le statut calculé
        const enrichedArticles = data.map((article: Article) => ({
          ...article,
          status: calculateStatus(article, language),
        }));
        
        setArticles(enrichedArticles);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : (language === 'FR' ? "Erreur inconnue" : "Unknown error"));
        setLoading(false);
      }
    };

    fetchArticles();
  }, [language]);

  // Trier les articles
  const sortedArticles = [...articles].sort((a, b) => {
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
          {language === 'FR' ? 'Articles' : 'Articles'}
        </p>
        <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[32px] text-white w-full">
          {language === 'FR' ? 'Voici tout nos articles' : 'Here are all our articles'}
        </p>
      </div>
      <div className="relative shrink-0 w-full">
        <div aria-hidden="true" className="absolute border-[#f3f3f5] border-b border-solid inset-0 pointer-events-none" />
        <div className="flex flex-col items-center size-full">
          <div className="content-stretch flex flex-col gap-[40px] items-center p-[50px] relative w-full">
            <div className="content-stretch flex items-center justify-end gap-[20px] relative shrink-0 w-full">
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
                    {language === 'FR' ? (sortBy === "date-asc" ? "Date (Plus ancien)" : "Date (Plus récent)") : (sortBy === "date-asc" ? "Date (Oldest)" : "Date (Newest)")}
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
                      {language === 'FR' ? "Date (Plus ancien)" : "Date (Oldest)"}
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
                      {language === 'FR' ? "Date (Plus récent)" : "Date (Newest)"}
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-[40px] w-full">
              {loading && (
                <div className="col-span-3 text-center py-[50px]">
                  <p className="font-['Inter:Regular',sans-serif] font-normal text-[24px] text-gray-500">
                    {language === 'FR' ? 'Chargement des articles...' : 'Loading articles...'}
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
                    {language === 'FR' ? 'Aucun article trouvé' : 'No articles found'}
                  </p>
                </div>
              )}
              {!loading &&
                !error &&
                sortedArticles.map((article) => (
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
                    image="https://images.unsplash.com/photo-1581093449818-2655b2467fd6?w=400&h=300&fit=crop"
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



