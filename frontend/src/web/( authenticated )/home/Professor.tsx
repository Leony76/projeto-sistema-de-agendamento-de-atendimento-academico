import React, { useEffect, useState } from 'react'
import Layout from '../Layout'
import { FaArrowCircleLeft, FaEdit, FaFilter, FaRegClock } from 'react-icons/fa';
import { RiCalendarScheduleFill } from 'react-icons/ri';
import { Input } from '@frontend/components/input';
import { Select } from '@frontend/components/select';
import { Card } from '@frontend/components/card';
import Calendar from 'react-calendar';
import '@frontend/css/calendar.css';
import { FaCircleChevronLeft, FaCircleChevronRight, FaClipboardQuestion, FaPersonCircleQuestion } from 'react-icons/fa6';
import { PROFESSOR_APPOINTMENTS_FILTER_MAP, PROFESSOR_APPOINTMENTS_FILTER_VALUE_MAP } from '@frontend/constants/maps/filters/professorAppointments.map.filter';
import NoContent from '@frontend/components/misc/NoContent';
import { filterProfessorAppointments } from '@frontend/utils/filters/filterProfessorAppointments.util';
import HomeBrief from '@frontend/components/misc/HomeBrief';
import { formatDateTime } from '@frontend/utils/formats/formatDateTime.util';
import type { ProfessorAppointment } from '@shared/types/appointment.type';
import { PROFESSOR_APPOINTMENTS } from '@frontend/constants/mocks/dto/professor/appointments.mock';
import type { ProfessorAvailability } from '@shared/types/professorAvailability.type';
import { PROFESSOR_AVAILABILITY } from '@frontend/constants/mocks/data/professorAvailability.mock';
import { PROFESSOR_BRIEF_INFOS } from '@frontend/constants/mocks/dto/professor/briefInfos.mock';
import type { ProfessorBriefInfos } from '@shared/types/professorBriefInfos.type';
import { Button } from '@frontend/components/button';
import { DAYS } from '@frontend/constants/days.const';
import { AVAILABLE_DAYS, AVAILABLE_DAYS_MAP } from '@frontend/constants/maps/days.map';
import type { AvailableDays } from '@shared/types/availableDays.type';
import { availabilityHoursRange } from '@frontend/utils/misc/availabilityHoursRange.util';

type EditingHours = {
  startHour : number;
  endHour   : number;
};

const Professor = (): React.JSX.Element => {

  
  const [searchValue, setSearchValue] = useState<string>('');
  const [filterValue, setFilterValue] = useState<typeof PROFESSOR_APPOINTMENTS_FILTER_MAP[number]['value']>('none');
  const [dateSelected, setDateSelected] = useState<Date | null>(new Date());
  
  const [ availability, setAvailability ] = useState<ProfessorAvailability[]>([]);
  const [ editingAvailability, setEditingAvailability ] = useState<AvailableDays | null>(null);
  const [ editAvailabilityHours, setEditAvailabilityHours ] = useState<EditingHours | null>(null);
  
  const [ editingMorningHours, setEditingMorningHours ] = useState<EditingHours | null>(null);
  const [ editingAfternoonHours, setEditingAfternoonHours ] = useState<EditingHours | null>(null);
  
  const [ professorAppointments, setProfessorAppointments ] = useState<ProfessorAppointment[]>([]);
  const [ professorBriefInfos, setProfessorBriefInfos ] = useState<ProfessorBriefInfos | null>(null);
  
  const noomInMinutes = 720;

  const BRIEF_RENDER = [
    { id: 1, icon: <FaRegClock className='text-cyan-500' size={28}/>             ,  label: 'Agendas confirmados'  , value: professorBriefInfos?.appointmentsConfirmed },
    { id: 2, icon: <FaRegClock className='text-cyan-500' size={28}/>             ,  label: 'Solicitações pendentes'  , value: professorBriefInfos?.pendingSolicitations },
    { id: 3, icon: <RiCalendarScheduleFill className='text-cyan-500' size={28}/> ,  label: 'Próxima agenda'     , value: professorBriefInfos?.nextAppointmentDateTime ? formatDateTime(professorBriefInfos.nextAppointmentDateTime) : '??/??/??, ??:??'},
  ];

  const filteredStudentAppointmentsData = filterProfessorAppointments(
    professorAppointments,
    searchValue,
    filterValue,
  );

  const selectedEditDayAvaliable = {
    startHour : availability.find((av) => av.dayOfWeek === editingAvailability)?.startHour,
    endHour   : availability.find((av) => av.dayOfWeek === editingAvailability)?.endHour,
  };

  const selectedEditDayAvaliableHoursRange = availabilityHoursRange(
    selectedEditDayAvaliable.startHour,
    selectedEditDayAvaliable.endHour,
  );

  const handleNewAvailability = async(days: string[]) => {
    alert('Novos dias:' + days);
  };

  useEffect(() => {
    (async() => {
      try {
        const [ response1, response2, response3 ] = [
          PROFESSOR_APPOINTMENTS,
          PROFESSOR_AVAILABILITY,
          PROFESSOR_BRIEF_INFOS,
        ];

        setProfessorAppointments(response1);
        setAvailability(response2);
        setProfessorBriefInfos(response3);
      } catch (error:unknown) {
        if (error instanceof Error) console.error(error.message);
      }
    })();
  },[]);

  return (
    <Layout 
    selectedTab='HOME'
    from='PROFESSOR'
    >
      <div className='grid grid-cols-[1fr_300px] gap-x-3 h-full min-h-0'>
        <div className='grid gap-y-3 grid-rows-[60px_1fr] min-h-0'>
          <div className='flex gap-5 max-w-200 mx-auto w-full justify-center'>
            { BRIEF_RENDER.map((item) => (
              item.id === 3 ? (
                <HomeBrief
                  key={item.id}
                  Icon={() => item.icon}
                  label={item.label}
                  value={item.value ?? '?'}
                  customStyle={{ value: 'text-[15px] mt-[1px]' }}
                />     
              ) : (
                <HomeBrief
                  key={item.id}
                  Icon={() => item.icon}
                  label={item.label}
                  value={item.value ?? '?'}
                />     
              ) 
            ))}
          </div>

          <div className='flex flex-col gap-3 py-2 px-10 h-full min-h-0 border border-cyan-400 rounded-lg bg-cyan-100/20'>
            <h3 className='self-center font-semibold text-lg text-cyan-500'>
              Agenda
            </h3>

            <div className='w-full flex gap-2'>
              <Input.Search
                onChange={(e) => setSearchValue(e.target.value)}
                onClear={() => setSearchValue('')}
                placeholder='Pesquisar por aluno, status, sala ou motivo'
                value={searchValue}
                customStyle={{ input: 'flex-4' }}
              />

              <Select.Default
                Icon={() => <FaFilter size={13}/>}
                placeholder='Filtro'
                optionsSchema='PROFESSOR_APPOINTMENT_FILTER'
                value={filterValue}
                onSelect={(value) => setFilterValue(value as typeof PROFESSOR_APPOINTMENTS_FILTER_MAP[number]['value'])}
              />
            </div>

            <div className='flex-1 min-h-0 flex flex-col gap-2 overflow-auto bg-white p-2 rounded-xl border border-cyan-300'>
              { filteredStudentAppointmentsData.length > 0 ? (
                filteredStudentAppointmentsData.map((appointment) => (
                  <Card.Appointment
                    from='PROFESSOR'
                    key={appointment.id}
                    { ...appointment }
                  />
                ))
              ) : (
                <NoContent
                  Icon={(searchValue || filterValue) ? () => <FaPersonCircleQuestion size={24}/> : () => <FaClipboardQuestion size={24}/>}
                  message={
                    searchValue && filterValue
                      ? `Nenhum resultado para "${searchValue}" com o filtro "${PROFESSOR_APPOINTMENTS_FILTER_VALUE_MAP[filterValue as keyof typeof PROFESSOR_APPOINTMENTS_FILTER_VALUE_MAP]}"`
                      : searchValue
                      ? `Nenhum resultado para "${searchValue}"`
                      : filterValue
                      ? `Nenhum resultado para o filtro "${PROFESSOR_APPOINTMENTS_FILTER_VALUE_MAP[filterValue as keyof typeof PROFESSOR_APPOINTMENTS_FILTER_VALUE_MAP]}"`
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

          <div className='relative flex flex-col self-start gap-1 border border-cyan-400 p-2 pt-1 rounded-lg bg-cyan-100/20 min-h-0'>
            { editingAvailability &&
              <button 
              className='absolute top-2 left-3 text-cyan-500 hover:brightness-95 active:brightness-90 cursor-pointer'
              onClick={() => {
                setEditAvailabilityHours(null);
                setEditingAvailability(null);
                setEditingAfternoonHours(null);
                setEditingMorningHours(null);
              }}
              >
                <FaArrowCircleLeft size={18}/>
              </button>
            }

            <h2 className='text-cyan-500 font-semibold self-center'>
              Disponibilidade
            </h2>

            <div className='flex flex-col gap-2 justify-between flex-1 p-2 min-h-0 overflow-auto bg-white border rounded-lg border-cyan-300'>          
              { editingAvailability ? (
                <div className='space-y-1'>
                  <h4 className='text-xs text-orange-500'>
                    Defina sua disponibilidade { (editingAvailability !== 'SUNDAY' && editingAvailability !== 'SATURDAY') 
                      ? 'às ' + (AVAILABLE_DAYS_MAP[editingAvailability].split('-')[0].toLowerCase() + 's-' + AVAILABLE_DAYS_MAP[editingAvailability].split('-')[1] + 's') 
                      : 'aos ' + AVAILABLE_DAYS_MAP[editingAvailability].toLowerCase() + 's'
                    }: 
                  </h4>
                  
                  <div className='flex gap-1 items-center'>
                    <button
                    onClick={() => setEditingMorningHours(editAvailabilityHours)}
                    className='text-orange-400 hover:brightness-95 hover:scale-[1.2] active:brightness-90 active:scale-[1.1] cursor-pointer'
                    >
                      <FaEdit className='text-orange-400'/>
                    </button>

                    <h5 className='flex items-center gap-1 text-sm text-cyan-500 font-semibold'>
                      Ás manhãs: <span className='text-gray-400 font-normal'>
                        { editingMorningHours ? (
                          <div className='flex'>
                            <input 
                              className='min-w-0 w-12 text-center outline-none'
                              type="text"
                              value={editingMorningHours.startHour} 
                            />

                            <span>ás</span>
                            
                            <input 
                              className='min-w-0 w-12 text-center outline-none'
                              type="text"
                              value={editingMorningHours.endHour} 
                            />
                          </div>
                        ) : (
                          selectedEditDayAvaliableHoursRange.morning
                        )}
                      </span>
                    </h5>
                  </div>
                  
                  <div className='flex gap-1 items-center'>
                    <button
                    onClick={() => setEditingAfternoonHours(editAvailabilityHours)}
                    className='text-orange-400 hover:brightness-95 hover:scale-[1.2] active:brightness-90 active:scale-[1.1] cursor-pointer'
                    >
                      <FaEdit className='text-orange-400'/>
                    </button>

                    <h5 className='flex items-center gap-1 text-sm text-cyan-500 font-semibold'>
                      Ás tardes: <span className='text-gray-400 font-normal'>
                        { editingAfternoonHours ? (
                          <div className='flex'>
                            <input 
                              className='min-w-0 w-12 text-center outline-none'
                              type="text"
                              value={editingAfternoonHours.startHour} 
                            />

                            <span>ás</span>
                            
                            <input 
                              className='min-w-0 w-12 text-center outline-none'
                              type="text"
                              value={editingAfternoonHours.endHour} 
                            />
                          </div>
                        ) : (
                          selectedEditDayAvaliableHoursRange.afternoon
                        )}
                      </span>
                    </h5>
                  </div>
                </div>
              ) : (
                <div className='grid grid-cols-4 gap-1.5'>
                  { AVAILABLE_DAYS.map((days) => {

                    const isAvailable = availability.some((a) => a.dayOfWeek === days.value);
                    const availableHoursOfTargetDay = availability.find((a) => a.dayOfWeek === days.value);

                    return (
                      <Button.Default
                      selected={isAvailable}
                        label={days.label.split('-')[0]}
                        customStyle={{ button: 'py-1 text-xs' }}
                        onClick={() => {
                          setEditingAvailability(days.value);
                          if (availableHoursOfTargetDay) {
                            setEditAvailabilityHours({
                              endHour   : availableHoursOfTargetDay.endHour,
                              startHour : availableHoursOfTargetDay.startHour,
                            });
                            return;
                          }
                        }}
                      />
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Professor