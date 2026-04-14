import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Navigation } from "../components/Navigation.tsx";
import { Footer } from "../components/Footer.tsx";
import { useAuth } from "../../contexts/AuthContext.tsx";

export default function FormulairePage() {
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    titreFr: "",
    titreEn: "",
    resumeFr: "",
    resumeEn: "",
    methodsFr: "",
    methodsEn: "",
    resultsFr: "",
    resultsEn: "",
    perspectivesFr: "",
    perspectivesEn: "",
  });

  // Afficher un message de chargement pendant la vérification de l'authentification
  if (loading) {
    return (
      <div className="bg-white content-stretch flex flex-col items-center relative size-full">
        <Navigation />
        <div className="flex-1 flex items-center justify-center w-full">
          <p className="text-lg text-gray-500">Vérification de l'authentification...</p>
        </div>
        <Footer />
      </div>
    );
  }

  // Si l'utilisateur n'est pas authentifié, afficher un message
  if (!isAuthenticated) {
    return (
      <div className="bg-white content-stretch flex flex-col items-center relative size-full">
        <Navigation />
        <div className="flex-1 flex items-center justify-center w-full bg-gray-50">
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <p className="text-lg mb-4">Vous devez être connecté pour créer un projet</p>
            <button
              onClick={() => navigate("/")}
              className="bg-primary text-white px-6 py-2 rounded"
            >
              Retour à l'accueil
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
  
  const steps = [
    { number: 1, title: "Titre et Résumé", key: "titleResume" },
    { number: 2, title: "Méthodes", key: "methods" },
    { number: 3, title: "Résultats", key: "results" },
    { number: 4, title: "Perspectives", key: "perspectives" },
  ];

  const validateStep = (step: number): boolean => {
    if (step === 1) {
      // Titre et résumé obligatoires
      if (!formData.titreFr.trim() || !formData.titreEn.trim() || 
          !formData.resumeFr.trim() || !formData.resumeEn.trim()) {
        setError("Le titre et le résumé sont obligatoires (FR et EN)");
        return false;
      }
    }
    setError("");
    return true;
  };

  // ✅ Vérifier si les champs obligatoires (étape 1) sont remplis
  const canSubmit = () => {
    return (
      formData.titreFr.trim() &&
      formData.titreEn.trim() &&
      formData.resumeFr.trim() &&
      formData.resumeEn.trim() &&
      !formLoading
    );
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < steps.length) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // ✅ Vérifier les champs obligatoires avant de soumettre
    if (!validateStep(1)) return;

    setFormLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      console.log("Token trouvé:", token ? "OUI" : "NON");
      console.log("isAuthenticated:", isAuthenticated);
      
      if (!token) {
        setError("Token d'authentification manquant. Reconnectez-vous SVP.");
        setFormLoading(false);
        return;
      }

      const response = await fetch("/api/projects", {
        method: "POST",
        credentials: 'include', // ✅ Envoyer automatiquement les cookies
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          title_fr: formData.titreFr,
          title_en: formData.titreEn,
          summary_fr: formData.resumeFr,
          summary_en: formData.resumeEn,
          methods_fr: formData.methodsFr,
          methods_en: formData.methodsEn,
          results_fr: formData.resultsFr,
          results_en: formData.resultsEn,
          perspectives_fr: formData.perspectivesFr,
          perspectives_en: formData.perspectivesEn,
        }),
      });

      console.log("Réponse status:", response.status);
      
      const responseData = await response.json();
      console.log("Réponse data:", responseData);

      if (!response.ok) {
        throw new Error(responseData.error || JSON.stringify(responseData.errors) || "Erreur lors de la sauvegarde");
      }

      navigate("/membres/articles");
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Erreur inconnue";
      console.error("Erreur complète:", errorMsg);
      setError("Erreur: " + errorMsg);
    } finally {
      setFormLoading(false);
    }
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
          type="button"
          disabled={!canSubmit()}
          onClick={() => {
            if (canSubmit()) {
              const form = document.querySelector('form');
              form?.requestSubmit();
            }
          }}
          className={`content-stretch flex gap-2 sm:gap-3 items-center justify-center px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 md:py-3 rounded-sm ${
            !canSubmit() ? "bg-gray-400 cursor-not-allowed opacity-50" : "bg-success"
          }`}
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
        <button 
          type="button"
          onClick={() => navigate("/membres/articles")}
          className="bg-gray-50 border-2 border-gray-200 content-stretch flex gap-2 sm:gap-3 items-center justify-center px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 md:py-3 rounded-sm hover:bg-gray-100"
        >
          <p className="font-['Inter:Regular',sans-serif] font-normal text-sm sm:text-base md:text-lg text-black whitespace-nowrap">
            Annuler
          </p>
          <div className="relative size-4 sm:size-5 md:size-6">
            <svg className="block size-full" fill="none" viewBox="0 0 24 24">
              <path d="M19 6.4L17.6 5L12 10.6L6.4 5L5 6.4L10.6 12L5 17.6L6.4 19L12 13.4L17.6 19L19 17.6L13.4 12L19 6.4Z" fill="black" />
            </svg>
          </div>
        </button>
      </div>
      <div className="relative shrink-0 w-full">
        <div className="flex flex-col items-center size-full">
          <div className="content-stretch flex flex-col gap-6 sm:gap-8 md:gap-10 items-center p-4 sm:p-6 md:p-8 lg:p-12 relative w-full max-w-4xl">
            <form 
              onSubmit={handleSubmit}
              onKeyDown={(e) => {
                // ✅ Empêcher le submit accidentel si on appuie sur Entrée en dehors du bouton "Terminer"
                if (e.key === "Enter" && !(e.target as HTMLElement).classList.contains("submit-button")) {
                  if (currentStep !== steps.length) {
                    e.preventDefault();
                  }
                }
              }}
              className="w-full">
              <div className="bg-white content-stretch flex flex-col gap-6 sm:gap-8 md:gap-10 p-6 sm:p-8 md:p-10 lg:p-12 relative rounded-lg w-full">
                <div aria-hidden="true" className="absolute border-gray-50 border-2 inset-0 pointer-events-none rounded-lg" />
                
                {/* Progress Header */}
                <div className="content-stretch flex flex-col gap-2 sm:gap-3 md:gap-4 items-start w-full">
                  <p className="font-['Inter:Bold',sans-serif] font-bold text-lg sm:text-2xl md:text-3xl text-black w-full">
                    {steps[currentStep - 1].title}
                  </p>
                  <div className="h-1 w-full bg-gray-50 rounded-full relative">
                    <div 
                      className="h-full bg-primary rounded-full transition-all duration-300"
                      style={{ width: `${(currentStep / steps.length) * 100}%` }}
                    />
                  </div>
                  <p className="text-sm text-gray-500">Étape {currentStep} sur {steps.length}</p>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="bg-red-50 border-2 border-red-200 p-3 sm:p-4 md:p-5 rounded-sm w-full">
                    <p className="text-red-600 font-normal text-sm sm:text-base">{error}</p>
                  </div>
                )}

                {/* Step 1: Titre et Résumé */}
                {currentStep === 1 && (
                  <div className="content-stretch flex flex-col gap-4 sm:gap-5 md:gap-6 items-start w-full">
                    <div className="content-stretch flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-6 items-start relative shrink-0 w-full">
                      <div className="content-stretch flex flex-col flex-1 gap-2 sm:gap-3 md:gap-4 items-start relative w-full sm:w-auto">
                        <label className="font-['Inter:Regular',sans-serif] font-normal text-base sm:text-lg md:text-xl text-black w-full">
                          Titre <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={formData.titreFr}
                          onChange={(e) => setFormData({ ...formData, titreFr: e.target.value })}
                          placeholder="Français"
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
                          Résumé <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          value={formData.resumeFr}
                          onChange={(e) => setFormData({ ...formData, resumeFr: e.target.value })}
                          placeholder="Français"
                          rows={6}
                          className="bg-white border-gray-50 border-2 content-stretch flex items-start p-3 sm:p-4 md:p-5 rounded-sm resize-vertical w-full font-['Inter:Regular',sans-serif] font-normal text-sm sm:text-base md:text-lg text-black placeholder:text-gray-300"
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
                          className="bg-white border-gray-50 border-2 content-stretch flex items-start p-3 sm:p-4 md:p-5 rounded-sm resize-vertical w-full font-['Inter:Regular',sans-serif] font-normal text-sm sm:text-base md:text-lg text-black placeholder:text-gray-300"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2: Méthodes */}
                {currentStep === 2 && (
                  <div className="content-stretch flex flex-col gap-4 sm:gap-5 md:gap-6 items-start w-full">
                    <div className="content-stretch flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-6 items-start relative shrink-0 w-full">
                      <div className="content-stretch flex flex-col flex-1 gap-2 sm:gap-3 md:gap-4 items-start relative w-full sm:w-auto">
                        <label className="font-['Inter:Regular',sans-serif] font-normal text-base sm:text-lg md:text-xl text-black w-full">
                          Méthodes
                        </label>
                        <textarea
                          value={formData.methodsFr}
                          onChange={(e) => setFormData({ ...formData, methodsFr: e.target.value })}
                          placeholder="Français"
                          rows={6}
                          className="bg-white border-gray-50 border-2 content-stretch flex items-start p-3 sm:p-4 md:p-5 rounded-sm resize-vertical w-full font-['Inter:Regular',sans-serif] font-normal text-sm sm:text-base md:text-lg text-black placeholder:text-gray-300"
                        />
                      </div>
                      <div className="content-stretch flex flex-col flex-1 gap-2 sm:gap-3 md:gap-4 items-start relative w-full sm:w-auto">
                        <label className="font-['Inter:Regular',sans-serif] font-normal text-base sm:text-lg md:text-xl text-transparent w-full">
                          .
                        </label>
                        <textarea
                          value={formData.methodsEn}
                          onChange={(e) => setFormData({ ...formData, methodsEn: e.target.value })}
                          placeholder="English"
                          rows={6}
                          className="bg-white border-gray-50 border-2 content-stretch flex items-start p-3 sm:p-4 md:p-5 rounded-sm resize-vertical w-full font-['Inter:Regular',sans-serif] font-normal text-sm sm:text-base md:text-lg text-black placeholder:text-gray-300"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3: Résultats */}
                {currentStep === 3 && (
                  <div className="content-stretch flex flex-col gap-4 sm:gap-5 md:gap-6 items-start w-full">
                    <div className="content-stretch flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-6 items-start relative shrink-0 w-full">
                      <div className="content-stretch flex flex-col flex-1 gap-2 sm:gap-3 md:gap-4 items-start relative w-full sm:w-auto">
                        <label className="font-['Inter:Regular',sans-serif] font-normal text-base sm:text-lg md:text-xl text-black w-full">
                          Résultats
                        </label>
                        <textarea
                          value={formData.resultsFr}
                          onChange={(e) => setFormData({ ...formData, resultsFr: e.target.value })}
                          placeholder="Français"
                          rows={6}
                          className="bg-white border-gray-50 border-2 content-stretch flex items-start p-3 sm:p-4 md:p-5 rounded-sm resize-vertical w-full font-['Inter:Regular',sans-serif] font-normal text-sm sm:text-base md:text-lg text-black placeholder:text-gray-300"
                        />
                      </div>
                      <div className="content-stretch flex flex-col flex-1 gap-2 sm:gap-3 md:gap-4 items-start relative w-full sm:w-auto">
                        <label className="font-['Inter:Regular',sans-serif] font-normal text-base sm:text-lg md:text-xl text-transparent w-full">
                          .
                        </label>
                        <textarea
                          value={formData.resultsEn}
                          onChange={(e) => setFormData({ ...formData, resultsEn: e.target.value })}
                          placeholder="English"
                          rows={6}
                          className="bg-white border-gray-50 border-2 content-stretch flex items-start p-3 sm:p-4 md:p-5 rounded-sm resize-vertical w-full font-['Inter:Regular',sans-serif] font-normal text-sm sm:text-base md:text-lg text-black placeholder:text-gray-300"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 4: Perspectives */}
                {currentStep === 4 && (
                  <div className="content-stretch flex flex-col gap-4 sm:gap-5 md:gap-6 items-start w-full">
                    <div className="content-stretch flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-6 items-start relative shrink-0 w-full">
                      <div className="content-stretch flex flex-col flex-1 gap-2 sm:gap-3 md:gap-4 items-start relative w-full sm:w-auto">
                        <label className="font-['Inter:Regular',sans-serif] font-normal text-base sm:text-lg md:text-xl text-black w-full">
                          Perspectives
                        </label>
                        <textarea
                          value={formData.perspectivesFr}
                          onChange={(e) => setFormData({ ...formData, perspectivesFr: e.target.value })}
                          placeholder="Français"
                          rows={6}
                          className="bg-white border-gray-50 border-2 content-stretch flex items-start p-3 sm:p-4 md:p-5 rounded-sm resize-vertical w-full font-['Inter:Regular',sans-serif] font-normal text-sm sm:text-base md:text-lg text-black placeholder:text-gray-300"
                        />
                      </div>
                      <div className="content-stretch flex flex-col flex-1 gap-2 sm:gap-3 md:gap-4 items-start relative w-full sm:w-auto">
                        <label className="font-['Inter:Regular',sans-serif] font-normal text-base sm:text-lg md:text-xl text-transparent w-full">
                          .
                        </label>
                        <textarea
                          value={formData.perspectivesEn}
                          onChange={(e) => setFormData({ ...formData, perspectivesEn: e.target.value })}
                          placeholder="English"
                          rows={6}
                          className="bg-white border-gray-50 border-2 content-stretch flex items-start p-3 sm:p-4 md:p-5 rounded-sm resize-vertical w-full font-['Inter:Regular',sans-serif] font-normal text-sm sm:text-base md:text-lg text-black placeholder:text-gray-300"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="content-stretch flex gap-3 sm:gap-4 md:gap-6 items-center w-full">
                  <button
                    type="button"
                    onClick={handlePrevious}
                    disabled={currentStep === 1}
                    className={`content-stretch flex items-center justify-center px-6 sm:px-8 md:px-10 py-3 sm:py-4 md:py-5 rounded-sm flex-1 ${
                      currentStep === 1
                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                        : "bg-gray-50 border-2 border-gray-200 text-black hover:bg-gray-100"
                    }`}
                  >
                    <p className="font-['Inter:Regular',sans-serif] font-normal text-base sm:text-lg md:text-xl whitespace-nowrap">
                      Précédent
                    </p>
                  </button>
                  {currentStep < steps.length && (
                    <button
                      type="button"
                      onClick={handleNext}
                      disabled={formLoading}
                      className="bg-primary content-stretch flex items-center justify-center px-6 sm:px-8 md:px-10 py-3 sm:py-4 md:py-5 rounded-sm flex-1 hover:opacity-90"
                    >
                      <p className="font-['Inter:Regular',sans-serif] font-normal text-base sm:text-lg md:text-xl text-white whitespace-nowrap">
                        Suivant
                      </p>
                    </button>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}



