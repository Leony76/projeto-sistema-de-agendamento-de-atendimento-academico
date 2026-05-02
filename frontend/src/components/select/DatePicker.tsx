import { forwardRef, useEffect, useState, type ButtonHTMLAttributes } from 'react'
import { FaCalendarDays, FaCircleChevronLeft, FaCircleChevronRight } from 'react-icons/fa6';
import { Modal } from '../modal';
import Calendar from 'react-calendar';
import { formatDate } from '@frontend/utils/formats/formatDate.util';
import '@frontend/css/calendar.css';
import { DAYS_BY_INDEX_MAP } from '@frontend/constants/maps/days.map';
import Warning from '../misc/Warning';

type Props = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onSelect'> & {
  label?        : string;
  error?        : string;
  placeholder   : string;
  value?        : string;
  onChange      : (value: string) => void;
  disabledDate?: (date: Date) => boolean;
  customStyle?  : {
    label?      : string;
    input?      : string;
    container?  : string;
  };
};

const DatePicker = forwardRef<HTMLButtonElement, Props>((props, ref) => {

  const { 
    label,
    error, 
    customStyle, 
  } = props;

  const [showCalendar, setShowCalendar] = useState<boolean>(false);
  const [internalDate, setInternalDate] = useState<Date | null>(null);

  useEffect(() => {
    if (props.value) {
      setInternalDate(new Date(props.value));
    } else {
      setInternalDate(null);
    }
  }, [props.value]);

  return (
    <>
      <Modal.Default
      onCloseRequest={() => setShowCalendar(false)}
      visible={showCalendar}
      >
        <Calendar
          value={internalDate}
          className="custom-calendar"
          prevLabel={<FaCircleChevronLeft/>}
          nextLabel={<FaCircleChevronRight/>}
          minDate={new Date()}
          prev2Label={null}
          next2Label={null}
          onChange={(value) => {
            const selected = value as Date;

            setInternalDate(selected);
            props.onChange(selected.toISOString());
            setShowCalendar(false);
          }}
          tileDisabled={({ date, view }) => {
            if (view !== 'month') return false;

            return props.disabledDate?.(date) ?? false;
          }}
        />
      </Modal.Default>

      <div className={`flex flex-col gap-1 w-full ${customStyle?.container ?? ''}`}>
        {label && (
          <label className={`
            text-orange-500 text-sm font-semibold 
            ${customStyle?.label ?? ''}
          `}>
            { label }
          </label>
        )} 

        <button 
        ref={ref}
        onClick={() => setShowCalendar(true)}
        className={`
          p-2 text-cyan-600 hover:brightness-95 active:brightness-90 cursor-pointer justify-between text-sm flex items-center border bg-amber-100/25 transition-colors rounded-xl relative 
          ${error ? 'border-red-500 shadow-[0px_0px_3px_red]' : 'border-orange-300'} 
          ${customStyle?.input ?? ''}
        `}>
          {internalDate 
            ? formatDate(internalDate.toISOString()) 
            : props.placeholder
          }

          <FaCalendarDays className='text-cyan-600'/>
        </button>
      
        {error && <Warning error={error}/>}
      </div>
    </>
  );
});

DatePicker.displayName = 'Select.DatePicker';

export default DatePicker