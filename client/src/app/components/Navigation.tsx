import { Link, useLocation, useNavigate } from "react-router";
import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext.tsx";
import { useLanguage } from "../../contexts/LanguageContext.tsx";
import { t } from "../../contexts/translations.tsx";
import svgPaths from "../../imports/Home/svg-1u6sm0pn16.ts";
import { ImageWithFallback } from "./figma/ImageWithFallback.tsx";
import { LoginModal } from "./LoginModal.tsx";
import { IMAGE_PLACEHOLDER_LOGO_SVG } from "../../constants/placeholders.ts";

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

function MenuHamburger({ isOpen, onClick }: { isOpen: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="hidden sm:flex flex-col gap-1.5 items-center justify-center"
      aria-label="Toggle menu"
    >
      <div className={`w-6 h-0.5 bg-current transition-all ${isOpen ? 'rotate-45 translate-y-2' : ''}`} />
      <div className={`w-6 h-0.5 bg-current transition-all ${isOpen ? 'opacity-0' : ''}`} />
      <div className={`w-6 h-0.5 bg-current transition-all ${isOpen ? '-rotate-45 -translate-y-2' : ''}`} />
    </button>
  );
}

export function Navigation() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();
  const { language, setLanguage } = useLanguage();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Si l'utilisateur est connecté, afficher une barre bleue unie
  if (isAuthenticated) {
    return (
      <div className="bg-primary content-stretch flex items-center justify-between px-3 sm:px-4 py-2 sm:py-3 relative shrink-0 w-full" data-name="nav">
        <div className="content-stretch flex gap-2 sm:gap-5 items-center relative shrink-0" data-name="nav/navbarre">
          <Link to="/" className="h-10 sm:h-12 relative shrink-0 w-24 sm:w-32" data-name="Img Fake">
            <ImageWithFallback 
              src={IMAGE_PLACEHOLDER_LOGO_SVG}
              alt="Logo ANR Casibio"
              className="absolute inset-0 object-cover"
            />
          </Link>
          
          {/* Bouton Back - Déconnexion uniquement */}
          <button
            onClick={handleLogout}
            className="content-stretch flex gap-1 sm:gap-1.5 h-8 sm:h-9 items-center justify-center p-1 relative rounded-sm shrink-0 px-2 sm:px-3 bg-primary-dark hover:bg-primary-darker transition"
            data-name="backoffice-btn"
          >
            <div className="relative shrink-0 w-4 sm:w-5 h-4 sm:h-5" data-name="settings">
              <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24" stroke="white" strokeWidth="2">
                <path d="M12 8c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z" />
                <path d="M12 14c-2.67 0-8 1.34-8 4v6h16v-6c0-2.66-5.33-4-8-4z" />
              </svg>
            </div>
            <p className="hidden sm:block font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-sm sm:text-base text-white whitespace-nowrap">
              {t(language, "deconnexion")}
            </p>
          </button>
        </div>

        {/* Boutons de langue */}
        <div className="bg-primary-dark content-stretch flex gap-0.5 items-center overflow-clip p-0.5 relative rounded-sm shrink-0" data-name="nav/ButtonLangue">
          <button
            onClick={() => setLanguage('EN')}
            className={`rounded-sm shrink-0 size-8 sm:size-10 transition ${
              language === 'EN' ? 'bg-primary' : 'bg-primary-dark'
            }`}
          >
            <p className={`font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic text-xs sm:text-sm whitespace-nowrap ${
              language === 'EN' ? 'text-white' : 'text-gray-400'
            }`}>
              EN
            </p>
          </button>
          <button
            onClick={() => setLanguage('FR')}
            className={`rounded-sm shrink-0 size-8 sm:size-10 transition ${
              language === 'FR' ? 'bg-primary' : 'bg-primary-dark'
            }`}
          >
            <p className={`font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic text-xs sm:text-sm whitespace-nowrap ${
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
    <div className="bg-white content-stretch flex flex-col items-stretch relative shrink-0 w-full" data-name="nav">
      <div aria-hidden="true" className="absolute border-gray-50 border-b-2 border-solid inset-0 pointer-events-none" />
      {/* Top bar */}
      <div className="flex items-center justify-between px-3 sm:px-6 md:px-8 py-2 sm:py-3 bg-white">
        <Link to="/" className="h-10 sm:h-12 relative shrink-0 w-24 sm:w-32 md:w-40" data-name="Img Fake">
          <ImageWithFallback 
            src="https://images.unsplash.com/photo-1581093449818-2655b2467fd6?w=120&h=48&fit=crop"
            alt="Logo ANR Casibio"
            className="absolute inset-0 object-cover"
          />
        </Link>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-3 lg:gap-4">
          <Link
            to="/"
            className={`content-stretch flex gap-1 h-8 lg:h-9 items-center justify-center px-2 lg:px-3 py-1 relative rounded-sm shrink-0 ${
              isActive("/") ? "bg-primary" : "bg-white hover:bg-gray-50"
            }`}
            data-name="Component 6"
          >
            <div className="relative shrink-0 size-6 lg:size-7" data-name="ph:house-fill">
              <div className="absolute inset-[9.38%_12.5%_12.5%_12.5%]" data-name="Vector">
                <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 27.6806 28.8329">
                  <path d={svgPaths.p27d0bd00} fill={isActive("/") ? "white" : "var(--color-primary)"} id="Vector" />
                </svg>
              </div>
            </div>
            <p className={`font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-sm lg:text-base whitespace-nowrap ${
              isActive("/") ? "text-white" : "text-primary"
            }`}>
              {t(language, "accueil")}
            </p>
          </Link>
          <Link
            to="/histoire"
            className={`content-stretch flex gap-1 h-8 lg:h-9 items-center justify-center px-2 lg:px-3 py-1 relative rounded-sm shrink-0 ${
              isActive("/histoire") ? "bg-primary" : "bg-white hover:bg-gray-50"
            }`}
            data-name="Component 7"
          >
            <div className="relative shrink-0 size-6 lg:size-7" data-name="famicons:book-sharp">
              <div className="absolute inset-[9.38%_3.13%_12.5%_3.13%]" data-name="Vector">
                <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 34.6008 28.834">
                  <path d={svgPaths.p1d3f4100} fill={isActive("/histoire") ? "white" : "var(--color-primary)"} id="Vector" />
                </svg>
              </div>
            </div>
            <p className={`font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-sm lg:text-base text-left whitespace-nowrap ${
              isActive("/histoire") ? "text-white" : "text-primary"
            }`}>
              {t(language, "histoire")}
            </p>
          </Link>
          <Link
            to="/articles"
            className={`content-stretch flex gap-1 h-8 lg:h-9 items-center justify-center px-2 lg:px-3 py-1 relative rounded-sm shrink-0 ${
              isActive("/articles") ? "bg-primary" : "bg-white hover:bg-gray-50"
            }`}
            data-name="Component 8"
          >
            <div className="content-stretch flex items-center justify-center p-0.5 relative shrink-0 size-6 lg:size-7" data-name="tabler:books">
              <Group />
            </div>
            <p className={`font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-sm lg:text-base text-left whitespace-nowrap ${
              isActive("/articles") ? "text-white" : "text-primary"
            }`}>
              {t(language, "articles")}
            </p>
          </Link>
          <Link
            to="/gallerie"
            className={`content-stretch flex gap-1 h-8 lg:h-9 items-center justify-center px-2 lg:px-3 py-1 relative rounded-sm shrink-0 ${
              isActive("/gallerie") ? "bg-primary" : "bg-white hover:bg-gray-50"
            }`}
            data-name="Component 9"
          >
            <div className="relative shrink-0 size-6 lg:size-7" data-name="material-symbols:image-rounded">
              <div className="absolute inset-[12.5%]" data-name="Vector">
                <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 27.6807 27.6807">
                  <path d={svgPaths.p14ef9180} fill={isActive("/gallerie") ? "white" : "white"} id="Vector" stroke={isActive("/gallerie") ? "white" : "var(--color-primary)"} strokeWidth="2" />
                </svg>
              </div>
            </div>
            <p className={`font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-sm lg:text-base text-left whitespace-nowrap ${
              isActive("/gallerie") ? "text-white" : "text-primary"
            }`}>
              {t(language, "gallerie")}
            </p>
          </Link>
        </div>

        {/* Right side - Desktop */}
        <div className="hidden md:flex gap-3 lg:gap-4 items-center">
          <button 
            onClick={() => setShowLoginModal(true)}
            className="bg-white content-stretch flex items-center justify-center px-3 lg:px-4 py-1.5 relative rounded-sm shrink-0 border border-primary text-primary hover:bg-gray-50 transition text-sm lg:text-base" 
            data-name="nav/buttonConnexion"
          >
            {t(language, "connexion")}
          </button>
          <div className="bg-gray-50 content-stretch flex gap-0.5 items-center overflow-clip p-0.5 relative rounded-sm shrink-0" data-name="nav/ButtonLangue">
            <button
              onClick={() => setLanguage('EN')}
              className={`rounded-sm shrink-0 size-8 lg:size-10 transition ${
                language === 'EN' ? 'bg-primary' : 'bg-gray-50'
              }`}
            >
              <p className={`font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic text-xs lg:text-sm whitespace-nowrap ${
                language === 'EN' ? 'text-white' : 'text-gray-400'
              }`}>
                EN
              </p>
            </button>
            <button
              onClick={() => setLanguage('FR')}
              className={`rounded-sm shrink-0 size-8 lg:size-10 transition ${
                language === 'FR' ? 'bg-primary' : 'bg-gray-50'
              }`}
            >
              <p className={`font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic text-xs lg:text-sm whitespace-nowrap ${
                language === 'FR' ? 'text-white' : 'text-[#999]'
              }`}>
                FR
              </p>
            </button>
          </div>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-primary w-6 h-6 flex flex-col gap-1 justify-center"
          aria-label="Toggle menu"
        >
          <div className={`w-6 h-0.5 bg-primary transition-all ${mobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
          <div className={`w-6 h-0.5 bg-primary transition-all ${mobileMenuOpen ? 'opacity-0' : ''}`} />
          <div className={`w-6 h-0.5 bg-primary transition-all ${mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-50 flex flex-col gap-2 px-3 py-3">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex gap-2 items-center px-3 py-2 rounded-sm ${
              isActive("/") ? "bg-primary" : "bg-gray-50 hover:bg-gray-100"
            }`}
          >
            <div className="relative shrink-0 size-5">
              <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 27.6806 28.8329">
                <path d={svgPaths.p27d0bd00} fill={isActive("/") ? "white" : "var(--color-primary)"} id="Vector" />
              </svg>
            </div>
            <p className={`font-['Inter:Regular',sans-serif] font-normal text-sm ${
              isActive("/") ? "text-white" : "text-primary"
            }`}>
              {t(language, "accueil")}
            </p>
          </Link>
          <Link
            to="/histoire"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex gap-2 items-center px-3 py-2 rounded-sm ${
              isActive("/histoire") ? "bg-primary" : "bg-gray-50 hover:bg-gray-100"
            }`}
          >
            <div className="relative shrink-0 size-5">
              <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 34.6008 28.834">
                <path d={svgPaths.p1d3f4100} fill={isActive("/histoire") ? "white" : "var(--color-primary)"} id="Vector" />
              </svg>
            </div>
            <p className={`font-['Inter:Regular',sans-serif] font-normal text-sm ${
              isActive("/histoire") ? "text-white" : "text-primary"
            }`}>
              {t(language, "histoire")}
            </p>
          </Link>
          <Link
            to="/articles"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex gap-2 items-center px-3 py-2 rounded-sm ${
              isActive("/articles") ? "bg-primary" : "bg-gray-50 hover:bg-gray-100"
            }`}
          >
            <div className="relative shrink-0 size-5">
              <Group />
            </div>
            <p className={`font-['Inter:Regular',sans-serif] font-normal text-sm ${
              isActive("/articles") ? "text-white" : "text-primary"
            }`}>
              {t(language, "articles")}
            </p>
          </Link>
          <Link
            to="/gallerie"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex gap-2 items-center px-3 py-2 rounded-sm ${
              isActive("/gallerie") ? "bg-primary" : "bg-gray-50 hover:bg-gray-100"
            }`}
          >
            <div className="relative shrink-0 size-5">
              <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 27.6807 27.6807">
                <path d={svgPaths.p14ef9180} fill={isActive("/gallerie") ? "white" : "white"} id="Vector" stroke={isActive("/gallerie") ? "white" : "var(--color-primary)"} strokeWidth="2" />
              </svg>
            </div>
            <p className={`font-['Inter:Regular',sans-serif] font-normal text-sm ${
              isActive("/gallerie") ? "text-white" : "text-primary"
            }`}>
              {t(language, "gallerie")}
            </p>
          </Link>
          <button 
            onClick={() => {
              setShowLoginModal(true);
              setMobileMenuOpen(false);
            }}
            className="w-full bg-primary flex items-center justify-center px-3 py-2 relative rounded-sm text-white text-sm hover:bg-primary-dark transition mt-2" 
          >
            {t(language, "connexion")}
          </button>
          <div className="bg-gray-50 flex gap-1 items-center p-1 rounded-sm mt-2">
            <button
              onClick={() => setLanguage('EN')}
              className={`rounded-sm flex-1 py-1.5 transition text-xs font-medium ${
                language === 'EN' ? 'bg-primary text-white' : 'text-gray-400'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLanguage('FR')}
              className={`rounded-sm flex-1 py-1.5 transition text-xs font-medium ${
                language === 'FR' ? 'bg-primary text-white' : 'text-gray-400'
              }`}
            >
              FR
            </button>
          </div>
        </div>
      )}
      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
    </div>
  );
}
