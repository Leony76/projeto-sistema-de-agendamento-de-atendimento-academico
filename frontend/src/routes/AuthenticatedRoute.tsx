import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@frontend/hooks/useAuth.hook';
import Loading from '@frontend/components/misc/Loading';

export const AuthenticatedRoute = (): React.JSX.Element => {

  const { token, loading } = useAuth();
  const storedToken = localStorage.getItem('@token');

  if (loading) return (
    <div className='flex flex-col gap-1 justify-center items-center h-screen w-screen'>
      <Loading 
        size={36}
        className='text-orange-500'
      />

      <p className='text-orange-300 animate-pulse'> Carregando... </p>
    </div>
  );

  if (!token && !storedToken) return <Navigate to="/" />;

  return <Outlet />;
};