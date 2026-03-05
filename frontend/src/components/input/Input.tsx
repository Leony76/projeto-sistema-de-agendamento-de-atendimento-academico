import { forwardRef, InputHTMLAttributes } from 'react';
import style from './css/Input.module.css';
import InputValidationError from './InputValidationError';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string; 
}

const Input = forwardRef<HTMLInputElement, Props>(
  ({ label, error, type, placeholder, ...rest }, ref) => {
    return (
      <div className={style.input_container}>
        <label htmlFor={rest.id || rest.name}>
          {label}
        </label>

        <input
          {...rest}
          ref={ref} 
          type={type}
          placeholder={placeholder}
          className={error ? style.input_error : ''}
        />
        
        {error && 
          <InputValidationError error={error}/>
        }
      </div>
    );
  }
);

Input.displayName = 'Input'; 

export default Input;