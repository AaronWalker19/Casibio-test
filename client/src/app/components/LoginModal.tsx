import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../../contexts/AuthContext.tsx";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

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
        setUsername("");
        setPassword("");
        onClose();
        // Rediriger vers la page back articles après connexion réussie
        setTimeout(() => {
          navigate("/backoffice/articles");
        }, 100);
      } else {
        const data = await response.json();
        setError(data.message || "Identifiants incorrects");
      }
    } catch (err) {
      setError("Erreur de connexion. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      
      <div className="relative bg-primary rounded-[8px] shadow-2xl p-[50px] w-full max-w-[500px] mx-[20px]" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={onClose}
          className="absolute top-[20px] right-[20px] text-white text-[28px] hover:opacity-70 transition"
          aria-label="Fermer"
        >
          ✕
        </button>

        <h1 className="font-['Inter:Bold',sans-serif] font-bold text-[48px] text-white mb-[40px] text-center">
          Se connecter
        </h1>

        <form onSubmit={handleLogin} className="flex flex-col gap-[25px]">
          <div className="flex flex-col gap-[8px]">
            <label className="font-['Inter:Bold',sans-serif] font-bold text-[16px] text-white">
              identifiant
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="bg-gray-100 border-0 rounded-[4px] p-[12px] font-['Inter:Regular',sans-serif] text-[16px] text-black placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-white"
              placeholder=""
              required
              disabled={loading}
            />
          </div>

          <div className="flex flex-col gap-[8px]">
            <label className="font-['Inter:Bold',sans-serif] font-bold text-[16px] text-white">
              mots de passe
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-gray-100 border-0 rounded-[4px] p-[12px] font-['Inter:Regular',sans-serif] text-[16px] text-black placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-white"
              placeholder=""
              required
              disabled={loading}
            />
          </div>

          {error && (
            <div className="bg-error-accent text-white p-[12px] rounded-[4px] font-['Inter:Regular',sans-serif] text-[14px] text-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="bg-white text-primary font-['Inter:Bold',sans-serif] font-bold text-[16px] p-[15px] rounded-[4px] hover:bg-opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? "Connexion en cours..." : "Se connecter"}
          </button>
        </form>
      </div>
    </div>
  );
}
