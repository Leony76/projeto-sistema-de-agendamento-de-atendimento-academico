import { AVAILABLE_DAYS, AVAILABLE_DAYS_MAP } from '@shared/utils/days.map';
import React, { useState } from 'react'
import { FaArrowCircleLeft, FaCalendarPlus, FaCheckSquare, FaEdit } from 'react-icons/fa';
import { Button } from '../button';
import type { ProfessorAvailability, Shift } from '@shared/types/professorAvailability.type';
import { useToast } from '@frontend/contexts/ToastContext';
import ShiftHourEditor from '../misc/ShiftHourEditor';
import { useAuth } from '@frontend/hooks/useAuth.hook';
import { Navigate } from 'react-router-dom';
import { formatMinutesToTime } from '@frontend/utils/formats/formartMinutesInHours.util';
import { ProfessorService } from '@frontend/services/professor.service';
import { apiError } from '@frontend/utils/misc/apiError.util';
import { RiSettingsFill } from 'react-icons/ri';

type Props = {
  availability : ProfessorAvailability[];
  refresh      : () => void;
};

const EditProfessorAvailability = (props:Props): React.JSX.Element => {

  const { user } = useAuth();
  if (!user) return <Navigate to={'/'}/>

  const { toast } = useToast();

  const [ shiftEditing, setShiftEditing ] = useState<Shift | null>(null);
  const [ oldAvailability, setOldAvailability ] = useState<ProfessorAvailability | null>(null);
  const [ defineAvailability, setDefineAvailability ] = useState<boolean>(false);
  const [ newAvailability, setNewAvailability ] = useState<ProfessorAvailability | null>(null);

  const handleNewAvailability = async(professorId: number, data: ProfessorAvailability): Promise<void> => {
    try {  
      const response = await ProfessorService.defineNewAvailability(professorId, data);
      
      if (response.success) {
        toast(response.message);
        console.log(response.data);
        props.refresh();

        if (defineAvailability && newAvailability) {
          setDefineAvailability(false);
          setNewAvailability(null);
        }
      }
    } catch (error:unknown) {
      toast(apiError(error), 'error');
    }
  };

  const SHIFT_LABELS: Record<Shift, string> = {
    MORNING   : 'Às manhãs',
    AFTERNOON : 'Às tardes',
  };

  const SHIFT_HOURS_LIMITS: ProfessorAvailability['shift'] = {
    MORNING: { 
      start : '07:00', 
      end   : '11:30'    
    },
    AFTERNOON: { 
      start : '13:00', 
      end   : '18:00' 
    },
  };

  const SHIFTS: Shift[] = ['MORNING', 'AFTERNOON'];

  const updateShiftHour = (shift: Shift, field: 'start' | 'end', value: string) => {
    setNewAvailability(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        shift: {
          ...prev.shift,
          [shift]: {
            ...prev.shift[shift],
            [field]: value,
          },
        },
      };
    });
  };

  const restoreShiftHour = (shift: Shift, field: 'start' | 'end') => {
    setNewAvailability(prev => {
      if (!prev || !oldAvailability) return prev;
      return {
        ...prev,
        shift: {
          ...prev.shift,
          [shift]: {
            ...prev.shift[shift],
            [field]:
              oldAvailability.shift[shift][field],
          },
        },
      };
    });
  };

  const formatAvailability = (item: ProfessorAvailability): ProfessorAvailability => {
    return {
      ...item,
      shift: {
        MORNING : {
          start : item.shift.MORNING.start
            ? formatMinutesToTime(Number(item.shift.MORNING.start))
            : '',
          end : item.shift.MORNING.end
            ? formatMinutesToTime(Number(item.shift.MORNING.end))
            : '',
        },
        AFTERNOON: {
          start : item.shift.AFTERNOON.start
            ? formatMinutesToTime(Number(item.shift.AFTERNOON.start))
            : '',
          end : item.shift.AFTERNOON.end
            ? formatMinutesToTime(Number(item.shift.AFTERNOON.end))
            : '',
        },
      },
    };
  };

  return (
    <>
      {(newAvailability || defineAvailability) && (
        <button
          className='absolute top-2 left-3 text-cyan-500 hover:brightness-95 active:brightness-90 cursor-pointer'
          onClick={() => {
            if (defineAvailability && newAvailability && !oldAvailability) {
              setNewAvailability(null);
              setShiftEditing(null);
              return;
            }

            setDefineAvailability(false);
            setNewAvailability(null);
            setOldAvailability(null);
            setShiftEditing(null);
          }}
        >
          <FaArrowCircleLeft size={18}/>
        </button>
      )}

      <h2 className='text-cyan-500 font-semibold self-center'>
        Disponibilidade
      </h2>

      <div className='flex flex-col gap-2 justify-between flex-1 p-2 min-h-0 overflow-auto bg-white border rounded-lg border-cyan-300'>
        {defineAvailability ? (
          !newAvailability ? (
            <div className='flex flex-col gap-2'>
              <h4 className='text-xs text-orange-500'>
                Escolha o dia da disponibilidade:
              </h4>

              <div className='grid grid-cols-4 gap-1.5'>
                {AVAILABLE_DAYS.filter((day) => !props.availability.some(
                  (availability) => availability.dayOfWeek === day.value
                )).map((item) => (
                    <Button.Default
                      key={item.label}
                      label={item.label.split('-')[0]}
                      customStyle={{ button: 'py-1 text-xs' }}
                      onClick={() => {
                        const availability: ProfessorAvailability = {
                          dayOfWeek : item.value,
                          shift     : {
                            MORNING   : { start: '', end: '' },
                            AFTERNOON : { start: '', end: '' },
                          },
                        };

                        setNewAvailability(availability);
                      }}
                    />
                  ))}
              </div>
            </div>
          ) : (
            <div className='space-y-2'>
              <h4 className='text-xs text-orange-500'>
                Defina sua disponibilidade para{' '}
                {AVAILABLE_DAYS_MAP[newAvailability.dayOfWeek].toLowerCase()}:
              </h4>

              {SHIFTS.map((shift) => (
                <div
                key={shift}
                className='flex gap-1 items-center'
                >
                  <button
                  className='text-orange-400 hover:brightness-95 hover:scale-[1.2] active:brightness-90 active:scale-[1.1] cursor-pointer'
                  onClick={() => {
                    setShiftEditing((prev) => {
                      if (prev === shift) {
                        handleNewAvailability(user.id, newAvailability);
                        return null;
                      }

                      return shift;
                    });
                  }}
                  >
                    {shiftEditing === shift
                      ? <FaCheckSquare className='text-green-500' />
                      : <FaEdit />
                    }
                  </button>

                  <h5 className='flex items-center gap-1 text-sm text-cyan-500 font-semibold'>
                    {SHIFT_LABELS[shift]}:

                    <span className='text-gray-400 font-normal'>
                      <ShiftHourEditor
                        newShiftHours={newAvailability.shift[shift]}
                        oldShiftHours={newAvailability.shift[shift]}
                        shiftHoursLimit={SHIFT_HOURS_LIMITS[shift]}
                        editing={shiftEditing === shift}
                        onChange={{
                          start : (value) => updateShiftHour(shift, 'start', value),
                          end   : (value) => updateShiftHour(shift, 'end', value),
                        }}
                        onRestore={{
                          start : () => restoreShiftHour(shift, 'start'),
                          end   : () => restoreShiftHour(shift, 'end'),
                        }}
                      />
                    </span>
                  </h5>
                </div>
              ))}
            </div>
          )
        ) : newAvailability && oldAvailability ? (
          <div className='space-y-2'>
            <h4 className='text-xs text-orange-500'>
              Defina sua disponibilidade para{' '}
              {AVAILABLE_DAYS_MAP[newAvailability.dayOfWeek].toLowerCase()}:
            </h4>

            {SHIFTS.map((shift) => (
              <div
              key={shift}
              className='flex gap-1 items-center'
              >
                <button
                className='text-orange-400 hover:brightness-95 hover:scale-[1.2] active:brightness-90 active:scale-[1.1] cursor-pointer'
                onClick={() => {
                  setShiftEditing((prev) => {
                    if (prev === shift) {
                      handleNewAvailability(user.id, newAvailability);
                      return null;
                    }

                    return shift;
                  });
                }}
                >
                  {shiftEditing === shift
                    ? <FaCheckSquare className='text-green-500' />
                    : <FaEdit />
                  }
                </button>

                <h5 className='flex items-center gap-1 text-sm text-cyan-500 font-semibold'>
                  {SHIFT_LABELS[shift]}:

                  <span className='text-gray-400 font-normal'>
                    <ShiftHourEditor
                      newShiftHours={newAvailability.shift[shift]}
                      oldShiftHours={oldAvailability.shift[shift]}
                      shiftHoursLimit={SHIFT_HOURS_LIMITS[shift]}
                      editing={shiftEditing === shift}
                      onChange={{
                        start : (value) => updateShiftHour(shift, 'start', value),
                        end   : (value) => updateShiftHour(shift, 'end', value),
                      }}
                      onRestore={{
                        start : () => restoreShiftHour(shift, 'start'),
                        end   : () => restoreShiftHour(shift, 'end'),
                      }}
                    />
                  </span>
                </h5>
              </div>
            ))}
          </div>
        ) : props.availability.length > 0 ? (
          <div className='grid grid-cols-4 gap-1.5'>
            {props.availability.map((item) => (
              <Button.Default
                key={item.dayOfWeek}
                label={AVAILABLE_DAYS_MAP[item.dayOfWeek].split('-')[0]}
                customStyle={{button: 'py-1 text-xs'}}
                onClick={() => {
                  const formatted = formatAvailability(item);

                  setNewAvailability(formatted);
                  setOldAvailability(formatted);
                }}
              />
            ))}

            { props.availability.length < 6 &&
              <Button.Default
                label=''
                Icon={() => <FaCalendarPlus size={12}/>}
                customStyle={{
                  button: 'py-1 !w-fit bg-green-50 text-green-500 border-green-300'
                }}
                onClick={() => {
                  setDefineAvailability(true);
                  setNewAvailability(null);
                  setOldAvailability(null);
                  setShiftEditing(null);
                }}
              />
            }
          </div>
        ) : (
          <div className='flex flex-col gap-2 items-center'>
            <p className='text-xs text-center text-orange-500'>
              Você ainda não possui horários de disponibilidade para agendamento.
            </p>

            <Button.Default
              label='Definir'
              Icon={() => <RiSettingsFill/>}
              onClick={() => setDefineAvailability(true)}
              customStyle={{ button: '!py-1' }}
            />
          </div>
        )}
      </div>
    </>
  )
}

export default EditProfessorAvailability
