import { AVAILABLE_DAYS_MAP, AVAILABLE_DAYS } from '@frontend/constants/maps/days.map';
import React, { useState } from 'react'
import { FaArrowCircleLeft, FaCheckSquare, FaEdit } from 'react-icons/fa';
import { Button } from '../button';
import type { AvailableDays } from '@shared/types/availableDays.type';
import type { ProfessorAvailability } from '@shared/types/professorAvailability.type';
import { formatMinutesToTime } from '@frontend/utils/formats/formartMinutesInHours.util';
import { formatTimeInput } from '@frontend/utils/formats/formatTimeToInput.util';
import { formatHoursToMinutes } from '@frontend/utils/formats/formatHoursInMinutes.util';
import { useToast } from '@frontend/contexts/ToastContext';

type Props = {
  availability: ProfessorAvailability[];
};

export type Hours = {
  start : string; 
  end   : string; 
}

const EditProfessorAvailability = (props:Props): React.JSX.Element => {

  const { toast } = useToast();

  const [ editingAvailabilityDay, setEditingAvailabilityDay ] = useState<AvailableDays | null>(null);

  const [ newAvailableShiftHours, setNewAvailableShiftHours ] = useState<Hours | null>(null);

  const [ newMorningHours, setNewMorningHours ] = useState<Hours | null>(null);
  const [ newAfternoonHours, setNewAfternoonHours ] = useState<Hours | null>(null);

  const [ backupMorningHours, setBackupMorningHours ] = useState<Hours | null>(null);
  const [ backupAfternoonHours, setBackupAfternoonHours ] = useState<Hours | null>(null);

  const [ editing, setEditing ] = useState<'MORNING' | 'AFTERNOON' | null>(null);

  const isValidTimeString = (time: string): boolean => {
    if (!time) return false;

    const match = time.match(/^(\d{2}):(\d{2})$/);
    if (!match) return false;

    const hours = Number(match[1]);
    const minutes = Number(match[2]);

    if (hours < 0 || hours > 23) return false;
    if (minutes < 0 || minutes > 59) return false;

    return true;
  };

  const isValidHours = (hours: Hours | null): boolean => {
    if (!hours) return false;

    if (!isValidTimeString(hours.start)) return false;
    if (!isValidTimeString(hours.end)) return false;

    const start = formatHoursToMinutes(hours.start);
    const end   = formatHoursToMinutes(hours.end);

    return start < end;
  };

  const handleNewAvailability = async (): Promise<void> => {
    try {
  
      toast('Nova disponibilidade salva com sucesso!');
  
    } catch (error:unknown) {
      if (error instanceof Error) console.error(error.message);
    }
  };

  return (
    <>
      {editingAvailabilityDay &&
        <button 
        className='absolute top-2 left-3 text-cyan-500 hover:brightness-95 active:brightness-90 cursor-pointer'
        onClick={() => {
          setNewMorningHours(null);
          setNewAfternoonHours(null);
          setNewAvailableShiftHours(null);
          setEditingAvailabilityDay(null);
          setEditing(null);
        }}
        >
          <FaArrowCircleLeft size={18}/>
        </button>
      }

      <h2 className='text-cyan-500 font-semibold self-center'>
        Disponibilidade
      </h2>

      <div className='flex flex-col gap-2 justify-between flex-1 p-2 min-h-0 overflow-auto bg-white border rounded-lg border-cyan-300'>          
        { editingAvailabilityDay ? (
          <div className='space-y-1'>
            <h4 className='text-xs text-orange-500'>
              Defina sua disponibilidade { (editingAvailabilityDay !== 'SUNDAY' && editingAvailabilityDay !== 'SATURDAY') 
                ? 'às ' + (AVAILABLE_DAYS_MAP[editingAvailabilityDay].split('-')[0].toLowerCase() + 's-' + AVAILABLE_DAYS_MAP[editingAvailabilityDay].split('-')[1] + 's') 
                : 'aos ' + AVAILABLE_DAYS_MAP[editingAvailabilityDay].toLowerCase() + 's'
              }: 
            </h4>
            
            <div className='flex gap-1 items-center'>
              <button
              className='text-orange-400 hover:brightness-95 hover:scale-[1.2] active:brightness-90 active:scale-[1.1] cursor-pointer'
              onClick={() => {
                if (newAvailableShiftHours) setNewMorningHours(newAvailableShiftHours);

                if (editing === 'MORNING') {
                  if (!isValidHours(newMorningHours)) {
                    toast('Horário inválido', 'error');
                    return
                  };
                  handleNewAvailability();
                }

                setEditing(prev => prev === 'MORNING' ? null : 'MORNING');
                setBackupMorningHours(newMorningHours);           
              }}
              >
                { editing === 'MORNING' 
                  ? <FaCheckSquare className='text-green-500' /> 
                  : <FaEdit /> 
                }                     
              </button>

              <h5 className='flex items-center gap-1 text-sm text-cyan-500 font-semibold'>
                Ás manhãs: <span className='text-gray-400 font-normal'>
                  { newMorningHours ? (
                    <div className='flex gap-1'>
                      <input
                        placeholder={'XX:XX'}
                        readOnly={editing !== 'MORNING'} 
                        className='min-w-0 w-10 text-center outline-none'
                        type="text"
                        value={newMorningHours.start}
                        onBlur={() => {
                          if (!newMorningHours || !backupMorningHours) return;

                          const currentStart = newMorningHours.start;

                          if (!currentStart) {
                            setNewMorningHours(backupMorningHours);
                            return;
                          }

                          const value = formatHoursToMinutes(currentStart);

                          setNewMorningHours(prev => {
                            if (!prev) return prev;

                            if (value > 690) return { ...prev, start: '11:30' };
                            if (value < 420)  return { ...prev, start: '07:00' };

                            return prev;
                          });
                        }}
                        onChange={(e) => {
                          const value = formatTimeInput(e.target.value);                         

                          setNewMorningHours(prev => {
                            if (!prev) return { start: value ?? '', end: '' }; 
                            return { ...prev, start: value ?? '' };
                          });
                        }}
                      />

                      <span>ás</span>
                      
                      <input
                        placeholder={'XX:XX'} 
                        readOnly={editing !== 'MORNING'} 
                        className='min-w-0 w-10 text-center outline-none'
                        type="text"
                        value={newMorningHours.end}
                        onBlur={() => {
                          if (!newMorningHours || !backupMorningHours) return;

                          const currentEnd = newMorningHours.end;

                          if (!currentEnd) {
                            setNewMorningHours(backupMorningHours);
                            return;
                          }

                          const value = formatHoursToMinutes(currentEnd);

                          setNewMorningHours(prev => {
                            if (!prev) return prev;

                            if (value > 690) return { ...prev, end: '11:30' };
                            if (value < 420)  return { ...prev, end: '07:00' };

                            return prev;
                          });
                        }}
                        onChange={(e) => {
                          const value = formatTimeInput(e.target.value);                         

                          setNewMorningHours(prev => {
                            if (!prev) return { start: '', end: value ?? '' }; 
                            return { ...prev, end: value ?? '' };
                          });
                        }}
                      />
                    </div>
                  ) : (
                    editing === 'MORNING' ? (
                      <div className='flex gap-1'>
                        <input
                          placeholder={'XX:XX'}
                          readOnly={editing !== 'MORNING'} 
                          className='min-w-0 w-10 text-center outline-none'
                          type="text"
                          value={newAvailableShiftHours?.start ?? ''}
                          onChange={(e) => {
                            const value = formatTimeInput(e.target.value);                         

                            setNewAvailableShiftHours(prev => {
                              if (!prev) return { start: value ?? '', end: '' }; 
                              return { ...prev, start: value ?? '' };
                            });
                          }}
                        />

                        <span>ás</span>
                        
                        <input
                          placeholder={'XX:XX'} 
                          readOnly={editing !== 'MORNING'} 
                          className='min-w-0 w-10 text-center outline-none'
                          type="text"
                          value={newAvailableShiftHours?.end}
                          onChange={(e) => {
                            const value = formatTimeInput(e.target.value);                         

                            setNewAvailableShiftHours(prev => {
                              if (!prev) return { start: '', end: value ?? '' }; 
                              return { ...prev, end: value ?? '' };
                            });
                          }}
                        />
                      </div>
                    ) : (
                      <div>Não disponível</div>
                    )
                  )}
                </span>
              </h5>
            </div>
            
            <div className='flex gap-1 items-center'>
              <button
              className='text-orange-400 hover:brightness-95 hover:scale-[1.2] active:brightness-90 active:scale-[1.1] cursor-pointer'
              onClick={() => {
                if (newAvailableShiftHours) setNewAfternoonHours(newAvailableShiftHours);
                
                if (editing === 'AFTERNOON') {
                  if (!isValidHours(newAfternoonHours)) {
                    toast('Horário inválido', 'error');
                    return
                  };

                  handleNewAvailability();
                }

                setEditing(prev => prev === 'AFTERNOON' ? null : 'AFTERNOON');
                setBackupAfternoonHours(newAfternoonHours);
              }}
              >
                { editing === 'AFTERNOON' 
                  ? <FaCheckSquare className='text-green-500' /> 
                  : <FaEdit /> 
                }                     
              </button>

              <h5 className='flex items-center gap-1 text-sm text-cyan-500 font-semibold'>
                Ás tardes: <span className='text-gray-400 font-normal'>
                  { newAfternoonHours ? (
                    <div className='flex gap-1'>
                      <input
                        placeholder={'XX:XX'} 
                        readOnly={editing !== 'AFTERNOON'}
                        className='min-w-0 w-10 text-center outline-none'
                        type="text"
                        value={newAfternoonHours.start}
                        onBlur={() => {
                          if (!newAfternoonHours || !backupAfternoonHours) return;

                          const currentStart = newAfternoonHours.start;

                          if (!currentStart) {
                            setNewAfternoonHours(backupAfternoonHours);
                            return;
                          }

                          const value = formatHoursToMinutes(currentStart);

                          setNewAfternoonHours(prev => {
                            if (!prev) return prev;

                            if (value > 1080) return { ...prev, start: '18:00' };
                            if (value < 780)  return { ...prev, start: '13:00' };

                            return prev;
                          });
                        }}
                        onChange={(e) => {
                          const value = formatTimeInput(e.target.value);           

                          setNewAfternoonHours(prev => {
                            if (!prev) return { start: value ?? '', end: '' }; 
                            return { ...prev, start: value ?? '' };
                          });
                        }}
                      />

                      <span>ás</span>
                      
                      <input
                        placeholder={'XX:XX'} 
                        readOnly={editing !== 'AFTERNOON'}
                        className='min-w-0 w-10 text-center outline-none'
                        type="text"
                        value={newAfternoonHours.end}
                        onBlur={() => {
                          if (!newAfternoonHours || !backupAfternoonHours) return;

                          const currentEnd = newAfternoonHours.end;

                          if (!currentEnd) {
                            setNewAfternoonHours(backupAfternoonHours);
                            return;
                          }

                          const value = formatHoursToMinutes(currentEnd);

                          setNewAfternoonHours(prev => {
                            if (!prev) return prev;

                            if (value > 1080) return { ...prev, end: '18:00' };
                            if (value < 780)  return { ...prev, end: '13:00' };

                            return prev;
                          });
                        }}
                        onChange={(e) => {
                          const value = formatTimeInput(e.target.value);

                          setNewAfternoonHours(prev => {
                            if (!prev) return { start: '', end: value ?? '' }; 
                            return { ...prev, end: value ?? '' };
                          });
                        }}
                      />
                    </div>
                  ) : (
                    editing === 'AFTERNOON' ? (
                      <div className='flex gap-1'>
                        <input
                          placeholder={'XX:XX'}
                          readOnly={editing !== 'AFTERNOON'} 
                          className='min-w-0 w-10 text-center outline-none'
                          type="text"
                          value={newAvailableShiftHours?.start ?? ''}
                          onChange={(e) => {
                            const value = formatTimeInput(e.target.value);                         

                            setNewAvailableShiftHours(prev => {
                              if (!prev) return { start: value ?? '', end: '' }; 
                              return { ...prev, start: value ?? '' };
                            });
                          }}
                        />

                        <span>ás</span>
                        
                        <input
                          placeholder={'XX:XX'} 
                          readOnly={editing !== 'AFTERNOON'} 
                          className='min-w-0 w-10 text-center outline-none'
                          type="text"
                          value={newAvailableShiftHours?.end}
                          onChange={(e) => {
                            const value = formatTimeInput(e.target.value);                         

                            setNewAvailableShiftHours(prev => {
                              if (!prev) return { start: '', end: value ?? '' }; 
                              return { ...prev, end: value ?? '' };
                            });
                          }}
                        />
                      </div>
                    ) : (
                      <div>Não disponível</div>
                    )
                  )}
                </span>
              </h5>
            </div>
          </div>
        ) : (
          <div className='grid grid-cols-4 gap-1.5'>
            { AVAILABLE_DAYS.map((days) => {

              const available = props.availability.some((a) => a.dayOfWeek === days.value);
              const availableHoursOfTargetDay = props.availability.find((a) => a.dayOfWeek === days.value);

              return (
                <Button.Default
                  selected={available}
                  label={days.label.split('-')[0]}
                  customStyle={{ button: 'py-1 text-xs' }}
                  onClick={() => {        
                    setEditingAvailabilityDay(days.value);
                    if (availableHoursOfTargetDay) {

                      const isMorning = availableHoursOfTargetDay.endHour < 720;
                      const isAfternoon = availableHoursOfTargetDay.startHour >= 720;
                      const isMixed = availableHoursOfTargetDay.startHour < 720 && availableHoursOfTargetDay.endHour >= 720;

                      if (isMixed) {
                        setNewMorningHours({
                          start : formatMinutesToTime(availableHoursOfTargetDay.startHour),
                          end   : '11:30',
                        }); setNewAfternoonHours({
                          start : '13:00',
                          end   : formatMinutesToTime(availableHoursOfTargetDay.endHour),
                        });
                      } else if (isMorning) {
                        setNewMorningHours({
                          start : formatMinutesToTime(availableHoursOfTargetDay.startHour),
                          end   : formatMinutesToTime(availableHoursOfTargetDay.endHour),
                        });
                      } else if (isAfternoon) {
                        setNewAfternoonHours({
                          start : formatMinutesToTime(availableHoursOfTargetDay.startHour),
                          end   : formatMinutesToTime(availableHoursOfTargetDay.endHour),
                        });
                      }
                      return;
                    }
                  }}
                />
              )
            })}
          </div>
        )}
      </div>
    </>
  )
}

export default EditProfessorAvailability