import { Link, useLocation } from "react-router";
import { useState } from "react";
import svgPaths from "../../imports/Home/svg-1u6sm0pn16";
import { ImageWithFallback } from "./figma/ImageWithFallback";

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
  const [showBackofficeMenu, setShowBackofficeMenu] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="bg-white content-stretch flex items-center justify-between px-[14px] py-[10px] relative shrink-0 w-full" data-name="nav">
      <div aria-hidden="true" className="absolute border-[#f3f3f5] border-b-2 border-solid inset-0 pointer-events-none" />
      <div className="content-stretch flex gap-[21px] items-center relative shrink-0" data-name="nav/navbarre">
        <Link to="/" className="h-[62px] relative shrink-0 w-[152px]" data-name="Img Fake">
          <ImageWithFallback 
            src="https://images.unsplash.com/photo-1581093449818-2655b2467fd6?w=152&h=62&fit=crop"
            alt="Logo ANR Casibio"
            className="absolute inset-0 object-cover"
          />
        </Link>
        <div className="content-stretch flex gap-[16px] items-center relative shrink-0" data-name="Component 10">
          <div className="relative">
            <button
              onClick={() => setShowBackofficeMenu(!showBackofficeMenu)}
              className={`content-stretch flex gap-[6.301px] h-[46.002px] items-center justify-center p-[4.501px] relative rounded-[3.601px] shrink-0 w-[158.211px] ${
                isActive("/") || isActive("/backoffice/articles") || isActive("/backoffice/membres") ? "bg-[#183542]" : "bg-white"
              }`}
              data-name="Component 6"
            >
              <div className="relative shrink-0 size-[36.908px]" data-name="ph:house-fill">
                <div className="absolute inset-[9.38%_12.5%_12.5%_12.5%]" data-name="Vector">
                  <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 27.6806 28.8329">
                    <path d={svgPaths.p27d0bd00} fill={isActive("/") || isActive("/backoffice/articles") || isActive("/backoffice/membres") ? "white" : "#183542"} id="Vector" />
                  </svg>
                </div>
              </div>
              <p className={`font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[30.803px] whitespace-nowrap ${
                isActive("/") || isActive("/backoffice/articles") || isActive("/backoffice/membres") ? "text-white" : "text-[#183542]"
              }`}>
                Accueil
              </p>
            </button>
            {showBackofficeMenu && (
              <div className="absolute top-full left-0 mt-[5px] bg-white shadow-lg rounded-[4px] border border-[#f3f3f5] z-50 min-w-[200px]">
                <Link
                  to="/"
                  onClick={() => setShowBackofficeMenu(false)}
                  className="block px-[20px] py-[12px] hover:bg-[#f3f3f5] font-['Inter:Regular',sans-serif] text-[16px] text-[#183542]"
                >
                  Page d'accueil
                </Link>
                <Link
                  to="/backoffice/articles"
                  onClick={() => setShowBackofficeMenu(false)}
                  className="block px-[20px] py-[12px] hover:bg-[#f3f3f5] font-['Inter:Regular',sans-serif] text-[16px] text-[#183542] border-t border-[#f3f3f5]"
                >
                  Backoffice Articles
                </Link>
                <Link
                  to="/backoffice/membres"
                  onClick={() => setShowBackofficeMenu(false)}
                  className="block px-[20px] py-[12px] hover:bg-[#f3f3f5] font-['Inter:Regular',sans-serif] text-[16px] text-[#183542] border-t border-[#f3f3f5]"
                >
                  Backoffice Membres
                </Link>
              </div>
            )}
          </div>
          <Link
            to="/histoire"
            className={`content-stretch flex gap-[6.301px] h-[46.002px] items-center justify-center p-[4.501px] relative rounded-[3.601px] shrink-0 w-[164.211px] ${
              isActive("/histoire") ? "bg-[#183542]" : "bg-white"
            }`}
            data-name="Component 7"
          >
            <div className="relative shrink-0 size-[36.908px]" data-name="famicons:book-sharp">
              <div className="absolute inset-[9.38%_3.13%_12.5%_3.13%]" data-name="Vector">
                <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 34.6008 28.834">
                  <path d={svgPaths.p1d3f4100} fill={isActive("/histoire") ? "white" : "#183542"} id="Vector" />
                </svg>
              </div>
            </div>
            <p className={`font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[30.803px] text-left whitespace-nowrap ${
              isActive("/histoire") ? "text-white" : "text-[#183542]"
            }`}>
              Histoire
            </p>
          </Link>
          <Link
            to="/articles"
            className={`content-stretch flex gap-[6.301px] h-[46.002px] items-center justify-center p-[4.501px] relative rounded-[3.601px] shrink-0 w-[163.211px] ${
              isActive("/articles") ? "bg-[#183542]" : "bg-white"
            }`}
            data-name="Component 8"
          >
            <div className="content-stretch flex items-center justify-center p-[4.613px] relative shrink-0 size-[36.908px]" data-name="tabler:books">
              <Group />
            </div>
            <p className={`font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[30.803px] text-left whitespace-nowrap ${
              isActive("/articles") ? "text-white" : "text-[#183542]"
            }`}>
              Articles
            </p>
          </Link>
          <Link
            to="/gallerie"
            className={`content-stretch flex gap-[6.301px] h-[46.002px] items-center justify-center p-[4.501px] relative rounded-[3.601px] shrink-0 w-[163.211px] ${
              isActive("/gallerie") ? "bg-[#183542]" : "bg-white"
            }`}
            data-name="Component 9"
          >
            <div className="relative shrink-0 size-[36.908px]" data-name="material-symbols:image-rounded">
              <div className="absolute inset-[12.5%]" data-name="Vector">
                <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 27.6807 27.6807">
                  <path d={svgPaths.p14ef9180} fill={isActive("/gallerie") ? "white" : "white"} id="Vector" stroke={isActive("/gallerie") ? "white" : "#183542"} strokeWidth="2" />
                </svg>
              </div>
            </div>
            <p className={`font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[30.803px] text-left whitespace-nowrap ${
              isActive("/gallerie") ? "text-white" : "text-[#183542]"
            }`}>
              Gallerie
            </p>
          </Link>
        </div>
      </div>
      <div className="content-stretch flex flex-[1_0_0] gap-[20px] items-center justify-end min-h-px min-w-px relative">
        <button className="cursor-pointer flex-[1_0_0] h-[53.885px] max-w-[600px] min-h-px min-w-px relative rounded-[4px]">
          <div className="flex flex-row items-center justify-end max-w-[inherit] size-full">
            <div className="content-stretch flex items-center justify-end max-w-[inherit] p-[5px] relative size-full">
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
        <button className="bg-white content-stretch flex items-center justify-center p-[7.41px] relative rounded-[2.964px] shrink-0" data-name="nav/buttonConnexion">
          <div aria-hidden="true" className="absolute border-[#f3f3f5] border-[0.731px] border-solid inset-0 pointer-events-none rounded-[2.964px]" />
          <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[#183542] text-[25.028px] whitespace-nowrap">
            Connexion
          </p>
        </button>
        <div className="bg-[#f3f3f5] content-stretch flex gap-[4px] items-center overflow-clip p-[2px] relative rounded-[1.9px] shrink-0" data-name="nav/ButtonLangue">
          <div className="bg-[#f3f3f5] rounded-[1.9px] shrink-0 size-[49.885px]" />
          <div className="bg-[#183542] rounded-[1.9px] shrink-0 size-[49.885px]" />
          <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-[6.65px] not-italic text-[#183542] text-[30.406px] top-[9.03px] whitespace-nowrap">
            EN
          </p>
          <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-[62.24px] not-italic text-[30.406px] text-white top-[9.03px] whitespace-nowrap">
            FR
          </p>
        </div>
      </div>
    </div>
  );
}