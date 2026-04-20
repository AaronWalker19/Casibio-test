import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { Navigation } from "../components/Navigation.tsx";
import { Footer } from "../components/Footer.tsx";
import { ImageWithFallback } from "../components/figma/ImageWithFallback.tsx";
import { ArticleCard } from "../components/ArticleCard.tsx";
import { useAuth } from "../../contexts/AuthContext.tsx";
import { useLanguage } from "../../contexts/LanguageContext.tsx";

interface Article {
  id: number;
  title_fr: string;
  title_en: string;
  summary_fr: string;
  summary_en: string;
  created_at: string;
  code_anr?: string;
  image?: string;
  methods_fr?: string;
  methods_en?: string;
  results_fr?: string;
  results_en?: string;
  perspectives_fr?: string;
  perspectives_en?: string;
  first_content_fr?: string | null;
  first_content_en?: string | null;
  contents?: Array<{
    id: number;
    project_id: number;
    title_fr: string;
    title_en: string;
    content_fr: string;
    content_en: string;
    position: number;
  }>;
}

export default function MemberArticlesPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { language } = useLanguage();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [articleImages, setArticleImages] = useState<{ [key: number]: string }>({});

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
      
      console.log("=== MEMBER ARTICLES PAGE ===");
      console.log("Nombre d'articles:", data.length);
      if (data.length > 0) {
        console.log("Premier article:", data[0]);
        console.log("- first_content_fr:", data[0].first_content_fr);
        console.log("- first_content_en:", data[0].first_content_en);
        console.log("- contents:", data[0].contents);
      }
      
      setArticles(data);
      setError("");
      
      // Récupérer les images liées à chaque article
      const imagesMap: { [key: number]: string } = {};
      for (const article of data) {
        try {
          const filesResponse = await fetch(`/api/projects/${article.id}/files`, {
            headers: {
              "Authorization": `Bearer ${token}`,
            },
            credentials: 'include',
          });
          if (filesResponse.ok) {
            const files = await filesResponse.json();
            if (files.length > 0) {
              // Filtrer et trier les images par date (la plus récente d'abord)
              const imagesOnly = files.filter((f: any) => 
                f.file_type?.toLowerCase().includes('image') ||
                f.file_path?.match(/\.(jpg|jpeg|png|gif|webp)$/i)
              );
              
              if (imagesOnly.length > 0) {
                // Trier par date décroissante (plus récent d'abord)
                const sortedImages = imagesOnly.sort((a: any, b: any) => {
                  return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
                });
                // Prendre l'image la plus récente
                imagesMap[article.id] = sortedImages[0].file_path;
              }
            }
          }
        } catch (err) {
          console.error(`Erreur lors du chargement des images pour l'article ${article.id}:`, err);
        }
      }
      setArticleImages(imagesMap);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors du chargement");
      console.error("Error fetching articles:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteArticle = async (id: number, title: string) => {
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

  const handleEditArticle = (article: Article) => {
    // Naviguer vers le formulaire en passant l'article à modifier
    navigate("/formulaire", { state: { editingArticle: article } });
  };

  const handleViewArticle = (articleId: number) => {
    // Naviguer vers la page de détail de l'article
    navigate(`/articles/${articleId}`);
  };

  const formatDate = (dateString: string) => {
    try {
      // Normaliser la date SQLite au format ISO
      const normalizedDate = dateString.includes("T")
        ? dateString
        : dateString.replace(" ", "T");
      const date = new Date(normalizedDate);
      return new Intl.DateTimeFormat('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }).format(date);
    } catch {
      return dateString;
    }
  };

  // Fonction pour vérifier si un article est complet
  const isArticleComplete = (article: Article): boolean => {
    // Si l'article a des contenus, il est complet s'il n'a pas de contenus vides
    if (article.contents && article.contents.length > 0) {
      return !article.contents.some(content => 
        !content.content_fr?.trim() || !content.content_en?.trim()
      );
    }
    
    // Fallback pour les anciens articles : vérifier les champs statiques
    return !!(
      article.title_fr?.trim() &&
      article.title_en?.trim() &&
      article.summary_fr?.trim() &&
      article.summary_en?.trim() &&
      article.methods_fr?.trim() &&
      article.methods_en?.trim() &&
      article.results_fr?.trim() &&
      article.results_en?.trim() &&
      article.perspectives_fr?.trim() &&
      article.perspectives_en?.trim()
    );
  };

  // Fonction pour filtrer les articles
  const getFilteredArticles = () => {
    let filtered = articles.filter((article) => {
      const matchesSearch = searchTerm === "" || 
        article.title_fr.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.title_en.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.summary_fr.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.summary_en.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Filtre par statut - vérifier si l'article est complété ou non
      const isComplete = isArticleComplete(article);
      const matchesStatus = filterStatus === "tous" || 
        (filterStatus === "completed" && isComplete) ||
        (filterStatus === "in_progress" && !isComplete);
      
      return matchesSearch && matchesStatus;
    });

    // Tri par date
    return filtered.sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
    });
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
                <button 
                  onClick={() => setShowSearchInput(!showSearchInput)}
                  className="flex gap-[10px] items-center p-[5px] rounded-[4px] border border-black hover:bg-gray-100"
                >
                  <div className="relative size-[32px]">
                    <div className="absolute inset-[12.5%_14.27%_14.27%_12.5%]" data-name="Vector">
                      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 23.4526 23.4526">
                        <path d="M19.6914 20.9531L13.168 14.4297C12.6758 14.8438 12.1152 15.168 11.4863 15.4023C10.8574 15.6367 10.1895 15.7539 9.48242 15.7539C7.72852 15.7539 6.22852 15.1582 5.04102 13.9668C3.84375 12.7852 3.24023 11.2852 3.24023 9.53125C3.24023 7.77734 3.8418 6.27734 5.04102 5.08594C6.23047 3.88477 7.73047 3.28516 9.48242 3.28516C11.2441 3.28516 12.7441 3.88477 13.9355 5.08594C15.1367 6.27734 15.7363 7.77734 15.7363 9.53125C15.7363 10.2383 15.6191 10.9062 15.3848 11.5352C15.1504 12.1641 14.8262 12.7305 14.4121 13.2227L20.9551 19.7656L19.6914 20.9531ZM9.48242 14.0039C10.7461 14.0039 11.8184 13.5527 12.6895 12.6621C13.5703 11.7617 14.0156 10.6895 14.0156 9.42578C14.0156 8.16211 13.5703 7.08984 12.6895 6.19922C11.8184 5.29883 10.7461 4.84766 9.48242 4.84766C8.20898 4.84766 7.13086 5.29883 6.25977 6.19922C5.37891 7.08984 4.93359 8.16211 4.93359 9.42578C4.93359 10.6895 5.37891 11.7617 6.25977 12.6621C7.13086 13.5527 8.20898 14.0039 9.48242 14.0039Z" fill="black" id="Vector" />
                      </svg>
                    </div>
                  </div>
                </button>
                <button 
                  onClick={() => setShowFilterMenu(!showFilterMenu)}
                  className="flex gap-[10px] items-center p-[5px] rounded-[4px] border border-black hover:bg-gray-100 relative"
                >
                  <div className="relative size-[32px]">
                    <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
                      <path d="M4 8H28V10.6667H4V8ZM8 14.6667H24V17.3333H8V14.6667ZM12 21.3333H20V24H12V21.3333Z" fill="black" />
                    </svg>
                  </div>
                  
                  {/* Menu déroulant filtre */}
                  {showFilterMenu && (
                    <div className="absolute top-full left-0 mt-[10px] bg-white border-2 border-black rounded-[4px] shadow-lg z-50 p-[10px] w-[250px]">
                      <div className="flex flex-col gap-[15px]">
                        {/* Filtre par date */}
                        <div className="flex flex-col gap-[8px]">
                          <p className="font-['Inter:Bold',sans-serif] font-bold text-[14px] text-black">
                            Tri par date
                          </p>
                          <button
                            onClick={() => {
                              setSortOrder("desc");
                              setShowFilterMenu(false);
                            }}
                            className={`p-[8px] rounded-[4px] text-left text-[14px] ${
                              sortOrder === "desc" ? "bg-primary text-white" : "bg-gray-100 hover:bg-gray-200"
                            }`}
                          >
                            Plus récents
                          </button>
                          <button
                            onClick={() => {
                              setSortOrder("asc");
                              setShowFilterMenu(false);
                            }}
                            className={`p-[8px] rounded-[4px] text-left text-[14px] ${
                              sortOrder === "asc" ? "bg-primary text-white" : "bg-gray-100 hover:bg-gray-200"
                            }`}
                          >
                            Plus anciens
                          </button>
                        </div>

                        {/* Séparateur */}
                        <div className="h-[1px] bg-gray-300" />
                      </div>
                    </div>
                  )}
                </button>
              </div>
              <Link
                to="/formulaire"
                className="bg-primary flex gap-[10px] items-center justify-center px-[20px] py-[15px] rounded-[4px]"
              >
                <p className="font-['Inter:Regular',sans-serif] font-normal text-[16px] text-white whitespace-nowrap">
                  Ajouter un articles
                </p>
                <div className="relative size-[24px]">
                  <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
                    <path d="M12 5V19M5 12H19" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                  </svg>
                </div>
              </Link>
            </div>
            {/* Champ de recherche visible */}
            {showSearchInput && (
              <input
                type="text"
                placeholder="Rechercher par titre ou résumé..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-[10px] border border-gray-300 rounded-[4px] font-['Inter:Regular',sans-serif]"
              />
            )}
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
            ) : getFilteredArticles().length === 0 ? (
              <div className="w-full text-center py-8">
                <p className="font-['Inter:Regular',sans-serif] font-normal text-[18px] text-gray-600">
                  {searchTerm ? "Aucun article trouvé. Essayez une autre recherche." : "Aucun article pour le moment. Créez votre premier article !"}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-[40px] w-full">
                {getFilteredArticles().map((article) => (
                  <ArticleCard
                    key={article.id}
                    id={article.id}
                    title={language === 'FR' ? article.title_fr : article.title_en}
                    date={formatDate(article.created_at)}
                    description={language === 'FR' ? (article.first_content_fr ?? "") : (article.first_content_en ?? "")}
                    image={articleImages[article.id]}
                    isEditable={true}
                    onEdit={() => handleEditArticle(article)}
                    onDelete={(id, title) => handleDeleteArticle(id, title)}
                    onView={handleViewArticle}
                  />
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



