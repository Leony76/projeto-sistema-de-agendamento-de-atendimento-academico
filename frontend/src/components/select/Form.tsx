import { forwardRef, SelectHTMLAttributes } from 'react'
import { SelectVariants } from '../../types/variants/selectVariants';
import { SelectSchema } from '../../types/selectSchame';
import { SELECT_SCHEMA_MAP } from '../../maps/selectSchema/selectSchemaMap';
import { FiFilter } from "react-icons/fi";
import style from './css/Select.module.css';

interface Props extends SelectHTMLAttributes<HTMLSelectElement> {
  error?: string;
  selectSchema: SelectSchema;
  className?: string;
};

const Form = forwardRef<HTMLSelectElement, Props>(
  ({ error, className, selectSchema, ...rest }, ref) => {

    const schema = SELECT_SCHEMA_MAP[selectSchema];

    return (
      <div className={`${style.select_container} ${className ?? ''}`}>

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
      </div>
    )
  } 
);

Form.displayName = 'Select';

export default Form;