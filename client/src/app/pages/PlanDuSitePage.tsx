import { Navigation } from "../components/Navigation.tsx";
import { Footer } from "../components/Footer.tsx";
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
      <div className="bg-primary content-stretch flex flex-col gap-[20px] items-start px-[50px] py-[50px] relative shrink-0 w-full">
        <p className="font-['Inter:Bold',sans-serif] font-bold leading-[normal] not-italic relative shrink-0 text-[96px] text-error-accent w-full">
          {t(language, "planDuSite")}
        </p>
      </div>

      <div className="p-[50px] w-full">
        <div className="max-w-4xl mx-auto">
          <ul className="space-y-4">
            {sitePages.map((page) => (
              <li key={page.path}>
                <Link to={page.path} className="text-blue-600 hover:underline">
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
