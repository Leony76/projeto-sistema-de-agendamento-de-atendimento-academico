import { forwardRef, InputHTMLAttributes, useState } from 'react';
import style from './css/Input.module.css';
import InputValidationError from './InputValidationError';
import { LuEyeClosed } from "react-icons/lu";
import { LuEye } from "react-icons/lu";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string; 
}

const Input = forwardRef<HTMLInputElement, Props>(
  ({ label, error, type, placeholder, ...rest }, ref) => {

    const [showPassword, setShowPassword] = useState<boolean>(false);

    return (
      <div className={style.input_container}>
        <label htmlFor={rest.id || rest.name}>
          {label}
        </label>

        {type !== 'password' ? (
          <input
            {...rest}
            ref={ref} 
            type={type}
            placeholder={placeholder}
            className={error ? style.input_error : ''}
          />
        ) : (
          <div className={style.password_input_container}>
            <input
              {...rest}
              ref={ref} 
              type={showPassword 
                ? 'text'
                : 'password'
              }
              placeholder={placeholder}
              className={error ? style.input_error : ''}
            />

            <button 
            type='button'
            onClick={() => setShowPassword(prev => !prev)}
            >
              {showPassword 
                ? <LuEye/>
                : <LuEyeClosed/>
              }              
            </button>
          </div>
        )}
        
        {error && 
          <InputValidationError error={error}/>
        }
      </div>
    );
  }
);

Input.displayName = 'Input'; 

export default Input;