import React, { useState } from 'react'
import Layout from '../Layout'
import { GrSchedule } from 'react-icons/gr';
import { FaFilter, FaRegClock } from 'react-icons/fa';
import { RiCalendarScheduleFill } from 'react-icons/ri';
import { Input } from '@/components/input';
import { Select } from '@/components/select';
import type { StudentAppointment } from '@/types/appointment.type';
import { Card } from '@/components/card';
import Calendar from 'react-calendar';
import '@/css/calendar.css';
import { FaCircleChevronLeft, FaCircleChevronRight, FaClipboardQuestion, FaPersonCircleQuestion } from 'react-icons/fa6';
import { formatDateTime } from '@/utils/formats/formatDateTime.util';
import type { StudentLastAppointment } from '@/types/studentLastAppointment.type';
import { filterStudentAppointments } from '@/utils/filters/filterStudentAppointments.util';
import NoContent from '@/components/misc/NoContent';
import { STUDENT_APPOINTMENTS_FILTER_MAP, STUDENT_APPOINTMENTS_FILTER_VALUE_MAP } from '@/constants/maps/filters/studentAppoitment.map.filter';
import { formatTime } from '@/utils/formats/formatTime.util';
import type { UserRole } from '@/types/userRole.type';

export const LOGGED_USER_DATA: { role: Exclude<UserRole, 'MANAGER'> } = {
  role: 'STUDENT',
}

const STUDENT_APPOITMENTS_DATA: StudentAppointment[] = [
  {
    id         :  1,
    dateTime   : '2026-10-05T15:00:00.000Z',
    reason     : 'Lorem ipsum dolor ',
    status     : 'CONFIRMED',
    room       : '1B',
    professor  : {
      name  : 'Cloud Strife',
      photo : 'https://static0.thegamerimages.com/wordpress/wp-content/uploads/2021/04/cloud-strife-ff7remake.jpg?w=1600&h=900&fit=crop' ,
    },
  },
  {
    id         :  2,
    dateTime   : '2026-10-07T16:00:00.000Z',
    professor  : {
      name  : 'Madara Uchiha',
      photo : 'https://criticalhits.com.br/wp-content/uploads/2021/05/Madara_Rinnegan.png',
    },
    reason     : 'Lorem ipsum dolorem ',
    status     : 'UNCONFIRMED',
    room       : '1C'
  },
];

const STUDENT_LAST_APPOITMENT: StudentLastAppointment = {
  id            : 0,
  dateTime      : '2026-10-07T16:00:00.000Z',
  professorName : 'Sasuke Uchiha',
  reason        : 'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
  room          : '4A',
};

const PENDING_SOLICITATIONS = {
  appointmentsDone     : 3,
  pendingSolicitations : 5,
  nextPending          : '2026-04-24T19:30:00.000Z' 
};

const Student = (): React.JSX.Element => {

  const BRIEF_RENDER = [
    { icon: <GrSchedule className='text-cyan-500' size={28}/>             , label: 'Agendamentos feitos'      , value: PENDING_SOLICITATIONS.appointmentsDone     },
    { icon: <FaRegClock className='text-cyan-500' size={28}/>             ,  label: 'Solicitações pendentes'  , value: PENDING_SOLICITATIONS.pendingSolicitations },
    { icon: <RiCalendarScheduleFill className='text-cyan-500' size={28}/> ,  label: 'Próximo agendamento'     , value: formatTime(PENDING_SOLICITATIONS.nextPending)          },
  ];

  const [searchValue, setSearchValue] = useState<string>('');
  const [filterValue, setFilterValue] = useState<typeof STUDENT_APPOINTMENTS_FILTER_MAP[number]['value']>('none');
  const [dateSelected, setDateSelected] = useState<Date | null>(new Date());

  const filteredStudentAppointmentsData = filterStudentAppointments(
    STUDENT_APPOITMENTS_DATA,
    searchValue,
    filterValue,
  );

  return (
    <Layout 
    selectedTab='HOME'
    from='STUDENT'
    >
      <div className='grid grid-cols-[1fr_300px] gap-x-3 h-full min-h-0'>
        <div className='grid gap-y-3 grid-rows-[60px_1fr] min-h-0'>
          <div className='flex gap-5 max-w-200 mx-auto w-full'>
            { BRIEF_RENDER.map((item) => (
              <div className='flex border justify-evenly items-center border-cyan-400 rounded-lg bg-cyan-100/20 flex-1'>
                { item.icon }
                
                <div className='flex flex-col '>
                  <h4 className=' text-cyan-500 text-sm'>
                    { item.label }
                  </h4>

                  <span className='text-lg font-semibold -mt-1 text-orange-500/50'>
                    { item.value }
                  </span>
                </div>
              </div>
            )) }
          </div>

          <div className='flex flex-col gap-3 py-2 px-10 h-full min-h-0 border border-cyan-400 rounded-lg bg-cyan-100/20'>
            <h3 className='self-center font-semibold text-lg text-cyan-500'>
              Agendamentos
            </h3>

            <div className='w-full flex gap-2'>
              <Input.Search
                onChange={(e) => setSearchValue(e.target.value)}
                onClear={() => setSearchValue('')}
                placeholder='Pesquisar por professor, status, sala ou motivo'
                value={searchValue}
                customStyle={{ input: 'flex-4' }}
              />

              <Select.Default
                Icon={() => <FaFilter size={13}/>}
                placeholder='Filtro'
                optionsSchema='STUDENT_APPOINTMENT_FILTER'
                value={filterValue}
                onSelect={(value) => setFilterValue(value as typeof STUDENT_APPOINTMENTS_FILTER_MAP[number]['value'])}
                selectedOptionPlaceholderNotShow
              />
            </div>

            <div className='flex-1 min-h-0 flex flex-col gap-2 overflow-auto bg-white p-2 rounded-xl border border-cyan-300'>
              { filteredStudentAppointmentsData.length > 0 ? (
                filteredStudentAppointmentsData.map((appointment) => (
                 <Card.Appointment
                  from='STUDENT'
                   key={appointment.id}
                   { ...appointment }
                 />
               ))
              ) : (
                <NoContent
                  Icon={(searchValue || filterValue) ? () => <FaPersonCircleQuestion size={24}/> : () => <FaClipboardQuestion size={24}/>}
                  message={
                    searchValue && filterValue !== 'none'
                      ? `Nenhum resultado para "${searchValue}" com o filtro "${STUDENT_APPOINTMENTS_FILTER_VALUE_MAP[filterValue as keyof typeof STUDENT_APPOINTMENTS_FILTER_VALUE_MAP]}"`
                      : searchValue
                      ? `Nenhum resultado para "${searchValue}"`
                      : filterValue
                      ? `Nenhum resultado para o filtro "${STUDENT_APPOINTMENTS_FILTER_VALUE_MAP[filterValue as keyof typeof STUDENT_APPOINTMENTS_FILTER_VALUE_MAP]}"`
                      : `Nenhum agendamento disponível no momento!`
                  }
                />
              )}
            </div>
          </div>
        </div>

        <div className='grid grid-rows-[2fr_1fr] gap-y-3 max-h-120 min-h-0'>
          <div className='flex items-center border border-cyan-400 rounded-lg bg-cyan-100/20'>
            <Calendar
              onChange={(value) => setDateSelected(value as Date)}
              value={dateSelected}
              className="custom-calendar"
              prevLabel={<FaCircleChevronLeft/>}
              nextLabel={<FaCircleChevronRight/>}
              prev2Label={null}
              next2Label={null}
            />
          </div>

          <div className='flex flex-col gap-1 border border-cyan-400 p-2 pt-1 rounded-lg bg-cyan-100/20 min-h-0'>
            <h2 className='text-cyan-500 font-semibold self-center'>
              Último agendamento
            </h2>

            <div className='flex flex-col flex-1 px-3 min-h-0 overflow-auto justify-center bg-white border rounded-lg border-cyan-300'>
              <h3 className='font-bold text-orange-400 text-sm'>
                { formatDateTime(STUDENT_LAST_APPOITMENT.dateTime) }
              </h3>        
              
              <div className='flex flex-col'>
                <label className=' text-orange-400 font-semibold text-xs'>
                  Professor: <span className='text-cyan-500 font-normal'> { STUDENT_LAST_APPOITMENT.professorName } </span>
                </label>

                <label className=' text-orange-400 font-semibold text-xs'>
                  Sala: <span className='text-cyan-500 font-normal'> { STUDENT_LAST_APPOITMENT.room } </span>
                </label>
          
                <label className=' text-orange-400 font-semibold text-xs'>
                  Motivo: <span className='text-gray-400 font-normal'> { STUDENT_LAST_APPOITMENT.reason.slice(0,50) + '...' } </span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Student