import React, { useEffect, useState } from 'react'
import { Modal } from '.';
import { Select } from '../select';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { editAppointmentSolicitationSchema, type EditAppointmentSolicitationFormData } from '@shared/schemas/appointmentSolicitation.schema';
import Warning from '../misc/Warning';
import { Input } from '../input';
import { Button } from '../button';
import { DAYS_BY_INDEX_MAP } from '@shared/utils/days.map';
import { FaEdit } from 'react-icons/fa';
import { ScheduleService } from '@frontend/services/schedule.service';
import { useToast } from '@frontend/contexts/ToastContext';
import { apiError } from '@frontend/utils/misc/apiError.util';

type Props = {
  title          : string;
  visible        : boolean;
  onRequestClose : () => void;
  onEdit         : (data: EditAppointmentSolicitationFormData) => void;
  initialData?: {
    appointmentId   : number;
    appointmentDate : string;
    hour            : string;
    reason          : string;
  }
  professor: {
    readonly id    : number;
    availableDays  : string[];
  }
};

const EditAppointment = (props:Props): React.JSX.Element => {

  const { toast } = useToast();

  const {
    handleSubmit,
    register,
    reset,
    setValue,
    watch,
    formState: { errors }
  } = useForm<EditAppointmentSolicitationFormData>({
    resolver: zodResolver(editAppointmentSolicitationSchema),
    defaultValues: {
      appointmentDate : '',
      hour            : '',
      reason          : '',
    }
  });
  
  const [professorAvailabilitySlots, setProfessorAvailabilitySlots] = useState<string[]>([]);
  
  const getProfessorAvailableSlotsToSchedule = async (
    professorId : number,
    dateTime    : string,
  ): Promise<void> => {
    try {

      const slots = await ScheduleService.getProfessorAvailableSlotsToSchedule(
        professorId,
        new Date(dateTime),
      );

      setProfessorAvailabilitySlots(slots);

    } catch (error:unknown) {
      toast(apiError(error), 'error');
    }
  };
  
  useEffect(() => {
    if (!props.initialData) return;

    reset({
      appointmentId   : props.initialData.appointmentId,
      appointmentDate : props.initialData.appointmentDate,
      hour            : props.initialData.hour,
      reason          : props.initialData.reason,
    });
  }, [props.visible]);

  useEffect(() => {
    if ( !props.visible || !props.professor.id || !watch('appointmentDate')) {
      return;
    }

    getProfessorAvailableSlotsToSchedule(
      props.professor.id,
      watch('appointmentDate')
    );
  }, [watch('appointmentDate'), props.visible, props.professor.availableDays]);

  return (
    <Modal.Default
    title={props.title}
    visible={props.visible}
    containerMaxWidth='max-w-76'
    containerPadding='p-3'
    onCloseRequest={props.onRequestClose}
    >
      <Select.DatePicker
        placeholder='Selecione uma data'
        label='Data do agendamento'
        customStyle={{ input: 'py-1.25!' }}
        value={watch('appointmentDate')}
        onChange={(date) => setValue('appointmentDate', date as string, { shouldValidate: true })}
        error={errors.appointmentDate?.message}
        disabledDate={(date) => {
          if (props.professor.availableDays.length === 0) return true;

          const day = DAYS_BY_INDEX_MAP[date.getDay()];

          return !props.professor.availableDays.includes(day);
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
          label='Editar'
          disabled={Object.keys(errors).length > 0}
          onClick={handleSubmit(props.onEdit)}
          Icon={() => <FaEdit />}
          customStyle={{ button: 'py-1.5! font-semibold' }}
        />
      </div>
    </Modal.Default>
  )
}

export default EditAppointment