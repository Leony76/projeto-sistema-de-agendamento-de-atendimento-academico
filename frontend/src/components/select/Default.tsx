import { SELECT_OPTIONS_SCHEMA_MAP } from '@/constants/maps/selectOptionsSchema.map';
import type { SelectOptionsSchema } from '@/types/selectOptionsSchema.type';
import { forwardRef, useState, type ButtonHTMLAttributes } from 'react'

type Props = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onSelect'> & {
  label?        : string;
  error?        : string;
  placeholder   : string;
  optionsSchema : SelectOptionsSchema;
  onSelect      : React.Dispatch<React.SetStateAction<string>>;
  Icon?         : React.ElementType; 
  customStyle?  : {
    label?      : string;
    input?      : string;
    container?  : string;
    options?    : {
      container?: string;
      button?   : string;
    };
  };
};

const Default = forwardRef<HTMLButtonElement, Props>((props, ref) => {

  const { 
    label,
    error, 
    customStyle, 
  } = props;

  const Icon = props.Icon;

  const [showOptions, setShowOptions] = useState<boolean>(false);

  return (
    <div className={`flex-1 flex flex-col gap-1 w-full ${customStyle?.container ?? ''}`}>
      {label && (
        <label className={`text-orange-500 text-sm font-semibold ${customStyle?.label ?? ''}`}>
          { label }
        </label>
      )} 

      <div className={`
        h-full flex flex-col border bg-amber-100/25 transition-colors rounded-xl relative 
        ${error ? 'border-red-500 shadow-[0px_0px_3px_red]' : 'border-orange-300'} 
        ${showOptions ? 'rounded-b-none' : '' }
      `}>
        <button 
        ref={ref}
        onClick={() => setShowOptions(prev => !prev)}
        className={`
          px-2 flex-1 py-1 text-orange-400 text-sm flex cursor-pointer gap-2 justify-center items-center hover:bg-amber-100/30 active:brightness-90
          ${customStyle?.input ?? ''}
          ${showOptions ? 'border-b' : ''}
        `}>
          { Icon && <Icon/> }

          <span className='mb-0.5'>
            { props.placeholder }
          </span>
        </button>
        
        {showOptions && (
          <div className={`
            absolute top-full left-0 w-full z-10 bg-[#F8FBF1] border border-t-0 rounded-b-xl border-orange-300 overflow-hidden
            ${props.customStyle?.options?.container ?? ''}
          `}>
            {SELECT_OPTIONS_SCHEMA_MAP[props.optionsSchema].map(( item ) => (
              <button
              key={item.value}
              onClick={() => {
                props.onSelect(item.value);
                setShowOptions(false);
              }}
              className={`
                w-full text-left text-sm text-orange-500 py-1.5 hover:bg-amber-100/30 cursor-pointer px-2
                ${props.customStyle?.options?.button}
                ${item.value === props.value ? 'bg-amber-100/70' : ''}
              `}
              >
                { item.label }
              </button>
            ))}
          </div>
        )}
      </div>
    
      {error && <span className="text-xs text-red-500">{ error }</span>}
    </div>
  );
});

Default.displayName = 'Select.Default';

export default Default