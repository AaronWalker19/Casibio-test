import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { useAuth } from "../../contexts/AuthContext.tsx";
import { Navigation } from "../components/Navigation.tsx";
import { Footer } from "../components/Footer.tsx";

export default function ActivateAccountPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuth();
  
  const token = searchParams.get("token");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    username: "",
    name: "",
    password: "",
    passwordConfirm: "",
  });

  // Vérifier le token à l'arrivée sur la page
  useEffect(() => {
    verifyToken();
  }, []);

  const verifyToken = async () => {
    if (!token) {
      setError("Token d'invitation manquant");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`/api/auth/invite/${token}`, {
        headers: {
          "Accept": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Token invalide ou expiré");
      }

      const data = await response.json();
      setEmail(data.email);
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de la vérification du token");
      console.error("Token verification error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = (): boolean => {
    // Vérifier les champs obligatoires
    if (!formData.username || !formData.name || !formData.password || !formData.passwordConfirm) {
      setError("Tous les champs sont requis");
      return false;
    }

    // Vérifier longueur du username
    if (formData.username.length < 3) {
      setError("Le nom d'utilisateur doit faire au moins 3 caractères");
      return false;
    }

    // Vérifier longueur du nom
    if (formData.name.length < 2) {
      setError("Le nom complet doit faire au moins 2 caractères");
      return false;
    }

    // Vérifier longueur du mot de passe
    if (formData.password.length < 8) {
      setError("Le mot de passe doit faire au moins 8 caractères");
      return false;
    }

    // Vérifier que les mots de passe correspondent
    if (formData.password !== formData.passwordConfirm) {
      setError("Les mots de passe ne correspondent pas");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/auth/activate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          username: formData.username,
          name: formData.name,
          password: formData.password,
          passwordConfirm: formData.passwordConfirm,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.error || errorData.errors?.[0]?.msg || "Erreur lors de l'activation";
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log("Account activated:", data);

      // Sauvegarder le token et rediriger
      localStorage.setItem("authToken", data.token);
      setSuccess(true);

      // Attendre 2 secondes puis rediriger
      setTimeout(() => {
        navigate("/backoffice/articles");
        window.location.reload();
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de l'activation");
      console.error("Account activation error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !email) {
    return (
      <div className="bg-white flex flex-col items-center relative size-full">
        <Navigation />
        <div className="flex items-center justify-center w-full h-[70vh]">
          <p className="font-['Inter:Regular',sans-serif] font-normal text-[18px] text-gray-600">
            Vérification du lien d'invitation...
          </p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error && !email) {
    return (
      <div className="bg-white flex flex-col items-center relative size-full">
        <Navigation />
        <div className="flex flex-col items-center justify-center w-full h-[70vh] px-[20px]">
          <div className="max-w-[500px] w-full">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-[20px]">
              {error}
            </div>
            <button
              onClick={() => navigate("/")}
              className="w-full bg-primary flex items-center justify-center px-[40px] py-[12px] rounded-[4px] hover:bg-opacity-90 transition"
            >
              <p className="font-['Inter:Regular',sans-serif] font-normal text-[16px] text-white">
                Retour à l'accueil
              </p>
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (success) {
    return (
      <div className="bg-white flex flex-col items-center relative size-full">
        <Navigation />
        <div className="flex flex-col items-center justify-center w-full h-[70vh]">
          <div className="max-w-[600px] w-full px-[20px]">
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-[20px] text-center">
              <p className="font-['Inter:Regular',sans-serif] font-bold text-[18px]">
                ✓ Compte activé avec succès !
              </p>
              <p className="font-['Inter:Regular',sans-serif] font-normal text-[16px] mt-[10px]">
                Redirection en cours...
              </p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-white flex flex-col items-center relative size-full">
      <Navigation />
      <div className="relative w-full bg-gray-50 flex-1">
        <div className="flex flex-col items-center justify-center h-full p-[40px]">
          <div className="bg-white rounded-[8px] shadow-lg p-[40px] max-w-[600px] w-full">
            <h1 className="font-['Inter:Bold',sans-serif] font-bold text-[32px] text-black mb-[10px]">
              Créer votre compte
            </h1>
            <p className="font-['Inter:Regular',sans-serif] font-normal text-[16px] text-gray-600 mb-[30px]">
              Complétez les informations ci-dessous pour finir votre inscription
            </p>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-[20px]">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-[20px]">
              {/* Email (lecture seule) */}
              <div className="flex flex-col gap-[8px]">
                <label className="font-['Inter:Regular',sans-serif] font-normal text-[14px] text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  disabled
                  className="bg-gray-100 border-gray-300 border border-solid flex items-center p-[12px] rounded-[4px] w-full font-['Inter:Regular',sans-serif] font-normal text-[16px] text-gray-500 cursor-not-allowed"
                />
              </div>

              {/* Nom complet */}
              <div className="flex flex-col gap-[8px]">
                <label className="font-['Inter:Regular',sans-serif] font-normal text-[14px] text-gray-700">
                  Nom complet *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Votre nom complet"
                  className="bg-white border-gray-300 border border-solid flex items-center p-[12px] rounded-[4px] w-full font-['Inter:Regular',sans-serif] font-normal text-[16px] text-black placeholder:text-gray-300"
                />
              </div>

              {/* Username */}
              <div className="flex flex-col gap-[8px]">
                <label className="font-['Inter:Regular',sans-serif] font-normal text-[14px] text-gray-700">
                  Nom d'utilisateur *
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  placeholder="Choisissez un nom d'utilisateur (min 3 caractères)"
                  className="bg-white border-gray-300 border border-solid flex items-center p-[12px] rounded-[4px] w-full font-['Inter:Regular',sans-serif] font-normal text-[16px] text-black placeholder:text-gray-300"
                />
              </div>

              {/* Mot de passe */}
              <div className="flex flex-col gap-[8px]">
                <label className="font-['Inter:Regular',sans-serif] font-normal text-[14px] text-gray-700">
                  Mot de passe *
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Mot de passe (min 8 caractères)"
                  className="bg-white border-gray-300 border border-solid flex items-center p-[12px] rounded-[4px] w-full font-['Inter:Regular',sans-serif] font-normal text-[16px] text-black placeholder:text-gray-300"
                />
              </div>

              {/* Confirmation mot de passe */}
              <div className="flex flex-col gap-[8px]">
                <label className="font-['Inter:Regular',sans-serif] font-normal text-[14px] text-gray-700">
                  Confirmer le mot de passe *
                </label>
                <input
                  type="password"
                  name="passwordConfirm"
                  value={formData.passwordConfirm}
                  onChange={handleInputChange}
                  placeholder="Confirmez votre mot de passe"
                  className="bg-white border-gray-300 border border-solid flex items-center p-[12px] rounded-[4px] w-full font-['Inter:Regular',sans-serif] font-normal text-[16px] text-black placeholder:text-gray-300"
                />
              </div>

              {/* Bouton submit */}
              <button
                type="submit"
                disabled={loading}
                className="bg-primary flex items-center justify-center px-[40px] py-[12px] rounded-[4px] disabled:opacity-50 cursor-pointer hover:bg-opacity-90 transition mt-[20px]"
              >
                <p className="font-['Inter:Regular',sans-serif] font-normal text-[16px] text-white whitespace-nowrap">
                  {loading ? "Activation en cours..." : "Activer mon compte"}
                </p>
              </button>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
