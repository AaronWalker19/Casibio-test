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
      <div className="bg-[#f3f3f5] content-stretch flex items-center gap-[20px] px-[50px] py-[20px] relative shrink-0 w-full">
        <Link to="/membres/articles" className="content-stretch flex gap-[10px] items-center relative shrink-0">
          <div className="relative shrink-0 size-[32px]">
            <svg className="block size-full" fill="none" viewBox="0 0 32 32">
              <path d="M20 26L10 16L20 6" stroke="black" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            </svg>
          </div>
          <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[32px] text-black whitespace-nowrap">
            Retour
          </p>
        </Link>
        <div className="flex-1" />
        <button
          onClick={handleSubmit}
          className="bg-[#137300] content-stretch flex gap-[10px] items-center justify-center px-[20px] py-[10px] relative rounded-[4px] shrink-0"
        >
          <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[24px] text-white whitespace-nowrap">
            Sauvegarder
          </p>
          <div className="relative shrink-0 size-[24px]">
            <svg className="block size-full" fill="none" viewBox="0 0 24 24">
              <path d="M17 3H5C3.89 3 3 3.9 3 5V19C3 20.1 3.89 21 5 21H19C20.1 21 21 20.1 21 19V7L17 3ZM19 19H5V5H16.17L19 7.83V19ZM12 12C10.34 12 9 13.34 9 15C9 16.66 10.34 18 12 18C13.66 18 15 16.66 15 15C15 13.34 13.66 12 12 12ZM6 6H15V10H6V6Z" fill="white" />
            </svg>
          </div>
        </button>
        <button className="bg-[#c9232c] content-stretch flex gap-[10px] items-center justify-center px-[20px] py-[10px] relative rounded-[4px] shrink-0">
          <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[24px] text-white whitespace-nowrap">
            supprimer
          </p>
          <div className="relative shrink-0 size-[24px]">
            <svg className="block size-full" fill="none" viewBox="0 0 24 24">
              <path d="M6 19C6 20.1 6.9 21 8 21H16C17.1 21 18 20.1 18 19V7H6V19ZM8 9H16V19H8V9ZM15.5 4L14.5 3H9.5L8.5 4H5V6H19V4H15.5Z" fill="white" />
            </svg>
          </div>
        </button>
      </div>
      <div className="relative shrink-0 w-full">
        <div className="flex flex-col items-center size-full">
          <div className="content-stretch flex flex-col gap-[40px] items-center p-[50px] relative w-full max-w-[1200px]">
            <form onSubmit={handleSubmit} className="w-full">
              <div className="bg-white content-stretch flex flex-col gap-[30px] p-[40px] relative rounded-[8px] w-full">
                <div aria-hidden="true" className="absolute border-[#f3f3f5] border-2 border-solid inset-0 pointer-events-none rounded-[8px]" />
                <div className="content-stretch flex flex-col gap-[10px] items-start relative shrink-0 w-full">
                  <p className="font-['Inter:Bold',sans-serif] font-bold leading-[normal] not-italic relative shrink-0 text-[32px] text-black w-full">
                    Premiere Information
                  </p>
                  <div className="h-[4px] w-full bg-[#f3f3f5] rounded-full relative">
                    <div className="h-full w-[25%] bg-[#183542] rounded-full" />
                  </div>
                </div>
                <div className="content-stretch flex flex-col gap-[20px] items-start relative shrink-0 w-full">
                  <div className="content-stretch flex flex-col gap-[10px] items-start relative shrink-0 w-full">
                    <label className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[24px] text-black w-full">
                      Code ANR
                    </label>
                    <input
                      type="text"
                      value={formData.codeANR}
                      onChange={(e) => setFormData({ ...formData, codeANR: e.target.value })}
                      placeholder="Code ANR"
                      className="bg-white border-[#f3f3f5] border-2 border-solid content-stretch flex items-center p-[15px] relative rounded-[4px] shrink-0 w-full font-['Inter:Regular',sans-serif] font-normal text-[20px] text-black placeholder:text-[#d9d9d9]"
                    />
                  </div>
                  <div className="content-stretch flex gap-[20px] items-start relative shrink-0 w-full">
                    <div className="content-stretch flex flex-col flex-1 gap-[10px] items-start relative">
                      <label className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[24px] text-black w-full">
                        titre
                      </label>
                      <input
                        type="text"
                        value={formData.titreFr}
                        onChange={(e) => setFormData({ ...formData, titreFr: e.target.value })}
                        placeholder="francais"
                        className="bg-white border-[#f3f3f5] border-2 border-solid content-stretch flex items-center p-[15px] relative rounded-[4px] shrink-0 w-full font-['Inter:Regular',sans-serif] font-normal text-[20px] text-black placeholder:text-[#d9d9d9]"
                      />
                    </div>
                    <div className="content-stretch flex flex-col flex-1 gap-[10px] items-start relative">
                      <label className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[24px] text-transparent w-full">
                        .
                      </label>
                      <input
                        type="text"
                        value={formData.titreEn}
                        onChange={(e) => setFormData({ ...formData, titreEn: e.target.value })}
                        placeholder="English"
                        className="bg-white border-[#f3f3f5] border-2 border-solid content-stretch flex items-center p-[15px] relative rounded-[4px] shrink-0 w-full font-['Inter:Regular',sans-serif] font-normal text-[20px] text-black placeholder:text-[#d9d9d9]"
                      />
                    </div>
                  </div>
                  <div className="content-stretch flex gap-[20px] items-start relative shrink-0 w-full">
                    <div className="content-stretch flex flex-col flex-1 gap-[10px] items-start relative">
                      <label className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[24px] text-black w-full">
                        Resume
                      </label>
                      <textarea
                        value={formData.resumeFr}
                        onChange={(e) => setFormData({ ...formData, resumeFr: e.target.value })}
                        placeholder="francais"
                        rows={6}
                        className="bg-white border-[#f3f3f5] border-2 border-solid content-stretch flex items-start p-[15px] relative rounded-[4px] resize-none shrink-0 w-full font-['Inter:Regular',sans-serif] font-normal text-[20px] text-black placeholder:text-[#d9d9d9]"
                      />
                    </div>
                    <div className="content-stretch flex flex-col flex-1 gap-[10px] items-start relative">
                      <label className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[24px] text-transparent w-full">
                        .
                      </label>
                      <textarea
                        value={formData.resumeEn}
                        onChange={(e) => setFormData({ ...formData, resumeEn: e.target.value })}
                        placeholder="English"
                        rows={6}
                        className="bg-white border-[#f3f3f5] border-2 border-solid content-stretch flex items-start p-[15px] relative rounded-[4px] resize-none shrink-0 w-full font-['Inter:Regular',sans-serif] font-normal text-[20px] text-black placeholder:text-[#d9d9d9]"
                      />
                    </div>
                  </div>
                </div>
                <button
                  type="submit"
                  className="bg-[#183542] content-stretch flex items-center justify-center px-[40px] py-[15px] relative rounded-[4px] shrink-0 w-full"
                >
                  <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[32px] text-white whitespace-nowrap">
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



