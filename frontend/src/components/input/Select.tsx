import { forwardRef, SelectHTMLAttributes } from 'react'
import { SelectVariants } from '../../types/selectVariants';
import { SelectSchema } from '../../types/selectSchame';
import { SELECT_SCHEMA_MAP } from '../../maps/selectSchema/selectSchemaMap';
import { FiFilter } from "react-icons/fi";
import style from './css/Select.module.css';

interface Props extends SelectHTMLAttributes<HTMLSelectElement> {
  error?: string;
  variant: SelectVariants;
  selectSchema: SelectSchema;
  className?: string;
};

const Select = forwardRef<HTMLSelectElement, Props>(
  ({ error, variant, className, selectSchema, ...rest }, ref) => {

    const schema = SELECT_SCHEMA_MAP[selectSchema];

    if (variant === 'SEARCH') {
      return (
        <div className={`${style.select_container} ${className ?? ''}`}>
          <FiFilter/>

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
    } return null;
  }
);

Select.displayName = 'Select';

export default Select;