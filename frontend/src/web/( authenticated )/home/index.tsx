import { type UserRole } from '@/types/userRole.type'
import Student from './Student'
import Manager from './Manager'
import Professor from './Professor'
import type React from 'react'

const Home = (): React.JSX.Element | null => {

  const user: {role: UserRole} = { role: 'MANAGER' }
  
  switch (user.role) {
    case 'STUDENT'   : return <Student/>
    case 'PROFESSOR' : return <Professor/>
    case 'MANAGER'   : return <Manager/>
    default          : return null
  }
}

export default Home;