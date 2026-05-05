import { useState, useEffect } from "react";
import { Navigation } from "../components/Navigation.tsx";
import { Footer } from "../components/Footer.tsx";
import { HalCard } from "../components/HalCard.tsx";

interface HalArticle {
  title_s: string[];
  authLastNameFirstName_s: string[];
  uri_s: string;
}

interface HalResponse {
  response: {
    numFound: number;
    docs: HalArticle[];
  };
}

export default function HalPage() {
  const [articles, setArticles] = useState<HalArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHalArticles = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          "https://api.hal.science/search/?q=anrProjectReference_s:ANR-20-CE46-0004&fl=authLastNameFirstName_s,uri_s,title_s"
        );
        
        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des articles");
        }
        
        const data: HalResponse = await response.json();
        setArticles(data.response.docs || []);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur inconnue");
        setArticles([]);
      } finally {
        setLoading(false);
      }
    };

    fetchHalArticles();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-primary">Articles HAL</h1>
        
        {loading && (
          <div className="flex justify-center items-center py-12">
            <p className="text-lg text-gray-600">Chargement des articles...</p>
          </div>
        )}
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        {!loading && articles.length === 0 && !error && (
          <div className="text-center py-12">
            <p className="text-lg text-gray-600">Aucun article trouvé</p>
          </div>
        )}
        
        {!loading && articles.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article, index) => (
              <HalCard key={index} article={article} />
            ))}
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
}
