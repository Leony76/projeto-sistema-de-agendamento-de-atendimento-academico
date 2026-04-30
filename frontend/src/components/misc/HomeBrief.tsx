import React from 'react'

type Props = {
  Icon  : React.ElementType;
  label : string;
  value : string | number;
  customStyle?: {
    label?: string;
    value?: string;
  };
};

const HomeBrief = (props:Props): React.JSX.Element => {

  const Icon = props.Icon;
  
  return (
    <div className='flex px-5 gap-5 border items-center border-cyan-400 rounded-lg bg-cyan-100/20 flex-1'>
      <Icon/>
      
      <div className={`
        flex flex-col 
        ${ props.customStyle?.label ?? '' }
      `}>
        <h4 className=' text-cyan-500 text-sm'>
          { props.label }
        </h4>

        <span className={`
          text-lg font-semibold -mt-1 text-orange-500/50
          ${ props.customStyle?.value ?? '' }
        `}>
          { props.value }
        </span>
      </div>
    </div>
  )
}

export default HomeBrief