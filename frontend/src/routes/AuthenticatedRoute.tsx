import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@frontend/hooks/useAuth.hook';

export const AuthenticatedRoute = (): React.JSX.Element => {

  const { token, loading } = useAuth();
  const storedToken = localStorage.getItem('@token');

  if (loading) return <p>Loading...</p>;

  if (!token && !storedToken) return <Navigate to="/" />;

  return <Outlet />;
};