import { DISCIPLINES_VALUE_MAP } from '@/constants/maps/disciplines.map';
import { useCloseModalOnMouseClickOutside } from '@/hooks/useCloseModalOnMouseClickOutside.hook';
import type { StudentAppointmentHistory } from '@/types/appointmentHistory.type';
import type { Discipline } from '@/types/disciplines.type';
import type { UserRole } from '@/types/userRole.type';
import { formatDate } from '@/utils/formats/formatDate.util';
import { formatTime } from '@/utils/formats/formatTime.util';
import React, { useState } from 'react'
import { BsThreeDotsVertical } from 'react-icons/bs';
import { FaTrashAlt } from 'react-icons/fa';
import ExpansibleImage from '../misc/ExpansibleImage';

type Props = Omit<StudentAppointmentHistory, 'discipline'> & {
  discipline?: Discipline; 
  from: Omit<UserRole, 'MANAGER'>;
};

const History = (props:Props): React.JSX.Element => {

  const [moreOptions, setMoreOptions] = useState<boolean>(false);
  const { containerRef } = useCloseModalOnMouseClickOutside(setMoreOptions);

  return (
    <div className='relative px-3 py-2 border flex items-center gap-4 rounded-lg border-orange-300 bg-amber-50/50'>
      <div 
      ref={containerRef}
      className={`absolute top-2 right-2 flex flex-row-reverse gap-1`}>
        <button 
        onClick={() => setMoreOptions(prev => !prev)}
        className='text-orange-400 self-end mt-px text-xl cursor-pointer rounded-full hover:bg-amber-100 active:bg-amber-200 p-1'
        >
          <BsThreeDotsVertical />
        </button>

        { moreOptions &&
          <div className='flex flex-col rounded-b-xl rounded-tl-xl'>
            <button className={`
              bg-red-50 border border-red-300 text-red-500 flex items-center gap-1 px-5 p-1 cursor-pointer text-sm hover:brightness-95 active:brightness-90
              ${props.from === 'STUDENT' ? 'rounded-b-lg' : 'rounded-lg'}
            `}>
              <FaTrashAlt />
              Apagar
            </button>
          </div>
        }  
      </div>
      
      <ExpansibleImage
        image={{
          name : props.name,
          uri  : props.photo,
          size : 'h-26 w-26'
        }}
      />

      <div className='flex flex-col flex-1'>
        <h3 className='font-bold text-orange-400'>
          { props.name }
        </h3>   

        { props.discipline &&
          <label className='text-sm text-orange-400 font-semibold'>
            Disciplina: <span className='text-cyan-500 font-normal'>{ DISCIPLINES_VALUE_MAP[props.discipline] }</span>
          </label>
        }

        <label className='text-sm text-orange-400 font-semibold'>
          Data: <span className='text-cyan-500 font-normal'>{ formatDate(props.appoitmentDateTime) }</span>
        </label>

        <label className='text-sm text-orange-400 font-semibold'>
          Horário: <span className='text-cyan-500 font-normal'>{ formatTime(props.appoitmentDateTime) }</span>
        </label>

        <label className='text-sm text-orange-400 font-semibold'>
          Motivo: <span className='text-gray-400 font-normal'>{ props.reason }</span>
        </label>
      </div>  
    </div>
  );
}

export default History