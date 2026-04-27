import { DISCIPLINES_VALUE_MAP } from '@/constants/maps/disciplines.map';
import { formatDate } from '@/utils/formats/formatDate.util';
import React, { useState } from 'react'
import { BsThreeDotsVertical } from 'react-icons/bs';
import { MdEdit } from 'react-icons/md';
import { useCloseModalOnMouseClickOutside } from '@/hooks/useCloseModalOnMouseClickOutside.hook';
import ExpansibleImage from '../misc/ExpansibleImage';
import type { RegisteredManager, RegisteredProfessor, RegisteredStudent } from '@/types/registeredUsers.type';
import { FaTrashAlt } from 'react-icons/fa';

type Props = {
  onClick: () => void;
} & (| RegisteredStudent & {
  from: 'STUDENT';
} | RegisteredProfessor & {
  from: 'PROFESSOR';
}| RegisteredManager & {
  from: 'MANAGER';
});

const UserGeneralInfo = (props:Props): React.JSX.Element => {

  const [moreOptions, setMoreOptions] = useState<boolean>(false);

  const { containerRef } = useCloseModalOnMouseClickOutside(setMoreOptions);

  return (
    <div className='relative px-3 py-2 border flex items-center gap-4 rounded-lg border-orange-300 bg-amber-50/50'>
      <div 
      ref={containerRef}
      className={`absolute top-2 right-2 flex gap-1 flex-row-reverse`}>
        <button 
        onClick={() => setMoreOptions(prev => !prev)}
        className='text-orange-400 self-start mt-px text-xl cursor-pointer rounded-full hover:bg-amber-100 active:bg-amber-200 p-1'
        >
          <BsThreeDotsVertical />
        </button>

        { moreOptions &&
          <div className='flex flex-col rounded-b-xl rounded-tl-xl'>
            { props.from === 'STUDENT' && 
              <button className='bg-yellow-50 border border-yellow-500 text-yellow-600 flex items-center gap-1 rounded-tl-lg px-5 p-1 justify-center cursor-pointer text-sm hover:brightness-95 active:brightness-90'>
                <MdEdit />
                Editar
              </button>
            }

            <button className={`
              bg-red-50 border border-red-300 text-red-500 flex items-center gap-1 px-5 p-1 cursor-pointer text-sm hover:brightness-95 active:brightness-90
              ${props.from === 'STUDENT' ? 'rounded-b-lg' : 'rounded-lg'}
            `}>
              <FaTrashAlt/>
              Excluir
            </button>
          </div>
        }  
      </div>
      
      <ExpansibleImage
        image={{
          name : props.name,
          uri  : props.photo,
          size : 'h-25 w-25'
        }}
      />

      <div className='flex flex-col flex-1'>
        <h3 
        className='font-bold text-orange-400 break-all hover:underline cursor-pointer active:underline-offset-0 w-fit'
        onClick={props.onClick}
        >
          { props.name }
        </h3>
      
        <label className='text-sm text-orange-400 font-semibold'>
          Identificador: <span className='text-green-500 font-bold'>{ props.id }</span>
        </label>

        { props.from === 'PROFESSOR' && 
          <label className='text-sm text-orange-400 font-semibold'>
            Disciplina: <span className='text-cyan-500 font-normal'>{ DISCIPLINES_VALUE_MAP[props.discipline] }</span>
          </label>
        }

        <label className='text-sm text-orange-400 font-semibold'>
          Data de cadastro: <span className='text-cyan-500 font-normal'>{ formatDate(props.registeredAt) }</span>
        </label>

        { props.from !== 'MANAGER' &&
          <label className='text-sm text-orange-400 font-semibold'>
            Agendamentos: <span className='text-cyan-500 font-normal'>{ props.appointments }</span>
          </label>
        }

        { props.from !== 'MANAGER' &&
          <label className='text-sm text-orange-400 font-semibold'>
            Solicitações: <span className='text-cyan-500 font-normal'>{ props.solicitations }</span>
          </label>
        }
      </div>  
    </div>
  );
}

export default UserGeneralInfo