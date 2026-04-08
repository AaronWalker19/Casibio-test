import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { Navigation } from "../../components/Navigation.tsx";
import { Footer } from "../../components/Footer.tsx";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback.tsx";

interface Article {
  id: number;
  code_anr: string;
  title_fr: string;
  date: string;
  status: string;
  image: string;
  summary_fr: string;
  methods_fr: string;
  results_fr: string;
  perspectives_fr: string;
}

// Articles data basée sur la structure BDD
const articlesData: Article[] = [
  {
    id: 1,
    code_anr: "ANR-23-CE08-0002",
    title_fr: "Catalyseurs céramiques poreuses pour reformage du méthane",
    date: "17 Mars 2026",
    status: "Complété",
    image: "https://images.unsplash.com/photo-1581093449818-2655b2467fd6?w=400&h=300&fit=crop",
    summary_fr: "Le procédé Polymer Impregnation Pyrolysis (PIP) est sélectionné pour synthétiser des céramiques poreuses catalytiques Ni(Ru)/SiCxOy pour les réactions de reformage à sec du méthane et de méthanation du CO2. Ces deux réactions sont incontournables dans le domaine de l'énergie pour lesquels la stabilité du catalyseur est la principale problématique.",
    methods_fr: "Nous avons développé une approche multi-étapes incluant la préparation des poudres, l'imprégnation polymère, et la pyrolyse. Les catalyseurs ont été caractérisés par microscopie électronique, spectroscopie Raman, et tests catalytiques. L'optimisation des paramètres de synthèse a permis d'obtenir des matériaux avec une excellente stabilité thermique et une distribution uniforme des sites actifs.",
    results_fr: "Les catalyseurs Ni(Ru)/SiCxOy préparés montrent une activité catalytique remarquable avec plus de 95% de conversion du méthane à 800°C. La stabilité opérationnelle a été confirmée par des tests prolongés sur 500 heures sans désactivation significative. La présence du ruthénium améliore significativement les performances en comparaison aux catalyseurs Ni seuls.",
    perspectives_fr: "Ces résultats ouvrent des perspectives intéressantes pour l'application industrielle dans les systèmes de production d'hydrogène et de gaz de synthèse. Les travaux futurs porteront sur l'optimisation de la composition du catalyseur et le scale-up du procédé de synthèse. Une seconde génération de catalyseurs multi-métalliques est actuellement en développement pour améliorer encore les performances.",
  },
  {
    id: 2,
    code_anr: "ANR-23-CE08-0002",
    title_fr: "Étude comparative des supports catalytiques",
    date: "25 Février 2026",
    status: "En cours",
    image: "https://images.unsplash.com/photo-1707863080643-2a7dc1f8486f?w=400&h=300&fit=crop",
    summary_fr: "Comparaison approfondie de différents supports céramiques pour l'imprégnation de métaux catalytiques.",
    methods_fr: "Utilisation de techniques de caractérisation standards incluant XRD, BET, et TEM.",
    results_fr: "Les supports à base de SiC montrent la meilleure performance thermique.",
    perspectives_fr: "Développement de nouveaux supports composites hybrides.",
  },
];

export default function ArticlePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("resume");

  const article = articlesData.find((a) => a.id === parseInt(id || "1"));

  if (!article) {
    return (
      <div className="bg-white content-stretch flex flex-col items-center relative size-full">
        <Navigation />
        <div className="flex flex-col items-center justify-center size-full py-[50px]">
          <p className="font-['Inter:Bold',sans-serif] font-bold text-[32px] text-black">
            Article non trouvé
          </p>
        </div>
        <Footer />
      </div>
    );
  }

  const sections = [
    { id: "resume", title: "Résumé", content: article.summary_fr },
    { id: "methodes", title: "Méthodes", content: article.methods_fr },
    { id: "resultats", title: "Résultats", content: article.results_fr },
    { id: "perspectives", title: "Perspectives", content: article.perspectives_fr },
  ];

  return (
    <div className="bg-white content-stretch flex flex-col items-center relative size-full">
      <Navigation />
      
      {/* Header */}
      <div className="bg-[#183542] content-stretch flex flex-col gap-[20px] items-start px-[50px] py-[50px] relative shrink-0 w-full">
        <div className="flex gap-[15px] items-center">
          <div className="bg-[#ff404a] px-[12px] py-[6px] rounded-[4px]">
            <p className="font-['Inter:Bold',sans-serif] font-bold text-[14px] text-white">
              {article.code_anr}
            </p>
          </div>
        </div>
        <p className="font-['Inter:Bold',sans-serif] font-bold leading-[normal] not-italic relative shrink-0 text-[96px] text-white w-full">
          {article.title_fr}
        </p>
        <Link to="/articles" className="content-stretch flex gap-[10px] items-center relative shrink-0">
          <div className="relative shrink-0 size-[30px]" data-name="tabler:books">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 30 30">
              <g>
                <path d="M6.25 5.625V24.375M6.25 5.625C6.25 5.625 8.75 3.75 12.5 3.75C16.25 3.75 18.75 5.625 18.75 5.625M6.25 5.625C6.25 5.625 3.75 3.75 0 3.75V24.375C3.75 24.375 6.25 26.25 6.25 26.25M18.75 5.625V24.375M18.75 5.625C18.75 5.625 21.25 3.75 25 3.75C28.75 3.75 30 5.625 30 5.625V24.375C30 24.375 28.75 22.5 25 22.5C21.25 22.5 18.75 24.375 18.75 24.375M18.75 24.375C18.75 24.375 16.25 22.5 12.5 22.5C8.75 22.5 6.25 24.375 6.25 24.375" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
              </g>
            </svg>
          </div>
          <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[32px] text-white whitespace-nowrap">
            Articles
          </p>
          <div className="relative shrink-0 size-[30px]" data-name="weui:arrow-filled">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 30 30">
              <path clipRule="evenodd" d="M12.2344 7.73438L18.5156 14.0156C18.6719 14.1719 18.75 14.375 18.75 14.625C18.75 14.875 18.6719 15.0781 18.5156 15.2344L12.2344 21.5156C11.9219 21.8281 11.4531 21.8281 11.1406 21.5156C10.8281 21.2031 10.8281 20.7344 11.1406 20.4219L16.9375 14.625L11.1406 8.82812C10.8281 8.51562 10.8281 8.04688 11.1406 7.73438C11.4531 7.42188 11.9219 7.42188 12.2344 7.73438Z" fill="white" fillRule="evenodd" />
            </svg>
          </div>
        </Link>
      </div>

      {/* Image et infos */}
      <div className="bg-white content-stretch flex flex-col items-center gap-[20px] px-[50px] py-[30px] relative shrink-0 w-full border-b border-[#f3f3f5]">
        <div className="h-[300px] w-full rounded-[4px] overflow-hidden">
          <ImageWithFallback src={article.image} alt={article.title_fr} className="w-full h-full object-cover" />
        </div>
        <div className="flex gap-[20px] items-start w-full">
          <div className="flex gap-[10px] items-center">
            <div className="bg-[#c9232c] content-stretch flex items-center justify-center p-[8px] relative rounded-[4px] shrink-0">
              <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[12px] text-white whitespace-nowrap">
                {article.date}
              </p>
            </div>
            <div className="bg-[#137300] content-stretch flex items-center justify-center p-[8px] relative rounded-[4px] shrink-0">
              <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[12px] text-white whitespace-nowrap">
                {article.status}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Contenu */}
      <div className="relative shrink-0 w-full">
        <div aria-hidden="true" className="absolute border-[#f3f3f5] border-b border-solid inset-0 pointer-events-none" />
        <div className="flex flex-col items-center size-full">
          <div className="content-stretch flex gap-[50px] items-start p-[50px] relative w-full">
            {/* Contenu principal */}
            <div className="flex-1 content-stretch flex flex-col gap-[40px] items-start relative">
              {sections.map((section) => (
                <div
                  key={section.id}
                  id={section.id}
                  className={`content-stretch flex flex-col gap-[20px] items-start relative shrink-0 w-full scroll-mt-[100px]`}
                >
                  <p className="font-['Inter:Bold',sans-serif] font-bold leading-[normal] not-italic relative shrink-0 text-[40px] text-black w-full">
                    {section.title}
                  </p>
                  <p className="font-['Inter:Regular',sans-serif] font-normal leading-[24px] not-italic relative shrink-0 text-[16px] text-black text-justify w-full">
                    {section.content}
                  </p>
                </div>
              ))}
            </div>

            {/* Sidebar */}
            <div className="content-stretch flex flex-col gap-[20px] items-start relative shrink-0 w-[400px]">
              {/* Sommaire */}
              <div className="bg-[#f3f3f5] content-stretch flex flex-col gap-[10px] items-start p-[20px] relative rounded-[4px] shrink-0 w-full sticky top-[50px]">
                <p className="font-['Inter:Bold',sans-serif] font-bold leading-[normal] not-italic relative shrink-0 text-[24px] text-black w-full">
                  Sommaire
                </p>
                <div className="content-stretch flex flex-col gap-[5px] items-start relative shrink-0 w-full">
                  {sections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => {
                        setActiveSection(section.id);
                        const element = document.getElementById(section.id);
                        element?.scrollIntoView({ behavior: "smooth" });
                      }}
                      className={`font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[16px] w-full text-left p-[8px] rounded-[4px] transition-colors ${
                        activeSection === section.id
                          ? "bg-[#ff404a] text-white"
                          : "text-black hover:bg-gray-200"
                      }`}
                    >
                      {section.title}
                    </button>
                  ))}
                </div>
              </div>

              {/* Fichier */}
              <div className="bg-[#f3f3f5] content-stretch flex flex-col gap-[10px] items-start p-[20px] relative rounded-[4px] shrink-0 w-full">
                <p className="font-['Inter:Bold',sans-serif] font-bold leading-[normal] not-italic relative shrink-0 text-[24px] text-black w-full">
                  Fichier de l'article
                </p>
                <div className="h-[200px] relative shrink-0 w-full">
                  <ImageWithFallback
                    src={article.image}
                    alt={article.title_fr}
                    className="w-full h-full object-cover rounded-[4px]"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
