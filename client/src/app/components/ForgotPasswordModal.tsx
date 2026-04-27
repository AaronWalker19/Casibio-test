import { useState } from "react";

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function ForgotPasswordModal({ isOpen, onClose, onSuccess }: ForgotPasswordModalProps) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setSuccess(true);
        setEmail("");
        setTimeout(() => {
          onSuccess?.();
          onClose();
          setSuccess(false);
        }, 3000);
      } else {
        const data = await response.json();
        setError(data.error || "Erreur lors de la demande");
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
      <div className="absolute inset-0 bg-[#00000080]" onClick={onClose} />

      <div
        className="relative bg-primary rounded-[8px] shadow-2xl p-[50px] w-full max-w-[500px] mx-[20px]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-[20px] right-[20px] text-white text-[28px] hover:opacity-70 transition"
          aria-label="Fermer"
        >
          ✕
        </button>

        <h1 className="font-['Inter:Bold',sans-serif] font-bold text-[48px] text-white mb-[40px] text-center">
          Mot de passe oublié
        </h1>

        {success ? (
          <div className="text-center">
            <div className="bg-green-500 text-white p-[15px] rounded-[4px] font-['Inter:Regular',sans-serif] text-[16px] mb-[20px]">
              ✓ Email envoyé avec succès
            </div>
            <p className="font-['Inter:Regular',sans-serif] text-[14px] text-white">
              Veuillez vérifier votre email pour le lien de réinitialisation.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-[25px]">
            <div className="flex flex-col gap-[8px]">
              <label className="font-['Inter:Bold',sans-serif] font-bold text-[16px] text-white">
                Adresse email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-gray-100 border-0 rounded-[4px] p-[12px] font-['Inter:Regular',sans-serif] text-[16px] text-black placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-white"
                placeholder="votre@email.com"
                required
                disabled={loading}
              />
            </div>

            <p className="font-['Inter:Regular',sans-serif] text-[14px] text-gray-200">
              Entrez votre adresse email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
            </p>

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
              {loading ? "Envoi en cours..." : "Envoyer le lien"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
