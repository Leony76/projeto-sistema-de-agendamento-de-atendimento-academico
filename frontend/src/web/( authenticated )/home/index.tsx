import { type UserRole } from '@shared/types/userRole.type'
import Student from './Student'
import Manager from './Manager'
import Professor from './Professor'
import type React from 'react'
import { LOGGED_USER_DATA } from '@frontend/constants/mocks/loggedUserData.mock'

const Home = (): React.JSX.Element | null => {

  const user: {role: UserRole} = { role: LOGGED_USER_DATA.role }
  
  switch (user.role) {
    case 'STUDENT'   : return <Student/>
    case 'PROFESSOR' : return <Professor/>
    case 'MANAGER'   : return <Manager/>
    default          : return null
  }
}

export default Home;