import React from 'react'
import type { ShiftHours } from '@shared/types/professorAvailability.type';
import { formatTimeInput } from '@frontend/utils/formats/formatTimeToInput.util';
import { formatHoursToMinutes } from '@frontend/utils/formats/formatHoursInMinutes.util';

type Props = {
  newShiftHours   : ShiftHours;
  oldShiftHours   : ShiftHours;
  shiftHoursLimit : ShiftHours;
  editing    : boolean;
  onChange   : {
    start : (value: string) => void;
    end   : (value: string) => void;
  };
  onRestore : {
    start : () => void;
    end   : () => void;
  };
};

const ShiftHourEditor = (props:Props): React.JSX.Element => { 

  const noHours =
    !props.newShiftHours.start.trim() &&
    !props.newShiftHours.end.trim()
  ;

  return (
    <div className='flex gap-1'>
      { noHours && !props.editing ? (
        <div>
          Sem horários
        </div>
      ) : (
        <>
          <input
            placeholder={'XX:XX'}
            readOnly={!props.editing}
            className='min-w-0 w-10 text-center outline-none'
            type="text"
            value={props.newShiftHours.start}
            onChange={(e) => props.onChange.start(
              formatTimeInput(e.target.value)
            )}
            onBlur={() => {
              if (!props.newShiftHours.start.trim()) {
                props.onRestore.start();
                return
              } 
              
              const value = formatHoursToMinutes(props.newShiftHours.start);
              const min   = formatHoursToMinutes(props.shiftHoursLimit.start);
              const max   = formatHoursToMinutes(props.shiftHoursLimit.end);

              if (value < min) {
                props.onChange.start(props.shiftHoursLimit.start);
              } if (value > max) {
                props.onChange.start(props.shiftHoursLimit.end);
              }
            }}
          />

          <span>
            às
          </span>
          
          <input
            placeholder='XX:XX'
            readOnly={!props.editing}
            className='min-w-0 w-10 text-center outline-none'
            type='text'
            value={props.newShiftHours.end}
            onChange={(e) => props.onChange.end(
              formatTimeInput(e.target.value)
            )}
            onBlur={() => {
              if (!props.newShiftHours.end.trim()) {
                props.onRestore.end();
                return;
              }

              const value = formatHoursToMinutes(props.newShiftHours.end);
              const min   = formatHoursToMinutes(props.shiftHoursLimit.start);
              const max   = formatHoursToMinutes(props.shiftHoursLimit.end);

              if (value < min) {
                props.onChange.end(props.shiftHoursLimit.start);
              } if (value > max) {
                props.onChange.end(props.shiftHoursLimit.end);
              }
            }}
          />
        </>
      )}
    </div>
  )
}

export default ShiftHourEditor