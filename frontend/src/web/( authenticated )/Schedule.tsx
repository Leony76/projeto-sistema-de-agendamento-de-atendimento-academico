import React, { useEffect, useState } from 'react'
import Layout from './Layout'
import { FaArrowCircleLeft, FaExclamation, FaFilter } from 'react-icons/fa';
import { Input } from '@/components/input';
import { Select } from '@/components/select';
import { Card } from '@/components/card';
import '@/css/calendar.css';
import type { Professor } from '@/types/professor.type';
import { Button } from '@/components/button';
import { useForm } from 'react-hook-form';
import { appointmentSolicitationSchema, type AppointmentSolicitationFormData } from '@/schemas/appointmentSolicitation.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import Warning from '@/components/misc/Warning';
import { formatMergeDateWithTime } from '@/utils/formats/formatMergeDateWithTime.util';
import type { ProfessorScheduledAppointments } from '@/types/professorScheduledAppointments.type';
import { normalizeAppointments } from '@/utils/misc/normalizeAppointments.util';
import { filterToScheduleProfessors } from '@/utils/filters/filterToScheduleProfessors.util';
import NoContent from '@/components/misc/NoContent';
import { FaClipboardQuestion, FaPersonCircleQuestion } from 'react-icons/fa6';
import { TO_SCHEDULE_PROFESSORS_FILTER_MAP, TO_SCHEDULE_PROFESSORS_FILTER_VALUE_MAP } from '@/constants/maps/filters/toScheduleProfessors.map.filter';

const PROFESSORS_DATA: Professor[] = [
  {
    id: 1,
    name: 'Cloud Strife',
    photo: 'https://static0.thegamerimages.com/wordpress/wp-content/uploads/2021/04/cloud-strife-ff7remake.jpg?w=1600&h=900&fit=crop',
    discipline: 'ENGLISH',
    available: {
      days: ['FRIDAY', 'SATURDAY', 'TUESDAY'],
      hours: ['10:00', '13:00', '15:00'],
    },
  },
  {
    id: 2,
    name: 'Madara Uchiha',
    discipline: 'GEOGRAPHY',
    photo: 'https://criticalhits.com.br/wp-content/uploads/2021/05/Madara_Rinnegan.png',
    available: {
      days: ['MONDAY', 'THURSDAY', 'TUESDAY'],
      hours: ['11:00', '14:00', '16:00'],
    },
  },
];

const PROFESSORS_APPOINTMENTS_DATA: ProfessorScheduledAppointments[] = [
  {
    id: 1,
    professorId: 1,
    appointments: [
      '2026-04-24T13:00:00.000Z',
      '2026-04-25T15:00:00.000Z',
      '2026-04-28T15:00:00.000Z',
    ],
  },
  {
    id: 2,
    professorId: 2,
    appointments: [
      '2026-04-27T11:00:00.000Z',
      '2026-04-27T14:00:00.000Z',
      '2026-04-27T16:00:00.000Z',
      '2026-04-29T11:00:00.000Z',
      '2026-04-30T11:00:00.000Z',
    ],
  },
]

const Schedule = ():React.JSX.Element => {

  const {
    handleSubmit,
    register,
    setValue,
    reset,
    watch,
    formState: { errors }
  } = useForm<AppointmentSolicitationFormData>({
    resolver: zodResolver(appointmentSolicitationSchema),
    defaultValues: {
      appointmentDate : '',
      professorName   : '',
      reason          : '',
      hour            : '',
    },
  })

  const [searchValue, setSearchValue] = useState<string>('');
  const [filterValue, setFilterValue] = useState<typeof TO_SCHEDULE_PROFESSORS_FILTER_MAP[number]['value']>('none');

  const [showToScheduleForm, setShowToScheduleForm] = useState<boolean>(false);

  const [selectedProfessorData, setSelectedProfessorData] = useState<Professor | null>(null);
  const [selectedProfessorScheduledAppointments, setSelectedProfessorScheduledAppointments] = useState<ProfessorScheduledAppointments['appointments'] | null>(null);

  const selectedDate = watch('appointmentDate');

  const selectedDateKey = selectedDate
    ? new Date(selectedDate).toISOString().split('T')[0]
    : ''
  ;

  const appointmentsMap = selectedProfessorScheduledAppointments
    ? normalizeAppointments(selectedProfessorScheduledAppointments)
    : {}
  ;

  const bookedHours = selectedDateKey
    ? appointmentsMap[selectedDateKey] || []
    : []
  ;

  const handleAppointmentSolicitation = async(data: AppointmentSolicitationFormData): Promise<void> => {

    const appointmentDateTime: string = formatMergeDateWithTime(data.appointmentDate, data.hour);
    
    alert('Solicitado!')
    console.log(data, appointmentDateTime);
  };

  const getSelectedProfessorScheduledAppointments = async(professorId: number): Promise<void> => {
    try {
      const result = PROFESSORS_APPOINTMENTS_DATA.find((item) => item.professorId === professorId);

      if (result) setSelectedProfessorScheduledAppointments(result.appointments);
    } catch (error:unknown) {
      if (error instanceof Error) console.error(error.message);
    }
  }; 

  useEffect(() => {
    register('appointmentDate');
    register('professorName');
  }, [register]);

  const filteredProfessorsData = filterToScheduleProfessors(
    PROFESSORS_DATA,
    searchValue,
    filterValue,
  );

  return (
    <Layout 
    from='STUDENT'
    selectedTab='TO_SCHEDULE'
    >
      <div className={`
        grid gap-x-3 h-full min-h-0 
        ${showToScheduleForm
          ? 'grid-cols-[1fr_300px]'
          : 'grid-cols-1 mx-15'
        }
      `}>
        <div className='grid gap-y-3 grid-rows-1 min-h-0'>
          <div className='flex flex-col gap-3 py-2 px-10 h-full min-h-0 border border-cyan-400 rounded-lg bg-cyan-100/20'>
            <h3 className='self-center font-semibold text-lg text-cyan-500'>
              Professores
            </h3>

            <div className='w-full flex gap-2'>
              <Input.Search
                onChange={(e) => setSearchValue(e.target.value)}
                onClear={() => setSearchValue('')}
                placeholder='Pesquisar por professor, disciplina, dias disponíveis ou horários disponíveis'
                value={searchValue}
                customStyle={{ input: 'flex-4' }}
              />

              <Select.Default
                Icon={() => <FaFilter size={13}/>}
                placeholder='Filtro'
                optionsSchema='TO_SCHEDULE_PROFESSORS_FILTER'
                value={filterValue}
                onSelect={(value) => setFilterValue(value as typeof TO_SCHEDULE_PROFESSORS_FILTER_MAP[number]['value'])}
              />
            </div>

            <div className='flex-1 min-h-0 flex flex-col gap-2 overflow-auto bg-white p-2 rounded-xl border border-cyan-300'>
              { filteredProfessorsData.length > 0 ? (
                filteredProfessorsData.map(( professor ) => (
                  <Card.ProfessorInfos
                    key={professor.id}
                    { ...professor }
                    onClick={{ toSchedule: () => {
                      reset();
                      setShowToScheduleForm(true);
                      setSelectedProfessorData(professor);
                      getSelectedProfessorScheduledAppointments(professor.id);
                      setValue('professorName', professor.name);
                    }}}
                  />
                ))
              ) : (
                <NoContent
                  Icon={(searchValue || filterValue) ? () => <FaPersonCircleQuestion size={24}/> : () => <FaClipboardQuestion size={24}/>}
                  message={
                    searchValue && filterValue !== 'none'
                      ? `Nenhum resultado para "${searchValue}" com o filtro "${TO_SCHEDULE_PROFESSORS_FILTER_VALUE_MAP[filterValue as keyof typeof TO_SCHEDULE_PROFESSORS_FILTER_VALUE_MAP]}"`
                      : searchValue
                      ? `Nenhum resultado para "${searchValue}"`
                      : filterValue
                      ? `Nenhum resultado para o filtro "${TO_SCHEDULE_PROFESSORS_FILTER_VALUE_MAP[filterValue as keyof typeof TO_SCHEDULE_PROFESSORS_FILTER_VALUE_MAP]}"`
                      : `Nenhum professor disponível para agendamento no momento!`
                  }
                />
              )}
            </div>
          </div>
        </div>
        
        { showToScheduleForm &&
          <div className='grid grid-rows-[1fr] min-h-0 gap-y-3'>
            <div className='relative flex flex-col min-h-0 h-full overflow-hidden px-3 py-2 gap-2 border border-cyan-400 rounded-lg bg-cyan-100/20'>
              <button 
              className='absolute top-3'
              onClick={() => {
                setShowToScheduleForm(false);
                reset();
              }}
              >
                <FaArrowCircleLeft className='text-cyan-500 cursor-pointer text-xl hover:brightness-95 active:brightness-90'/>
              </button>
            
              <h3 className='font-semibold self-center text-lg text-cyan-500'>
                Agendamento
              </h3>

              <p className='text-orange-400 text-xs break-all'>
                Informações a respeito do agendamento a ser realizado.
              </p>

              <div className='flex-1 min-h-0 gap-3 overflow-auto py-1 flex flex-col border-y border-cyan-100'>
                <Input.Default
                  label='Professor'
                  readOnly
                  customStyle={{ input: 'h-8' }}
                  value={selectedProfessorData?.name}
                  error={errors.professorName?.message}
                />

                <Select.DatePicker
                  placeholder='Selecione uma data'
                  label='Data do agendamento'
                  customStyle={{ input: 'py-1.25!' }}
                  appointmentsMap={appointmentsMap}
                  availableDays={selectedProfessorData?.available.days}
                  availableHours={selectedProfessorData?.available.hours}
                  value={watch('appointmentDate')}
                  onChange={(date) => setValue('appointmentDate', date as string, { shouldValidate: true })}
                  error={errors.appointmentDate?.message}
                />

                <div className='space-y-1'>
                  <div>
                    <h4 className={`
                      text-sm font-semibold text-orange-500 
                      ${ watch('appointmentDate') ? 'mb-1' : '-mb-1' }
                    `}>
                      Horários disponíveis
                    </h4>

                    { watch('appointmentDate') ? (
                      <>
                        <p className='text-xs text-gray-400'>
                          Escolha um horário disponível do professor:
                        </p>

                        <div className='flex flex-wrap gap-2 mt-2'>
                          {selectedProfessorData?.available.hours
                            .filter(( hour ) => !bookedHours.includes(hour)) 
                            .map(( hour, index ) => (
                              <Button.Default
                                key={index}
                                label={hour}
                                selected={hour === watch('hour')}
                                onClick={() => setValue('hour', hour, { shouldValidate: true })}
                                customStyle={{
                                  button: 'w-fit! py-1 px-4! rounded-lg! text-xs font-bold',
                                }}
                              />
                          ))}
                          
                          {errors.hour?.message && <Warning error={errors.hour.message}/>}
                        </div>
                      </>
                    ) : (
                      <span className='text-xs text-gray-400'>
                        Selecione a data do agendamento
                      </span>
                    )}
                  </div>

                  <Input.TextArea
                    label='Motivo'
                    maxLength={50}
                    { ...register('reason') }
                    value={watch('reason')}
                    error={errors.reason?.message}
                  />

                  <Button.Default
                    label='Solicitar agendamento'
                    disabled={Object.keys(errors).length > 0}
                    onClick={handleSubmit(handleAppointmentSolicitation)}
                    Icon={() => <FaExclamation />}
                    customStyle={{ button: 'py-1.5! font-semibold' }}
                  />
                </div>
              </div>
            </div>
          </div>
        }
      </div>
    </Layout>
  )
}

export default Schedule