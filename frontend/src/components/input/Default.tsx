import React, { forwardRef, useState, type InputHTMLAttributes } from 'react'
import { FaEye, FaEyeSlash } from 'react-icons/fa';

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
  customStyle?: {
    label?     : string;
    input?     : string;
    container? : string;
  };
};

const Default = forwardRef<HTMLInputElement, Props>((props, ref) => {

  const { 
    label,
    error, 
    customStyle, 
    type, 
    ...rest 
  } = props;

  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
  const isPassword = type === 'password';

  return (
    <div className={`flex flex-col gap-1 w-full ${customStyle?.container ?? ''}`}>
      {label && (
        <label className={`text-orange-500 text-sm font-semibold ${customStyle?.label ?? ''}`}>
          { label }
        </label>
      )}

      <div className={`
        px-2 flex py-2 items-center rounded-xl border bg-amber-100/25 transition-colors
        ${error ? 'border-red-500 shadow-[0px_0px_3px_red]' : 'border-orange-300'} 
        ${customStyle?.input ?? ''}
      `}>
        <input
          ref={ref}
          {...rest} 
          className="flex-1 outline-none text-sm text-cyan-600 bg-transparent"
          type={isPassword && passwordVisible ? 'text' : type}
        />

        {isPassword && (
          <button 
          type="button" 
          onClick={() => setPasswordVisible(!passwordVisible)}
          className="focus:outline-none"
          >
            {passwordVisible ? (
              <FaEyeSlash className="mx-1 ml-2 text-cyan-500 cursor-pointer" />
            ) : (
              <FaEye className="mx-1 ml-2 text-cyan-500 cursor-pointer" />
            )}
          </button>
        )}
      </div>
      
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
});

Default.displayName = 'Input.Default';

export default Default