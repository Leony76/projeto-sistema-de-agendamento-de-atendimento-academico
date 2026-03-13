import { createContext, useState, useEffect, ReactNode, useContext } from "react";
import { UserDTO } from "../types/dtos/userDTO";

interface AuthContextData {
  user: UserDTO | null;
  loading: boolean;
  signOut: () => void;
  signIn: (
    token: string,
    userData: UserDTO,
  ) => void; 
}

export const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }:{ children: React.ReactNode }) {

  const [user, setUser] = useState<UserDTO | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async() => {
      const token = localStorage.getItem("token");
      const baseURL = import.meta.env.VITE_BACKEND_BASE_URL;

      if (token) {
        try {
          const response = await fetch(`${baseURL}/api/users/me`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const data = await response.json();
            setUser(data);
          } else {
            localStorage.removeItem("token"); 
          }
        } catch (error) {
          console.error("Erro ao carregar usuário", error);
        }
      }
      setLoading(false);
    }

    loadUser();
  }, []);

  const signIn = (token: string, userData: UserDTO) => {
    localStorage.setItem("token", token);
    setUser(userData); 
  }

  const signOut = () => {
    localStorage.removeItem("token");
    setUser(null);
    window.location.href = "/login"; 
  }
  
  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      signOut, 
      signIn 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);