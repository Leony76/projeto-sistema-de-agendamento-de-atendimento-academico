import React, { type JSX } from 'react'
import { AiFillSchedule } from 'react-icons/ai';
import { FaExclamation, FaHistory } from 'react-icons/fa';
import { IoHome } from 'react-icons/io5';
import { Link } from 'react-router-dom';

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
};

const Layout = (props:Props): React.JSX.Element => {

  const ASIDE_TABS_RENDER: AsideTab[] = [
    { id: 'HOME'        , name: 'Início'       , icon: <IoHome />         , route: '/home' },
    { id: 'TO_SCHEDULE' , name: 'Agendar'      , icon: <AiFillSchedule /> , route: '/schedule' },
    { id: 'REQUESTS'    , name: 'Solicitações' , icon: <FaExclamation />  , route: '/requests' },
    { id: 'HISTORY'     , name: 'Histórico'    , icon: <FaHistory />      , route: '/history' },
  ];

  return (
    <div className='flex flex-col h-screen'>
      <header className='flex justify-between items-center bg-cyan-100/50 py-2 px-3 border-b border-b-cyan-300'>
        <h3 className='text-cyan-600 text-lg font-semibold'>
          Sistema de Agendamento Acadêmico Online
        </h3>

        <div className='flex gap-5'>
          <span className='font-semibold text-orange-400'>
            Aluno: <span className='text-cyan-400 font-normal'>Leony Leandro Barros</span>
          </span>

          <div className='w-px bg-cyan-300 rounded-4xl'/>

          <span className='font-semibold text-orange-400'>
            RA: <span className='text-cyan-400 font-normal'>20241180209</span>
          </span>
        </div>
      </header>

      <div className='flex-1 grid grid-cols-[175px_1fr] min-h-0'>
        <aside className='flex flex-col py-5 border-r border-gray-200 bg-linear-to-b from-cyan-100/50 to-orange-500/5'>
          { ASIDE_TABS_RENDER.map((item) => (
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