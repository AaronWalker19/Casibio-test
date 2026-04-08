import { Link, useLocation, useNavigate } from "react-router";
import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext.tsx";
import { useLanguage } from "../../contexts/LanguageContext.tsx";
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
              <path d={svgPaths.p1fc97ec0} stroke="var(--stroke-0, #183542)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            </g>
            <g id="Vector_2">
              <path d={svgPaths.p25d90a80} fill="var(--fill-0, white)" />
              <path d={svgPaths.p2b534680} stroke="var(--stroke-0, #183542)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
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
  const [showBackofficeMenu, setShowBackofficeMenu] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Si l'utilisateur est connecté, afficher une barre bleue unie
  if (isAuthenticated) {
    return (
      <div className="bg-[#183542] content-stretch flex items-center justify-between px-[14px] py-[10px] relative shrink-0 w-full" data-name="nav">
        <div className="content-stretch flex gap-[21px] items-center relative shrink-0" data-name="nav/navbarre">
          <Link to="/" className="h-[48px] relative shrink-0 w-[120px]" data-name="Img Fake">
            <ImageWithFallback 
              src="https://images.unsplash.com/photo-1581093449818-2655b2467fd6?w=120&h=48&fit=crop"
              alt="Logo ANR Casibio"
              className="absolute inset-0 object-cover"
            />
          </Link>
          
          {/* Menu Back office pour les utilisateurs connectés */}
          <div className="relative">
            <button
              onClick={() => setShowBackofficeMenu(!showBackofficeMenu)}
              className="content-stretch flex gap-[6px] h-[36px] items-center justify-center p-[4px] relative rounded-[3px] shrink-0 px-[10px] bg-[#0f2835] hover:bg-[#0d1f28] transition"
              data-name="backoffice-btn"
            >
              <div className="relative shrink-0 size-[28px]" data-name="settings">
                <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24" stroke="white" strokeWidth="2">
                  <path d="M12 8c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z" />
                  <path d="M12 14c-2.67 0-8 1.34-8 4v6h16v-6c0-2.66-5.33-4-8-4z" />
                </svg>
              </div>
              <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[16px] text-white whitespace-nowrap">
                Back
              </p>
            </button>

            {showBackofficeMenu && (
              <div className="absolute top-full left-0 mt-[5px] bg-white shadow-lg rounded-[4px] border border-[#f3f3f5] z-50 min-w-[220px]">
                <Link
                  to="/backoffice/articles"
                  onClick={() => setShowBackofficeMenu(false)}
                  className="block px-[20px] py-[12px] hover:bg-[#f3f3f5] font-['Inter:Regular',sans-serif] text-[16px] text-[#183542]"
                >
                  Articles
                </Link>
                <Link
                  to="/backoffice/membres"
                  onClick={() => setShowBackofficeMenu(false)}
                  className="block px-[20px] py-[12px] hover:bg-[#f3f3f5] font-['Inter:Regular',sans-serif] text-[16px] text-[#183542] border-t border-[#f3f3f5]"
                >
                  Membres
                </Link>
                <button
                  onClick={() => {
                    setShowBackofficeMenu(false);
                    handleLogout();
                  }}
                  className="w-full text-left px-[20px] py-[12px] hover:bg-[#f3f3f5] font-['Inter:Regular',sans-serif] text-[16px] text-[#c9232c] border-t border-[#f3f3f5]"
                >
                  Déconnexion
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="content-stretch flex flex-[1_0_0] gap-[20px] items-center justify-end min-h-px min-w-px relative">
          <button className="cursor-pointer flex-[1_0_0] h-[53.885px] max-w-[600px] min-h-px min-w-px relative rounded-[4px]">
            <div className="flex flex-row items-center justify-end max-w-[inherit] size-full">
              <div className="content-stretch flex items-center justify-end max-w-[inherit] p-[5px] relative size-full">
                <div className="aspect-[24/24] h-full relative shrink-0" data-name="material-symbols:search-rounded">
                  <div className="absolute inset-[12.5%_14.27%_14.27%_12.5%]" data-name="Vector">
                    <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32.1368 32.1368">
                      <path d={svgPaths.pf001600} fill="white" id="Vector" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </button>
          
          <div className="bg-[#f3f3f5] content-stretch flex gap-[4px] items-center overflow-clip p-[2px] relative rounded-[1.9px] shrink-0" data-name="nav/ButtonLangue">
            <button
              onClick={() => setLanguage('EN')}
              className={`rounded-[1.9px] shrink-0 size-[42px] transition ${
                language === 'EN' ? 'bg-[#183542]' : 'bg-[#f3f3f5]'
              }`}
            >
              <p className={`font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic text-[12px] whitespace-nowrap ${
                language === 'EN' ? 'text-white' : 'text-[#999]'
              }`}>
                EN
              </p>
            </button>
            <button
              onClick={() => setLanguage('FR')}
              className={`rounded-[1.9px] shrink-0 size-[42px] transition ${
                language === 'FR' ? 'bg-[#183542]' : 'bg-[#f3f3f5]'
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
      </div>
    );
  }

  // Navigation normale pour les utilisateurs non connectés
  return (
    <div className="bg-white content-stretch flex items-center justify-between px-[14px] py-[10px] relative shrink-0 w-full" data-name="nav">
      <div aria-hidden="true" className="absolute border-[#f3f3f5] border-b-2 border-solid inset-0 pointer-events-none" />
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
              isActive("/") ? "bg-[#183542]" : "bg-white"
            }`}
            data-name="Component 6"
          >
            <div className="relative shrink-0 size-[28px]" data-name="ph:house-fill">
              <div className="absolute inset-[9.38%_12.5%_12.5%_12.5%]" data-name="Vector">
                <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 27.6806 28.8329">
                  <path d={svgPaths.p27d0bd00} fill={isActive("/") ? "white" : "#183542"} id="Vector" />
                </svg>
              </div>
            </div>
            <p className={`font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[16px] whitespace-nowrap ${
              isActive("/") ? "text-white" : "text-[#183542]"
            }`}>
              Accueil
            </p>
          </Link>
          <Link
            to="/histoire"
            className={`content-stretch flex gap-[6px] h-[36px] items-center justify-center p-[4px] relative rounded-[3px] shrink-0 w-[130px] ${
              isActive("/histoire") ? "bg-[#183542]" : "bg-white"
            }`}
            data-name="Component 7"
          >
            <div className="relative shrink-0 size-[28px]" data-name="famicons:book-sharp">
              <div className="absolute inset-[9.38%_3.13%_12.5%_3.13%]" data-name="Vector">
                <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 34.6008 28.834">
                  <path d={svgPaths.p1d3f4100} fill={isActive("/histoire") ? "white" : "#183542"} id="Vector" />
                </svg>
              </div>
            </div>
            <p className={`font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[16px] text-left whitespace-nowrap ${
              isActive("/histoire") ? "text-white" : "text-[#183542]"
            }`}>
              Histoire
            </p>
          </Link>
          <Link
            to="/articles"
            className={`content-stretch flex gap-[6px] h-[36px] items-center justify-center p-[4px] relative rounded-[3px] shrink-0 w-[130px] ${
              isActive("/articles") ? "bg-[#183542]" : "bg-white"
            }`}
            data-name="Component 8"
          >
            <div className="content-stretch flex items-center justify-center p-[3px] relative shrink-0 size-[28px]" data-name="tabler:books">
              <Group />
            </div>
            <p className={`font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[16px] text-left whitespace-nowrap ${
              isActive("/articles") ? "text-white" : "text-[#183542]"
            }`}>
              Articles
            </p>
          </Link>
          <Link
            to="/gallerie"
            className={`content-stretch flex gap-[6px] h-[36px] items-center justify-center p-[4px] relative rounded-[3px] shrink-0 w-[130px] ${
              isActive("/gallerie") ? "bg-[#183542]" : "bg-white"
            }`}
            data-name="Component 9"
          >
            <div className="relative shrink-0 size-[28px]" data-name="material-symbols:image-rounded">
              <div className="absolute inset-[12.5%]" data-name="Vector">
                <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 27.6807 27.6807">
                  <path d={svgPaths.p14ef9180} fill={isActive("/gallerie") ? "white" : "white"} id="Vector" stroke={isActive("/gallerie") ? "white" : "#183542"} strokeWidth="2" />
                </svg>
              </div>
            </div>
            <p className={`font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[16px] text-left whitespace-nowrap ${
              isActive("/gallerie") ? "text-white" : "text-[#183542]"
            }`}>
              Gallerie
            </p>
          </Link>
        </div>
      </div>
      <div className="content-stretch flex flex-[1_0_0] gap-[20px] items-center justify-end min-h-px min-w-px relative">
        <button className="cursor-pointer flex-[1_0_0] h-[40px] max-w-[600px] min-h-px min-w-px relative rounded-[4px]">
          <div className="flex flex-row items-center justify-end max-w-[inherit] size-full">
            <div className="content-stretch flex items-center justify-end max-w-[inherit] p-[4px] relative size-full">
              <div className="aspect-[24/24] h-full relative shrink-0" data-name="material-symbols:search-rounded">
                <div className="absolute inset-[12.5%_14.27%_14.27%_12.5%]" data-name="Vector">
                  <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32.1368 32.1368">
                    <path d={svgPaths.pf001600} fill="#183542" id="Vector" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </button>
        <button 
          onClick={() => setShowLoginModal(true)}
          className="bg-white content-stretch flex items-center justify-center p-[7.41px] relative rounded-[2.964px] shrink-0 hover:bg-opacity-90 transition" 
          data-name="nav/buttonConnexion"
        >
          <div aria-hidden="true" className="absolute border-[#f3f3f5] border-[0.731px] border-solid inset-0 pointer-events-none rounded-[2.964px]" />
          <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[#183542] text-[16px] whitespace-nowrap">
            Connexion
          </p>
        </button>
        <div className="bg-[#f3f3f5] content-stretch flex gap-[4px] items-center overflow-clip p-[2px] relative rounded-[1.9px] shrink-0" data-name="nav/ButtonLangue">
          <button
            onClick={() => setLanguage('EN')}
            className={`rounded-[1.9px] shrink-0 size-[42px] transition ${
              language === 'EN' ? 'bg-[#183542]' : 'bg-[#f3f3f5]'
            }`}
          >
            <p className={`font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic text-[12px] whitespace-nowrap ${
              language === 'EN' ? 'text-white' : 'text-[#999]'
            }`}>
              EN
            </p>
          </button>
          <button
            onClick={() => setLanguage('FR')}
            className={`rounded-[1.9px] shrink-0 size-[42px] transition ${
              language === 'FR' ? 'bg-[#183542]' : 'bg-[#f3f3f5]'
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
