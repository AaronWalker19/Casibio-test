import { useState, useEffect } from "react";
import { Link } from "react-router";
import { Navigation } from "../components/Navigation.tsx";
import { Footer } from "../components/Footer.tsx";
import { ArticleCard } from "../components/ArticleCard.tsx";
import { useLanguage } from "../../contexts/LanguageContext.tsx";
import { t } from "../../contexts/translations.tsx";
import svgPaths from "../../imports/Home/svg-1u6sm0pn16.ts";
import { ImageWithFallback } from "../components/figma/ImageWithFallback.tsx";

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

interface GalleryImage {
  id: number;
  file_name: string;
  file_display_name: string;
  file_path: string;
  file_type: string;
  created_at: string;
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
  return hasEmptyField ? t(language, "inCours") : t(language, "complet");
};

function Frame4() {
  return (
    <div className=" flex gap-[10px] items-start justify-center p-[5px] relative rounded-[4px] shrink-0">
      <div aria-hidden="true" className="absolute border border-solid border-white inset-0 pointer-events-none rounded-[4px]" />
      <div className="relative shrink-0 size-[16px]" data-name="game-icons:round-potion">
        <div className="absolute inset-[5.27%_14.92%_4.88%_11.34%]" data-name="Vector">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11.7984 14.375">
            <path d={svgPaths.p83c3df0} fill="var(--fill-0, white)" id="Vector" />
          </svg>
        </div>
      </div>
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[16px] text-white whitespace-nowrap">
        ANR-23-CE08-0002
      </p>
    </div>
  );
}

function Group1() {
  return (
    <div className="flex-[1_0_0] h-full min-h-px min-w-px relative" data-name="Group">
      <div className="absolute inset-[-5.42%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 25.835 25.8345">
          <g id="Group">
            <path d={svgPaths.p2fe8e000} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.52618" />
            <path d={svgPaths.p3650c900} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.52618" />
          </g>
        </svg>
      </div>
    </div>
  );
}

export default function HomePage() {
  const { language } = useLanguage();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loadingArticles, setLoadingArticles] = useState(true);
  const [errorArticles, setErrorArticles] = useState<string | null>(null);

  const [galleryImagesFetched, setGalleryImagesFetched] = useState<GalleryImage[]>([]);
  const [loadingGallery, setLoadingGallery] = useState(true);
  const [errorGallery, setErrorGallery] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch("/api/projects");
        if (!response.ok) {
          throw new Error(t(language, "erreurChargementArticles"));
        }
        const data = await response.json();
        
        // Enrichir les articles avec le statut calculé et prendre les 3 derniers
        const enrichedArticles = data
          .slice(0, 3)
          .map((article: Article) => ({
            ...article,
            status: calculateStatus(article, language),
          }));
        
        setArticles(enrichedArticles);
        setLoadingArticles(false);
      } catch (err) {
        setErrorArticles(err instanceof Error ? err.message : t(language, "erreurInconnue"));
        setLoadingArticles(false);
      }
    };

    fetchArticles();
  }, [language]);

  useEffect(() => {
    const fetchGalleryImages = async () => {
      try {
        const response = await fetch("/api/projects/files/all");
        if (!response.ok) {
          throw new Error(t(language, "erreurChargementImages"));
        }
        const data = await response.json();
        // Prendre les 3 premières images
        const recentImages = data.slice(0, 3);
        setGalleryImagesFetched(recentImages);
        setLoadingGallery(false);
      } catch (err) {
        setErrorGallery(err instanceof Error ? err.message : t(language, "erreurInconnue"));
        setLoadingGallery(false);
      }
    };

    fetchGalleryImages();
  }, [language]);
  return (
    <div className="bg-white  flex flex-col items-center relative size-full" data-name="home">
      <Navigation />
      <div className="bg-[#183542]  flex flex-col gap-[20px] items-center justify-center py-[150px] relative shrink-0 w-full" data-name="accueil">
        <div className=" flex flex-col gap-[10px] items-center relative shrink-0">
          <Frame4 />
          <p className="font-['Inter:Bold',sans-serif] font-bold leading-[normal] not-italic relative shrink-0 text-[96px] text-[#ff404a] whitespace-nowrap">
            {t(language, "projetANRCasibio")}
          </p>
          <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic opacity-70 relative shrink-0 text-[14px] text-center text-white w-[901px]">
            {t(language, "projectDescription")}
          </p>
        </div>
        <div className=" flex gap-[20px] items-start justify-center relative shrink-0">
          <Link
            to="/articles"
            className="bg-[#183542]  flex gap-[5.306px] h-[38.736px] items-center justify-center p-[3.79px] relative rounded-[3.032px] shrink-0"
            data-name="Component 9"
          >
            <div className=" flex items-center justify-center p-[3.885px] relative shrink-0 size-[31.078px]" data-name="tabler:books">
              <Group1 />
            </div>
            <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[25.938px] text-white whitespace-nowrap">
              {t(language, "articles")}
            </p>
            <div className="h-[31.156px] relative shrink-0 w-[15.578px]" data-name="weui:arrow-filled">
              <div className="absolute inset-[23.5%_12.92%_23.47%_25.72%]" data-name="Vector">
                <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 9.5595 16.5232">
                  <path clipRule="evenodd" d={svgPaths.p4cfaf00} fill="var(--fill-0, white)" fillRule="evenodd" id="Vector" />
                </svg>
              </div>
            </div>
          </Link>
          <Link
            to="/histoire"
            className="bg-white  flex gap-[5.306px] h-[38.736px] items-center justify-center p-[3.79px] relative rounded-[3.032px] shrink-0 w-[197.464px]"
            data-name="Component 10"
          >
            <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[#183542] text-[25.938px] whitespace-nowrap">
              {t(language, "enSavoirPlus")}
            </p>
            <div className="h-[31.156px] relative shrink-0 w-[15.578px]" data-name="weui:arrow-filled">
              <div className="absolute inset-[23.5%_12.92%_23.47%_25.72%]" data-name="Vector">
                <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 9.5595 16.5232">
                  <path clipRule="evenodd" d={svgPaths.p4cfaf00} fill="var(--fill-0, #183542)" fillRule="evenodd" id="Vector" />
                </svg>
              </div>
            </div>
          </Link>
        </div>
      </div>
      <div className="relative shrink-0 w-full">
        <div aria-hidden="true" className="absolute border-[#f3f3f5] border-b border-solid border-t inset-0 pointer-events-none" />
        <div className="flex flex-col items-center size-full">
          <div className=" flex flex-col gap-[50px] items-center p-[50px] relative w-full">
            <div className=" flex flex-col gap-[28px] items-start relative shrink-0 w-full">
              <p className="font-['Inter:Bold',sans-serif] font-bold leading-[normal] not-italic relative shrink-0 text-[48px] text-black w-full">
                {t(language, "dernieresPublications")}
              </p>
              <div className=" flex items-center justify-between relative shrink-0 w-full">
                <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[32px] text-black text-center whitespace-nowrap">
                  {t(language, "decouvrezNosTravaux")}
                </p>
                <Link to="/articles" className=" flex gap-[10px] items-center relative shrink-0">
                  <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[32px] text-black text-center whitespace-nowrap">
                    {t(language, "voirTout")}
                  </p>
                  <div className="relative shrink-0 size-[30px]" data-name="maki:arrow">
                    <div className="absolute inset-[13.33%_3.33%_13.42%_3.33%]" data-name="Vector">
                      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 27.9996 21.975">
                        <path d={svgPaths.p14b61a80} fill="var(--fill-0, black)" id="Vector" />
                      </svg>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
            <div className=" flex gap-[80px] items-center justify-center relative shrink-0 w-full">
              {loadingArticles ? (
                <p className="font-['Inter:Regular',sans-serif] font-normal text-[16px] text-gray-500">
                  {t(language, "chargementArticles")}
                </p>
              ) : errorArticles ? (
                <p className="font-['Inter:Regular',sans-serif] font-normal text-[16px] text-red-500">
                  {errorArticles}
                </p>
              ) : articles.length === 0 ? (
                <p className="font-['Inter:Regular',sans-serif] font-normal text-[16px] text-gray-500">
                  {t(language, "aucunArticleTrouve")}
                </p>
              ) : (
                articles.map((article) => (
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
                ))
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="bg-[#183542]  flex gap-[67px] items-center justify-center py-[104px] relative shrink-0 w-full">
        <div className=" flex flex-col items-center relative shrink-0">
          <p className="font-['Inter:Bold',sans-serif] font-bold leading-[normal] not-italic relative shrink-0 text-[148px] text-white whitespace-nowrap">
            25
          </p>
          <p className="font-['Inter:Bold',sans-serif] font-bold leading-[normal] not-italic relative shrink-0 text-[96px] text-white whitespace-nowrap">
            articles
          </p>
        </div>
        <div className=" flex flex-col h-full items-end justify-center pb-[53.75px] relative rounded-[8.75px] shrink-0">
          <div className="flex-[1_0_0] mb-[-53.75px] min-h-px min-w-px relative w-[651px]">
            <ImageWithFallback 
              src="https://images.unsplash.com/photo-1581093449818-2655b2467fd6?w=651&h=400&fit=crop"
              alt="Articles preview"
              className="w-full h-full object-cover rounded-[8.75px]"
            />
          </div>
          <Link
            to="/articles"
            className="bg-white  flex gap-[7.363px] h-[53.75px] items-center justify-center mb-[-53.75px] p-[5.259px] relative shrink-0 w-[274px]"
            data-name="Component 10"
          >
            <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[#183542] text-[35.99px] whitespace-nowrap">
              {t(language, "enSavoirPlus")}
            </p>
            <div className="h-[43.232px] relative shrink-0 w-[21.616px]" data-name="weui:arrow-filled">
              <div className="absolute inset-[23.5%_12.92%_23.47%_25.72%]" data-name="Vector">
                <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.2647 22.9275">
                  <path clipRule="evenodd" d={svgPaths.p34a05400} fill="var(--fill-0, #183542)" fillRule="evenodd" id="Vector" />
                </svg>
              </div>
            </div>
          </Link>
        </div>
      </div>
      <div className="relative shrink-0 w-full">
        <div aria-hidden="true" className="absolute border-[#f3f3f5] border-b border-solid border-t inset-0 pointer-events-none" />
        <div className="flex flex-col items-center size-full">
          <div className=" flex flex-col gap-[50px] items-center p-[50px] relative w-full">
            <div className=" flex flex-col gap-[28px] items-start relative shrink-0 w-full">
              <p className="font-['Inter:Bold',sans-serif] font-bold leading-[normal] not-italic relative shrink-0 text-[48px] text-black w-full">
                Dernières image rajouter a la galerie
              </p>
              <div className=" flex items-center justify-between relative shrink-0 w-full">
                <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[32px] text-black text-center whitespace-nowrap">
                  Découvrez nos dernier image de notre projet
                </p>
                <div className=" flex gap-[10px] items-center relative shrink-0">
                  <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[32px] text-black text-center whitespace-nowrap">
                    Voir tout
                  </p>
                  <div className="relative shrink-0 size-[30px]" data-name="maki:arrow">
                    <div className="absolute inset-[13.33%_3.33%_13.42%_3.33%]" data-name="Vector">
                      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 27.9996 21.975">
                        <path d={svgPaths.p14b61a80} fill="var(--fill-0, black)" id="Vector" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className=" flex gap-[80px] items-center justify-center relative shrink-0 w-full">
              {loadingGallery ? (
                <p className="font-['Inter:Regular',sans-serif] font-normal text-[16px] text-gray-500">
                  Chargement des images...
                </p>
              ) : errorGallery ? (
                <p className="font-['Inter:Regular',sans-serif] font-normal text-[16px] text-red-500">
                  Erreur lors du chargement des images
                </p>
              ) : galleryImagesFetched.length === 0 ? (
                <p className="font-['Inter:Regular',sans-serif] font-normal text-[16px] text-gray-500">
                  Aucune image trouvée
                </p>
              ) : (
                galleryImagesFetched.map((image) => (
                  <div key={image.id} className="bg-[#183542]  flex flex-col items-center pb-[59px] relative rounded-[4px] shrink-0 w-[450px]" data-name="article">
                    <div className="h-[313px] mb-[-59px] relative shrink-0 w-[450px]">
                      <ImageWithFallback src={image.file_path} alt={image.file_display_name} className="w-full h-full object-cover" />
                    </div>
                    <div className=" flex flex-col gap-[5px] items-end mb-[-59px] relative shrink-0 w-[450px]">
                      <div className="bg-[#c9232c]  flex items-center justify-center p-[5px] relative rounded-[4px] shrink-0">
                        <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[12px] text-white whitespace-nowrap">
                          {new Date(image.created_at).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                      <div className="bg-[#183542] relative rounded-[4px] shrink-0 w-full">
                        <div className="flex flex-col items-center justify-center size-full">
                          <div className=" flex flex-col gap-[10px] items-center justify-center p-[5px] relative w-full">
                            <p className="font-['Inter:Bold',sans-serif] font-bold leading-[normal] not-italic relative shrink-0 text-[16px] text-center text-white w-full">
                              {image.file_display_name}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}



