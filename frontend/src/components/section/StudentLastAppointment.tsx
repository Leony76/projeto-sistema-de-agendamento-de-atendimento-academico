import { formatDateTime } from '@frontend/utils/formats/formatDateTime.util';
import type { Appointment } from '@shared/types/appointment.type';
import type { Professor } from '@shared/types/userBasicInfos.type';
import React from 'react'
import NoContent from '../misc/NoContent';
import { FaHistory } from 'react-icons/fa';

type Props = {
  lastAppointment: Appointment<Pick<Professor, "name">> | null
};

const StudentLastAppointment = (props:Props): React.JSX.Element => {
  return (
    <div className='flex flex-col gap-2 border border-cyan-400 p-2 rounded-lg bg-cyan-100/20 min-h-0'>
      <h2 className='text-cyan-500 font-semibold self-center'>
        Último agendamento
      </h2>
      
      { props.lastAppointment ? (
        <div className='flex flex-col flex-1 px-3 min-h-0 overflow-auto justify-center bg-white border rounded-lg border-cyan-300'>
          <h3 className='font-bold text-orange-400 text-sm'>
            { formatDateTime(props.lastAppointment.dateTime) }
          </h3>        
          
          <div className='flex flex-col'>
            <label className=' text-orange-400 font-semibold text-xs'>
              Professor: <span className='text-cyan-500 font-normal'> { props.lastAppointment.user.name } </span>
            </label>

            <label className=' text-orange-400 font-semibold text-xs'>
              Sala: <span className='text-cyan-500 font-normal'> { props.lastAppointment.room } </span>
            </label>
      
            <label className=' text-orange-400 font-semibold text-xs'>
              Motivo: <span className='text-gray-400 font-normal'> { props.lastAppointment.reason } </span>
            </label>
          </div>
        </div>
      ) : (
        <div className='flex flex-col flex-1 px-3 min-h-0 overflow-auto justify-center bg-white border rounded-lg border-cyan-300'>
          <NoContent 
            Icon={() => <FaHistory />}
            message='Nenhum agendamento realizado!'
          />
        </div>
      )}
    </div>
  )
}

export default StudentLastAppointment