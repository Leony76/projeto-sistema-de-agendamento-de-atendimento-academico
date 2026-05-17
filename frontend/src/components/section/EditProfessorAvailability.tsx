import { AVAILABLE_DAYS_MAP } from '@frontend/constants/maps/days.map';
import React, { useState } from 'react'
import { FaArrowCircleLeft, FaCheckSquare, FaEdit } from 'react-icons/fa';
import { Button } from '../button';
import type { ProfessorAvailability, Shift } from '@shared/types/professorAvailability.type';
import { useToast } from '@frontend/contexts/ToastContext';
import ShiftHourEditor from '../misc/ShiftHourEditor';
import { useAuth } from '@frontend/hooks/useAuth.hook';
import { Navigate } from 'react-router-dom';
import { formatMinutesToTime } from '@frontend/utils/formats/formartMinutesInHours.util';

type Props = {
  availability: ProfessorAvailability[];
};

const EditProfessorAvailability = (props:Props): React.JSX.Element => {

  const { user } = useAuth();
  if (!user) return <Navigate to={'/'}/>

  const { toast } = useToast();

  const [ shiftEditing, setShiftEditing ] = useState<Shift | null>(null);
  const [ oldAvailability, setOldAvailability ] = useState<ProfessorAvailability | null>(null);
  const [ newAvailability, setNewAvailability ] = useState<ProfessorAvailability | null>(null);

  const handleNewAvailability = async (professorId: number): Promise<void> => {
    try {

  
    } catch (error:unknown) {
      if (error instanceof Error) console.error(error.message);
    }
  };

  const SHIFT_LABELS: Record<Shift, string> = {
    MORNING   : 'Ás manhãs',
    AFTERNOON : 'Ás tardes',
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
        MORNING: {
          start : formatMinutesToTime(Number(item.shift.MORNING.start)),
          end   : formatMinutesToTime(Number(item.shift.MORNING.end)),
        },
        AFTERNOON: {
          start : formatMinutesToTime(Number(item.shift.AFTERNOON.start)),
          end   : formatMinutesToTime(Number(item.shift.AFTERNOON.end)),
        },
      },
    };
  };

  return (
    <>
      {newAvailability &&
        <button 
        className='absolute top-2 left-3 text-cyan-500 hover:brightness-95 active:brightness-90 cursor-pointer'
        onClick={() => {
          setNewAvailability(null)
          setShiftEditing(null);
        }}
        >
          <FaArrowCircleLeft size={18}/>
        </button>
      }

      <h2 className='text-cyan-500 font-semibold self-center'>
        Disponibilidade
      </h2>

      <div className='flex flex-col gap-2 justify-between flex-1 p-2 min-h-0 overflow-auto bg-white border rounded-lg border-cyan-300'>          
        {(newAvailability && oldAvailability) ? (
          <div className='space-y-2'>
            <h4 className='text-xs text-orange-500'>
              Defina sua disponibilidade:
            </h4>
            
            {SHIFTS.map((shift) => (
              <div
              key={shift}
              className='flex gap-1 items-center'
              >
                <button
                className='text-orange-400 hover:brightness-95 hover:scale-[1.2] active:brightness-90 active:scale-[1.1] cursor-pointer'
                onClick={() => setShiftEditing(shift)}
                >
                  {shiftEditing === shift
                    ? <FaCheckSquare className='text-green-500' />
                    : <FaEdit />
                  }
                </button>

                <h5 className='flex items-center gap-1 text-sm text-cyan-500 font-semibold'>
                  { SHIFT_LABELS[shift] }:

                  <span className='text-gray-400 font-normal'>
                    <ShiftHourEditor
                      newShiftHours={newAvailability.shift[shift]}
                      oldShiftHours={oldAvailability.shift[shift]}
                      shiftHoursLimit={SHIFT_HOURS_LIMITS[shift]}
                      editing={shiftEditing === shift}
                      onChange={{
                        start : (value) => updateShiftHour(shift, 'start', value ),
                        end   : (value) => updateShiftHour(shift, 'end', value ),
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
        ) : (       
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
          </div>
        )}
      </div>
    </>
  )
}

export default EditProfessorAvailability
