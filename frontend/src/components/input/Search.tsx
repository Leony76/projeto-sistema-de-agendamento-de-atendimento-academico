import { forwardRef, useState } from 'react';
import style from './css/Input.module.css';
import { IoClose } from 'react-icons/io5';
import { IoMdSearch } from 'react-icons/io';
import { BaseProps } from '.';

type Props = BaseProps;

const Search = forwardRef<HTMLInputElement, Props>(
  (props, ref) => {

    const { 
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
        />

        <IoClose 
          className={style.clear_search}
          onClick={() => rest.onChange?.({ target: { value: '' } } as any)}
        />
      </div>
    );
  }
);

Search.displayName = 'Input'; 

export default Search;