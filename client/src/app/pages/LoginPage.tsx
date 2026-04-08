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
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("authToken", data.token);
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
      <div className="flex-1 flex items-center justify-center w-full bg-[#f3f3f5]">
        <div className="bg-white rounded-[4px] shadow-lg p-[50px] w-[500px]">
          <h1 className="font-['Inter:Bold',sans-serif] font-bold text-[48px] text-[#183542] mb-[40px] text-center">
            Connexion
          </h1>
          <form onSubmit={handleLogin} className="flex flex-col gap-[20px]">
            <div className="flex flex-col gap-[10px]">
              <label className="font-['Inter:Bold',sans-serif] font-bold text-[16px] text-[#183542]">
                Nom d'utilisateur
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="border border-[#183542] rounded-[4px] p-[10px] font-['Inter:Regular',sans-serif] text-[16px]"
                required
              />
            </div>
            <div className="flex flex-col gap-[10px]">
              <label className="font-['Inter:Bold',sans-serif] font-bold text-[16px] text-[#183542]">
                Mot de passe
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border border-[#183542] rounded-[4px] p-[10px] font-['Inter:Regular',sans-serif] text-[16px]"
                required
              />
            </div>
            {error && (
              <div className="bg-[#ff4444] text-white p-[10px] rounded-[4px] font-['Inter:Regular',sans-serif] text-[14px]">
                {error}
              </div>
            )}
            <button
              type="submit"
              className="bg-[#183542] text-white font-['Inter:Bold',sans-serif] font-bold text-[16px] p-[15px] rounded-[4px] hover:bg-[#0e1f2a] transition"
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



