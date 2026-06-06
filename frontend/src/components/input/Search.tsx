import { forwardRef, type InputHTMLAttributes } from 'react'
import { IoClose, IoSearch } from 'react-icons/io5';

type Props = InputHTMLAttributes<HTMLInputElement> & {
  onClear: () => void;
  customStyle?: {
    label?     : string;
    input?     : string;
  };
};

const Search = forwardRef<HTMLInputElement, Props>((props, ref) => {

  const { 
    customStyle, 
    type, 
    ...rest 
  } = props;  

  const hasValue = rest.value && rest.value.toString().length > 0;

  return (
    <div className={`
      px-2 flex items-center rounded-xl border bg-amber-100/25 transition-colors border-orange-300
      ${customStyle?.input ?? ''}
    `}>
      <IoSearch className='text-orange-300 mx-1 mr-2'/>

      <input
        ref={ref}
        {...rest} 
        className="flex-1 outline-none text-sm text-cyan-400 py-1.5 bg-transparent"
        type='text'
      />

      {hasValue && (
        <button 
        type="button" 
        onClick={props.onClear}
        className="focus:outline-none cursor-pointer"
        >
          <IoClose className="text-xl text-orange-300" />
        </button>
      )}
    </div>
  );
});

Search.displayName = 'Input.Search';

export default Search;