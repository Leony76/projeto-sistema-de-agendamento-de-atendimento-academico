import React, { useState } from 'react'
import Layout from '../Layout'
import { FaArrowCircleLeft, FaFilter, FaRegClock } from 'react-icons/fa';
import { RiCalendarScheduleFill } from 'react-icons/ri';
import { Input } from '@/components/input';
import { Select } from '@/components/select';
import { Card } from '@/components/card';
import Calendar from 'react-calendar';
import '@/css/calendar.css';
import { FaCircleChevronLeft, FaCircleChevronRight, FaClipboardQuestion, FaPersonCircleQuestion } from 'react-icons/fa6';
import { PROFESSOR_APPOINTMENTS_FILTER_MAP, PROFESSOR_APPOINTMENTS_FILTER_VALUE_MAP } from '@/constants/maps/filters/professorAppointments.map.filter';
import NoContent from '@/components/misc/NoContent';
import { filterProfessorAppointments } from '@/utils/filters/filterProfessorAppointments.util';
import { AVAILABLE_DAYS, AVAILABLE_DAYS_MAP } from '@/constants/maps/days.map';
import { BiEdit } from 'react-icons/bi';
import { Button } from '@/components/button';
import { AVAILABLE_HOURS } from '@/constants/availableHours.const';
import HomeBrief from '@/components/misc/HomeBrief';
import { formatDateTime } from '@/utils/formats/formatDateTime.util';
import { PROFESSOR_APPOITMENTS_DATA } from '@/constants/mocks/users/professor/professorAppointmentsData.mock';
import { PROFESSOR_AVAILIBITY_DATA } from '@/constants/mocks/users/professor/professorAvailibityData.mock';
import { PROFESSOR_GENERAL_INFO_STATUS_DATA } from '@/constants/mocks/users/professor/professorGeneralInfoStatusData.mock';

const Professor = (): React.JSX.Element => {

  const BRIEF_RENDER = [
    { id: 1, icon: <FaRegClock className='text-cyan-500' size={28}/>             ,  label: 'Agendas confirmados'  , value: PROFESSOR_GENERAL_INFO_STATUS_DATA.pendingSolicitations },
    { id: 2, icon: <FaRegClock className='text-cyan-500' size={28}/>             ,  label: 'Solicitações pendentes'  , value: PROFESSOR_GENERAL_INFO_STATUS_DATA.pendingSolicitations },
    { id: 3, icon: <RiCalendarScheduleFill className='text-cyan-500' size={28}/> ,  label: 'Próxima agenda'     , value: formatDateTime(PROFESSOR_GENERAL_INFO_STATUS_DATA.nextPending)          },
  ];

  const [searchValue, setSearchValue] = useState<string>('');
  const [filterValue, setFilterValue] = useState<typeof PROFESSOR_APPOINTMENTS_FILTER_MAP[number]['value']>('none');
  const [dateSelected, setDateSelected] = useState<Date | null>(new Date());

  const [editAvailableDays, setEditAvailableDays]   = useState<string[]>(PROFESSOR_AVAILIBITY_DATA.days);
  const [editAvailableHours, setEditAvailableHours] = useState<string[]>(PROFESSOR_AVAILIBITY_DATA.hours);

  const [showEdit, setShowEdit] = useState<'AVAILABLE_HOURS' | 'AVAILABLE_DAYS' | null>(null);

  const filteredStudentAppointmentsData = filterProfessorAppointments(
    PROFESSOR_APPOITMENTS_DATA,
    searchValue,
    filterValue,
  );

  const handleNewAvailableDays = async(days: string[]) => {
    alert('Novos dias:' + days);
  };

  const handleNewAvailableHours = async(hours: string[]) => {
    alert('Novos horários:' + hours);
  };

  const handleToggleDay = (day: string) => {
    setEditAvailableDays(prev =>
      prev.includes(day)
        ? prev.filter(d => d !== day) 
        : [...prev, day]              
    );
  };

  const handleToggleHour = (hour: string) => {
    setEditAvailableHours(prev =>
      prev.includes(hour)
        ? prev.filter(h => h !== hour) 
        : [...prev, hour]              
    );
  };

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
            { showEdit &&
              <button 
              className='absolute top-2 left-3 text-cyan-500 hover:brightness-95 active:brightness-90 cursor-pointer'
              onClick={() => {
                switch (showEdit) {
                  case 'AVAILABLE_DAYS'  : handleNewAvailableDays(editAvailableDays);   break;
                  case 'AVAILABLE_HOURS' : handleNewAvailableHours(editAvailableHours); break;
                }
                setShowEdit(null);
              }}
              >
                <FaArrowCircleLeft size={18}/>
              </button>
            }

            <h2 className='text-cyan-500 font-semibold self-center'>
              Disponibilidade
            </h2>

            <div className='flex flex-col gap-2 justify-between flex-1 p-2 min-h-0 overflow-auto bg-white border rounded-lg border-cyan-300'>          
              { showEdit === 'AVAILABLE_DAYS' ? (
                <div className='flex flex-col gap-2'>
                  <label className='text-sm text-orange-500'>
                    Selecione seus dias disponíveis:
                  </label>

                  <div className='grid grid-cols-3 gap-2'>
                    { AVAILABLE_DAYS.map(( item ) => {
                      const isSelected = editAvailableDays.includes(item.value);
                      
                      return (
                      item.value !== 'SUNDAY' && (  
                        <Button.Default
                          label={item.label.split('-')[0]}
                          selected={isSelected}                     
                          onClick={() => handleToggleDay(item.value)}
                          customStyle={{ button: 'h-6 text-xs font-semibold' }}
                        />
                      )
                    )})}
                  </div>
                </div>
              ) : showEdit === 'AVAILABLE_HOURS' ? (
                <div className='flex flex-col gap-2'>
                  <label className='text-sm text-orange-500'>
                    Selecione seus horários disponíveis:
                  </label>

                  <div className='grid grid-cols-4 gap-2'>
                    { AVAILABLE_HOURS.map(( item ) => {
                      const isSelected = editAvailableHours.includes(item);
                      
                      return (
                        <Button.Default
                          label={item}
                          selected={isSelected}                          
                          onClick={() => handleToggleHour(item)}
                          customStyle={{ button: 'h-6 text-xs font-semibold' }}
                        />
                    )})}
                  </div>
                </div>
              ) : (
                <>
                  <div className='flex gap-2'>
                    <button 
                    onClick={() => setShowEdit('AVAILABLE_DAYS')}
                    className='text-orange-400 cursor-pointer h-fit hover:brightness-120 active:brightness-100'>
                      <BiEdit className='scale-[1.3]'/>
                    </button>

                    <label className=' text-orange-400 font-semibold text-[13px]'>
                      Dias: { PROFESSOR_AVAILIBITY_DATA.days.map(( day, index ) => (
                        <span 
                        key={index}
                        className='text-cyan-500 font-normal '
                        >
                          { AVAILABLE_DAYS_MAP[day] }
                          {index === PROFESSOR_AVAILIBITY_DATA.days.length - 2
                            ? ' e '
                            : index < PROFESSOR_AVAILIBITY_DATA.days.length - 2
                            ? ', '
                            : ''
                          }
                        </span>
                      ))}        
                    </label>
                  </div>
                  
                  <div className='flex gap-2'>
                    <button 
                    onClick={() => setShowEdit('AVAILABLE_HOURS')}
                    className='text-orange-400 cursor-pointer h-fit hover:brightness-120 active:brightness-100'>
                      <BiEdit className='scale-[1.3]'/>
                    </button>

                    <label className=' text-orange-400 font-semibold text-[13px]'>
                      Horários: { PROFESSOR_AVAILIBITY_DATA.hours.map((hour, index) => (
                        <span 
                        key={index}
                        className='text-cyan-500 font-normal'
                        >
                          { hour }
                          {index === PROFESSOR_AVAILIBITY_DATA.hours.length - 2
                            ? ' e '
                            : index < PROFESSOR_AVAILIBITY_DATA.hours.length - 2
                            ? ', '
                            : ''
                          }
                        </span>
                      ))}
                    </label>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Professor