import React from "react";
import type { Hours } from "../section/EditProfessorAvailability";
import { formatHoursToMinutes } from "@frontend/utils/formats/formatHoursInMinutes.util";
import { useToast } from "@frontend/contexts/ToastContext";
import { FaCheckSquare, FaEdit } from "react-icons/fa";
import { formatTimeInput } from "@frontend/utils/formats/formatTimeToInput.util";
import type { ShiftHourConfig } from '@shared/types/shiftHourConfig.type';

type Props = ( ShiftHourConfig ) & {
  editing               : 'MORNING' | 'AFTERNOON' | null;
  hours                 : Record<'MORNING' | 'AFTERNOON', Hours | null>;
  backup                : Record<'MORNING' | 'AFTERNOON', Hours | null>;
  setHours              : React.Dispatch<React.SetStateAction<Record<'MORNING' | 'AFTERNOON', Hours | null>>>;
  setBackup             : React.Dispatch<React.SetStateAction<Record<'MORNING' | 'AFTERNOON', Hours | null>>>;
  handleNewAvailability : (hours: Record<'MORNING' | 'AFTERNOON', Hours | null>) => Promise<void>;
  setEditing            : React.Dispatch<React.SetStateAction<'MORNING' | 'AFTERNOON' | null>>;
};

const ShiftHourEditor = (config: Props): React.JSX.Element => {

  const { toast } = useToast();

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
  
  const updateHours = (
    shift : 'MORNING' | 'AFTERNOON', 
    field : 'start' | 'end', 
    value : string,
  ) => {
    config.setHours(prev => ({
      ...prev,
      [shift]: {
        start: field === 'start' ? value : prev[shift]?.start ?? '',
        end: field === 'end' ? value : prev[shift]?.end ?? '',
      }
    }));
  };
  
  const clampHours = (
    shift : ShiftHourConfig, 
    value : string
  ) => {
    const minutes = formatHoursToMinutes(value);
  
    if (minutes < shift.min) return shift.fallbackStart;
    if (minutes > shift.max) return shift.fallbackEnd;
  
    return value;
  };

  const shift = config.key;
  const data = config.hours[shift];

  return (
    <div className='flex gap-1 items-center'>
      <button
        onClick={() => {
          if (config.editing === shift) {
            if (!isValidHours(data)) {
              toast('Horário inválido', 'error');
              return;
            }
            config.handleNewAvailability(config.hours);
          }

          config.setEditing(prev => prev === shift ? null : shift);
          config.setBackup(prev => ({ ...prev, [shift]: data }));
        }}
      >
        {config.editing === shift ? <FaCheckSquare /> : <FaEdit />}
      </button>

      <h5>
        {config.label}:
        {data ? (
          <div className='flex gap-1'>
            <input
              value={data.start}
              readOnly={config.editing !== shift}
              onChange={(e) => updateHours(shift, 'start', formatTimeInput(e.target.value))}
              onBlur={() => {
                if (!data.start) {
                  config.setHours(prev => ({ ...prev, [shift]: config.backup[shift] }));
                  return;
                }

                updateHours(shift, 'start', clampHours(config, data.start));
              }}
            />

            <span>às</span>

            <input
              value={data.end}
              readOnly={config.editing !== shift}
              onChange={(e) => updateHours(shift, 'end', formatTimeInput(e.target.value))}
              onBlur={() => {
                if (!data.end) {
                  config.setHours(prev => ({ ...prev, [shift]: config.backup[shift] }));
                  return;
                }

                updateHours(shift, 'end', clampHours(config, data.end));
              }}
            />
          </div>
        ) : (
          <div>Não disponível</div>
        )}
      </h5>
    </div>
  );
};

export default ShiftHourEditor;