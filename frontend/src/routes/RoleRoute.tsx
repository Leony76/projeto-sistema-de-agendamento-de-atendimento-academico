import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@frontend/hooks/useAuth.hook';
import type { UserRole } from '@shared/types/userRole.type';

type Props = { allowedRoles: UserRole[] };

export const RoleRoute = ({ allowedRoles }: Props): React.JSX.Element => {

  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/" />;
  }

  const hasPermission = allowedRoles.includes(user.role);

  if (!hasPermission) {
    return <Navigate to="/home" />;
  }

  return <Outlet />;
};