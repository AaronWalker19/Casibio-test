import { Link, useLocation, useNavigate } from "react-router";
import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext.tsx";
import { useLanguage } from "../../contexts/LanguageContext.tsx";
import { t } from "../../contexts/translations.tsx";
import svgPaths from "../../imports/Home/svg-1u6sm0pn16.ts";
import { ImageWithFallback } from "./figma/ImageWithFallback.tsx";
import { LoginModal } from "./LoginModal.tsx";

function Group() {
  return (
    <div className="flex-[1_0_0] h-full min-h-px min-w-px relative" data-name="Group">
      <div className="absolute inset-[-3.04%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 34.9078 34.907">
          <g id="Group">
            <g id="Vector">
              <path d={svgPaths.p3ec70c00} fill="var(--fill-0, white)" />
              <path d={svgPaths.p1fc97ec0} stroke="var(--stroke-0, var(--color-primary))" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            </g>
            <g id="Vector_2">
              <path d={svgPaths.p25d90a80} fill="var(--fill-0, white)" />
              <path d={svgPaths.p2b534680} stroke="var(--stroke-0, var(--color-primary))" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            </g>
          </g>
        </svg>
      </div>
    </div>
  );
}

export function Navigation() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();
  const { language, setLanguage } = useLanguage();
  const [showLoginModal, setShowLoginModal] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Si l'utilisateur est connecté, afficher une barre bleue unie
  if (isAuthenticated) {
    return (
      <div className="bg-primary content-stretch flex items-center justify-between px-[14px] py-[10px] relative shrink-0 w-full" data-name="nav">
        <div className="content-stretch flex gap-[21px] items-center relative shrink-0" data-name="nav/navbarre">
          <Link to="/" className="h-[48px] relative shrink-0 w-[120px]" data-name="Img Fake">
            <ImageWithFallback 
              src="https://images.unsplash.com/photo-1581093449818-2655b2467fd6?w=120&h=48&fit=crop"
              alt="Logo ANR Casibio"
              className="absolute inset-0 object-cover"
            />
          </Link>
          
          {/* Bouton Back - Déconnexion uniquement */}
          <button
            onClick={handleLogout}
            className="content-stretch flex gap-[6px] h-[36px] items-center justify-center p-[4px] relative rounded-[3px] shrink-0 px-[10px] bg-primary-dark hover:bg-primary-darker transition"
            data-name="backoffice-btn"
          >
            <div className="relative shrink-0 w-[20px] h-[20px]" data-name="settings">
              <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24" stroke="white" strokeWidth="2">
                <path d="M12 8c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z" />
                <path d="M12 14c-2.67 0-8 1.34-8 4v6h16v-6c0-2.66-5.33-4-8-4z" />
              </svg>
            </div>
            <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[16px] text-white whitespace-nowrap">
              {t(language, "deconnexion")}
            </p>
          </button>
        </div>

        {/* Boutons de langue */}
        <div className="bg-primary-dark content-stretch flex gap-[4px] items-center overflow-clip p-[2px] relative rounded-[1.9px] shrink-0" data-name="nav/ButtonLangue">
          <button
            onClick={() => setLanguage('EN')}
            className={`rounded-[1.9px] shrink-0 size-[42px] transition ${
              language === 'EN' ? 'bg-primary' : 'bg-primary-dark'
            }`}
          >
            <p className={`font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic text-[12px] whitespace-nowrap ${
              language === 'EN' ? 'text-white' : 'text-gray-400'
            }`}>
              EN
            </p>
          </button>
          <button
            onClick={() => setLanguage('FR')}
            className={`rounded-[1.9px] shrink-0 size-[42px] transition ${
              language === 'FR' ? 'bg-primary' : 'bg-primary-dark'
            }`}
          >
            <p className={`font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic text-[12px] whitespace-nowrap ${
              language === 'FR' ? 'text-white' : 'text-gray-400'
            }`}>
              FR
            </p>
          </button>
        </div>
      </div>
    );
  }

  // Navigation normale pour les utilisateurs non connectés
  return (
    <div className="bg-white content-stretch flex items-center justify-between px-[14px] py-[10px] relative shrink-0 w-full" data-name="nav">
      <div aria-hidden="true" className="absolute border-gray-50 border-b-2 border-solid inset-0 pointer-events-none" />
      <div className="content-stretch flex gap-[21px] items-center relative shrink-0" data-name="nav/navbarre">
        <Link to="/" className="h-[48px] relative shrink-0 w-[120px]" data-name="Img Fake">
          <ImageWithFallback 
            src="https://images.unsplash.com/photo-1581093449818-2655b2467fd6?w=120&h=48&fit=crop"
            alt="Logo ANR Casibio"
            className="absolute inset-0 object-cover"
          />
        </Link>
        <div className="content-stretch flex gap-[16px] items-center relative shrink-0" data-name="Component 10">
          <Link
            to="/"
            className={`content-stretch flex gap-[6px] h-[36px] items-center justify-center p-[4px] relative rounded-[3px] shrink-0 w-[120px] ${
              isActive("/") ? "bg-primary" : "bg-white"
            }`}
            data-name="Component 6"
          >
            <div className="relative shrink-0 size-[28px]" data-name="ph:house-fill">
              <div className="absolute inset-[9.38%_12.5%_12.5%_12.5%]" data-name="Vector">
                <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 27.6806 28.8329">
                  <path d={svgPaths.p27d0bd00} fill={isActive("/") ? "white" : "var(--color-primary)"} id="Vector" />
                </svg>
              </div>
            </div>
            <p className={`font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[16px] whitespace-nowrap ${
              isActive("/") ? "text-white" : "text-primary"
            }`}>
              {t(language, "accueil")}
            </p>
          </Link>
          <Link
            to="/histoire"
            className={`content-stretch flex gap-[6px] h-[36px] items-center justify-center p-[4px] relative rounded-[3px] shrink-0 w-[130px] ${
              isActive("/histoire") ? "bg-primary" : "bg-white"
            }`}
            data-name="Component 7"
          >
            <div className="relative shrink-0 size-[28px]" data-name="famicons:book-sharp">
              <div className="absolute inset-[9.38%_3.13%_12.5%_3.13%]" data-name="Vector">
                <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 34.6008 28.834">
                  <path d={svgPaths.p1d3f4100} fill={isActive("/histoire") ? "white" : "var(--color-primary)"} id="Vector" />
                </svg>
              </div>
            </div>
            <p className={`font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[16px] text-left whitespace-nowrap ${
              isActive("/histoire") ? "text-white" : "text-primary"
            }`}>
              {t(language, "histoire")}
            </p>
          </Link>
          <Link
            to="/articles"
            className={`content-stretch flex gap-[6px] h-[36px] items-center justify-center p-[4px] relative rounded-[3px] shrink-0 w-[130px] ${
              isActive("/articles") ? "bg-primary" : "bg-white"
            }`}
            data-name="Component 8"
          >
            <div className="content-stretch flex items-center justify-center p-[3px] relative shrink-0 size-[28px]" data-name="tabler:books">
              <Group />
            </div>
            <p className={`font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[16px] text-left whitespace-nowrap ${
              isActive("/articles") ? "text-white" : "text-primary"
            }`}>
              {t(language, "articles")}
            </p>
          </Link>
          <Link
            to="/gallerie"
            className={`content-stretch flex gap-[6px] h-[36px] items-center justify-center p-[4px] relative rounded-[3px] shrink-0 w-[130px] ${
              isActive("/gallerie") ? "bg-primary" : "bg-white"
            }`}
            data-name="Component 9"
          >
            <div className="relative shrink-0 size-[28px]" data-name="material-symbols:image-rounded">
              <div className="absolute inset-[12.5%]" data-name="Vector">
                <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 27.6807 27.6807">
                  <path d={svgPaths.p14ef9180} fill={isActive("/gallerie") ? "white" : "white"} id="Vector" stroke={isActive("/gallerie") ? "white" : "var(--color-primary)"} strokeWidth="2" />
                </svg>
              </div>
            </div>
            <p className={`font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[16px] text-left whitespace-nowrap ${
              isActive("/gallerie") ? "text-white" : "text-primary"
            }`}>
              {t(language, "gallerie")}
            </p>
          </Link>
        </div>
      </div>
      <div className="content-stretch flex flex-[1_0_0] gap-[20px] items-center justify-end min-h-px min-w-px relative">
        
        <button 
          onClick={() => setShowLoginModal(true)}
          className="bg-white content-stretch flex items-center justify-center p-[7.41px] relative rounded-[2.964px] shrink-0 hover:bg-opacity-90 transition" 
          data-name="nav/buttonConnexion"
        >
          <div aria-hidden="true" className="absolute border-gray-50 border-[0.731px] border-solid inset-0 pointer-events-none rounded-[2.964px]" />
          <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-primary text-[16px] whitespace-nowrap">
            {t(language, "connexion")}
          </p>
        </button>
        <div className="bg-gray-50 content-stretch flex gap-[4px] items-center overflow-clip p-[2px] relative rounded-[1.9px] shrink-0" data-name="nav/ButtonLangue">
          <button
            onClick={() => setLanguage('EN')}
            className={`rounded-[1.9px] shrink-0 size-[42px] transition ${
              language === 'EN' ? 'bg-primary' : 'bg-gray-50'
            }`}
          >
            <p className={`font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic text-[12px] whitespace-nowrap ${
              language === 'EN' ? 'text-white' : 'text-gray-400'
            }`}>
              EN
            </p>
          </button>
          <button
            onClick={() => setLanguage('FR')}
            className={`rounded-[1.9px] shrink-0 size-[42px] transition ${
              language === 'FR' ? 'bg-primary' : 'bg-gray-50'
            }`}
          >
            <p className={`font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic text-[12px] whitespace-nowrap ${
              language === 'FR' ? 'text-white' : 'text-[#999]'
            }`}>
              FR
            </p>
          </button>
        </div>
      </div>
      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
    </div>
  );
}
