import { forwardRef, SelectHTMLAttributes } from 'react'
import { SelectSchema } from '../../types/selectSchame';
import { SELECT_SCHEMA_MAP } from '../../maps/selectSchema/selectSchemaMap';
import style from './css/Form.module.css';
import NoAvailableContent from '../ui/NoAvailableContent';
import InputValidationError from '../input/InputValidationError';

interface Props extends SelectHTMLAttributes<HTMLSelectElement> {
  error?       : string;
  selectSchema : SelectSchema;
  label        : string;     
  className?   : string;
};

const Form = forwardRef<HTMLSelectElement, Props>(
  ({ error, className, label, selectSchema, ...rest }, ref) => {

    const schema = SELECT_SCHEMA_MAP[selectSchema];

    return (
      <div className={`${style.select_container} ${className ?? ''}`}>
        
        <label>
          {label}
        </label>

        <select
        {...rest}
        ref={ref}
        >
          {schema.map((option) => (
            <option 
            value={option.value} 
            key={option.value}
            >
              {option.name}
            </option>
          ))}
        </select>

        {error && <InputValidationError error={error} />}
      </div>
    )
  } 
);

Form.displayName = 'Select';

export default Form;