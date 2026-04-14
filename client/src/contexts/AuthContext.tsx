import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  user: any | null;
  login: (credentials: any) => void;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Vérifier l'authentification au chargement
    // Le cookie sera envoyé automatiquement par le navigateur
    const verifyAuth = async () => {
      try {
        // Essayer d'abord la route /verify
        let response = await fetch('/api/auth/verify', {
          credentials: 'include',
        });
        
        // Si 404, essayer /me comme fallback
        if (response.status === 404) {
          response = await fetch('/api/auth/me', {
            credentials: 'include',
          });
        }

        if (response.ok) {
          const data = await response.json();
          
          // /verify renvoie { valid, user }, /me renvoie { user }
          if (data.valid !== undefined) {
            // Route /verify
            if (data.valid) {
              setIsAuthenticated(true);
              setUser(data.user);
            } else {
              localStorage.removeItem('authToken');
              setIsAuthenticated(false);
            }
          } else if (data.user) {
            // Route /me
            setIsAuthenticated(true);
            setUser(data.user);
          } else {
            setIsAuthenticated(false);
          }
        } else {
          localStorage.removeItem('authToken');
          setIsAuthenticated(false);
        }
      } catch (err) {
        console.error("Erreur vérification auth:", err);
        localStorage.removeItem('authToken');
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    verifyAuth();
  }, []);

  const login = (data: any) => {
    // Mettre à jour l'état avec les données de l'authentification
    if (data.token) {
      // Garder le token en localStorage comme fallback
      localStorage.setItem('authToken', data.token);
      setIsAuthenticated(true);
      setUser(data.user);
    }
  };

  const logout = async () => {
    try {
      // Appeler la route logout pour effacer le cookie et la session
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } catch (err) {
      console.error("Erreur logout:", err);
    } finally {
      localStorage.removeItem('authToken');
      setIsAuthenticated(false);
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
