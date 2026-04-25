import React, { useState } from 'react'
import { Modal } from '../modal';

type Props = {
  image: {
    name : string;
    uri  : string;
    size?: string; 
  };
}

const ExpansibleImage = (props:Props):React.JSX.Element => {

  const [ expanded, setExpanded ] = useState<boolean>(false);

  return (
    <>
      <Modal.Default
      onCloseRequest={() => setExpanded(false)}
      visible={expanded}
      >
        <div className='max-h-[90vh] overflow-auto cursor-zoom-out'>
          <figure 
          className={``}
          onClick={() => setExpanded(false)}
          >
            <img 
              src={ props.image.uri } 
              alt={ props.image.name }
              className='h-full w-full object-cover'
            />
          </figure>
        </div>
      </Modal.Default>
     
      <figure 
      onClick={() => setExpanded(true)}
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