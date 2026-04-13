import { Navigation } from "../components/Navigation.tsx";
import { Link } from "react-router";
import { useLanguage } from "../../contexts/LanguageContext.tsx";
import { t } from "../../contexts/translations.tsx";

export default function PlanDuSitePage() {
  const { language } = useLanguage();

  const sitePages = [
    { path: "/", label: "accueil" },
    { path: "/histoire", label: "histoire" },
    { path: "/articles", label: "articles" },
    { path: "/gallerie", label: "gallerie" },
    
  ];

  return (
    <div className="bg-white content-stretch flex flex-col items-center relative size-full">
      <Navigation />
      <div className="bg-primary content-stretch flex flex-col gap-4 sm:gap-5 md:gap-6 items-start px-4 sm:px-6 md:px-8 lg:px-12 py-8 sm:py-12 md:py-16 w-full">
        <p className="font-['Inter:Bold',sans-serif] font-bold text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-error-accent w-full">
          {t(language, "planDuSite")}\n        </p>
      </div>

      <div className="p-4 sm:p-6 md:p-8 lg:p-12 w-full">
        <div className="max-w-4xl mx-auto">
          <ul className="space-y-3 sm:space-y-4">
            {sitePages.map((page) => (
              <li key={page.path}>
                <Link to={page.path} className="text-blue-600 hover:underline text-sm sm:text-base md:text-lg">
                  {t(language, page.label)}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      
    </div>
  );
}
