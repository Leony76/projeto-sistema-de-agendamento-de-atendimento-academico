import type { UserRole } from '@shared/types/userRole.type';
import React, { useState, type JSX } from 'react'
import { AiFillSchedule } from 'react-icons/ai';
import { BiLogOut } from 'react-icons/bi';
import { FaExclamation, FaHistory } from 'react-icons/fa';
import { IoHome } from 'react-icons/io5';
import { Link, Navigate } from 'react-router-dom';
import { LOGGED_USER_DATA } from '@frontend/constants/mocks/loggedUserData.mock';
import ExpansibleImage from '@frontend/components/misc/ExpansibleImage';
import { useAuth } from '@frontend/hooks/useAuth.hook';
import { Modal } from '@frontend/components/modal';

type SystemTabs = 'HOME' | 'REQUESTS' | 'TO_SCHEDULE' | 'HISTORY';
type AsideTab = {
  id    : SystemTabs; 
  name  : string;
  icon  : JSX.Element;
  route : string;
};

type Props = {
  children    : React.ReactNode;
  selectedTab : SystemTabs;
  from        : UserRole;
};

const Layout = (props:Props): React.JSX.Element => {

  const { user, logout } = useAuth();
  const [ logoutConfirm, setLogoutConfirm ] = useState<boolean>(false);

  const ASIDE_TABS_RENDER: Record<UserRole, AsideTab[]> = {
    STUDENT: [
      { id: 'HOME'        , name: 'Início'       , icon: <IoHome />         , route: '/home' },
      { id: 'TO_SCHEDULE' , name: 'Agendar'      , icon: <AiFillSchedule /> , route: '/schedule' },
      { id: 'REQUESTS'    , name: 'Solicitações' , icon: <FaExclamation />  , route: '/solicitations' },
      { id: 'HISTORY'     , name: 'Histórico'    , icon: <FaHistory />      , route: '/history' },
    ],
    PROFESSOR: [
      { id: 'HOME'        , name: 'Início'       , icon: <IoHome />         , route: '/home' },
      { id: 'REQUESTS'    , name: 'Solicitações' , icon: <FaExclamation />  , route: '/solicitations' },
      { id: 'HISTORY'     , name: 'Histórico'    , icon: <FaHistory />      , route: '/history' },
    ],
    MANAGER: [
      { id: 'HOME'        , name: 'Início'       , icon: <IoHome />         , route: '/home' },
    ],
  };

  const formatter = new Intl.ListFormat('pt-BR', { style: 'long', type: 'conjunction' });

  const HEADER_INFOS_FOR_ROLE_CONFIG: Record<UserRole, {
    label: string;
    secondaryLabel?: string;
    secondaryLabelValue?: string | string[];
  }> = {
    STUDENT: {
      label: 'Aluno:',
      secondaryLabel: 'RA:',
      secondaryLabelValue: user?.role === 'STUDENT' ? user.ra : '',
    },
    PROFESSOR: {
      label: 'Professor:',
      secondaryLabel: 'Disciplina(s):',
      secondaryLabelValue: user?.role === 'PROFESSOR' ? formatter.format(user.disciplines?.map((discipline) => discipline)) : [],
    },
    MANAGER: {
      label: 'Gestor:',
    },
  } as const;

  const config = HEADER_INFOS_FOR_ROLE_CONFIG[props.from];
  
  if (!user) return <Navigate to={'/'}/>

  const profilePhoto = (user.photo === '' || user.photo === null)
    ? 'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original'
    : user?.photo
  ;

  console.log(user?.photo)

  return (
    <div className='flex flex-col h-screen'>

      <Modal.ConfirmAction
        title='Sair do sistema'
        message='Tem certeza em sair do sistema?'
        onAccept={logout}
        onCloseRequest={() => setLogoutConfirm(false)}
        visible={logoutConfirm}
      />

      <header className='flex justify-between items-center bg-cyan-100/50 py-2 px-3 border-b border-b-cyan-300'>
        <h3 className='text-cyan-600 text-lg font-semibold'>
          Sistema de Agendamento Acadêmico Online
        </h3>

        <div className='flex items-center gap-5'>
          <span className='font-semibold text-orange-400'>
            { config.label } {''} 

            <span className='text-cyan-400 font-normal'>
              { user?.name }
            </span>
          </span>

          { config.secondaryLabel &&
            <>
              <div className='w-px h-7 bg-cyan-300 rounded-4xl'/>

              <span className='font-semibold text-orange-400'>
                { config.secondaryLabel } {''}

                <span className='text-cyan-400 font-normal'>
                  { config.secondaryLabelValue }
                </span>
              </span>
            </>
          }

          <ExpansibleImage
            imagePaddingDisabled
            image={{
              name : user?.name,
              uri  : profilePhoto,
              size : 'w-8 h-8',
            }}
          />
        </div>
      </header>

      <div className='flex-1 grid grid-cols-[175px_1fr] min-h-0'>
        <aside className='flex flex-col py-5 border-r border-gray-200 bg-linear-to-b from-cyan-100/50 to-orange-500/5'>
          { ASIDE_TABS_RENDER[props.from].map((item) => (
            <Link
            to={item.route}
            key={item.id} 
            className={`
              flex justify-center items-center py-1 gap-1 
              ${props.selectedTab === item.id
                ? 'text-orange-400 hover:bg-amber-100/50'
                : 'text-cyan-400 hover:bg-cyan-100/50'
              }
            `}>
              { item.icon }
              { item.name }
            </Link>
          ))}

          <button
          className={`flex mt-auto cursor-pointer justify-center hover items-center py-1 gap-1 text-red-500 hover:bg-red-100/50`}
          onClick={() => setLogoutConfirm(true)}
          >
            <BiLogOut size={20}/>
            Sair
          </button>
        </aside>

        <main className='p-3 h-full min-h-0 overflow-hidden'>
          { props.children }
        </main>
      </div>

      <footer className='p-2 bg-orange-500/5 border-t border-t-orange-400 justify-center items-center'>
        <p className='text-center text-orange-400'>
          &copy; Leony Leandro Barros, Todos os direitos reservados.
        </p>
      </footer>
    </div>
  )
}

export default Layout