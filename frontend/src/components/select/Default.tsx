import { SELECT_OPTIONS_SCHEMA_MAP } from '@frontend/constants/maps/selectOptionsSchema.map';
import { useCloseModalOnMouseClickOutside } from '@frontend/hooks/useCloseModalOnMouseClickOutside.hook';
import type { SelectOptionsSchema } from '@shared/types/selectOptionsSchema.type';
import { forwardRef, useState, type ButtonHTMLAttributes } from 'react'
import type { SelectOption } from '@shared/types/selectOptions.type';

type Props<T> = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onSelect'> & {
  label?                          : string;
  error?                          : string;
  placeholder                     : string;
  textSize?                       : 'BASE' | 'LG' | 'SM';
  selectedOptionPlaceholderShow?  : boolean;
  optionsSchema?                  : SelectOptionsSchema;
  externalOptionsSchema?          : SelectOption[];
  multipleOptions?                : boolean;
  onSelect                        : (value: T | T[]) => void;
  value?                          : T | T[];
  gridConfig?                     : `grid-cols-${number}`;
  Icon?                           : React.ElementType;
  customStyle? : {
    label?     : string;
    input?     : string;
    container? : string;
    options? : {
      container? : string;
      button?    : string;
    };
  };
};

const Default = forwardRef(
  <T extends string>(
    props : Props<T>, 
    ref   : React.Ref<HTMLButtonElement>
  ) => {
    const { 
      label,
      error, 
      customStyle, 
    } = props;

    const isMultiple = props.multipleOptions;
    const selectedValues = Array.isArray(props.value)
      ? props.value
      : props.value
        ? [props.value]
        : []
    ;

    const optionsSchema = props.externalOptionsSchema ?? SELECT_OPTIONS_SCHEMA_MAP[props.optionsSchema!];
    
    const selectedOptions = optionsSchema.filter(item => selectedValues.includes(item.value as T));

    const Icon = props.Icon;
    
    const [showOptions, setShowOptions] = useState<boolean>(false);
    const { containerRef } = useCloseModalOnMouseClickOutside(setShowOptions);
    
    return (
      <div className={`flex flex-col gap-1 ${customStyle?.container ?? ''}`}>
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
            flex-1 px-10 py-1 text-orange-400 text-sm flex cursor-pointer gap-2 justify-center items-center hover:bg-amber-100/30 active:brightness-90
            ${customStyle?.input ?? ''}
            ${showOptions ? 'border-b' : ''}
          `}>
            { Icon && <Icon/> }
    
            <span className={`mb-0.5`}>
              { props.selectedOptionPlaceholderShow ? (
                selectedOptions.length > 0
                  ? selectedOptions.map(item => item.label).join(', ')
                  : props.placeholder
              ) : (
                props.placeholder 
              )}
            </span>
          </button>
          
          {showOptions && (
            <div className={`
              absolute top-full max-h-50 overflow-y-auto left-0 w-full z-10 bg-[#F8FBF1] border border-t-0 rounded-b-xl border-orange-300
              ${ props.customStyle?.options?.container ?? '' }
              ${optionsSchema.length > 0 && props.gridConfig 
                ? `grid ${props.gridConfig}` 
                : 'justify-center' 
              }
            `}>
              { optionsSchema.length > 0 ? (
                optionsSchema.map(( item ) => (
                  <button
                  key={item.value}
                  onClick={() => {
                    const value = item.value as T;

                    if (isMultiple) {

                      const alreadySelected = selectedValues.includes(value);
                      const updatedValues = alreadySelected
                        ? selectedValues.filter(v => v !== value)
                        : [...selectedValues, value]
                      ;

                      props.onSelect(updatedValues as T[]);
                    } else {
                      props.onSelect(value);
                      setShowOptions(false);
                    }
                  }}
                  className={`
                    w-full text-left text-sm text-orange-500 py-1.5 hover:bg-amber-100/30 cursor-pointer px-2              
                    ${props.customStyle?.options?.button}
                    ${selectedValues.includes(item.value as T) ? 'bg-amber-100/70' : ''}
                    ${ props.gridConfig ? 'text-center! rounded-xl' : '' }
                  `}
                  >
                    { item.label }
                  </button>
                ))
              ) : (
                <button            
                className={`
                  text-center text-sm text-orange-500 py-1.5 px-2              
                  ${props.customStyle?.options?.button}
                `}
                >
                  Nenhum opção disponível
                </button>
              )}
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