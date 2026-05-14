import Student from './Student'
import Manager from './Manager'
import Professor from './Professor'
import type React from 'react'
import { useAuth } from '@frontend/hooks/useAuth.hook'
import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useToast } from '@frontend/contexts/ToastContext'

const Home = (): React.JSX.Element | null => {

  const { user } = useAuth();
  const { toast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();
  
  useEffect(() => {
    const successMessage = location.state?.success;

    if (successMessage) {
      toast(successMessage, 'success');

      navigate(location.pathname, {
        replace: true,
        state: {}
      });
    }
  }, []);

  switch (user?.role) {
    case 'STUDENT'   : return <Student/>
    case 'PROFESSOR' : return <Professor/>
    case 'MANAGER'   : return <Manager/>
    default          : return null
  }
}

export default Home;