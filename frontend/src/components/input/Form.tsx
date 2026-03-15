import { forwardRef, useState } from 'react';
import style from './css/Input.module.css';
import InputValidationError from './InputValidationError';
import { LuEyeClosed } from "react-icons/lu";
import { LuEye } from "react-icons/lu";
import { BaseProps } from '.';

type Props = | BaseProps & {
  label: string;
}

const Form = forwardRef<HTMLInputElement, Props>(
  (props, ref) => {

    const [showPassword, setShowPassword] = useState<boolean>(false);

    const { 
      error, 
      className, 
      label, 
      type, 
      placeholder, 
      ...rest 
    } = props;

    return (
      <div className={`${style.input_container} ${className ?? ''}`}>
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

Form.displayName = 'Form'; 

export default Form;