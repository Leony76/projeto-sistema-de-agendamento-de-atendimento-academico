import { createContext, useEffect, useState } from 'react';
import { type AuthUserBasicInfos } from '@shared/types/authUserBasicInfos.type';
import { useToast } from './ToastContext';
import { apiError } from '@frontend/utils/misc/apiError.util';
import { UserService } from '@frontend/services/user.service';

type AuthContextType = {
  token           : string | null;
  user            : AuthUserBasicInfos | null;
  isAuthenticated : boolean;
  loading         : boolean;

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
    
        if (localStorageToken && localStorageUser) {
          setToken(localStorageToken);
          
          const user: AuthUserBasicInfos = JSON.parse(localStorageUser);

          if (!user) throw new Error('Não foi possível carregar seus dados');

          const response = await UserService.me(user.id, user.role); 

          if (response) { setUser(response); return }
          if (user) { setUser(user); return };

          setUser(null);
        }
      } catch(error:unknown) {
        toast(apiError(error), 'error');
      } finally {
        setLoading(false);
      }
    })();
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