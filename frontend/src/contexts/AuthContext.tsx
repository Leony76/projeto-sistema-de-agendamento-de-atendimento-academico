import { createContext, useState, useEffect, ReactNode, useContext } from "react";
import { UserDTO } from "../types/dtos/userDTO";
import api from "../api";

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
    const loadUser = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await api.get('/users/me', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setUser(response.data);
    } catch (error: any) {
      console.error("Erro no loadUser:", error);
      if (error.response?.status === 401) {
        signOut(); 
      }
    } finally {
      setLoading(false);
    }
  };

    loadUser();
  }, []);

  const signIn = (
    token    : string, 
    userData : UserDTO
  ):void => {
    localStorage.setItem("token", token);
    setUser(userData); 
  }

  const signOut = ():void => {
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