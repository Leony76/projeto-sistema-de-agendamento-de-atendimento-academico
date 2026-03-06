import { createContext, useState, useEffect, ReactNode, useContext } from "react";
import { UserDTO } from "../types/dtos/userDTO";

interface AuthContextData {
  user: UserDTO | null;
  loading: boolean;
  signOut: () => void;
}

export const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserDTO | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      const token = localStorage.getItem("@App:token");

      if (token) {
        try {
          const response = await fetch("http://localhost:3000/api/me", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const data = await response.json();
            setUser(data);
          } else {
            localStorage.removeItem("@App:token"); // Token inválido ou expirado
          }
        } catch (error) {
          console.error("Erro ao carregar usuário", error);
        }
      }
      setLoading(false);
    }

    loadUser();
  }, []);

  function signOut() {
    localStorage.removeItem("@App:token");
    setUser(null);
    window.location.href = "/login"; 
  }
  
  return (
    <AuthContext.Provider value={{ user, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);