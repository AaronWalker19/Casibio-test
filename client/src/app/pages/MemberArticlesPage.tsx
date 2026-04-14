import { useState, useEffect } from "react";
import { Link } from "react-router";
import { Navigation } from "../components/Navigation.tsx";
import { Footer } from "../components/Footer.tsx";
import { ImageWithFallback } from "../components/figma/ImageWithFallback.tsx";
import { useAuth } from "../../contexts/AuthContext.tsx";

interface Article {
  id: number;
  title_fr: string;
  title_en: string;
  summary_fr: string;
  summary_en: string;
  created_at: string;
  code_anr?: string;
  image?: string;
}

export default function MemberArticlesPage() {
  const { user } = useAuth();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("authToken");
      if (!token) {
        setError("Vous n'êtes pas authentifié");
        setLoading(false);
        return;
      }

      const response = await fetch("/api/projects", {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error("Erreur lors du chargement des articles");
      }

      const data = await response.json();
      setArticles(data);
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors du chargement");
      console.error("Error fetching articles:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteArticle = async (id: number, title: string) => {
    if (!window.confirm(`Êtes-vous sûr de vouloir supprimer "${title}" ?`)) {
      return;
    }

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setError("Vous n'êtes pas authentifié");
        return;
      }

      const response = await fetch(`/api/projects/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la suppression");
      }

      // Supprimer de la liste locale
      setArticles(articles.filter((article) => article.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de la suppression");
      console.error("Error deleting article:", err);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };

  return (
    <div className="bg-white flex flex-col items-center relative size-full">
      <Navigation />
      <div className="relative w-full bg-gray-50">
        <div className="flex flex-col items-center size-full">
          <div className="flex flex-col gap-[40px] items-center p-[50px] relative w-full max-w-[1400px]">
            <div className="flex gap-[40px] items-start w-full">
              <button className="font-['Inter:Bold',sans-serif] font-bold text-[48px] text-black whitespace-nowrap border-b-[4px] border-black pb-[5px]">
                Articles
              </button>
              {user?.role === "admin" && (
                <Link to="/backoffice/membres" className="font-['Inter:Regular',sans-serif] font-normal text-[48px] text-black whitespace-nowrap">
                  Membres
                </Link>
              )}
            </div>
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center justify-end gap-[20px]">
                <button className="flex gap-[10px] items-center p-[5px] rounded-[4px]">
                  <div aria-hidden="true" className="absolute border border-black inset-0 pointer-events-none rounded-[4px]" />
                  <div className="relative size-[32px]">
                    <div className="absolute inset-[12.5%_14.27%_14.27%_12.5%]" data-name="Vector">
                      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 23.4526 23.4526">
                        <path d="M19.6914 20.9531L13.168 14.4297C12.6758 14.8438 12.1152 15.168 11.4863 15.4023C10.8574 15.6367 10.1895 15.7539 9.48242 15.7539C7.72852 15.7539 6.22852 15.1582 5.04102 13.9668C3.84375 12.7852 3.24023 11.2852 3.24023 9.53125C3.24023 7.77734 3.8418 6.27734 5.04102 5.08594C6.23047 3.88477 7.73047 3.28516 9.48242 3.28516C11.2441 3.28516 12.7441 3.88477 13.9355 5.08594C15.1367 6.27734 15.7363 7.77734 15.7363 9.53125C15.7363 10.2383 15.6191 10.9062 15.3848 11.5352C15.1504 12.1641 14.8262 12.7305 14.4121 13.2227L20.9551 19.7656L19.6914 20.9531ZM9.48242 14.0039C10.7461 14.0039 11.8184 13.5527 12.6895 12.6621C13.5703 11.7617 14.0156 10.6895 14.0156 9.42578C14.0156 8.16211 13.5703 7.08984 12.6895 6.19922C11.8184 5.29883 10.7461 4.84766 9.48242 4.84766C8.20898 4.84766 7.13086 5.29883 6.25977 6.19922C5.37891 7.08984 4.93359 8.16211 4.93359 9.42578C4.93359 10.6895 5.37891 11.7617 6.25977 12.6621C7.13086 13.5527 8.20898 14.0039 9.48242 14.0039Z" fill="black" id="Vector" />
                      </svg>
                    </div>
                  </div>
                </button>
                <button className="flex gap-[10px] items-center p-[5px] rounded-[4px]">
                  <div aria-hidden="true" className="absolute border border-black inset-0 pointer-events-none rounded-[4px]" />
                  <div className="relative size-[32px]">
                    <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
                      <path d="M4 8H28V10.6667H4V8ZM8 14.6667H24V17.3333H8V14.6667ZM12 21.3333H20V24H12V21.3333Z" fill="black" />
                    </svg>
                  </div>
                  <p className="font-['Inter:Regular',sans-serif] font-normal text-[32px] text-black whitespace-nowrap">
                    Filtre
                  </p>
                </button>
              </div>
              <Link
                to="/formulaire"
                className="bg-primary flex gap-[10px] items-center justify-center px-[40px] py-[15px] rounded-[4px]"
              >
                <p className="font-['Inter:Regular',sans-serif] font-normal text-[24px] text-white whitespace-nowrap">
                  Ajouter un articles
                </p>
                <div className="relative size-[24px]">
                  <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
                    <path d="M12 5V19M5 12H19" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                  </svg>
                </div>
              </Link>
            </div>
            {error && (
              <div className="w-full bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            {loading ? (
              <div className="w-full text-center py-8">
                <p className="font-['Inter:Regular',sans-serif] font-normal text-[18px] text-gray-600">
                  Chargement des articles...
                </p>
              </div>
            ) : articles.length === 0 ? (
              <div className="w-full text-center py-8">
                <p className="font-['Inter:Regular',sans-serif] font-normal text-[18px] text-gray-600">
                  Aucun article pour le moment. Créez votre premier article !
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-[40px] w-full">
                {articles.map((article) => (
                  <div key={article.id} className="bg-primary relative flex flex-col items-center pb-[103px] rounded-[4px]">
                    <button
                      onClick={() => handleDeleteArticle(article.id, article.title_fr)}
                      className="absolute right-[10px] top-[10px] z-10 bg-[#c9232c] p-[8px] rounded-[4px] cursor-pointer hover:bg-[#a01f26] transition-colors"
                    >
                      <svg className="size-[24px]" fill="none" viewBox="0 0 24 24">
                        <path d="M6 19C6 20.1 6.9 21 8 21H16C17.1 21 18 20.1 18 19V7H6V19ZM8 9H16V19H8V9ZM15.5 4L14.5 3H9.5L8.5 4H5V6H19V4H15.5Z" fill="white" />
                      </svg>
                    </button>
                    <div className="h-[270px] mb-[-103px] w-full">
                      <ImageWithFallback 
                        src={article.image ?? "https://images.unsplash.com/photo-1581093449818-2655b2467fd6?w=400&h=300&fit=crop"} 
                        alt={article.title_fr} 
                        className="w-full h-full object-cover rounded-t-[4px]" 
                      />
                    </div>
                    <div className="flex flex-col gap-[5px] items-end mb-[-103px] px-[10px] w-full">
                      <div className="flex gap-[5px] items-center w-full">
                        <div className="bg-error flex items-center justify-center p-[5px] rounded-[4px]">
                          <p className="font-['Inter:Regular',sans-serif] font-normal text-[12px] text-white whitespace-nowrap">
                            {formatDate(article.created_at)}
                          </p>
                        </div>
                        <div className="bg-success flex items-center justify-center p-[5px] rounded-[4px]">
                          <p className="font-['Inter:Regular',sans-serif] font-normal text-[12px] text-white whitespace-nowrap">
                            Complété
                          </p>
                        </div>
                      </div>
                      <div className="bg-gray-50 rounded-[4px] w-full">
                        <div className="flex flex-col items-center justify-center size-full">
                          <div className="flex flex-col gap-[10px] items-center justify-center leading-[normal] p-[20px] text-primary text-center w-full">
                            <p className="font-['Inter:Bold',sans-serif] font-bold text-[24px] w-full">
                              {article.title_fr}
                            </p>
                            <p className="font-['Inter:Regular',sans-serif] font-normal opacity-70 text-[14px] w-full">
                              {article.summary_fr}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}



