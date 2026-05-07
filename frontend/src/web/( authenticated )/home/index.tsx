import Student from './Student'
import Manager from './Manager'
import Professor from './Professor'
import type React from 'react'
import { useAuth } from '@frontend/hooks/useAuth.hook'

const Home = (): React.JSX.Element | null => {

  const { user } = useAuth();
  
  switch (user?.role) {
    case 'STUDENT'   : return <Student/>
    case 'PROFESSOR' : return <Professor/>
    case 'MANAGER'   : return <Manager/>
    default          : return null
  }
}

export default Home;