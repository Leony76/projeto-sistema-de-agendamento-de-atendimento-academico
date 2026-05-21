import { forwardRef, useState, type InputHTMLAttributes } from 'react'
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import Warning from '../misc/Warning';

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label?       : string;
  error?       : string;
  customStyle? : {
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
        flex overflow-hidden items-center rounded-xl border bg-amber-100/25 transition-colors
        ${error ? 'border-red-500 shadow-[0px_0px_3px_red]' : 'border-orange-300'} 
        ${customStyle?.input ?? ''}
      `}>
        <input
          ref={ref}
          {...rest} 
          className="flex-1 p-2 outline-none text-sm text-cyan-600 bg-transparent"
          type={isPassword && passwordVisible ? 'text' : type}
        />

        {isPassword && (
          <button 
          type="button" 
          onClick={() => setPasswordVisible(!passwordVisible)}
          className="focus:outline-none cursor-pointer"
          >
            {passwordVisible ? (
              <FaEyeSlash className="mx-2 text-cyan-500" />
            ) : (
              <FaEye className="mx-2 text-cyan-500" />
            )}
          </button>
        )}
      </div>
      
      {error && <Warning error={error}/>}
    </div>
  );
});

Default.displayName = 'Input.Default';

export default Default