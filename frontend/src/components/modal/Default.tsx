import React from 'react'
import { IoClose } from 'react-icons/io5';

type Props = {
  visible        : boolean;
  onCloseRequest : () => void;
  children       : React.ReactNode;
  title?         : string;
};

const Default = (props:Props): React.JSX.Element | false => {
  return (
    props.visible && (
      <div 
      className='fixed inset-0 bg-black/50 flex items-center justify-center z-50'
      onClick={props.onCloseRequest}
      >
        <div
        className='flex flex-col gap-1 border-cyan-300 p-2 w-full max-w-270 bg-white rounded-lg z-51'
        onClick={(e) => e.stopPropagation()}
        >
          <div className='flex'>
            { props.title && props.title }

            <button
            className='ml-auto cursor-pointer text-cyan-500 hover:bg-cyan-500 hover:text-white rounded-full'
            onClick={props.onCloseRequest}
            >
              <IoClose className='text-xl'/>
            </button>
          </div>

          { props.children }
        </div>
      </div>
    )
  )
}

export default Default