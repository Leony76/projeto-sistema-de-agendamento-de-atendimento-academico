import { forwardRef, InputHTMLAttributes, useState } from 'react';
import style from './css/Input.module.css';
import InputValidationError from './InputValidationError';
import { LuEyeClosed } from "react-icons/lu";
import { LuEye } from "react-icons/lu";
import { IoClose } from 'react-icons/io5';
import { IoMdSearch } from 'react-icons/io';

type BaseProps = | InputHTMLAttributes<HTMLInputElement> & {
  error?: string; 
  className?: string;
};

type Props = | BaseProps & {
  variant: 'FORM';
  label: string;
} | BaseProps & {
  variant: 'SEARCH';
};

const Input = forwardRef<HTMLInputElement, Props>(
  (props, ref) => {

    const [showPassword, setShowPassword] = useState<boolean>(false);
    
    if (props.variant === 'FORM') {

      const { 
        variant, 
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

    } else if (props.variant === 'SEARCH') {

      const { 
        variant, 
        error, 
        className, 
        type, 
        placeholder, 
        ...rest 
      } = props;
  
      return (
        <div className={`${style.search_input_container} ${className ?? ''}`}>
          <IoMdSearch />
  
          <input
            {...rest}
            ref={ref} 
            type={'text'}
            placeholder={placeholder}
            className={error ? style.input_error : ''}
          />
  
          <IoClose 
            className={style.clear_search}
            onClick={() => rest.onChange?.({ target: { value: '' } } as any)}
          />
        </div>
      );
    }
  }
);

Input.displayName = 'Input'; 

export default Input;