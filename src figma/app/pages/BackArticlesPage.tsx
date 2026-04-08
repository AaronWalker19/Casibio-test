import { Link } from "react-router";
import { Navigation } from "../components/Navigation";
import { Footer } from "../components/Footer";

export default function BackArticlesPage() {
  return (
    <div className="bg-white content-stretch flex flex-col items-center relative size-full">
      <Navigation />
      <div className="relative shrink-0 w-full bg-[#f3f3f5]">
        <div className="flex flex-col items-center size-full">
          <div className="content-stretch flex flex-col gap-[40px] items-center p-[50px] relative w-full max-w-[1400px]">
            <div className="content-stretch flex gap-[40px] items-start relative shrink-0 w-full">
              <button className="font-['Inter:Bold',sans-serif] font-bold leading-[normal] not-italic relative shrink-0 text-[48px] text-black whitespace-nowrap border-b-[4px] border-black pb-[5px]">
                Articles
              </button>
              <Link to="/backoffice/membres" className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[48px] text-black whitespace-nowrap">
                Membres
              </Link>
            </div>
            <div className="content-stretch flex flex-col gap-[20px] items-center relative shrink-0 w-full">
              <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[32px] text-center text-black w-full">
                Gestion des articles - Redirigez vers la page de gestion des articles membres
              </p>
              <Link
                to="/membres/articles"
                className="bg-[#183542] content-stretch flex gap-[10px] items-center justify-center px-[40px] py-[15px] relative rounded-[4px] shrink-0"
              >
                <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[24px] text-white whitespace-nowrap">
                  Gérer les articles
                </p>
                <div className="relative shrink-0 size-[24px]">
                  <svg className="block size-full" fill="none" viewBox="0 0 24 24">
                    <path clipRule="evenodd" d="M9.17578 5.67578L15.457 11.957C15.6133 12.1133 15.6914 12.3164 15.6914 12.5664C15.6914 12.8164 15.6133 13.0195 15.457 13.1758L9.17578 19.457C8.86328 19.7695 8.39453 19.7695 8.08203 19.457C7.76953 19.1445 7.76953 18.6758 8.08203 18.3633L13.8789 12.5664L8.08203 6.76953C7.76953 6.45703 7.76953 5.98828 8.08203 5.67578C8.39453 5.36328 8.86328 5.36328 9.17578 5.67578Z" fill="white" fillRule="evenodd" />
                  </svg>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
