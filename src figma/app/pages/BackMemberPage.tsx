import { useState } from "react";
import { Navigation } from "../components/Navigation";
import { Footer } from "../components/Footer";

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
}

const initialUsers: User[] = [
  { id: 1, username: "admin", email: "admin@test.com", role: "Admin" },
  { id: 2, username: "admin", email: "admin@test.com", role: "Admin" },
  { id: 3, username: "admin", email: "admin@test.com", role: "Admin" },
  { id: 4, username: "admin", email: "admin@test.com", role: "Admin" },
  { id: 5, username: "admin", email: "admin@test.com", role: "Admin" },
  { id: 6, username: "admin", email: "admin@test.com", role: "Admin" },
  { id: 7, username: "admin", email: "admin@test.com", role: "Admin" },
];

export default function BackMemberPage() {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [newUser, setNewUser] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (newUser.username && newUser.email && newUser.password) {
      const user: User = {
        id: users.length + 1,
        username: newUser.username,
        email: newUser.email,
        role: "Admin",
      };
      setUsers([...users, user]);
      setNewUser({ username: "", email: "", password: "" });
    }
  };

  const handleDeleteUser = (id: number) => {
    setUsers(users.filter((user) => user.id !== id));
  };

  return (
    <div className="bg-white content-stretch flex flex-col items-center relative size-full">
      <Navigation />
      <div className="relative shrink-0 w-full bg-[#f3f3f5]">
        <div className="flex flex-col items-center size-full">
          <div className="content-stretch flex flex-col gap-[40px] items-center p-[50px] relative w-full max-w-[1400px]">
            <div className="content-stretch flex gap-[40px] items-start relative shrink-0 w-full">
              <button className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[48px] text-black whitespace-nowrap">
                Articles
              </button>
              <button className="font-['Inter:Bold',sans-serif] font-bold leading-[normal] not-italic relative shrink-0 text-[48px] text-black whitespace-nowrap border-b-[4px] border-black pb-[5px]">
                Membres
              </button>
            </div>
            <div className="bg-white content-stretch flex flex-col gap-[20px] p-[30px] relative rounded-[8px] shadow-lg shrink-0 w-full">
              <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[24px] text-black w-full">
                Ajouter un utilisateur
              </p>
              <form onSubmit={handleAddUser} className="content-stretch flex gap-[15px] items-end relative shrink-0 w-full">
                <div className="content-stretch flex flex-col flex-1 gap-[5px] items-start relative">
                  <input
                    type="text"
                    value={newUser.username}
                    onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                    placeholder="Nom user"
                    className="bg-white border-[#e5e5e5] border border-solid content-stretch flex items-center p-[12px] relative rounded-[4px] shrink-0 w-full font-['Inter:Regular',sans-serif] font-normal text-[16px] text-black placeholder:text-[#d9d9d9]"
                  />
                </div>
                <div className="content-stretch flex flex-col flex-1 gap-[5px] items-start relative">
                  <input
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    placeholder="Email"
                    className="bg-white border-[#e5e5e5] border border-solid content-stretch flex items-center p-[12px] relative rounded-[4px] shrink-0 w-full font-['Inter:Regular',sans-serif] font-normal text-[16px] text-black placeholder:text-[#d9d9d9]"
                  />
                </div>
                <div className="content-stretch flex flex-col flex-1 gap-[5px] items-start relative">
                  <input
                    type="password"
                    value={newUser.password}
                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                    placeholder="Mot de passe"
                    className="bg-white border-[#e5e5e5] border border-solid content-stretch flex items-center p-[12px] relative rounded-[4px] shrink-0 w-full font-['Inter:Regular',sans-serif] font-normal text-[16px] text-black placeholder:text-[#d9d9d9]"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-[#183542] content-stretch flex items-center justify-center px-[40px] py-[12px] relative rounded-[4px] shrink-0"
                >
                  <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[16px] text-white whitespace-nowrap">
                    Ajouter
                  </p>
                </button>
              </form>
            </div>
            <div className="bg-white content-stretch flex flex-col relative rounded-[8px] shadow-lg shrink-0 w-full overflow-hidden">
              <div className="grid grid-cols-[2fr_2fr_1.5fr_1fr] gap-[20px] bg-[#f3f3f5] p-[20px] border-b border-[#e5e5e5]">
                <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[20px] text-black">
                  Utilisateur
                </p>
                <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[20px] text-black">
                  Email
                </p>
                <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[20px] text-black">
                  Rôle
                </p>
                <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[20px] text-black">
                  Actions
                </p>
              </div>
              {users.map((user) => (
                <div key={user.id} className="grid grid-cols-[2fr_2fr_1.5fr_1fr] gap-[20px] p-[20px] border-b border-[#e5e5e5] last:border-b-0 items-center">
                  <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[16px] text-black">
                    {user.username}
                  </p>
                  <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[16px] text-black">
                    {user.email}
                  </p>
                  <select
                    value={user.role}
                    onChange={(e) => {
                      const updatedUsers = users.map((u) =>
                        u.id === user.id ? { ...u, role: e.target.value } : u
                      );
                      setUsers(updatedUsers);
                    }}
                    className="bg-white border-[#e5e5e5] border border-solid p-[8px] rounded-[4px] font-['Inter:Regular',sans-serif] font-normal text-[16px] text-black"
                  >
                    <option value="Admin">Admin</option>
                    <option value="Membre">Membre</option>
                    <option value="Lecteur">Lecteur</option>
                  </select>
                  <button
                    onClick={() => handleDeleteUser(user.id)}
                    className="bg-[#c9232c] content-stretch flex items-center justify-center px-[15px] py-[8px] relative rounded-[4px] shrink-0 hover:bg-[#a01f26] transition-colors"
                  >
                    <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[14px] text-white whitespace-nowrap">
                      Supprimer
                    </p>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
