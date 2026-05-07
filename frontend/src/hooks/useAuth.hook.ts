import { useContext } from 'react';
import { AuthContext } from '@frontend/contexts/AuthContext';

export const useAuth = () => useContext(AuthContext);
