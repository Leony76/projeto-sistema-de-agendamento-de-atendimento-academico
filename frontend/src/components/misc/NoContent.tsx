import React from 'react'

type Props = {
  message : string;  
  Icon?   : React.ElementType;
};

const NoContent = (props:Props): React.JSX.Element => {

  const Icon = props.Icon;
  
  return (
    <div className='h-full w-full flex justify-center items-center'>
      <div className='text-center text-cyan-400 flex justify-center gap-1 flex-col items-center'>
        { Icon && <Icon/> }

        <span className='text-sm break-all'>
          { props.message }
        </span>
      </div>
    </div>
  )
}

export default NoContent