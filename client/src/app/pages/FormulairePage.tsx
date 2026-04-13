import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Navigation } from "../components/Navigation.tsx";
import { Footer } from "../components/Footer.tsx";

export default function FormulairePage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    codeANR: "",
    titreFr: "",
    titreEn: "",
    resumeFr: "",
    resumeEn: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log("Form submitted:", formData);
    // Navigate back to member articles page
    navigate("/membres/articles");
  };

  return (
    <div className="bg-white content-stretch flex flex-col items-center relative size-full">
      <Navigation />
      <div className="bg-gray-50 content-stretch flex items-center gap-3 sm:gap-4 md:gap-5 px-4 sm:px-6 md:px-8 lg:px-12 py-4 sm:py-5 md:py-6 relative shrink-0 w-full flex-wrap">
        <Link to="/membres/articles" className="content-stretch flex gap-2 sm:gap-3 items-center">
          <div className="relative size-6 sm:size-7 md:size-8">
            <svg className="block size-full" fill="none" viewBox="0 0 32 32">
              <path d="M20 26L10 16L20 6" stroke="black" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            </svg>
          </div>
          <p className="font-['Inter:Regular',sans-serif] font-normal text-lg sm:text-xl md:text-2xl text-black whitespace-nowrap">
            Retour
          </p>
        </Link>
        <div className="flex-1" />
        <button
          onClick={handleSubmit}
          className="bg-success content-stretch flex gap-2 sm:gap-3 items-center justify-center px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 md:py-3 rounded-sm"
        >
          <p className="font-['Inter:Regular',sans-serif] font-normal text-sm sm:text-base md:text-lg text-white whitespace-nowrap">
            Sauvegarder
          </p>
          <div className="relative shrink-0 size-4 sm:size-5 md:size-6">
            <svg className="block size-full" fill="none" viewBox="0 0 24 24">
              <path d="M17 3H5C3.89 3 3 3.9 3 5V19C3 20.1 3.89 21 5 21H19C20.1 21 21 20.1 21 19V7L17 3ZM19 19H5V5H16.17L19 7.83V19ZM12 12C10.34 12 9 13.34 9 15C9 16.66 10.34 18 12 18C13.66 18 15 16.66 15 15C15 13.34 13.66 12 12 12ZM6 6H15V10H6V6Z" fill="white" />
            </svg>
          </div>
        </button>
        <button className="bg-error content-stretch flex gap-2 sm:gap-3 items-center justify-center px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 md:py-3 rounded-sm">
          <p className="font-['Inter:Regular',sans-serif] font-normal text-sm sm:text-base md:text-lg text-white whitespace-nowrap">
            supprimer
          </p>
          <div className="relative size-4 sm:size-5 md:size-6">
            <svg className="block size-full" fill="none" viewBox="0 0 24 24">
              <path d="M6 19C6 20.1 6.9 21 8 21H16C17.1 21 18 20.1 18 19V7H6V19ZM8 9H16V19H8V9ZM15.5 4L14.5 3H9.5L8.5 4H5V6H19V4H15.5Z" fill="white" />
            </svg>
          </div>
        </button>
      </div>
      <div className="relative shrink-0 w-full">
        <div className="flex flex-col items-center size-full">
          <div className="content-stretch flex flex-col gap-6 sm:gap-8 md:gap-10 items-center p-4 sm:p-6 md:p-8 lg:p-12 relative w-full max-w-4xl">
            <form onSubmit={handleSubmit} className="w-full">
              <div className="bg-white content-stretch flex flex-col gap-6 sm:gap-8 md:gap-10 p-6 sm:p-8 md:p-10 lg:p-12 relative rounded-lg w-full">
              <div aria-hidden="true" className="absolute border-gray-50 border-2 inset-0 pointer-events-none rounded-lg" />
                <div className="content-stretch flex flex-col gap-2 sm:gap-3 md:gap-4 items-start w-full">
                  <p className="font-['Inter:Bold',sans-serif] font-bold text-lg sm:text-2xl md:text-3xl text-black w-full">
                    Premiere Information
                  </p>
                  <div className="h-1 w-full bg-gray-50 rounded-full relative">
                    <div className="h-full w-[25%] bg-primary rounded-full" />
                  </div>
                </div>
                <div className="content-stretch flex flex-col gap-4 sm:gap-5 md:gap-6 items-start w-full">
                  <div className="content-stretch flex flex-col gap-2 sm:gap-3 md:gap-4 items-start w-full">
                    <label className="font-['Inter:Regular',sans-serif] font-normal text-base sm:text-lg md:text-xl text-black w-full">
                      Code ANR
                    </label>
                    <input
                      type="text"
                      value={formData.codeANR}
                      onChange={(e) => setFormData({ ...formData, codeANR: e.target.value })}
                      placeholder="Code ANR"
                      className="bg-white border-gray-50 border-2 content-stretch flex items-center p-3 sm:p-4 md:p-5 rounded-sm w-full font-['Inter:Regular',sans-serif] font-normal text-sm sm:text-base md:text-lg text-black placeholder:text-gray-300"
                    />
                  </div>
                  <div className="content-stretch flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-6 items-start relative shrink-0 w-full">
                    <div className="content-stretch flex flex-col flex-1 gap-2 sm:gap-3 md:gap-4 items-start relative w-full sm:w-auto">
                      <label className="font-['Inter:Regular',sans-serif] font-normal text-base sm:text-lg md:text-xl text-black w-full">
                        titre
                      </label>
                      <input
                        type="text"
                        value={formData.titreFr}
                        onChange={(e) => setFormData({ ...formData, titreFr: e.target.value })}
                        placeholder="francais"
                        className="bg-white border-gray-50 border-2 content-stretch flex items-center p-3 sm:p-4 md:p-5 rounded-sm w-full font-['Inter:Regular',sans-serif] font-normal text-sm sm:text-base md:text-lg text-black placeholder:text-gray-300"
                      />
                    </div>
                    <div className="content-stretch flex flex-col flex-1 gap-2 sm:gap-3 md:gap-4 items-start relative w-full sm:w-auto">
                      <label className="font-['Inter:Regular',sans-serif] font-normal text-base sm:text-lg md:text-xl text-transparent w-full">
                        .
                      </label>
                      <input
                        type="text"
                        value={formData.titreEn}
                        onChange={(e) => setFormData({ ...formData, titreEn: e.target.value })}
                        placeholder="English"
                        className="bg-white border-gray-50 border-2 content-stretch flex items-center p-3 sm:p-4 md:p-5 rounded-sm w-full font-['Inter:Regular',sans-serif] font-normal text-sm sm:text-base md:text-lg text-black placeholder:text-gray-300"
                      />
                    </div>
                  </div>
                  <div className="content-stretch flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-6 items-start relative shrink-0 w-full">
                    <div className="content-stretch flex flex-col flex-1 gap-2 sm:gap-3 md:gap-4 items-start relative w-full sm:w-auto">
                      <label className="font-['Inter:Regular',sans-serif] font-normal text-base sm:text-lg md:text-xl text-black w-full">
                        Resume
                      </label>
                      <textarea
                        value={formData.resumeFr}
                        onChange={(e) => setFormData({ ...formData, resumeFr: e.target.value })}
                        placeholder="francais"
                        rows={6}
                        className="bg-white border-gray-50 border-2 content-stretch flex items-start p-3 sm:p-4 md:p-5 rounded-sm resize-none w-full font-['Inter:Regular',sans-serif] font-normal text-sm sm:text-base md:text-lg text-black placeholder:text-gray-300"
                      />
                    </div>
                    <div className="content-stretch flex flex-col flex-1 gap-2 sm:gap-3 md:gap-4 items-start relative w-full sm:w-auto">
                      <label className="font-['Inter:Regular',sans-serif] font-normal text-base sm:text-lg md:text-xl text-transparent w-full">
                        .
                      </label>
                      <textarea
                        value={formData.resumeEn}
                        onChange={(e) => setFormData({ ...formData, resumeEn: e.target.value })}
                        placeholder="English"
                        rows={6}
                        className="bg-white border-gray-50 border-2 content-stretch flex items-start p-3 sm:p-4 md:p-5 rounded-sm resize-none w-full font-['Inter:Regular',sans-serif] font-normal text-sm sm:text-base md:text-lg text-black placeholder:text-gray-300"
                      />
                    </div>
                  </div>
                </div>
                <button
                  type="submit"
                  className="bg-primary content-stretch flex items-center justify-center px-6 sm:px-8 md:px-10 py-3 sm:py-4 md:py-5 rounded-sm w-full"
                >
                  <p className="font-['Inter:Regular',sans-serif] font-normal text-base sm:text-lg md:text-xl text-white whitespace-nowrap">
                    suivant
                  </p>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}



