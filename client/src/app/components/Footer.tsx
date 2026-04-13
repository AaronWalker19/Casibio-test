import { ImageWithFallback } from "./figma/ImageWithFallback.tsx";
import { Link } from "react-router";
import { useLanguage } from "../../contexts/LanguageContext.tsx";
import { t } from "../../contexts/translations.tsx";

export function Footer() {
  const { language } = useLanguage();
  return (
    <div className="bg-primary flex flex-col gap-6 sm:gap-8 items-center px-4 sm:px-6 md:px-8 lg:px-12 py-8 sm:py-10 md:py-12 relative shrink-0 w-full" data-name="footer">
      <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 md:gap-12 lg:gap-16 items-center justify-center relative shrink-0 w-full">
        {/* Logo et infos */}
        <div className="flex flex-col gap-3 sm:gap-4 items-center text-center relative shrink-0">
          <div className="h-16 sm:h-20 md:h-24 relative shrink-0 w-20 sm:w-24 md:w-32">
            <ImageWithFallback 
              src="https://images.unsplash.com/photo-1581093449818-2655b2467fd6?w=247&h=159&fit=crop"
              alt="Logo"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex gap-2 sm:gap-3 items-center relative shrink-0">
            <div className="relative shrink-0 size-3 sm:size-4 md:size-5" data-name="akar-icons:circle-fill">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
                <circle cx="16" cy="16" fill="white" r="16" />
              </svg>
            </div>
            <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-xs sm:text-sm md:text-base text-white whitespace-nowrap">
              xlim group
            </p>
          </div>
          <div className="flex gap-2 sm:gap-3 items-center relative shrink-0">
            <div className="relative shrink-0 size-3 sm:size-4 md:size-5" data-name="mdi:location">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
                <path d="M16 2C11.0294 2 7 6.02944 7 11C7 17.5 16 30 16 30C16 30 25 17.5 25 11C25 6.02944 20.9706 2 16 2ZM16 14C14.3431 14 13 12.6569 13 11C13 9.34315 14.3431 8 16 8C17.6569 8 19 9.34315 19 11C19 12.6569 17.6569 14 16 14Z" fill="white" />
              </svg>
            </div>
            <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-xs sm:text-sm md:text-base text-white whitespace-nowrap">
              adresse
            </p>
          </div>
        </div>

        {/* Contact */}
        <div className="flex flex-col gap-2 sm:gap-3 items-center text-center relative shrink-0">
          <p className="font-['Inter:Bold',sans-serif] font-bold leading-[normal] not-italic relative shrink-0 text-sm sm:text-base md:text-lg text-white whitespace-nowrap">
            Contact
          </p>
          <div className="flex gap-2 sm:gap-3 items-center justify-center relative shrink-0">
            <div className="relative shrink-0 size-3 sm:size-4 md:size-5" data-name="ic:baseline-email">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
                <path d="M26.6667 5.33325H5.33333C3.86667 5.33325 2.68 6.53325 2.68 7.99992L2.66667 23.9999C2.66667 25.4666 3.86667 26.6666 5.33333 26.6666H26.6667C28.1333 26.6666 29.3333 25.4666 29.3333 23.9999V7.99992C29.3333 6.53325 28.1333 5.33325 26.6667 5.33325ZM26.6667 10.6666L16 17.3333L5.33333 10.6666V7.99992L16 14.6666L26.6667 7.99992V10.6666Z" fill="white" />
              </svg>
            </div>
            <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-xs sm:text-sm md:text-base text-white whitespace-nowrap">
              mail@mail.com
            </p>
          </div>
          <div className="flex gap-2 sm:gap-3 items-center justify-center relative shrink-0">
            <div className="relative shrink-0 size-3 sm:size-4 md:size-5" data-name="ic:baseline-phone">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
                <path d="M9.62 11.6C10.8533 13.9733 12.5867 16.1467 14.76 18.3067C16.92 20.48 19.0933 22.2133 21.4667 23.4467L23.3733 21.54C23.6133 21.3 23.94 21.2267 24.24 21.32C25.2267 21.6267 26.2933 21.7933 27.4 21.7933C28.14 21.7933 28.74 22.3933 28.74 23.1333V27.3333C28.74 28.0733 28.14 28.6733 27.4 28.6733C15.3133 28.6733 5.4 18.76 5.4 6.67333C5.4 5.93333 6 5.33333 6.74 5.33333H10.9533C11.6933 5.33333 12.2933 5.93333 12.2933 6.67333C12.2933 7.78667 12.46 8.84667 12.7667 9.83333C12.8533 10.1333 12.7867 10.4533 12.54 10.7L10.6333 12.6067L9.62 11.6Z" fill="white" />
              </svg>
            </div>
            <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-xs sm:text-sm md:text-base text-white whitespace-nowrap">
              06 06 06 06 06
            </p>
          </div>
        </div>

        {/* Plan du site */}
        <div className="flex flex-col gap-2 sm:gap-3 items-center text-center relative shrink-0">
          <p className="font-['Inter:Bold',sans-serif] font-bold leading-[normal] not-italic relative shrink-0 text-sm sm:text-base md:text-lg text-white whitespace-nowrap">
            {t(language, "planDuSite")}
          </p>
          <Link 
            to="/plan-du-site"
            className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-xs sm:text-sm md:text-base text-white whitespace-nowrap hover:underline"
          >
            {t(language, "planDuSiteDescription")}
          </Link>
        </div>
      </div>

      {/* Social icons */}
      <div className="flex gap-3 sm:gap-4 md:gap-5 items-center relative shrink-0">
        <div className="relative shrink-0 size-6 sm:size-7 md:size-8 hover:opacity-80 transition cursor-pointer">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 60 60">
            <rect fill="var(--color-gray-300)" height="60" width="60" />
          </svg>
        </div>
        <div className="relative shrink-0 size-6 sm:size-7 md:size-8 hover:opacity-80 transition cursor-pointer">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 60 60">
            <rect fill="var(--color-gray-300)" height="60" width="60" />
          </svg>
        </div>
        <div className="relative shrink-0 size-6 sm:size-7 md:size-8 hover:opacity-80 transition cursor-pointer">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 60 60">
            <rect fill="var(--color-gray-300)" height="60" width="60" />
          </svg>
        </div>
      </div>

      {/* Copyright */}
      <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-xs sm:text-sm text-center text-white whitespace-normal">
        2026-{t(language, "ALL_RIGHTS")}-{t(language, "LEGAL")}-{t(language, "CREATION")}: Maël Valin
      </p>
    </div>
  );
}
