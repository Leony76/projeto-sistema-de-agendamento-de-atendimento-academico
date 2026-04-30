import React, { useState } from 'react'
import { Modal } from '../modal';
import { BsArrowsFullscreen } from 'react-icons/bs';

type Props = {
  image: {
    name : string;
    uri  : string;
    size?: string; 
  };
}

const ExpansibleImage = (props:Props):React.JSX.Element => {

  const [ expanded, setExpanded ] = useState<'COVER' | 'CONTAIN' | null>(null);

  return (
    <>
      <Modal.Default
      onCloseRequest={() => setExpanded(null)}
      visible={!!expanded}
      >
        <div className='max-h-[90vh] overflow-auto cursor-zoom-out bg-black rounded-lg'>
          <figure 
          className={`relative`}
          onClick={() => setExpanded((prev) => prev === 'COVER' ? 'CONTAIN' : null)}
          >
            { expanded === 'CONTAIN' &&
              <button 
              className='absolute flex items-center gap-2 cursor-pointer top-2 right-2 text-orange-500 bg-orange-50 px-2 py-1 rounded-lg hover:brightness-105 active:brightness-120'
              onClick={(e) => {
                e.stopPropagation();
                setExpanded((prev) => prev === 'CONTAIN' ? 'COVER' : 'CONTAIN');
              }}
              >
                <BsArrowsFullscreen size={18}/>
                Expandir
              </button>
            }

            <img 
              src={props.image.uri} 
              alt={props.image.name}
              className={`
                w-full
                ${expanded === 'CONTAIN'
                  ? 'object-contain max-h-[90vh]'
                  : 'object-cover'
                }
              `}
            />
          </figure>
        </div>
      </Modal.Default>
     
      <figure 
      onClick={() => setExpanded('CONTAIN')}
      className={`
        border border-cyan-400 rounded-full p-1 cursor-zoom-in
        ${ props.image.size ?? ' h-30 w-30'}
      `}>
        <img 
          src={ props.image.uri } 
          alt={ props.image.name }
          className='h-full w-full object-cover rounded-full aspect-square'
        />
      </figure>
    </>
  )
}

export default ExpansibleImage