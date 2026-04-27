import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router";

export function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [validatingToken, setValidatingToken] = useState(true);
  const [email, setEmail] = useState("");

  const token = searchParams.get("token");

  useEffect(() => {
    // Valider le token
    const validateToken = async () => {
      if (!token) {
        setError("Lien invalide ou expiré");
        setValidatingToken(false);
        return;
      }

      try {
        const response = await fetch(`/api/auth/reset-password/${token}`);
        if (response.ok) {
          const data = await response.json();
          setEmail(data.email);
          setValidatingToken(false);
        } else {
          const data = await response.json();
          setError(data.error || "Lien invalide ou expiré");
          setValidatingToken(false);
        }
      } catch (err) {
        setError("Erreur de validation du lien");
        setValidatingToken(false);
      }
    };

    validateToken();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== passwordConfirm) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }

    if (password.length < 8) {
      setError("Le mot de passe doit faire au moins 8 caractères");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          password,
          passwordConfirm,
        }),
      });

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => {
          navigate("/");
        }, 3000);
      } else {
        const data = await response.json();
        setError(data.error || "Erreur lors de la réinitialisation");
      }
    } catch (err) {
      setError("Erreur de connexion. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary to-primary-dark px-4">
      <div className="w-full max-w-[500px] bg-white rounded-[8px] shadow-2xl p-[50px]">
        <h1 className="font-['Inter:Bold',sans-serif] font-bold text-[48px] text-primary mb-[40px] text-center">
          Réinitialiser le mot de passe
        </h1>

        {validatingToken ? (
          <div className="text-center">
            <div className="inline-block animate-spin">
              <div className="text-primary text-[24px]">⏳</div>
            </div>
            <p className="font-['Inter:Regular',sans-serif] text-[16px] text-gray-600 mt-[20px]">
              Vérification du lien...
            </p>
          </div>
        ) : error && !success ? (
          <div className="text-center">
            <div className="bg-red-100 text-red-800 p-[20px] rounded-[4px] font-['Inter:Regular',sans-serif] text-[16px] mb-[20px]">
              {error}
            </div>
            <button
              onClick={() => navigate("/")}
              className="bg-primary text-white font-['Inter:Bold',sans-serif] font-bold text-[16px] p-[15px] rounded-[4px] hover:bg-opacity-90 transition"
            >
              Retour à l'accueil
            </button>
          </div>
        ) : success ? (
          <div className="text-center">
            <div className="bg-green-100 text-green-800 p-[20px] rounded-[4px] font-['Inter:Regular',sans-serif] text-[16px] mb-[20px]">
              ✓ Mot de passe réinitialisé avec succès !
            </div>
            <p className="font-['Inter:Regular',sans-serif] text-[14px] text-gray-600">
              Vous allez être redirigé vers l'accueil...
            </p>
          </div>
        ) : (
          <>
            <p className="font-['Inter:Regular',sans-serif] text-[14px] text-gray-600 mb-[30px] text-center">
              Entrez un nouveau mot de passe pour {email}
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-[25px]">
              <div className="flex flex-col gap-[8px]">
                <label className="font-['Inter:Bold',sans-serif] font-bold text-[16px] text-primary">
                  Nouveau mot de passe
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-gray-100 border-0 rounded-[4px] p-[12px] font-['Inter:Regular',sans-serif] text-[16px] text-black placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Minimum 8 caractères"
                  required
                  disabled={loading}
                />
              </div>

              <div className="flex flex-col gap-[8px]">
                <label className="font-['Inter:Bold',sans-serif] font-bold text-[16px] text-primary">
                  Confirmer le mot de passe
                </label>
                <input
                  type="password"
                  value={passwordConfirm}
                  onChange={(e) => setPasswordConfirm(e.target.value)}
                  className="bg-gray-100 border-0 rounded-[4px] p-[12px] font-['Inter:Regular',sans-serif] text-[16px] text-black placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Confirmez votre nouveau mot de passe"
                  required
                  disabled={loading}
                />
              </div>

              {error && (
                <div className="bg-red-100 text-red-800 p-[12px] rounded-[4px] font-['Inter:Regular',sans-serif] text-[14px] text-center">
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="bg-primary text-white font-['Inter:Bold',sans-serif] font-bold text-[16px] p-[15px] rounded-[4px] hover:bg-opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? "Réinitialisation en cours..." : "Réinitialiser le mot de passe"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
