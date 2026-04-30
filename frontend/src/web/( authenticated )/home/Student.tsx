import React, { useState } from 'react'
import Layout from '../Layout'
import { GrSchedule } from 'react-icons/gr';
import { FaFilter, FaRegClock } from 'react-icons/fa';
import { RiCalendarScheduleFill } from 'react-icons/ri';
import { Input } from '@/components/input';
import { Select } from '@/components/select';
import { Card } from '@/components/card';
import Calendar from 'react-calendar';
import '@/css/calendar.css';
import { FaCircleChevronLeft, FaCircleChevronRight, FaClipboardQuestion, FaPersonCircleQuestion } from 'react-icons/fa6';
import { formatDateTime } from '@/utils/formats/formatDateTime.util';
import { filterStudentAppointments } from '@/utils/filters/filterStudentAppointments.util';
import NoContent from '@/components/misc/NoContent';
import { STUDENT_APPOINTMENTS_FILTER_MAP, STUDENT_APPOINTMENTS_FILTER_VALUE_MAP } from '@/constants/maps/filters/studentAppoitment.map.filter';
import HomeBrief from '@/components/misc/HomeBrief';
import { STUDENT_APPOITMENTS_DATA } from '@/constants/mocks/users/student/studentAppointmentsData.mock';
import { STUDENT_LAST_APPOITMENT } from '@/constants/mocks/users/student/studentLastAppointment.mock';
import { STUDENT_GENERAL_INFO_STATUS } from '@/constants/mocks/users/student/studentGeneralInfoStatus.mock';

const Student = (): React.JSX.Element => {

  const BRIEF_RENDER = [
    { id: 1, icon: <GrSchedule className='text-cyan-500' size={28}/>             , label: 'Agendamentos feitos'      , value: STUDENT_GENERAL_INFO_STATUS.appointmentsDone     },
    { id: 2, icon: <FaRegClock className='text-cyan-500' size={28}/>             ,  label: 'Solicitações pendentes'  , value: STUDENT_GENERAL_INFO_STATUS.pendingSolicitations },
    { id: 3, icon: <RiCalendarScheduleFill className='text-cyan-500' size={28}/> ,  label: 'Próximo agendamento'     , value: formatDateTime(STUDENT_GENERAL_INFO_STATUS.nextPending)          },
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
              item.id === 3 ? (
                <HomeBrief
                  key={item.id}
                  Icon={() => item.icon}
                  label={item.label}
                  value={item.value}
                  customStyle={{ value: 'text-[15px] mt-[1px]' }}
                />     
              ) : (
                <HomeBrief
                  key={item.id}
                  Icon={() => item.icon}
                  label={item.label}
                  value={item.value}
                />     
              )     
            ))}
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