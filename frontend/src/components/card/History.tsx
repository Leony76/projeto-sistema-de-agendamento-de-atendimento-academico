import { DISCIPLINES_MAP } from '@/constants/maps/disciplines.map';
import type { AppointmentHistory } from '@/types/appointmentHistory.type';
import { formatDate } from '@/utils/formats/formatDate.util';
import { formatTime } from '@/utils/formats/formatTime.util';
import React, { useState } from 'react'
import { BsThreeDotsVertical } from 'react-icons/bs';

type Props = AppointmentHistory;

const History = (props:Props): React.JSX.Element => {

  const [moreOptions, setMoreOptions] = useState<boolean>(false);

  return (
    <div className='relative px-3 py-2 border flex items-center gap-4 rounded-lg border-orange-300 bg-amber-50/50'>
      <div className='absolute top-2 right-2 flex flex-col gap-1'>
        <button 
        onClick={() => setMoreOptions(prev => !prev)}
        className='text-orange-400 self-end text-xl cursor-pointer rounded-full hover:bg-amber-100 active:bg-amber-200 p-1'
        >
          <BsThreeDotsVertical />
        </button>

        { moreOptions &&
          <div className='flex overflow-hidden flex-col text-sm border border-cyan-400 rounded-b-lg rounded-tl-lg'>
            <button className='text-cyan-400 cursor-pointer hover:bg-cyan-100 active:bg-cyan-200 bg-cyan-50 px-4 py-1 border-b border-cyan-400'>
              Cancelar
            </button>

            <button className='text-cyan-400 cursor-pointer hover:bg-cyan-100 active:bg-cyan-200 bg-cyan-50 px-4 py-1'>
              Apagar
            </button>
          </div>
        }
      </div>
      
      <figure className='h-30 w-30 border border-cyan-400 rounded-full p-1'>
        <img 
          src={ props.photo } 
          alt={ props.name  }
          className='h-full w-full object-cover rounded-full'
        />
      </figure>

      <div className='flex flex-col w-[60%]'>
        <h3 className='font-bold text-orange-400'>
          { props.name }
        </h3>   

        <label className='text-sm text-orange-400 font-semibold'>
          Disciplina: <span className='text-cyan-500 font-normal'>{ DISCIPLINES_MAP[props.discipline] }</span>
        </label>

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