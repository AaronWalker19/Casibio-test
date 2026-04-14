import { useState, useEffect } from "react";
import { Navigation } from "../components/Navigation.tsx";
import { Footer } from "../components/Footer.tsx";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../../contexts/AuthContext.tsx";

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
}

export default function BackMemberPage() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newUser, setNewUser] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [successMessage, setSuccessMessage] = useState("");

  // Vérifier si l'utilisateur est admin au chargement
  useEffect(() => {
    if (!authLoading) {
      if (!user || user.role !== "admin") {
        // Rediriger vers la page articles si pas admin
        navigate("/backoffice/articles");
      } else {
        // Charger les utilisateurs seulement si admin
        fetchUsers();
      }
    }
  }, [user, authLoading, navigate]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("authToken");
      if (!token) {
        setError("Vous n'êtes pas authentifié");
        setLoading(false);
        return;
      }
      const response = await fetch("/api/auth/users", {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        if (response.status === 403) {
          throw new Error("Vous devez avoir les permissions administrateur pour accéder à cette page");
        }
        throw new Error("Erreur lors de la récupération des utilisateurs");
      }
      const data = await response.json();
      setUsers(data);
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors du chargement");
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!newUser.username || !newUser.email || !newUser.password) {
      setError("Tous les champs sont requis");
      return;
    }
    
    if (newUser.username.length < 3) {
      setError("Le nom d'utilisateur doit faire au moins 3 caractères");
      return;
    }
    
    if (newUser.password.length < 8) {
      setError("Le mot de passe doit faire au moins 8 caractères");
      return;
    }

    // Valider l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newUser.email)) {
      setError("Email invalide");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: newUser.username,
          email: newUser.email,
          password: newUser.password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.error || errorData.errors?.[0]?.msg || "Erreur lors de l'ajout de l'utilisateur";
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log("Utilisateur créé:", data);
      
      setNewUser({ username: "", email: "", password: "" });
      setSuccessMessage(`✓ Utilisateur ${data.user.username} créé avec succès en tant que Membre`);
      setError("");
      
      // Masquer le message de succès après 3 secondes
      setTimeout(() => setSuccessMessage(""), 3000);
      
      // Rafraîchir la liste des utilisateurs
      await fetchUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de l'ajout");
      console.error("Error adding user:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id: number) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setError("Vous n'êtes pas authentifié");
        return;
      }
      const response = await fetch(`/api/auth/users/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la suppression de l'utilisateur");
      }

      await fetchUsers();
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de la suppression");
      console.error("Error deleting user:", err);
    }
  };

  const handleRoleChange = async (id: number, newRole: string) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setError("Vous n'êtes pas authentifié");
        return;
      }
      const response = await fetch(`/api/auth/users/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ role: newRole }),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la mise à jour du rôle");
      }

      await fetchUsers();
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de la mise à jour");
      console.error("Error updating role:", err);
    }
  };

  return (
    <div className="bg-white flex flex-col items-center relative size-full">
      <Navigation />
      <div className="relative w-full bg-gray-50">
        <div className="flex flex-col items-center size-full">
          <div className="flex flex-col gap-[40px] items-center p-[50px] relative w-full max-w-[1400px]">
            <div className="flex gap-[40px] items-start w-full">
              <button className="font-['Inter:Bold',sans-serif] font-bold text-[48px] text-black whitespace-nowrap border-b-[4px] border-black pb-[5px]">
                Articles
              </button>
              {user?.role === "admin" && (
                <Link to="/backoffice/membres" className="font-['Inter:Regular',sans-serif] font-normal text-[48px] text-black whitespace-nowrap">
                  Membres
                </Link>
              )}
            </div>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded w-full">
                {error}
              </div>
            )}

            {successMessage && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded w-full">
                {successMessage}
              </div>
            )}

            <div className="bg-white flex flex-col rounded-[8px] shadow-lg w-full overflow-hidden">
              <div className="grid grid-cols-[2fr_1.5fr_1.5fr_1fr_1fr] gap-[20px] bg-gray-50 p-[20px] border-b border-gray-200">
                <p className="font-['Inter:Regular',sans-serif] font-normal text-[20px] text-black">
                  Titre (FR)
                </p>
                <p className="font-['Inter:Regular',sans-serif] font-normal text-[20px] text-black">
                  Titre (EN)
                </p>
                <p className="font-['Inter:Regular',sans-serif] font-normal text-[20px] text-black">
                  Code ANR
                </p>
                <p className="font-['Inter:Regular',sans-serif] font-normal text-[20px] text-black">
                  Date
                </p>
                <p className="font-['Inter:Regular',sans-serif] font-normal text-[20px] text-black">
                  Actions
                </p>
              </div>
              {loading ? (
                <div className="p-[20px] text-center">
                  <p className="font-['Inter:Regular',sans-serif] font-normal text-[16px] text-gray-500">
                    Chargement des projets...
                  </p>
                </div>
              ) : projects.length === 0 ? (
                <div className="p-[20px] text-center">
                  <p className="font-['Inter:Regular',sans-serif] font-normal text-[16px] text-gray-500">
                    Aucun projet trouvé
                  </p>
                </div>
              ) : (
                projects.map((project) => (
                  <div key={project.id} className="grid grid-cols-[2fr_1.5fr_1.5fr_1fr_1fr] gap-[20px] p-[20px] border-b border-gray-200 last:border-b-0 items-center">
                    <div className="truncate">
                      <p className="font-['Inter:Regular',sans-serif] font-normal text-[16px] text-black truncate">
                        {project.title_fr}
                      </p>
                    </div>
                    <div className="truncate">
                      <p className="font-['Inter:Regular',sans-serif] font-normal text-[16px] text-black truncate">
                        {project.title_en}
                      </p>
                    </div>
                    <div className="truncate">
                      <p className="font-['Inter:Regular',sans-serif] font-normal text-[16px] text-gray-600">
                        {project.code_anr || "-"}
                      </p>
                    </div>
                    <div className="truncate">
                      <p className="font-['Inter:Regular',sans-serif] font-normal text-[14px] text-gray-500">
                        {new Date(project.created_at).toLocaleDateString("fr-FR")}
                      </p>
                    </div>
                    <div className="flex gap-[10px]">
                      <button
                        onClick={() => handleDeleteProject(project.id, project.title_fr)}
                        className="bg-error flex items-center justify-center px-[15px] py-[8px] rounded-[4px] hover:bg-error-dark transition-colors"
                      >
                        <p className="font-['Inter:Regular',sans-serif] font-normal text-[14px] text-white whitespace-nowrap">
                          Supprimer
                        </p>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}



