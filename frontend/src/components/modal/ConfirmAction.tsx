import React from 'react'
import { IoClose } from 'react-icons/io5';
import { Button } from '../button';
import { FaCheck } from 'react-icons/fa';
import { MdClose } from 'react-icons/md';

type Props = {
  visible        : boolean;
  title          : string;
  message        : string;  
  loading        : boolean;
  onCloseRequest : () => void;
  onAccept       : () => void; 
};

const ConfirmAction = (props:Props): React.JSX.Element | false => {
  return (
    props.visible && (
      <div 
      className='fixed inset-0 bg-black/50 flex items-center justify-center z-50'
      onClick={!props.loading ? props.onCloseRequest : () => {}}
      >
        <div
        className='flex flex-col gap-2 border-cyan-300 p-3 w-full max-w-100 bg-white rounded-lg z-51'
        onClick={(e) => e.stopPropagation()}
        >
          <div className='flex text-xl text-cyan-500 font-semibold'>
            { props.title }

            { !props.loading &&
              <button
              className='ml-auto cursor-pointer text-cyan-500 hover:bg-cyan-500 hover:text-white rounded-full'
              onClick={props.onCloseRequest}
              >
                <IoClose className='text-xl'/>
              </button>
            }
          </div>

          <span className='text-sm text-orange-500'>
            { props.message }
          </span>

          <div className='flex gap-2 mt-1'>
            <Button.Default
              label={props.loading  ? '' : 'Sim'}
              onClick={props.onAccept}
              loadingColor='text-green-500'
              loading={props.loading}
              disabled={props.loading}
              Icon={() => <FaCheck />}
              customStyle={{ button: 'py-1 text-green-500 boder border-green-500 bg-green-50' }}
            />

            <Button.Default
              label='Não'
              Icon={() => <MdClose className='scale-[1.5]'/>}
              disabled={props.loading}
              onClick={props.onCloseRequest}
              customStyle={{ button: 'py-1 text-red-500 border border-red-500 bg-red-50' }}
            />
          </div>
        </div>
      </div>
    )
  )
}

export default ConfirmAction