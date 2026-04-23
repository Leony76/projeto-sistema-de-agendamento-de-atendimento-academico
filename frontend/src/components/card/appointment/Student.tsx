import { APPOINTMENT_STATUS_MAP } from '@/constants/maps/appointmentStatus.map';
import type { Appointment } from '@/types/appointment.type';
import { formatDateTime } from '@/utils/formats/formatDateTime.util';
import React, { useState } from 'react'
import { BsThreeDotsVertical } from 'react-icons/bs';

type Props = Appointment;

const Student = (props:Props): React.JSX.Element => {

  const [expandedReason, setExpandedReason] = useState<boolean>(false);
  const [moreOptions, setMoreOptions] = useState<boolean>(false);

  const reason: string = (props.reason.length > 80 && !expandedReason) 
    ? props.reason.slice(0, 80) + '...'
    : props.reason
  ;

  return (
    <div className='px-3 py-2 border flex items-center gap-4 rounded-lg border-orange-300 bg-amber-50/50'>
      <figure className='h-25 w-25 border border-cyan-400 rounded-full p-1'>
        <img 
          src={ props.professor.photo } 
          alt={ props.professor.name  }
          className='h-full w-full object-cover rounded-full'
        />
      </figure>
      
      <div className='flex flex-col flex-1'>
        <div className='flex justify-between items-center'>
          <h3 className='font-bold text-orange-400'>
            { formatDateTime(props.dateTime) }
          </h3>

          <div className='relative'>
            <button
            onClick={() => setMoreOptions(prev => !prev)}
            className='hover:bg-amber-100 active:bg-amber-200 py-1 rounded-xl cursor-pointer flex justify-center items-center'
            >
              <BsThreeDotsVertical size={20} className=' text-orange-400'/>
            </button>

            { moreOptions &&
              <div className='flex border-cyan-300 overflow-hidden flex-col border absolute top-0 right-[120%] rounded-b-xl rounded-tl-xl'>
                <button className='px-5 p-1 cursor-pointer text-cyan-500 text-sm hover:brightness-95 active:brightness-90 bg-cyan-50 border-b border-cyan-300'>
                  Cancelar
                </button>

                <button className='px-5 p-1 cursor-pointer text-cyan-500 text-sm hover:brightness-95 active:brightness-90 bg-cyan-50'>
                  Editar
                </button>
              </div>
            }
          </div>      
        </div>

        <label className='text-sm text-orange-400 font-semibold'>
          Professor: <span className='text-cyan-500 font-normal'>{ props.professor.name }</span>
        </label>

        <label className='text-sm text-orange-400 font-semibold'>
          Status: <span className='text-cyan-500 font-normal'>{ APPOINTMENT_STATUS_MAP[props.status] }</span>
        </label>

        <label className='text-sm text-orange-400 font-semibold'>
          Sala: <span className='text-cyan-500 font-normal'>{ props.room }</span>
        </label>

        <label className='text-sm text-orange-400 font-semibold'>
          Motivo: <span className='text-gray-400 font-normal'>{ reason } { props.reason.length > 80 && 
            <button 
            onClick={() => setExpandedReason(prev => !prev)}
            className='text-gray-400 w-fit font-semibold italic hover:underline cursor-pointer'
            > 
              { expandedReason ? 'Ler menos' : 'Ler mais' }
            </button> 
          }</span>
        </label>
      </div>
    </div>
  )
}

export default Student