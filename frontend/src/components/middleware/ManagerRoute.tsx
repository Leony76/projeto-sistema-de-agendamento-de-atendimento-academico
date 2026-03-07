import React from 'react'
import { useAuth } from '../../contexts/AuthContext';
import { Navigate } from 'react-router-dom';

const ManagerRoute = ({children}:{children:React.ReactNode}) => {

  const { user, loading } = useAuth();

  if (loading) {
    return <p>Carregando sistema...</p>;
  }

  return user?.role === 'MANAGER'
    ? children
    : <Navigate to={'/home'}/>
}

export default ManagerRoute