import  { forwardRef, type TextareaHTMLAttributes } from 'react'
import Warning from '../misc/Warning';

type Props = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
  error?: string;
  customStyle?: {
    label?     : string;
    input?     : string;
    container? : string;
  };
};

const TextArea = forwardRef<HTMLTextAreaElement, Props>((props, ref) => {

  const { 
    label,
    error, 
    customStyle, 
    ...rest 
  } = props;

  return (
    <div className={`flex flex-col gap-1 w-full ${customStyle?.container ?? ''}`}>
      {label && (
        <label className={`text-orange-500 text-sm font-semibold ${customStyle?.label ?? ''}`}>
          {label}
        </label>
      )}

      <div className={`
        px-2 flex py-2 items-center rounded-lg border bg-amber-100/25 transition-colors
        ${error ? 'border-red-500 shadow-[0px_0px_3px_red]' : 'border-orange-300'} 
        ${customStyle?.input ?? ''}
      `}>
        <textarea 
          ref={ref}
          { ...rest }
          className="flex-1 w-full outline-none text-sm text-cyan-600 bg-transparent"
        />  
      </div>
      
      <div className='flex'>
        {error && <Warning error={error}/>}

        <span className={`
          ml-auto text-[10px] -mt-1 
          ${props.maxLength === props.value?.toString().length 
            ? 'text-red-400' 
            : 'text-gray-400'
          }
        `}>
          Contagem: { props.value?.toString().length } de { props.maxLength }
        </span>
      </div>
    </div>
  );
});

TextArea.displayName = 'Input.TextArea';

export default TextArea