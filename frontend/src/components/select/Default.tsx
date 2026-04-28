import { SELECT_OPTIONS_SCHEMA_MAP } from '@/constants/maps/selectOptionsSchema.map';
import { useCloseModalOnMouseClickOutside } from '@/hooks/useCloseModalOnMouseClickOutside.hook';
import type { SelectOptionsSchema } from '@/types/selectOptionsSchema.type';
import { forwardRef, useState, type ButtonHTMLAttributes } from 'react'

type Props<T> = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onSelect'> & {
  label?: string;
  error?: string;
  placeholder: string;
  textSize?: 'BASE' | 'LG' | 'SM';
  selectedOptionPlaceholderNotShow? : boolean;
  optionsSchema: SelectOptionsSchema;
  onSelect: (value: T) => void;
  gridConfig?: `grid-cols-${number}`;
  value?: T;
  Icon?: React.ElementType;
  customStyle?: {
    label?: string;
    input?: string;
    container?: string;
    options?: {
      container?: string;
      button?: string;
    };
  };
};

const Default = forwardRef(
  <T extends string>(
    props: Props<T>, 
    ref: React.Ref<HTMLButtonElement>
  ) => {
    const { 
      label,
      error, 
      customStyle, 
    } = props;
    
    const Icon = props.Icon;
    
    const [showOptions, setShowOptions] = useState<boolean>(false);
    const { containerRef } = useCloseModalOnMouseClickOutside(setShowOptions);

    const selectedOption = SELECT_OPTIONS_SCHEMA_MAP[props.optionsSchema]
      .find(item => item.value === props.value);
    
    return (
      <div className={`flex-1 flex flex-col gap-1 w-full ${customStyle?.container ?? ''}`}>
        {label && (
          <label className={`text-orange-500 text-sm font-semibold ${customStyle?.label ?? ''}`}>
            { label }
          </label>
        )} 
    
        <div 
        ref={containerRef}
        className={`
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
    
            <span className={`mb-0.5`}>
              { props.selectedOptionPlaceholderNotShow ? (
                props.placeholder 
              ) : (
                selectedOption?.label ?? props.placeholder 
              )}
            </span>
          </button>
          
          {showOptions && (
            <div className={`
              absolute top-full left-0 w-full z-10 bg-[#F8FBF1] border border-t-0 rounded-b-xl border-orange-300 overflow-hidden
              ${ props.customStyle?.options?.container ?? '' }
              ${ props.gridConfig ? `grid ${props.gridConfig}` : '' }
            `}>
              {SELECT_OPTIONS_SCHEMA_MAP[props.optionsSchema].map(( item ) => (
                <button
                key={item.value}
                onClick={() => {
                  props.onSelect(item.value as T);
                  setShowOptions(false);
                }}
                className={`
                  w-full text-left text-sm text-orange-500 py-1.5 hover:bg-amber-100/30 cursor-pointer px-2              
                  ${props.customStyle?.options?.button}
                  ${item.value === props.value ? 'bg-amber-100/70' : ''}
                  ${ props.gridConfig ? 'text-center!' : '' }
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
  }
);

Default.displayName = 'Select.Default';

export default Default