import React from 'react'
import { IoClose } from 'react-icons/io5';

type Props = {
  visible           : boolean;
  noImplicitClose?  : boolean;
  onCloseRequest    : () => void;
  containerMaxWidth?: `max-w-${number}`;
  containerPadding? : `p-${number}`;
  children          : React.ReactNode;
  title?            : string;
};

const Default = (props:Props): React.JSX.Element | false => {
  return (
    props.visible && (
      <div 
      className='fixed inset-0 bg-black/50 flex items-center justify-center z-50'
      onClick={!props.noImplicitClose ? props.onCloseRequest : () => {}}
      >
        <div
        onClick={(e) => e.stopPropagation()}
        className={`
          flex flex-col gap-1 border-cyan-300 w-full bg-white rounded-lg z-51
          ${ props.containerMaxWidth ?? 'max-w-270' }
          ${ props.containerPadding ?? 'p-2' }
        `}
        >
          <div className='flex text-xl text-cyan-500 font-semibold'>
            { props.title && props.title }

            { !props.noImplicitClose &&
              <button
              className='ml-auto cursor-pointer text-cyan-500 hover:bg-cyan-500 hover:text-white rounded-full'
              onClick={props.onCloseRequest}
              >
                <IoClose className='text-xl'/>
              </button>
            }
          </div>

          { props.children }
        </div>
      </div>
    )
  )
}

export default Default