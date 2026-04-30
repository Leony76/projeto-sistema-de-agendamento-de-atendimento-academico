import type { StudentAppointment, ProfessorAppointment } from '@shared/types/appointment.type';
import { formatDateTime } from '@frontend/utils/formats/formatDateTime.util';
import React, { useState } from 'react'
import { BsThreeDotsVertical } from 'react-icons/bs';
import { MdEdit } from 'react-icons/md';
import { TbCancel } from 'react-icons/tb';
import { Button } from '../button';
import { FaCheck } from 'react-icons/fa';
import { useCloseModalOnMouseClickOutside } from '@frontend/hooks/useCloseModalOnMouseClickOutside.hook';
import ExpansibleImage from '../misc/ExpansibleImage';

type Props = {
  smVersion?: boolean;
} & (
  | StudentAppointment &   { from: 'STUDENT' } 
  | ProfessorAppointment & { from: 'PROFESSOR'}
);

const Appointment = (props:Props): React.JSX.Element => {

  const [expandedReason, setExpandedReason] = useState<boolean>(false);
  const [moreOptions, setMoreOptions] = useState<boolean>(false);
  const { containerRef } = useCloseModalOnMouseClickOutside(setMoreOptions);

  const reason: string = (props.reason.length > 80 && !expandedReason) 
    ? props.reason.slice(0, 80) + '...'
    : props.reason
  ;

  const entity = props.from === 'PROFESSOR'
    ? props.student
    : props.professor
  ;

  return (
    <div className='relative px-3 py-2 border flex items-center gap-4 rounded-lg border-orange-300 bg-amber-50/50'>
      { !props.smVersion &&
        <>
          <div 
          ref={containerRef}
          className={`
            absolute top-2 right-2 flex gap-1
            ${ props.from === 'STUDENT' ? 'flex-row-reverse' : 'flex-col' }
          `}>
            <button 
            onClick={() => setMoreOptions(prev => !prev)}
            className={`
              text-orange-400 self-start text-xl cursor-pointer rounded-full hover:bg-amber-100 active:bg-amber-200 p-1
              ${ props.from === 'STUDENT' ? 'self-start' : 'ml-auto' }
            `}
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
                  <TbCancel className='scale-[1.2]'/>
                  Cancelar
                </button>
              </div>
            }  
          </div>
          
          <ExpansibleImage
            image={{
              name : entity.name,
              uri  : entity.photo,
              size: props.from === 'STUDENT' ? 'h-25 w-25' : 'h-30 w-30'
            }}
          />       
        </>
      }
      
      <div className='flex flex-col gap-1 flex-1'>
        <h3 className='font-bold text-orange-400'>
          { formatDateTime(props.dateTime) }
        </h3>

        <div className={`
          flex flex-col
          ${ props.from === 'PROFESSOR' ? 'text-xs' : 'text-sm' }
        `}>
          <label className='text-orange-400 font-semibold'>
            { props.from === 'PROFESSOR' ? 'Aluno:' : 'Professor:'} <span className='text-cyan-500 font-normal'>{ props.from === 'PROFESSOR' ? props.student.name : props.professor.name }</span>
          </label>

          <label className='text-orange-400 font-semibold'>
            Sala: <span className='text-cyan-500 font-normal'>{ props.room }</span>
          </label>

          <label className='text-orange-400 font-semibold'>
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

        { (props.from === 'PROFESSOR') &&
          <Button.Default
            label='Marcar como concluído'
            Icon={() => <FaCheck />}
            onClick={() => {}}
            customStyle={{ button: '!w-fit py-1 text-sm mt-2 mb-1 bg-green-100 text-green-500 border-green-500'}}
          />
        }
      </div>
    </div>
  )
}

export default Appointment