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
      <div className="bg-primary content-stretch flex flex-col gap-[20px] items-start px-[50px] py-[50px] relative shrink-0 w-full">
        <p className="font-['Inter:Bold',sans-serif] font-bold leading-[normal] not-italic relative shrink-0 text-[96px] text-error-accent w-full">
          Projet ANR Casibio
        </p>
        <Link
          to="/articles"
          className="content-stretch flex gap-[10px] items-center relative shrink-0"
        >
          <div
            className="relative shrink-0 size-[30px]"
            data-name="tabler:books"
          >
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
          <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[32px] text-white whitespace-nowrap">
            Articles
          </p>
          <div
            className="relative shrink-0 size-[30px]"
            data-name="weui:arrow-filled"
          >
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
          className="absolute border-gray-50 border-b border-solid inset-0 pointer-events-none"
        />
        <div className="flex flex-col items-center size-full">
          <div className="content-stretch flex gap-[50px] items-start p-[50px] relative w-full">
            <div className="flex-1 content-stretch flex flex-col gap-[40px] items-start relative">
              <div className="content-stretch flex flex-col gap-[20px] items-start relative shrink-0 w-full">
                <p className="font-['Inter:Bold',sans-serif] font-bold leading-[normal] not-italic relative shrink-0 text-[48px] text-black w-full">
                  {t(language, "histoireProjetCasibio")}
                </p>
              </div>
              <div className="content-stretch flex flex-col gap-[20px] items-start relative shrink-0 w-full">
                <p className="font-['Inter:Regular',sans-serif] font-normal leading-[24px] not-italic relative shrink-0 text-[16px] text-black text-justify w-full">
                  {t(language, "casibioContext1")}
                </p>
                <p className="font-['Inter:Regular',sans-serif] font-normal leading-[24px] not-italic relative shrink-0 text-[16px] text-black text-justify w-full">
                  {t(language, "casibioContext2")}
                </p>
                <p className="font-['Inter:Regular',sans-serif] font-normal leading-[24px] not-italic relative shrink-0 text-[16px] text-black text-justify w-full">
                  {t(language, "casibioContext3")}
                </p>
                <p className="font-['Inter:Regular',sans-serif] font-normal leading-[24px] not-italic relative shrink-0 text-[16px] text-black text-justify w-full">
                  {t(language, "casibioContext4")}
                </p>
                <p className="font-['Inter:Regular',sans-serif] font-normal leading-[24px] not-italic relative shrink-0 text-[16px] text-black text-justify w-full">
                  {t(language, "casibioContext5")}
                </p>
                <p className="font-['Inter:Regular',sans-serif] font-normal leading-[24px] not-italic relative shrink-0 text-[16px] text-black text-justify w-full">
                  {t(language, "casibioContext6")}
                </p>
              </div>
            </div>
            <div className="content-stretch flex flex-col gap-[20px] items-start relative shrink-0 w-[400px]">
              <div className="bg-gray-50 content-stretch flex flex-col gap-[10px] items-start p-[20px] relative rounded-[4px] shrink-0 w-full">
                <p className="font-['Inter:Bold',sans-serif] font-bold leading-[normal] not-italic relative shrink-0 text-[24px] text-black w-full">
                  {t(language, "fichierLie")}
                </p>
                <div className="h-[200px] relative shrink-0 w-full">
                  <ImageWithFallback
                    src="https://images.unsplash.com/photo-1581093449818-2655b2467fd6?w=400&h=200&fit=crop"
                    alt="file"
                    className="w-full h-full object-cover rounded-[4px]"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    <div className="flex gap-6 p-8 flex-col" >
      {/* Coordination du Projet */}
      <div className="bg-primary content-stretch flex flex-col gap-[20px] items-start px-[50px] py-[40px] relative shrink-0 w-full rounded-xl">
        <div className="flex gap-[20px] items-start w-full">
          <div className="relative size-[30px]" >
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
              <circle cx="12" cy="8" r="4" stroke="white" strokeWidth="2"/>
              <path d="M4 20c0-3.314 3.582-6 8-6s8 2.686 8 6" stroke="white" strokeWidth="2"/>
            </svg>
          </div>
          <div className="flex-1">
            <h2 className="font-['Inter:Bold',sans-serif] font-bold leading-[normal] not-italic text-[24px] text-white mb-[15px]">
              {t(language, "coordinationProjet")}
            </h2>
            <p className="font-['Inter:Bold',sans-serif] font-bold leading-[normal] not-italic text-[16px] text-white mb-[10px]">
              {t(language, "coordinateur")} <span className="font-normal">({t(language, "coordinateurAffiliation")})</span>
            </p>
            <p className="font-['Inter:Regular',sans-serif] font-normal leading-[24px] not-italic text-[16px] text-white">
              {t(language, "coordinateurTexte")}
            </p>
          </div>
        </div>
      </div>

      {/* Partenariat */}
      <div className="bg-primary content-stretch flex flex-col gap-[20px] items-start px-[50px] py-[40px] relative shrink-0 w-full rounded-xl">
        <div className="flex gap-[20px] items-start w-full">
          <div className="relative shrink-0 size-[30px] flex-shrink-0">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
              <path d="M2 8c0-1.1.9-2 2-2h4c1.1 0 2 .9 2 2v4c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V8z" stroke="white" strokeWidth="2"/>
              <path d="M14 8c0-1.1.9-2 2-2h4c1.1 0 2 .9 2 2v4c0 1.1-.9 2-2 2h-4c-1.1 0-2-.9-2-2V8z" stroke="white" strokeWidth="2"/>
              <path d="M2 20c0-1.1.9-2 2-2h4c1.1 0 2 .9 2 2v0c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2v0z" stroke="white" strokeWidth="2"/>
              <path d="M14 20c0-1.1.9-2 2-2h4c1.1 0 2 .9 2 2v0c0 1.1-.9 2-2 2h-4c-1.1 0-2-.9-2-2v0z" stroke="white" strokeWidth="2"/>
            </svg>
          </div>
          <div className="flex-1">
            <h2 className="font-['Inter:Bold',sans-serif] font-bold leading-[normal] not-italic text-[24px] text-white mb-[15px]">
              {t(language, "partenariat")}
            </h2>
            <div className="space-y-[10px]">
              <p className="font-['Inter:Bold',sans-serif] font-bold leading-[normal] not-italic text-[16px] text-white">
                {t(language, "xlim")}
              </p>
              <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic text-[16px] text-white">
                {t(language, "ircer")}
              </p>
              <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic text-[16px] text-white">
                {t(language, "ur4492")}
              </p>
              <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic text-[16px] text-white">
                {t(language, "umbr8181")}
              </p>
            </div>
            <div className="mt-[20px] space-y-[8px]">
              <p className="font-['Inter:Bold',sans-serif] font-bold leading-[normal] not-italic text-[16px] text-white">
                {t(language, "aideANR")}
              </p>
              <p className="font-['Inter:Bold',sans-serif] font-bold leading-[normal] not-italic text-[16px] text-white">
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
