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
  name?: string;
  is_active?: boolean;
  created_at?: string;
}

interface Invitation {
  id?: number;
  email: string;
  invited_by?: number;
  created_at?: string;
  expires_at?: string;
  status: 'pending' | 'activated';
}

export default function BackMemberPage() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("");
  const [showSearchInput, setShowSearchInput] = useState(false);

  // Vérifier si l'utilisateur est admin au chargement
  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        // Rediriger vers la page d'accueil si pas authentifié
        navigate("/");
      } else if (user.role !== "admin") {
        // Rediriger vers la page articles si pas admin
        navigate("/backoffice/articles");
      } else {
        // Charger les utilisateurs et invitations seulement si admin
        fetchUsers();
        fetchInvitations();
      }
    }
  }, [user, authLoading, navigate]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = sessionStorage.getItem("authToken");
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

  const fetchInvitations = async () => {
    try {
      const token = sessionStorage.getItem("authToken");
      if (!token) {
        return;
      }
      const response = await fetch("/api/auth/invitations", {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des invitations");
      }
      const data = await response.json();
      const formattedInvitations: Invitation[] = data.map((inv: any) => ({
        id: inv.id,
        email: inv.email,
        invited_by: inv.invited_by,
        created_at: inv.created_at,
        expires_at: inv.expires_at,
        status: 'pending'
      }));
      setInvitations(formattedInvitations);
    } catch (err) {
      console.error("Error fetching invitations:", err);
    }
  };

  const handleInviteMember = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!inviteEmail) {
      setError("L'email est requis");
      return;
    }
    
    // Valider l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(inviteEmail)) {
      setError("Email invalide");
      return;
    }

    try {
      setLoading(true);
      const token = sessionStorage.getItem("authToken");
      if (!token) {
        setError("Vous n'êtes pas authentifié");
        return;
      }

      const response = await fetch("/api/auth/invite", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          email: inviteEmail,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.error || errorData.errors?.[0]?.msg || "Erreur lors de l'envoi de l'invitation";
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log("Invitation envoyée:", data);
      
      setInviteEmail("");
      setSuccessMessage(`✓ Invitation envoyée à ${data.email}. Le lien d'activation expire dans 48 heures.`);
      setError("");
      
      // Masquer le message de succès après 4 secondes
      setTimeout(() => setSuccessMessage(""), 4000);
      
      // Rafraîchir la liste des utilisateurs et invitations
      await fetchUsers();
      await fetchInvitations();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de l'envoi de l'invitation");
      console.error("Error inviting member:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id: number) => {
    try {
      const token = sessionStorage.getItem("authToken");
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
      setSuccessMessage("✓ Utilisateur supprimé avec succès");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de la suppression");
      console.error("Error deleting user:", err);
    }
  };

  const handleCancelInvitation = async (invitationId: number) => {
    try {
      const token = sessionStorage.getItem("authToken");
      if (!token) {
        setError("Vous n'êtes pas authentifié");
        return;
      }
      const response = await fetch(`/api/auth/invitations/${invitationId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Erreur lors de l'annulation de l'invitation");
      }

      await fetchInvitations();
      setError("");
      setSuccessMessage("✓ Invitation annulée avec succès");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de l'annulation");
      console.error("Error canceling invitation:", err);
    }
  };

  const handleRoleChange = async (id: number, newRole: string) => {
    try {
      const token = sessionStorage.getItem("authToken");
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
      setSuccessMessage("✓ Rôle mis à jour avec succès");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de la mise à jour");
      console.error("Error updating role:", err);
    }
  };

  // Fonction pour filtrer les utilisateurs
  const getFilteredUsers = () => {
    return users.filter((u) => {
      const matchesSearch = searchTerm === "" || 
        (u.username && u.username.toLowerCase().includes(searchTerm.toLowerCase())) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (u.name && u.name.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesFilter = filterRole === "" || u.role === filterRole;
      
      return matchesSearch && matchesFilter;
    });
  };

  // Fonction pour combiner utilisateurs et invitations pour l'affichage
  const getCombinedMembers = () => {
    const combinedList: any[] = [];
    
    // Ajouter les utilisateurs
    getFilteredUsers().forEach((u) => {
      combinedList.push({
        type: 'user',
        id: u.id,
        name: u.name || '-',
        email: u.email,
        username: u.username || '-',
        role: u.role,
        status: 'active'
      });
    });
    
    // Ajouter les invitations (si aucun filtre de rôle ou recherche)
    if (searchTerm === "" || invitations.some(inv => 
      inv.email.toLowerCase().includes(searchTerm.toLowerCase())
    )) {
      if (filterRole === "") {
        invitations.forEach((inv) => {
          combinedList.push({
            type: 'invitation',
            id: `inv-${inv.id}`,
            name: '-',
            email: inv.email,
            username: '-',
            role: '-',
            status: 'pending',
            invitationId: inv.id,
            expiresAt: inv.expires_at
          });
        });
      }
    }
    
    return combinedList;
  };

  return (
    <div className="bg-white flex flex-col items-center relative size-full">
      <Navigation />
      <div className="relative w-full bg-gray-50">
        <div className="flex flex-col items-center size-full">
          <div className="flex flex-col gap-[40px] items-center p-[50px] relative w-full max-w-[1400px]">
            <div className="flex gap-[40px] items-start w-full">
              <Link to="/backoffice/articles" className="font-['Inter:Regular',sans-serif] font-normal text-[48px] text-black whitespace-nowrap">
                Articles
              </Link>
              <button className="font-['Inter:Bold',sans-serif] font-bold text-[48px] text-black whitespace-nowrap border-b-[4px] border-black pb-[5px]">
                Membres
              </button>
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

            {/* Section d'invitation */}
            <div className="bg-white flex flex-col gap-[20px] p-[30px] relative rounded-[8px] shadow-lg w-full">
              <p className="font-['Inter:Regular',sans-serif] font-normal text-[24px] text-black w-full">
                Inviter un nouveau membre
              </p>
              <p className="font-['Inter:Regular',sans-serif] font-normal text-[14px] text-gray-600 w-full">
                Entrez l'email du nouveau membre. Il recevra un lien pour créer son compte avec mot de passe, nom et username.
              </p>
              <form onSubmit={handleInviteMember} className="flex gap-[15px] items-end w-full">
                <div className="flex flex-col flex-1 gap-[5px] items-start relative">
                  <input
                    type="email"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="Email du nouveau membre"
                    className="bg-white border-gray-200 border border-solid flex items-center p-[12px] relative rounded-[4px] shrink-0 w-full font-['Inter:Regular',sans-serif] font-normal text-[16px] text-black placeholder:text-gray-300"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-primary flex items-center justify-center px-[40px] py-[12px] rounded-[4px] disabled:opacity-50 cursor-pointer hover:bg-opacity-90 transition"
                >
                  <p className="font-['Inter:Regular',sans-serif] font-normal text-[16px] text-white whitespace-nowrap">
                    {loading ? "Envoi en cours..." : "Inviter"}
                  </p>
                </button>
              </form>
            </div>

            {/* Section Recherche et Filtre */}
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center justify-end gap-[20px]">
                <button 
                  onClick={() => setShowSearchInput(!showSearchInput)}
                  className="flex gap-[10px] items-center p-[5px] rounded-[4px] border border-black hover:bg-gray-100"
                >
                  <div className="relative size-[32px]">
                    <div className="absolute inset-[12.5%_14.27%_14.27%_12.5%]">
                      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 23.4526 23.4526">
                        <path d="M19.6914 20.9531L13.168 14.4297C12.6758 14.8438 12.1152 15.168 11.4863 15.4023C10.8574 15.6367 10.1895 15.7539 9.48242 15.7539C7.72852 15.7539 6.22852 15.1582 5.04102 13.9668C3.84375 12.7852 3.24023 11.2852 3.24023 9.53125C3.24023 7.77734 3.8418 6.27734 5.04102 5.08594C6.23047 3.88477 7.73047 3.28516 9.48242 3.28516C11.2441 3.28516 12.7441 3.88477 13.9355 5.08594C15.1367 6.27734 15.7363 7.77734 15.7363 9.53125C15.7363 10.2383 15.6191 10.9062 15.3848 11.5352C15.1504 12.1641 14.8262 12.7305 14.4121 13.2227L20.9551 19.7656L19.6914 20.9531ZM9.48242 14.0039C10.7461 14.0039 11.8184 13.5527 12.6895 12.6621C13.5703 11.7617 14.0156 10.6895 14.0156 9.42578C14.0156 8.16211 13.5703 7.08984 12.6895 6.19922C11.8184 5.29883 10.7461 4.84766 9.48242 4.84766C8.20898 4.84766 7.13086 5.29883 6.25977 6.19922C5.37891 7.08984 4.93359 8.16211 4.93359 9.42578C4.93359 10.6895 5.37891 11.7617 6.25977 12.6621C7.13086 13.5527 8.20898 14.0039 9.48242 14.0039Z" fill="black" />
                      </svg>
                    </div>
                  </div>
                </button>
                <select 
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value)}
                  className="flex gap-[10px] items-center px-[10px] rounded-[4px] border border-black cursor-pointer hover:bg-gray-100 h-[42px]"
                >
                  <option value="">Tous les rôles</option>
                  <option value="admin">Admin</option>
                  <option value="member">Membre</option>
                </select>
              </div>
            </div>

            {/* Champ de recherche visible */}
            {showSearchInput && (
              <input
                type="text"
                placeholder="Rechercher par nom d'utilisateur, email ou nom complet..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-[10px] border border-gray-300 rounded-[4px] font-['Inter:Regular',sans-serif]"
              />
            )}

            {/* Table des membres actifs */}
            <div className="bg-white flex flex-col rounded-[8px] shadow-lg w-full overflow-hidden">
              <div className="grid grid-cols-[1fr_2fr_1fr_1fr_1.5fr] gap-[20px] bg-gray-50 p-[20px] border-b border-gray-200">
                <p className="font-['Inter:Regular',sans-serif] font-normal text-[20px] text-black">
                  Nom complet
                </p>
                <p className="font-['Inter:Regular',sans-serif] font-normal text-[20px] text-black">
                  Email
                </p>
                <p className="font-['Inter:Regular',sans-serif] font-normal text-[20px] text-black">
                  Username
                </p>
                <p className="font-['Inter:Regular',sans-serif] font-normal text-[20px] text-black">
                  Rôle / Statut
                </p>
                <p className="font-['Inter:Regular',sans-serif] font-normal text-[20px] text-black">
                  Actions
                </p>
              </div>
              {loading ? (
                <div className="p-[20px] text-center">
                  <p className="font-['Inter:Regular',sans-serif] font-normal text-[16px] text-gray-500">
                    Chargement des membres...
                  </p>
                </div>
              ) : getCombinedMembers().length === 0 ? (
                <div className="p-[20px] text-center">
                  <p className="font-['Inter:Regular',sans-serif] font-normal text-[16px] text-gray-500">
                    Aucun membre trouvé
                  </p>
                </div>
              ) : (
                getCombinedMembers().map((member) => (
                  <div key={member.id} className="grid grid-cols-[1fr_2fr_1fr_1fr_1.5fr] gap-[20px] p-[20px] border-b border-gray-200 last:border-b-0 items-center">
                    <div className="truncate">
                      <p className="font-['Inter:Regular',sans-serif] font-normal text-[16px] text-black truncate">
                        {member.name}
                      </p>
                    </div>
                    <div className="truncate">
                      <p className="font-['Inter:Regular',sans-serif] font-normal text-[16px] text-black truncate">
                        {member.email}
                      </p>
                    </div>
                    <div className="truncate">
                      <p className="font-['Inter:Regular',sans-serif] font-normal text-[16px] text-gray-600 truncate">
                        {member.username}
                      </p>
                    </div>
                    <div>
                      {member.type === 'user' ? (
                        <select 
                          value={member.role}
                          onChange={(e) => handleRoleChange(member.id, e.target.value)}
                          className="p-[8px] border border-gray-300 rounded-[4px] font-['Inter:Regular',sans-serif] text-[14px]"
                        >
                          <option value="admin">Admin</option>
                          <option value="member">Membre</option>
                        </select>
                      ) : (
                        <span className="bg-yellow-100 text-yellow-800 px-[12px] py-[6px] rounded-[4px] text-[14px] font-medium">
                          En cours de validation
                        </span>
                      )}
                    </div>
                    <div className="flex gap-[10px]">
                      {member.type === 'user' ? (
                        <button
                          onClick={() => handleDeleteUser(member.id)}
                          className="bg-error flex items-center justify-center px-[15px] py-[8px] rounded-[4px] hover:bg-red-700 transition-colors"
                        >
                          <p className="font-['Inter:Regular',sans-serif] font-normal text-[14px] text-white whitespace-nowrap">
                            Supprimer
                          </p>
                        </button>
                      ) : (
                        <button
                          onClick={() => handleCancelInvitation(member.invitationId)}
                          className="bg-orange-500 flex items-center justify-center px-[15px] py-[8px] rounded-[4px] hover:bg-orange-600 transition-colors"
                        >
                          <p className="font-['Inter:Regular',sans-serif] font-normal text-[14px] text-white whitespace-nowrap">
                            Annuler
                          </p>
                        </button>
                      )}
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



