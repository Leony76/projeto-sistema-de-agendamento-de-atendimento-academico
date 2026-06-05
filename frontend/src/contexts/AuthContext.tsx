import { createContext, useEffect, useMemo, useState } from 'react';
import { type AuthUserBasicInfos } from '@shared/types/authUserBasicInfos.type';
import { useToast } from './ToastContext';
import { apiError } from '@frontend/utils/misc/apiError.util';
import { UserService } from '@frontend/services/user.service';

type AuthContextType = {
  token           : string | null;
  user            : AuthUserBasicInfos | null;
  isAuthenticated : boolean;
  loading         : boolean;
  updateUser      : (user: AuthUserBasicInfos) => void;
  login  : ( token : string, user : AuthUserBasicInfos ) => void;
  logout : () => void;
};

export const AuthContext = createContext({} as AuthContextType);

export const AuthProvider = ({ children }: React.PropsWithChildren) => {

  const { toast } = useToast();

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

  const updateUser = (updatedUser: AuthUserBasicInfos): void => {

    localStorage.setItem(
      '@user',
      JSON.stringify(updatedUser)
    );

    setUser(updatedUser);
  };

  const logout = (): void => {
    localStorage.removeItem('@token');
    localStorage.removeItem('@user');

    setToken(null);
    setUser(null);
  };

  useEffect(() => {
    (async() => {
      try {
        const localStorageToken = localStorage.getItem('@token');
        const localStorageUser = localStorage.getItem('@user');

        if (!localStorageToken || !localStorageUser) {
          logout();
          return;
        }

        const parsedUser: AuthUserBasicInfos = JSON.parse(localStorageUser);

        const response = await UserService.me();

        setUser(response ?? parsedUser);
      } catch (error: unknown) {
        logout();
        toast(apiError(error), 'error');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const value = useMemo(() => ({
    token,
    user,
    loading,
    isAuthenticated: !!token && !!user,
    login,
    logout,
    updateUser,
  }), [token, user, loading]);

  return (
    <AuthContext.Provider value={value}>
      { children }
    </AuthContext.Provider>
  );
}