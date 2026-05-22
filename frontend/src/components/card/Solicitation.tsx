import { formatDate } from '@frontend/utils/formats/formatDate.util';
import { formatTime } from '@frontend/utils/formats/formatTime.util';
import React, { useState, type JSX } from 'react'
import { BsThreeDotsVertical } from 'react-icons/bs';
import { FaCheck, FaCheckCircle, FaRegClock } from 'react-icons/fa';
import { IoCloseCircleSharp, IoCloseSharp } from 'react-icons/io5';
import { Button } from '../button';
import { MdEdit } from 'react-icons/md';
import { TbCancel } from 'react-icons/tb';
import { useCloseModalOnMouseClickOutside } from '@frontend/hooks/useCloseModalOnMouseClickOutside.hook';
import ExpansibleImage from '../misc/ExpansibleImage';
import type { Professor, Student } from '@shared/types/userBasicInfos.type';
import type { Appointment } from '@shared/types/appointment.type';
import type { AppointmentStatus } from '@backend/generated/prisma/enums';
import { APPOINTMENT_STATUS_MAP } from '@frontend/constants/maps/appointmentStatus.map';

type Props = {
  smVersion?: boolean;
} & (
  | Appointment<Pick<Professor, 'name' | 'photo' | 'disciplines'>>  & { from: 'STUDENT' } 
  | Appointment<Pick<Student, 'name' | 'photo'>> & { from: 'PROFESSOR' }
);

const Solicitation = (props:Props): React.JSX.Element => {

  const [moreOptions, setMoreOptions] = useState<boolean>(false);

  const statusTagStyle: Record<AppointmentStatus, { style: string, icon: JSX.Element }> = {
    REJECTED  : { style: 'bg-red-50 text-red-400'      , icon: <IoCloseCircleSharp size={20} /> },
    ACCEPTED  : { style: 'bg-green-100 text-green-400'  , icon: <FaCheckCircle size={17}/>       },
    PENDING   : { style: 'bg-yellow-100 text-yellow-500', icon: <FaRegClock size={17}/>          },
    CANCELED  : { style: 'bg-yellow-100 text-yellow-500', icon: <FaRegClock size={17}/>          },
    CONFIRMED : { style: 'bg-yellow-100 text-yellow-500', icon: <FaRegClock size={17}/>          },
    DONE      : { style: 'bg-yellow-100 text-yellow-500', icon: <FaRegClock size={17}/>          },
    NO_SHOW   : { style: 'bg-yellow-100 text-yellow-500', icon: <FaRegClock size={17}/>          },
  };

  const { containerRef } = useCloseModalOnMouseClickOutside(setMoreOptions);

  const formatter = new Intl.ListFormat('pt-BR', { style: 'long', type: 'conjunction' });
  const disciplines = props.from === 'STUDENT' 
    ? props.user.disciplines.map(name => name) 
    : []
  ;

  return (
    <div className='relative self-start px-3 py-2 border flex items-center gap-4 rounded-lg border-orange-300 bg-amber-50/50'>
      { !props.smVersion && 
        <>
          <div 
          ref={containerRef}
          className={`
            absolute top-2 right-2 flex flex-col gap-1
            ${ props.from === 'STUDENT' ? 'flex-col' : 'flex-row-reverse' }
          `}>
            <button 
            onClick={() => setMoreOptions(prev => !prev)}
            className='text-orange-400 self-end mt-px text-xl cursor-pointer rounded-full hover:bg-amber-100 active:bg-amber-200 p-1'
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
              name : props.user.name,
              uri  : props.user.photo ?? 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original',
              size : 'h-26 w-26'
            }}
          />
        </>
      }

      <div className='flex flex-col flex-1 gap-1'>
        <h3 className='font-bold text-orange-400 break-all w-[90%]'>
          { props.user.name }
        </h3>
        
        <div className='flex flex-col text-xs'>
          { props.from === 'STUDENT' && 
            <label className='text-orange-400 font-semibold'>
              Disciplina(s): <span className='text-cyan-500 font-normal'> { formatter.format(disciplines) } </span>   
            </label>
          }

          <label className='text-orange-400 font-semibold'>
            Data: <span className='text-cyan-500 font-normal'>{ formatDate(props.dateTime) }</span>
          </label>

          <label className='text-orange-400 font-semibold'>
            Horário: <span className='text-cyan-500 font-normal'>{ formatTime(props.dateTime) }</span>
          </label>

          { props.from === 'PROFESSOR' &&
            <label className='text-orange-400 font-semibold'>
              Motivo: <span className='text-gray-400 font-normal'>{ props.reason }</span>
            </label>
          }

          <span className={`
            border mb-1 mt-2 text-sm py-1 font-semibold items-center gap-2 flex justify-center w-fit px-3 rounded-lg
            ${statusTagStyle[props.status].style}
          `}>
            { statusTagStyle[props.status].icon }

            <span className='mb-px'>
              { APPOINTMENT_STATUS_MAP[props.status] }
            </span>
          </span>
        </div>
      </div>  

      { (props.status === 'PENDING' && props.from === 'PROFESSOR') &&
        <div className='flex gap-2 self-end'>
          <Button.Default
            label='Aceitar'
            Icon={() => <FaCheck />}
            onClick={() => {}}
            customStyle={{ button: '!w-fit py-1 text-sm mt-2 mb-1 bg-green-100 text-green-500 border-green-500'}}
          />

          <Button.Default
            label='Recusar'
            Icon={() => <IoCloseSharp className='scale-[1.5]'/>}
            onClick={() => {}}
            customStyle={{ button: '!w-fit py-1 text-sm mt-2 mb-1 bg-red-100 text-red-500 border-red-500'}}
          />
        </div>
      }
    </div>
  );
}

export default Solicitation