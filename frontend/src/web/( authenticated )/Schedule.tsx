import React, { useEffect, useState } from 'react'
import Layout from './Layout'
import { FaArrowCircleLeft, FaExclamation, FaFilter } from 'react-icons/fa';
import { Input } from '@frontend/components/input';
import { Select } from '@frontend/components/select';
import { Card } from '@frontend/components/card';
import '@frontend/css/calendar.css';
import { Button } from '@frontend/components/button';
import { useForm } from 'react-hook-form';
import { appointmentSolicitationSchema, type AppointmentSolicitationFormData } from '@frontend/schemas/appointmentSolicitation.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import Warning from '@frontend/components/misc/Warning';
import { formatMergeDateWithTime } from '@frontend/utils/formats/formatMergeDateWithTime.util';
import { filterToScheduleProfessors } from '@frontend/utils/filters/filterToScheduleProfessors.util';
import NoContent from '@frontend/components/misc/NoContent';
import { FaClipboardQuestion, FaPersonCircleQuestion } from 'react-icons/fa6';
import { TO_SCHEDULE_PROFESSORS_FILTER_MAP, TO_SCHEDULE_PROFESSORS_FILTER_VALUE_MAP } from '@frontend/constants/maps/filters/toScheduleProfessors.map.filter';
import { getAvailableSlots, TO_SCHEDULE_PROFESSORS } from '@frontend/constants/mocks/dto/professor/toScheduleProfessors.mock';
import type { ToScheduleProfessors } from '@shared/types/toScheduleProfessors.type';
import { DAYS } from '@frontend/constants/days.const';

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

  const [selectedProfessorData, setSelectedProfessorData] = useState<ToScheduleProfessors | null>(null);
  const [toScheduleProfessors, setToScheduleProfessors] = useState<ToScheduleProfessors[]>([]);
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const appointmentDate = watch('appointmentDate');

  const handleAppointmentSolicitation = async(data: AppointmentSolicitationFormData): Promise<void> => {

    const appointmentDateTime: string = formatMergeDateWithTime(data.appointmentDate, data.hour);
    
    alert('Solicitado!');
    reset();
    setShowToScheduleForm(false);
    console.log(data, appointmentDateTime);
  };

  const filteredProfessorsData = filterToScheduleProfessors(
    toScheduleProfessors,
    searchValue,
    filterValue,
  );

  useEffect(() => {
    register('appointmentDate');
    register('professorName');
  }, [register]);

  useEffect(() => {
    if (!selectedProfessorData || !watch('appointmentDate')) {
      setAvailableSlots([]);
      return;
    }

    const result = getAvailableSlots({
      professorId: selectedProfessorData.id,
      date: watch('appointmentDate'),
    });

    setAvailableSlots(result.slots);

  }, [selectedProfessorData, appointmentDate]);

  const noContentFound = () => {
  
    const filterLabel = TO_SCHEDULE_PROFESSORS_FILTER_VALUE_MAP[filterValue as keyof typeof TO_SCHEDULE_PROFESSORS_FILTER_VALUE_MAP];
    const hasSearch = !!searchValue;
    const hasFilter = filterValue && filterValue !== 'none';

    const NoContentIcon = (hasSearch || hasFilter)
      ? <FaPersonCircleQuestion size={24}/>
      : <FaClipboardQuestion size={24}/>
    ;

    let message = 'Nenhum professor disponível para agendamento no momento!';

    if (hasSearch && hasFilter) {
      message = `Nenhum resultado para "${searchValue}" com o filtro "${filterLabel}"`;
    } else if (hasSearch) {
      message = `Nenhum resultado para "${searchValue}"`;
    } else if (hasFilter) {
      message = filterLabel === 'Nenhum'
        ? 'Nenhum professor disponível para agendamento no momento!'
        : `Nenhum resultado para o filtro "${filterLabel}"`;
    }

    return {
      message,
      Icon: NoContentIcon,
    };
  };

  useEffect(() => {
    const getData = async():Promise<void> => {
      try {
        const response = TO_SCHEDULE_PROFESSORS;

        setToScheduleProfessors(response);
      } catch (error:unknown) {
        if (error instanceof Error) console.error(error.message);
      }
    };

    getData();
  }, []);

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
                      setValue('professorName', professor.name);
                    }}}
                  />
                ))
              ) : (
                <NoContent
                  Icon={() => noContentFound().Icon}
                  message={noContentFound().message}
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
                  value={watch('appointmentDate')}
                  onChange={(date) => setValue('appointmentDate', date as string, { shouldValidate: true })}
                  error={errors.appointmentDate?.message}
                  disabledDate={(date) => {
                    if (!selectedProfessorData) return true;

                    const day = DAYS[date.getDay()];

                    const dayAvailability = selectedProfessorData.availability.filter(
                      (a) => a.dayOfWeek === day
                    );

                    if (dayAvailability.length === 0) return true;

                    return false;
                  }}
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
                          {availableSlots.length > 0 ? (
                            availableSlots.map((hour) => (
                              <Button.Default
                                key={hour}
                                label={hour}
                                selected={hour === watch('hour')}
                                onClick={() => setValue('hour', hour, { shouldValidate: true })}
                                customStyle={{
                                  button: 'w-fit! py-1 px-4! rounded-lg! text-xs font-bold',
                                }}
                              />
                            ))
                          ) : (
                            <span className='text-xs text-gray-400'>
                              Nenhum horário disponível para este dia
                            </span>
                          )}

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