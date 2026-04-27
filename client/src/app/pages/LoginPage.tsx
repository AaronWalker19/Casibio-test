import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../../contexts/AuthContext.tsx";
import { Navigation } from "../components/Navigation.tsx";
import { Footer } from "../components/Footer.tsx";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        credentials: 'include', // ✅ Envoyer automatiquement les cookies
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        sessionStorage.setItem("authToken", data.token);
        login(data);
        navigate("/backoffice/articles");
      } else {
        const data = await response.json();
        setError(data.message || "Identifiants incorrects");
      }
    } catch (err) {
      setError("Erreur de connexion. Veuillez réessayer.");
    }
  };

  return (
    <div className="bg-white content-stretch flex flex-col items-center relative size-full">
      <Navigation />
      <div className="flex-1 flex items-center justify-center w-full bg-gray-50 px-4 sm:px-6 md:px-8">
        <div className="bg-white rounded-sm shadow-lg p-6 sm:p-8 md:p-12 w-full max-w-xs sm:max-w-sm md:max-w-md">
          <h1 className="font-['Inter:Bold',sans-serif] font-bold text-2xl sm:text-3xl md:text-4xl text-primary mb-6 sm:mb-8 md:mb-10 text-center">
            Connexion
          </h1>
          <form onSubmit={handleLogin} className="flex flex-col gap-4 sm:gap-5 md:gap-6">
            <div className="flex flex-col gap-2 sm:gap-2.5 md:gap-3">
              <label className="font-['Inter:Bold',sans-serif] font-bold text-sm sm:text-base md:text-lg text-primary">
                Nom d'utilisateur ou email
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="border border-primary rounded-sm p-2.5 sm:p-3 md:p-3.5 font-['Inter:Regular',sans-serif] text-sm sm:text-base md:text-base"
                placeholder="Entrez votre username ou email"
                required
              />
            </div>
            <div className="flex flex-col gap-2 sm:gap-2.5 md:gap-3">
              <label className="font-['Inter:Bold',sans-serif] font-bold text-sm sm:text-base md:text-lg text-primary">
                Mot de passe
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border border-primary rounded-sm p-2.5 sm:p-3 md:p-3.5 font-['Inter:Regular',sans-serif] text-sm sm:text-base md:text-base"
                required
              />
            </div>
            {error && (
              <div className="bg-error-accent text-white p-2.5 sm:p-3 md:p-4 rounded-sm font-['Inter:Regular',sans-serif] text-xs sm:text-sm md:text-base">
                {error}
              </div>
            )}
            <button
              type="submit"
              className="bg-primary text-white font-['Inter:Bold',sans-serif] font-bold text-sm sm:text-base md:text-lg p-3 sm:p-4 md:p-4 rounded-sm hover:bg-primary-dark transition"
            >
              Se connecter
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}



