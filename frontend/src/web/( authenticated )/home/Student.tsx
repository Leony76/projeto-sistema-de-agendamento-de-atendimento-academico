import React, { useEffect, useState } from 'react'
import Layout from '../Layout'
import { GrSchedule } from 'react-icons/gr';
import { FaCalendarAlt, FaFilter, FaHistory, FaRegClock } from 'react-icons/fa';
import { RiCalendarScheduleFill } from 'react-icons/ri';
import { Input } from '@frontend/components/input';
import { Select } from '@frontend/components/select';
import { Card } from '@frontend/components/card';
import Calendar from 'react-calendar';
import '@frontend/css/calendar.css';
import { FaCircleChevronLeft, FaCircleChevronRight, FaClipboardQuestion, FaPersonCircleQuestion } from 'react-icons/fa6';
import { formatDateTime } from '@frontend/utils/formats/formatDateTime.util';
import { filterStudentAppointments } from '@frontend/utils/filters/filterStudentAppointments.util';
import NoContent from '@frontend/components/misc/NoContent';
import { STUDENT_APPOINTMENTS_FILTER_MAP, STUDENT_APPOINTMENTS_FILTER_VALUE_MAP } from '@frontend/constants/maps/filters/studentAppoitment.map.filter';
import HomeBrief from '@frontend/components/misc/HomeBrief';
import type { StudentBriefInfos } from '@shared/types/studentBriefInfos.type';
import { noContentFound } from '@frontend/utils/misc/noContentFound.util';
import type { Appointment } from '@shared/types/appointment.type';
import type { Professor } from '@shared/types/userBasicInfos.type';

const Student = (): React.JSX.Element => {

  const [searchValue, setSearchValue] = useState<string>('');
  const [filterValue, setFilterValue] = useState<typeof STUDENT_APPOINTMENTS_FILTER_MAP[number]['value']>('none');
  const [dateSelected, setDateSelected] = useState<Date | null>(new Date());

  const [appointments, setAppointments] = useState<Appointment<Pick<Professor, 'name' | 'photo'>>[]>([]);
  const [briefInfos, setBriefInfos] = useState<StudentBriefInfos | null>(null);
  const [lastAppointment, setLastAppointment] = useState<Appointment<Pick<Professor, 'name'>> | null>(null);

  const filteredStudentAppointmentsData = filterStudentAppointments(
    appointments,
    searchValue,
    filterValue,
  );

  const BRIEF_RENDER = [
    { id: 1, icon: <GrSchedule className='text-cyan-500' size={28}/>             , label: 'Agendamentos feitos'      , value: briefInfos?.appointmentsMade     },
    { id: 2, icon: <FaRegClock className='text-cyan-500' size={28}/>             ,  label: 'Solicitações pendentes'  , value: briefInfos?.pendingSolicitations! },
    { id: 3, icon: <RiCalendarScheduleFill className='text-cyan-500' size={28}/> ,  label: 'Próximo agendamento'     , value: briefInfos?.nextAppointmentDateTime ? formatDateTime(briefInfos?.nextAppointmentDateTime) : '--/--/--, --:--'},
  ];

  const noContent = noContentFound(
    'Nenhum agendamento no momento!',
    STUDENT_APPOINTMENTS_FILTER_VALUE_MAP[filterValue as keyof typeof STUDENT_APPOINTMENTS_FILTER_VALUE_MAP],
    searchValue,
    filterValue && filterValue !== 'none',
    {
      notFound   : FaPersonCircleQuestion,
      notContent : FaClipboardQuestion
    },
  );

  useEffect(() => {
    const getData = async(): Promise<void> => {
      try {
        
      } catch ( error:unknown ) {
        if (error instanceof Error) console.error(error.message);
      }
    };

    getData();
  },[]);

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
                  value={item.value!}
                  customStyle={{ value: 'text-[15px] mt-[1px]' }}
                />     
              ) : (
                <HomeBrief
                  key={item.id}
                  Icon={() => item.icon}
                  label={item.label}
                  value={item.value!}
                />     
              )     
            ))}
          </div>

          <div className='flex flex-col gap-3 py-2 px-10 h-full min-h-0 border border-cyan-400 rounded-lg bg-cyan-100/20'>
            <h3 className='flex items-center gap-1.5 self-center font-semibold text-lg text-cyan-500'>
              <FaCalendarAlt />
              Agendamentos
            </h3>

            <div className='w-full flex gap-2'>
              <Input.Search
                onChange={(e) => setSearchValue(e.target.value)}
                onClear={() => setSearchValue('')}
                placeholder='Pesquisar por data, professor, sala ou motivo'
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
                  Icon={noContent.Icon}
                  message={noContent.message}
                />
              )}
            </div>
          </div>
        </div>

        <div className='grid grid-rows-[300px_140px] gap-y-3 min-h-0'>
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

          <div className='flex flex-col gap-2 border border-cyan-400 p-2 rounded-lg bg-cyan-100/20 min-h-0'>
            <h2 className='text-cyan-500 font-semibold self-center'>
              Último agendamento
            </h2>
            
            { lastAppointment ? (
              <div className='flex flex-col flex-1 px-3 min-h-0 overflow-auto justify-center bg-white border rounded-lg border-cyan-300'>
                <h3 className='font-bold text-orange-400 text-sm'>
                  { formatDateTime(lastAppointment.dateTime) }
                </h3>        
                
                <div className='flex flex-col'>
                  <label className=' text-orange-400 font-semibold text-xs'>
                    Professor: <span className='text-cyan-500 font-normal'> { lastAppointment.user.name } </span>
                  </label>

                  <label className=' text-orange-400 font-semibold text-xs'>
                    Sala: <span className='text-cyan-500 font-normal'> { lastAppointment.room } </span>
                  </label>
            
                  <label className=' text-orange-400 font-semibold text-xs'>
                    Motivo: <span className='text-gray-400 font-normal'> { lastAppointment.reason } </span>
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
        </div>
      </div>
    </Layout>
  )
}

export default Student;