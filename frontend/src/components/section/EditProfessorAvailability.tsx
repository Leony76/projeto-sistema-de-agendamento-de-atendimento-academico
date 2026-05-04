import { AVAILABLE_DAYS_MAP, AVAILABLE_DAYS } from '@frontend/constants/maps/days.map';
import React, { useState } from 'react'
import { FaArrowCircleLeft, FaCheckSquare, FaEdit } from 'react-icons/fa';
import { Button } from '../button';
import type { AvailableDays } from '@shared/types/availableDays.type';
import type { ProfessorAvailability } from '@shared/types/professorAvailability.type';
import { formatMinutesToTime } from '@frontend/utils/formats/formartMinutesInHours.util';
import { useToast } from '@frontend/contexts/ToastContext';
import { isValidHours } from '@frontend/utils/misc/isValidHour.util';
import type { Shift } from '@shared/types/shifts.type';
import type { Hours } from '@shared/types/availableHours.type';
import ShiftHourEditor from '../misc/ShiftHourEditor';

type Props = {
  availability: ProfessorAvailability[];
};

const EditProfessorAvailability = (props:Props): React.JSX.Element => {

  const { toast } = useToast();

  const GENERAL_CONFIGS = {
    morning: { start: 420, end: 690    },
    afternoom: { start: 780, end: 1080 },
  };

  const [ editingAvailabilityDay, setEditingAvailabilityDay ] = useState<AvailableDays | null>(null);
  const [ newAvailableShiftHours, setNewAvailableShiftHours ] = useState<Hours | null>(null);

  const [ newMorningHours, setNewMorningHours ] = useState<Hours | null>(null);
  const [ newAfternoonHours, setNewAfternoonHours ] = useState<Hours | null>(null);

  const [ backupMorningHours, setBackupMorningHours ] = useState<Hours | null>(null);
  const [ backupAfternoonHours, setBackupAfternoonHours ] = useState<Hours | null>(null);

  const [ editing, setEditing ] = useState<Shift | null>(null);

  const handleOnEditAvailability = (
    newHours       : Hours | null, 
    newShiftHours  : Hours | null,
    setNewHours    : (hours: Hours | null) => void,
    setBackupHours : (hours: Hours | null) => void,
    shift          : Shift,
  ):void => {
    if (newShiftHours !== null) {
      setNewHours(newShiftHours);
    }

    if (editing === shift) {
      if (!isValidHours(newShiftHours || newHours)) {
        toast('Horário inválido', 'error');
        setNewAvailableShiftHours(null);
        return;
      }
      handleNewAvailability();
    }

    setEditing(prev => prev === shift ? null : shift);
    setBackupHours(newMorningHours);       
  }

  const handleEditDayAvailability = (
    dayHours : ProfessorAvailability | undefined,
    day      : typeof AVAILABLE_DAYS[number]['value'],
  ): void => {
    setEditingAvailabilityDay(day);
    if (dayHours) {

      const shiftLength = dayHours.endHour < 720
        ? 'MORNING'
      : dayHours.startHour >= 720
        ? 'AFTERNOON'
      : dayHours.startHour < 720 && dayHours.endHour >= 720
        && 'BOTH'
      ;

      switch (shiftLength) {
        case 'MORNING':
          setNewMorningHours({
            start : formatMinutesToTime(dayHours.startHour),
            end   : formatMinutesToTime(dayHours.endHour),
          }); break;
        case 'AFTERNOON':
            setNewAfternoonHours({
              start : formatMinutesToTime(dayHours.startHour),
              end   : formatMinutesToTime(dayHours.endHour),
            }); break;
        case 'BOTH':
          setNewMorningHours({
            start : formatMinutesToTime(dayHours.startHour),
            end   : '11:30',
          }); setNewAfternoonHours({
            start : '13:00',
            end   : formatMinutesToTime(dayHours.endHour),
          }); break;
        default: return
      } 
    }
  }

  const handleNewAvailability = async (): Promise<void> => {
    try {
  
      toast('Nova disponibilidade salva com sucesso!');

      setNewAvailableShiftHours(null);
  
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
              onClick={() => handleOnEditAvailability(
                newMorningHours, 
                newAvailableShiftHours,
                setNewMorningHours, 
                setBackupMorningHours, 
                'MORNING'
              )}
              >
                { editing === 'MORNING' 
                  ? <FaCheckSquare className='text-green-500' /> 
                  : <FaEdit /> 
                }                     
              </button>

              <h5 className='flex items-center gap-1 text-sm text-cyan-500 font-semibold'>
                Ás manhãs: <span className='text-gray-400 font-normal'>
                  <ShiftHourEditor
                    shift='MORNING'
                    editing={editing}
                    newHours={newMorningHours}
                    backupHours={backupMorningHours}
                    shiftLimit={GENERAL_CONFIGS.morning}
                    newShiftHours={newAvailableShiftHours}
                    setNewShiftHours={setNewAvailableShiftHours}
                    setNewHours={setNewMorningHours}
                  />
                </span>
              </h5>
            </div>
            
            <div className='flex gap-1 items-center'>
              <button
              className='text-orange-400 hover:brightness-95 hover:scale-[1.2] active:brightness-90 active:scale-[1.1] cursor-pointer'
              onClick={() => handleOnEditAvailability(
                newAfternoonHours,
                newAvailableShiftHours,
                setNewAfternoonHours,
                setBackupAfternoonHours,
                'AFTERNOON',
              )}
              >
                { editing === 'AFTERNOON' 
                  ? <FaCheckSquare className='text-green-500' /> 
                  : <FaEdit /> 
                }                     
              </button>

              <h5 className='flex items-center gap-1 text-sm text-cyan-500 font-semibold'>
                Ás tardes: <span className='text-gray-400 font-normal'>
                  <ShiftHourEditor
                    shift='AFTERNOON'
                    editing={editing}
                    newHours={newAfternoonHours}
                    backupHours={backupAfternoonHours}
                    newShiftHours={newAvailableShiftHours}
                    shiftLimit={GENERAL_CONFIGS.afternoom}
                    setNewShiftHours={setNewAvailableShiftHours}
                    setNewHours={setNewAfternoonHours}
                  />
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
                  onClick={() => handleEditDayAvailability(availableHoursOfTargetDay, days.value)}
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
