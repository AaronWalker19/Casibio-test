import { Link } from "react-router";
import { Navigation } from "../components/Navigation";
import { Footer } from "../components/Footer";
import svgPaths from "../../imports/Home/svg-1u6sm0pn16";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

function Frame4() {
  return (
    <div className="content-stretch flex gap-[10px] items-start justify-center p-[5px] relative rounded-[4px] shrink-0">
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

const articles = [
  {
    id: 1,
    title: "Polymer ajouter au contour de céramique",
    date: "17 Mars 2026",
    status: "Complété",
    description: "Le procédé Polymer Impregnation Pyrolysis (PIP) est sélectionné pour synthétiser ces objets",
    image: "https://images.unsplash.com/photo-1581093449818-2655b2467fd6?w=476&h=312&fit=crop",
  },
  {
    id: 2,
    title: "Polymer ajouter au contour de céramique",
    date: "17 Mars 2026",
    status: "Complété",
    description: "Le procédé Polymer Impregnation Pyrolysis (PIP) est sélectionné pour synthétiser ces objets",
    image: "https://images.unsplash.com/photo-1707863080643-2a7dc1f8486f?w=476&h=312&fit=crop",
  },
  {
    id: 3,
    title: "Polymer ajouter au contour de céramique",
    date: "17 Mars 2026",
    status: "Complété",
    description: "Le procédé Polymer Impregnation Pyrolysis (PIP) est sélectionné pour synthétiser ces objets",
    image: "https://images.unsplash.com/photo-1766297247072-93fd815afef3?w=476&h=312&fit=crop",
  },
];

const galleryImages = [
  {
    id: 1,
    title: "Polymer ajouter au contour de céramique",
    date: "date 17 Mars 2026",
    image: "https://images.unsplash.com/photo-1770320742275-2ad1714ab774?w=450&h=313&fit=crop",
  },
  {
    id: 2,
    title: "Polymer ajouter au contour de céramique",
    date: "date 17 Mars 2026",
    image: "https://images.unsplash.com/photo-1761095596584-34731de3e568?w=450&h=313&fit=crop",
  },
  {
    id: 3,
    title: "Polymer ajouter au contour de céramique",
    date: "date 17 Mars 2026",
    image: "https://images.unsplash.com/photo-1770320742319-6aa889b3130b?w=450&h=313&fit=crop",
  },
];

export default function HomePage() {
  return (
    <div className="bg-white content-stretch flex flex-col items-center relative size-full" data-name="home">
      <Navigation />
      <div className="bg-[#183542] content-stretch flex flex-col gap-[20px] items-center justify-center py-[150px] relative shrink-0 w-full" data-name="accueil">
        <div className="content-stretch flex flex-col gap-[10px] items-center relative shrink-0">
          <Frame4 />
          <p className="font-['Inter:Bold',sans-serif] font-bold leading-[normal] not-italic relative shrink-0 text-[96px] text-[#ff404a] whitespace-nowrap">
            Projet ANR Casibio
          </p>
          <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic opacity-70 relative shrink-0 text-[14px] text-center text-white w-[901px]">
            vise à élaborer des céramiques poreuses catalytiques Ni(Ru)/SiCxOy pour les réactions de reformage à sec du méthane et de méthanation du CO2, deux réactions incontournables dans le domaine de l'énergie pour lesquels la stabilité du catalyseur est la principale problématique
          </p>
        </div>
        <div className="content-stretch flex gap-[20px] items-start justify-center relative shrink-0">
          <Link
            to="/articles"
            className="bg-[#183542] content-stretch flex gap-[5.306px] h-[38.736px] items-center justify-center p-[3.79px] relative rounded-[3.032px] shrink-0"
            data-name="Component 9"
          >
            <div className="content-stretch flex items-center justify-center p-[3.885px] relative shrink-0 size-[31.078px]" data-name="tabler:books">
              <Group1 />
            </div>
            <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[25.938px] text-white whitespace-nowrap">
              Articles
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
            className="bg-white content-stretch flex gap-[5.306px] h-[38.736px] items-center justify-center p-[3.79px] relative rounded-[3.032px] shrink-0 w-[197.464px]"
            data-name="Component 10"
          >
            <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[#183542] text-[25.938px] whitespace-nowrap">
              En savoir plus
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
          <div className="content-stretch flex flex-col gap-[50px] items-center p-[50px] relative w-full">
            <div className="content-stretch flex flex-col gap-[28px] items-start relative shrink-0 w-full">
              <p className="font-['Inter:Bold',sans-serif] font-bold leading-[normal] not-italic relative shrink-0 text-[48px] text-black w-full">
                Dernières publication
              </p>
              <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
                <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[32px] text-black text-center whitespace-nowrap">
                  Découvrez nos travaux et avancements recents
                </p>
                <Link to="/articles" className="content-stretch flex gap-[10px] items-center relative shrink-0">
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
                </Link>
              </div>
            </div>
            <div className="content-stretch flex gap-[80px] items-center justify-center relative shrink-0 w-full">
              {articles.map((article) => (
                <div key={article.id} className="bg-[#183542] content-stretch flex flex-col items-center pb-[113px] relative rounded-[4px] shrink-0 w-[476px]" data-name="article">
                  <div className="h-[312px] mb-[-103px] relative shrink-0 w-[476px]">
                    <ImageWithFallback src={article.image} alt={article.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="content-stretch flex flex-col gap-[5px] items-end mb-[-103px] relative shrink-0 w-[450px]">
                    <div className="content-stretch flex gap-[5px] items-center relative shrink-0 w-full">
                      <div className="bg-[#c9232c] content-stretch flex items-center justify-center p-[5px] relative rounded-[4px] shrink-0">
                        <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[12px] text-white whitespace-nowrap">
                          date: {article.date}
                        </p>
                      </div>
                      <div className="bg-[#137300] content-stretch flex items-center justify-center p-[5px] relative rounded-[4px] shrink-0">
                        <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[12px] text-white whitespace-nowrap">
                          {article.status}
                        </p>
                      </div>
                    </div>
                    <div className="bg-[#f3f3f5] relative rounded-[4px] shrink-0 w-full">
                      <div className="flex flex-col items-center justify-center size-full">
                        <div className="content-stretch flex flex-col gap-[10px] items-center justify-center leading-[normal] not-italic p-[5px] relative text-[#183542] text-center w-full">
                          <p className="font-['Inter:Bold',sans-serif] font-bold relative shrink-0 text-[32px] w-full">
                            {article.title}
                          </p>
                          <p className="font-['Inter:Regular',sans-serif] font-normal opacity-70 relative shrink-0 text-[14px] w-full">
                            {article.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="bg-[#183542] content-stretch flex gap-[67px] items-center justify-center py-[104px] relative shrink-0 w-full">
        <div className="content-stretch flex flex-col items-center relative shrink-0">
          <p className="font-['Inter:Bold',sans-serif] font-bold leading-[normal] not-italic relative shrink-0 text-[148px] text-white whitespace-nowrap">
            25
          </p>
          <p className="font-['Inter:Bold',sans-serif] font-bold leading-[normal] not-italic relative shrink-0 text-[96px] text-white whitespace-nowrap">
            articles
          </p>
        </div>
        <div className="content-stretch flex flex-col h-full items-end justify-center pb-[53.75px] relative rounded-[8.75px] shrink-0">
          <div className="flex-[1_0_0] mb-[-53.75px] min-h-px min-w-px relative w-[651px]">
            <ImageWithFallback 
              src="https://images.unsplash.com/photo-1581093449818-2655b2467fd6?w=651&h=400&fit=crop"
              alt="Articles preview"
              className="w-full h-full object-cover rounded-[8.75px]"
            />
          </div>
          <Link
            to="/articles"
            className="bg-white content-stretch flex gap-[7.363px] h-[53.75px] items-center justify-center mb-[-53.75px] p-[5.259px] relative shrink-0 w-[274px]"
            data-name="Component 10"
          >
            <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[#183542] text-[35.99px] whitespace-nowrap">
              En savoir plus
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
          <div className="content-stretch flex flex-col gap-[50px] items-center p-[50px] relative w-full">
            <div className="content-stretch flex flex-col gap-[28px] items-start relative shrink-0 w-full">
              <p className="font-['Inter:Bold',sans-serif] font-bold leading-[normal] not-italic relative shrink-0 text-[48px] text-black w-full">
                Dernières image rajouter a la galerie
              </p>
              <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
                <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[32px] text-black text-center whitespace-nowrap">
                  Découvrez nos dernier image de notre projet
                </p>
                <div className="content-stretch flex gap-[10px] items-center relative shrink-0">
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
            <div className="content-stretch flex gap-[80px] items-center justify-center relative shrink-0 w-full">
              {galleryImages.map((image) => (
                <div key={image.id} className="bg-[#183542] content-stretch flex flex-col items-center pb-[59px] relative rounded-[4px] shrink-0 w-[450px]" data-name="article">
                  <div className="h-[313px] mb-[-59px] relative shrink-0 w-[450px]">
                    <ImageWithFallback src={image.image} alt={image.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="content-stretch flex flex-col gap-[5px] items-end mb-[-59px] relative shrink-0 w-[450px]">
                    <div className="bg-[#c9232c] content-stretch flex items-center justify-center p-[5px] relative rounded-[4px] shrink-0">
                      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[12px] text-white whitespace-nowrap">
                        {image.date}
                      </p>
                    </div>
                    <div className="bg-[#183542] relative rounded-[4px] shrink-0 w-full">
                      <div className="flex flex-col items-center justify-center size-full">
                        <div className="content-stretch flex flex-col gap-[10px] items-center justify-center p-[5px] relative w-full">
                          <p className="font-['Inter:Bold',sans-serif] font-bold leading-[normal] not-italic relative shrink-0 text-[16px] text-center text-white w-full">
                            {image.title}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
