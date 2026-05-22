import React, { useEffect, useState } from 'react'
import Layout from './Layout'
import { FaArrowCircleLeft, FaCalendarCheck, FaExclamation, FaFilter } from 'react-icons/fa';
import { Input } from '@frontend/components/input';
import { Select } from '@frontend/components/select';
import { Card } from '@frontend/components/card';
import '@frontend/css/calendar.css';
import { Button } from '@frontend/components/button';
import { useForm } from 'react-hook-form';
import { appointmentSolicitationSchema, type AppointmentSolicitationFormData } from '@shared/schemas/appointmentSolicitation.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import Warning from '@frontend/components/misc/Warning';
import { formatMergeDateWithTime } from '@frontend/utils/formats/formatMergeDateWithTime.util';
import { filterToScheduleProfessors } from '@frontend/utils/filters/filterToScheduleProfessors.util';
import NoContent from '@frontend/components/misc/NoContent';
import { FaClipboardQuestion, FaPersonCircleQuestion } from 'react-icons/fa6';
import { TO_SCHEDULE_PROFESSORS_FILTER_MAP, TO_SCHEDULE_PROFESSORS_FILTER_VALUE_MAP } from '@frontend/constants/maps/filters/toScheduleProfessors.map.filter';
import type { AvailableProfessorToScheduleResponse as AvailableProfessorToSchedule } from '@shared/types/dtos/availableProfessorToSchedule';
import { noContentFound } from '@frontend/utils/misc/noContentFound.util';
import { useToast } from '@frontend/contexts/ToastContext';
import { apiError } from '@frontend/utils/misc/apiError.util';
import { ScheduleService } from '@frontend/services/schedule.service';
import { DAYS_BY_INDEX_MAP } from '@shared/utils/days.map';
import { useAuth } from '@frontend/hooks/useAuth.hook';
import { Navigate } from 'react-router-dom';

const Schedule = (): React.JSX.Element => {

  const { user } = useAuth();
  if (!user) return <Navigate to={'/'}/>

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
      professorId     : undefined,
      studentId       : undefined,
      appointmentDate : '',
      professorName   : '',
      reason          : '',
      hour            : '',
    },
  });

  const { toast } = useToast();

  const [searchValue, setSearchValue] = useState<string>('');
  const [filterValue, setFilterValue] = useState<typeof TO_SCHEDULE_PROFESSORS_FILTER_MAP[number]['value']>('none');

  const [showToScheduleForm, setShowToScheduleForm] = useState<boolean>(false);

  const [selectedProfessorData, setSelectedProfessorData] = useState<AvailableProfessorToSchedule | null>(null);
  const [professorAvailabilitySlots, setProfessorAvailabilitySlots] = useState<string[]>([]);
  const [toScheduleProfessors, setToScheduleProfessors] = useState<AvailableProfessorToSchedule[]>([]);
  const appointmentDate = watch('appointmentDate');

  const handleAppointmentSolicitation = async(data: AppointmentSolicitationFormData): Promise<void> => {
    try {
      const appointmentDateTime: string = formatMergeDateWithTime(data.appointmentDate, data.hour);
      
      console.log(appointmentDateTime);

      const response = await ScheduleService.makeAppointmentSolicitation({
        studentId   : data.studentId,
        professorId : data.professorId,
        dateTime    : appointmentDateTime,
        reason      : data.reason,
      });

      if (response.success) {
        toast(response.message);

        reset();
        setShowToScheduleForm(false);
        console.log(response.data);
      }
    } catch (error:unknown) {
      toast(apiError(error), 'error');
    }
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

  const noContent = noContentFound(
    'Nenhum professor disponível para agendamento no momento!',
    TO_SCHEDULE_PROFESSORS_FILTER_VALUE_MAP[filterValue as keyof typeof TO_SCHEDULE_PROFESSORS_FILTER_VALUE_MAP],
    searchValue,
    filterValue && filterValue !== 'none',
    {
      notFound   : FaPersonCircleQuestion,
      notContent : FaClipboardQuestion
    },
  );

  useEffect(() => {
    if (!selectedProfessorData || !appointmentDate) {
      setProfessorAvailabilitySlots([]);
      return;
    }

    (async () => {
      try {

        const slots = await ScheduleService.getProfessorAvailableSlotsToSchedule(
          selectedProfessorData.id,
          new Date(appointmentDate),
        );

        setProfessorAvailabilitySlots(slots);

      } catch (error:unknown) {
        toast(apiError(error), 'error');
      }
    })();

  }, [selectedProfessorData, appointmentDate]);

  useEffect(() => {
    (async():Promise<void> => {
      try {
        const [ availableProfessors ] = await Promise.all([
          ScheduleService.getAvailableProfessorsToSchedule(),
        ]);

        setToScheduleProfessors(availableProfessors);
      } catch (error:unknown) {
        toast(apiError(error), 'error');
      }
    })();
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
            <h3 className='flex items-center gap-1.5 self-center font-semibold text-lg text-cyan-500'>
              <FaCalendarCheck />
              Agendamento
            </h3>

            <div className='w-full flex gap-2'>
              <Input.Search
                onChange={(e) => setSearchValue(e.target.value)}
                onClear={() => setSearchValue('')}
                placeholder='Pesquisar por professor, disciplina(s) ou dias disponíveis'
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
                      setValue('professorId', professor.id);
                      setValue('studentId', user.id);
                    }}}
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

                    const day = DAYS_BY_INDEX_MAP[date.getDay()];

                    return !selectedProfessorData.availableDays.includes(day);
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
                          {professorAvailabilitySlots.length > 0 ? (
                            professorAvailabilitySlots.map((hour) => (
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