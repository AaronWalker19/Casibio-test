import { Navigation } from "../components/Navigation.tsx";
import { Footer } from "../components/Footer.tsx";
import { Link } from "react-router";
import { ImageWithFallback } from "../components/figma/ImageWithFallback.tsx";
import { useLanguage } from "../../contexts/LanguageContext.tsx";
import { t } from "../../contexts/translations.tsx";

export default function HistoirePage() {
  const { language } = useLanguage();
  return (
    <div className="bg-white content-stretch flex flex-col items-center relative size-full">
      <Navigation />
      <div className="bg-primary flex flex-col gap-3 sm:gap-4 md:gap-5 items-start px-4 sm:px-6 md:px-8 lg:px-12 py-8 sm:py-12 md:py-16 w-full">
        <p className="font-['Inter:Bold',sans-serif] font-bold relative shrink-0 text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-error-accent w-full break-words">
          Projet ANR Casibio
        </p>
        <Link
          to="/articles"
          className="flex gap-2 sm:gap-3 items-center relative shrink-0 hover:opacity-70 transition"
        >
          <div className="relative shrink-0 size-6 sm:size-7 md:size-8">
            <svg
              className="block size-full"
              fill="none"
              preserveAspectRatio="none"
              viewBox="0 0 30 30"
            >
              <g>
                <path
                  d="M6.25 5.625V24.375M6.25 5.625C6.25 5.625 8.75 3.75 12.5 3.75C16.25 3.75 18.75 5.625 18.75 5.625M6.25 5.625C6.25 5.625 3.75 3.75 0 3.75V24.375C3.75 24.375 6.25 26.25 6.25 26.25M18.75 5.625V24.375M18.75 5.625C18.75 5.625 21.25 3.75 25 3.75C28.75 3.75 30 5.625 30 5.625V24.375C30 24.375 28.75 22.5 25 22.5C21.25 22.5 18.75 24.375 18.75 24.375M18.75 24.375C18.75 24.375 16.25 22.5 12.5 22.5C8.75 22.5 6.25 24.375 6.25 24.375"
                  stroke="white"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                />
              </g>
            </svg>
          </div>
          <p className="font-['Inter:Regular',sans-serif] font-normal relative shrink-0 text-lg sm:text-xl md:text-2xl lg:text-3xl text-white whitespace-nowrap">
            {t(language, "articles")}
          </p>
          <div className="relative shrink-0 size-6 sm:size-7 md:size-8">
            <svg
              className="block size-full"
              fill="none"
              preserveAspectRatio="none"
              viewBox="0 0 30 30"
            >
              <path
                clipRule="evenodd"
                d="M12.2344 7.73438L18.5156 14.0156C18.6719 14.1719 18.75 14.375 18.75 14.625C18.75 14.875 18.6719 15.0781 18.5156 15.2344L12.2344 21.5156C11.9219 21.8281 11.4531 21.8281 11.1406 21.5156C10.8281 21.2031 10.8281 20.7344 11.1406 20.4219L16.9375 14.625L11.1406 8.82812C10.8281 8.51562 10.8281 8.04688 11.1406 7.73438C11.4531 7.42188 11.9219 7.42188 12.2344 7.73438Z"
                fill="white"
                fillRule="evenodd"
              />
            </svg>
          </div>
        </Link>
      </div>
      <div className="relative shrink-0 w-full">
        <div
          aria-hidden="true"
          className="absolute border-gray-50 border-b inset-0 pointer-events-none"
        />
        <div className="flex flex-col items-center size-full">
          <div className="flex flex-col lg:flex-row gap-6 sm:gap-8 md:gap-10 lg:gap-12 items-start px-4 sm:px-6 md:px-8 lg:px-12 py-8 sm:py-12 md:py-16 w-full">
            <div className="flex-1 flex flex-col gap-6 sm:gap-8 items-start w-full lg:w-auto">
              <div className="flex flex-col gap-4 sm:gap-6 items-start w-full">
                <p className="font-['Inter:Bold',sans-serif] font-bold relative text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-black w-full">
                  {t(language, "histoireProjetCasibio")}
                </p>
              </div>
              <div className="flex flex-col gap-4 sm:gap-6 items-start w-full">
                <p className="font-['Inter:Regular',sans-serif] font-normal leading-relaxed text-xs sm:text-sm md:text-base text-black text-justify w-full">
                  {t(language, "casibioContext1")}
                </p>
                <p className="font-['Inter:Regular',sans-serif] font-normal leading-relaxed text-xs sm:text-sm md:text-base text-black text-justify w-full">
                  {t(language, "casibioContext2")}
                </p>
                <p className="font-['Inter:Regular',sans-serif] font-normal leading-relaxed text-xs sm:text-sm md:text-base text-black text-justify w-full">
                  {t(language, "casibioContext3")}
                </p>
                <p className="font-['Inter:Regular',sans-serif] font-normal leading-relaxed text-xs sm:text-sm md:text-base text-black text-justify w-full">
                  {t(language, "casibioContext4")}
                </p>
                <p className="font-['Inter:Regular',sans-serif] font-normal leading-relaxed text-xs sm:text-sm md:text-base text-black text-justify w-full">
                  {t(language, "casibioContext5")}
                </p>
                <p className="font-['Inter:Regular',sans-serif] font-normal leading-relaxed text-xs sm:text-sm md:text-base text-black text-justify w-full">
                  {t(language, "casibioContext6")}
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-4 sm:gap-6 items-start relative shrink-0 w-full lg:w-80">
              <div className="bg-gray-50 flex flex-col gap-2 sm:gap-3 items-start p-4 sm:p-6 md:p-8 rounded-sm w-full">
                <p className="font-['Inter:Bold',sans-serif] font-bold text-lg sm:text-xl md:text-2xl text-black w-full">
                  {t(language, "fichierLie")}
                </p>
                <div className="h-32 sm:h-40 md:h-48 relative shrink-0 w-full">
                  <ImageWithFallback
                    src="https://images.unsplash.com/photo-1581093449818-2655b2467fd6?w=400&h=200&fit=crop"
                    alt="file"
                    className="w-full h-full object-cover rounded-sm"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    <div className="flex flex-col gap-4 sm:gap-6 md:gap-8 px-4 sm:px-6 md:px-8 lg:px-12 py-8 sm:py-12 md:py-16 w-full">
      {/* Coordination du Projet */}
      <div className="bg-primary flex flex-col gap-4 sm:gap-6 items-start px-4 sm:px-6 md:px-8 py-6 sm:py-8 md:py-10 w-full rounded-md">
        <div className="flex gap-3 sm:gap-4 items-start w-full">
          <div className="relative size-6 sm:size-7 md:size-8 flex-shrink-0">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
              <circle cx="12" cy="8" r="4" stroke="white" strokeWidth="2"/>
              <path d="M4 20c0-3.314 3.582-6 8-6s8 2.686 8 6" stroke="white" strokeWidth="2"/>
            </svg>
          </div>
          <div className="flex-1">
            <h2 className="font-['Inter:Bold',sans-serif] font-bold text-lg sm:text-xl md:text-2xl lg:text-3xl text-white mb-2 sm:mb-3 md:mb-4">
              {t(language, "coordinationProjet")}
            </h2>
            <p className="font-['Inter:Bold',sans-serif] font-bold text-sm sm:text-base md:text-lg text-white mb-1 sm:mb-2 md:mb-3">
              {t(language, "coordinateur")} <span className="font-normal">({t(language, "coordinateurAffiliation")})</span>
            </p>
            <p className="font-['Inter:Regular',sans-serif] font-normal leading-relaxed text-xs sm:text-sm md:text-base text-white">
              {t(language, "coordinateurTexte")}
            </p>
          </div>
        </div>
      </div>

      {/* Partenariat */}
      <div className="bg-primary flex flex-col gap-4 sm:gap-6 items-start px-4 sm:px-6 md:px-8 py-6 sm:py-8 md:py-10 w-full rounded-md">
        <div className="flex gap-3 sm:gap-4 items-start w-full">
          <div className="relative size-6 sm:size-7 md:size-8 flex-shrink-0">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
              <path d="M2 8c0-1.1.9-2 2-2h4c1.1 0 2 .9 2 2v4c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V8z" stroke="white" strokeWidth="2"/>
              <path d="M14 8c0-1.1.9-2 2-2h4c1.1 0 2 .9 2 2v4c0 1.1-.9 2-2 2h-4c-1.1 0-2-.9-2-2V8z" stroke="white" strokeWidth="2"/>
              <path d="M2 20c0-1.1.9-2 2-2h4c1.1 0 2 .9 2 2v0c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2v0z" stroke="white" strokeWidth="2"/>
              <path d="M14 20c0-1.1.9-2 2-2h4c1.1 0 2 .9 2 2v0c0 1.1-.9 2-2 2h-4c-1.1 0-2-.9-2-2v0z" stroke="white" strokeWidth="2"/>
            </svg>
          </div>
          <div className="flex-1">
            <h2 className="font-['Inter:Bold',sans-serif] font-bold text-lg sm:text-xl md:text-2xl lg:text-3xl text-white mb-2 sm:mb-3 md:mb-4">
              {t(language, "partenariat")}
            </h2>
            <div className="space-y-1 sm:space-y-2 md:space-y-3">
              <p className="font-['Inter:Bold',sans-serif] font-bold text-sm sm:text-base md:text-lg text-white">
                {t(language, "xlim")}
              </p>
              <p className="font-['Inter:Regular',sans-serif] font-normal text-xs sm:text-sm md:text-base text-white">
                {t(language, "ircer")}
              </p>
              <p className="font-['Inter:Regular',sans-serif] font-normal text-xs sm:text-sm md:text-base text-white">
                {t(language, "ur4492")}
              </p>
              <p className="font-['Inter:Regular',sans-serif] font-normal text-xs sm:text-sm md:text-base text-white">
                {t(language, "umbr8181")}
              </p>
            </div>
            <div className="mt-4 sm:mt-6 md:mt-8 space-y-1 sm:space-y-2 md:space-y-3">
              <p className="font-['Inter:Bold',sans-serif] font-bold text-sm sm:text-base md:text-lg text-white">
                {t(language, "aideANR")}
              </p>
              <p className="font-['Inter:Bold',sans-serif] font-bold text-sm sm:text-base md:text-lg text-white">
                {t(language, "dureeProjet")}
              </p>
            </div>
          </div>
        </div>
      </div>
      </div>

      <Footer />
    </div>
  );
}
