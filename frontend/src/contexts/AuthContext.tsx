import { createContext, useEffect, useState } from 'react';
import type { AuthUserBasicInfos } from '@shared/types/authUserBasicInfos.type';

type AuthContextType = {
  token           : string | null;
  user            : AuthUserBasicInfos | null;
  isAuthenticated : boolean;
  loading         : boolean;

  login  : ( token : string, user  : AuthUserBasicInfos ) => void;
  logout : () => void;
};

export const AuthContext = createContext({} as AuthContextType);

export const AuthProvider = ({ children }: React.PropsWithChildren) => {

  const [token, setToken] = useState<string | null>(localStorage.getItem('@token'));
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<AuthUserBasicInfos | null>(() => {
    const storedUser = localStorage.getItem('@user');

    return storedUser
      ? JSON.parse(storedUser)
      : null
    ;
  });

  const login = ( token: string, user: AuthUserBasicInfos ): void => {

    localStorage.setItem(
      '@token',
      token
    );

    localStorage.setItem(
      '@user',
      JSON.stringify(user)
    );

    setToken(token);
    setUser(user);
  };

  const logout = (): void => {
    localStorage.removeItem('@token');
    localStorage.removeItem('@user');

    setToken(null);
    setUser(null);
  };

  useEffect(() => {

    const token = localStorage.getItem('@token');
    const user = localStorage.getItem('@user');

    if (token && user) {

      setToken(token);
      setUser(JSON.parse(user));
    }

    setLoading(false);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        loading,
        isAuthenticated: !!token,
        login,
        logout,
      }}
    >
      { children }
    </AuthContext.Provider>
  );
}