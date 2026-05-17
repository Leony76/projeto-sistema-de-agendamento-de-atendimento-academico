import React from 'react'
import type { Shift } from '@shared/types/shifts.type';
import type { Hours } from '@shared/types/availableHours.type';
import { formatHoursToMinutes } from '@frontend/utils/formats/formatHoursInMinutes.util';
import { formatTimeInput } from '@frontend/utils/formats/formatTimeToInput.util';

type Props = {
  shift            : Shift;
  editing          : Shift | null;
  newHours         : Hours | null;
  newShiftHours    : Hours | null;
  backupHours      : Hours | null;
  shiftLimit       : { start: number, end: number };
  setNewHours      : React.Dispatch<React.SetStateAction<Hours | null>>;
  setNewShiftHours : React.Dispatch<React.SetStateAction<Hours | null>>;
};

const ShiftHourEditor = (props:Props): React.JSX.Element => {

  const limitsPlaceholder: Record<Shift, { start: string, end: string }> = {
    MORNING   : { start: '07:00', end: '11:30' },
    AFTERNOON : { start: '13:00', end: '18:00' },
  };

  return (
    props.newHours ? (
      <div className='flex gap-1'>
        <input
          placeholder={'XX:XX'}
          readOnly={props.editing !== props.shift} 
          className='min-w-0 w-10 text-center outline-none'
          type="text"
          value={props.newHours.start}
          onBlur={() => {
            if (!props.newHours || !props.backupHours) return;

            const currentStart = props.newHours.start;

            if (!currentStart) {
              props.setNewHours(props.backupHours);
              return;
            }

            const value = formatHoursToMinutes(currentStart);

            props.setNewHours(prev => {
              if (!prev) return prev;

              if (value > props.shiftLimit.end)   
                return { ...prev, start: limitsPlaceholder[props.shift].end };
              if (value < props.shiftLimit.start) 
                return { ...prev, start: limitsPlaceholder[props.shift].start };

              return prev;
            });
          }}
          onChange={(e) => {
            const value = formatTimeInput(e.target.value);                         

            props.setNewHours(prev => {
              if (!prev) 
                return { start: value ?? '', end: '' }; 
              else 
                return { ...prev, start: value ?? '' };
            });
          }}
        />

        <span>ás</span>
        
        <input
          placeholder={'XX:XX'} 
          readOnly={props.editing !== props.shift} 
          className='min-w-0 w-10 text-center outline-none'
          type="text"
          value={props.newHours.end}
          onBlur={() => {
            if (!props.newHours || !props.backupHours) return;

            const currentEnd = props.newHours.end;

            if (!currentEnd) {
              props.setNewHours(props.backupHours);
              return;
            }

            const value = formatHoursToMinutes(currentEnd);

            props.setNewHours(prev => {
              if (!prev) return prev;

              if (value > props.shiftLimit.end)   
                return { ...prev, end: limitsPlaceholder[props.shift].end };
              if (value < props.shiftLimit.start) 
                return { ...prev, end: limitsPlaceholder[props.shift].start };

              return prev;
            });
          }}
          onChange={(e) => {
            const value = formatTimeInput(e.target.value);                         

            props.setNewHours(prev => {
              if (!prev) 
                return { start: '', end: value ?? '' }; 
              else 
                return { ...prev, end: value ?? '' };
            });
          }}
        />
      </div>
    ) : (
      props.editing === props.shift ? (
        <div className='flex gap-1'>
          <input
            placeholder={'XX:XX'}
            readOnly={props.editing !== props.shift} 
            className='min-w-0 w-10 text-center outline-none'
            type="text"
            value={props.newShiftHours?.start}
            onBlur={() => {
              if (!props.newShiftHours?.start) return;

              const value = formatHoursToMinutes(props.newShiftHours.start);

              props.setNewShiftHours(prev => {
                
                if (!prev) return prev;

                if (value > props.shiftLimit.end)   
                  return { ...prev, start: limitsPlaceholder[props.shift].end };
                if (value < props.shiftLimit.start) 
                  return { ...prev, start: limitsPlaceholder[props.shift].start };

                return prev;
              });
            }}
            onChange={(e) => {
              const value = formatTimeInput(e.target.value);                         

              props.setNewShiftHours(prev => {
                if (!prev) 
                  return { start: value ?? '', end: '' }; 
                else 
                  return { ...prev, start: value ?? '' };
              });
            }}
          />

          <span>ás</span>
          
          <input
            placeholder={'XX:XX'} 
            readOnly={props.editing !== props.shift} 
            className='min-w-0 w-10 text-center outline-none'
            type="text"
            value={props.newShiftHours?.end}
            onBlur={() => {
              if (!props.newShiftHours?.end) return;
              
              const value = formatHoursToMinutes(props.newShiftHours.end);

              props.setNewShiftHours(prev => {
                if (!prev) return prev;

                if (value > props.shiftLimit.end)   
                  return { ...prev, end: limitsPlaceholder[props.shift].end };
                if (value < props.shiftLimit.start) 
                  return { ...prev, end: limitsPlaceholder[props.shift].start };

                return prev;
              });
            }}
            onChange={(e) => {
              const value = formatTimeInput(e.target.value);                         

              props.setNewShiftHours(prev => {
                if (!prev) 
                  return { start: '', end: value ?? '' }; 
                else 
                  return { ...prev, end: value ?? '' };
              });
            }}
          />
        </div>
      ) : (
        <div>Não disponível</div>
      )
    )
  )
}

export default ShiftHourEditor