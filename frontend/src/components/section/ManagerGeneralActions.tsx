import React from 'react'
import { Button } from '../button';
import { FaUserPlus, FaClipboardList, FaTrashAlt } from 'react-icons/fa';
import { MdMeetingRoom } from 'react-icons/md';

type Props = {
  onNewUser     : () => void;
  onReports     : () => void;
  onUsersDelete : () => void;
  onViewRooms   : () => void;
};

const ManagerGeneralActions = (props:Props): React.JSX.Element => {

  return (
    <div className='flex flex-col items-center p-2 gap-2 border border-cyan-400 rounded-lg bg-cyan-100/20'>
      <h3 className='font-semibold text-lg text-cyan-500'>
        Ações gerais
      </h3>

      <div className='flex-1 min-h-0 w-full grid grid-cols-2 border gap-2 overflow-auto bg-white p-2 rounded-xl border-cyan-300'>
        <Button.Default
          label='Novo usuário'
          Icon={() => <FaUserPlus className='scale-[1.3]'/>}
          onClick={props.onNewUser}
          customStyle={{ button: 'py-1 text-xs text-green-500 border-green-500 bg-green-100 font-semibold' }}
        />  

        <Button.Default
          label='Relatórios'
          Icon={() => <FaClipboardList />}
          onClick={props.onReports}
          customStyle={{ button: 'py-1 text-xs text-cyan-600 border-cyan-700 bg-cyan-200 font-semibold' }}
        />  

        <Button.Default
          label='Excluir usuários'
          Icon={() => <FaTrashAlt />}
          onClick={props.onUsersDelete}
          customStyle={{ button: 'py-1 text-xs text-red-600 border-red-700 bg-red-100 font-semibold' }}
        />  

        <Button.Default
          label='Salas'
          Icon={() => <MdMeetingRoom size={16}/>}
          onClick={props.onViewRooms}
          customStyle={{ button: 'py-1 text-xs text-yellow-600 border-yellow-700 bg-yellow-100 font-semibold' }}
        />  
      </div>  
    </div>
  )
}

export default ManagerGeneralActions