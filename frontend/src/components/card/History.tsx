import { useCloseModalOnMouseClickOutside } from '@frontend/hooks/useCloseModalOnMouseClickOutside.hook';
import type { ProfessorAppointmentHistoryResponse as ProfessorAppointmentHistory, StudentAppointmentHistoryResponse as StudentAppointmentHistory } from '@shared/types/dtos/appointmentHistory.dto';
import { formatDate } from '@frontend/utils/formats/formatDate.util';
import { formatTime } from '@frontend/utils/formats/formatTime.util';
import React, { useState, type JSX } from 'react'
import { BsThreeDotsVertical } from 'react-icons/bs';
import { FaCalendarCheck, FaTrashAlt } from 'react-icons/fa';
import ExpansibleImage from '../misc/ExpansibleImage';
import type { AppointmentStatus } from '@backend/generated/prisma/enums';
import { APPOINTMENT_STATUS_MAP } from '@frontend/constants/maps/appointmentStatus.map';
import { FaPersonCircleQuestion } from 'react-icons/fa6';

type Props = | StudentAppointmentHistory & {
  from: 'STUDENT';
} | ProfessorAppointmentHistory & {
  from: 'PROFESSOR';
};

const History = (props:Props): React.JSX.Element => {

  const [moreOptions, setMoreOptions] = useState<boolean>(false);
  const { containerRef } = useCloseModalOnMouseClickOutside(setMoreOptions);

  const formatter = new Intl.ListFormat('pt-BR', { style: 'long', type: 'conjunction' });
  const disciplines = props.from === 'STUDENT' 
    ? props.professor.disciplines.map(name => name) 
    : []
  ;

  const entity = props.from === 'STUDENT'
    ? props.professor
    : props.student
  ;

  const statusTagStyle: Record<Exclude<AppointmentStatus, "PENDING" | "ACCEPTED" | "REJECTED" | "CONFIRMED" | "CANCELED">, { style: string, icon: JSX.Element }> = {
    DONE      : { style: 'bg-green-50 text-green-500' , icon: <FaCalendarCheck size={17} />         },
    NO_SHOW   : { style: 'bg-red-800 text-red-50'     , icon: <FaPersonCircleQuestion size={17} />  },
  };

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
          <button className={`bg-red-50 border rounded-lg border-red-300 text-red-500 flex items-center gap-1 px-5 p-1 cursor-pointer text-sm hover:brightness-95 active:brightness-90`}>
            <FaTrashAlt />
            Apagar
          </button>
        }  
      </div>
      
      <ExpansibleImage
        image={{
          name : entity.name,
          uri  : entity.photo ?? 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original',
          size : 'h-26 w-26'
        }}
      />

      <div className='flex flex-col flex-1 gap-1'>
        <h3 className='font-bold text-orange-400'>
          { entity.name }
        </h3>   

        <div className='flex flex-col text-xs'>
          { props.from === 'STUDENT' &&
            <label className='text-orange-400 font-semibold'>
              Disciplina: <span className='text-cyan-500 font-normal'>{ formatter.format(disciplines) }</span>
            </label>
          }

          <label className='text-orange-400 font-semibold'>
            Data: <span className='text-cyan-500 font-normal'>{ formatDate(props.dateTime) }</span>
          </label>

          <label className='text-orange-400 font-semibold'>
            Horário: <span className='text-cyan-500 font-normal'>{ formatTime(props.dateTime) }</span>
          </label>

          <label className='text-orange-400 font-semibold'>
            Motivo: <span className='text-gray-400 font-normal'>{ props.reason }</span>
          </label>

          <span className={`
            border mb-1 mt-2 text-sm py-1 font-semibold items-center gap-2 flex justify-center w-fit px-3 rounded-lg
            ${statusTagStyle[props.status as Exclude<AppointmentStatus, "PENDING" | "ACCEPTED" | "REJECTED" | "CONFIRMED" | "CANCELED">].style}
          `}>
            { statusTagStyle[props.status as Exclude<AppointmentStatus, "PENDING" | "ACCEPTED" | "REJECTED" | "CONFIRMED" | "CANCELED">].icon }

            <span className='mb-px'>
              { APPOINTMENT_STATUS_MAP[props.status] }
            </span>
          </span>
        </div>
      </div>  
    </div>
  );
}

export default History