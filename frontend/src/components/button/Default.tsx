import type React from "react";
import type { ButtonHTMLAttributes } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  onClick   : () => void;
  selected? : boolean;
  label     : React.ReactNode;
  Icon?     : React.ElementType;
  customStyle?: {
    button? : string;
    icon?   : string;
  };
};

const Default = (props:Props): React.JSX.Element => {

  const Icon = props.Icon;

  return (
    <button 
    disabled={props.disabled}
    onClick={props.onClick}
    className={`
      flex items-center justify-center gap-1.5 hover:brightness-97 active:brightness-90 hover:cursor-pointer w-full p-3 rounded-xl border 
      ${ props.customStyle?.button ?? '' }
      ${ props.disabled ? 'opacity-50 pointer-events-none' : '' }
      ${ props.selected 
        ? 'bg-cyan-500 text-cyan-100 border-cyan-300' 
        : 'bg-cyan-100 text-cyan-500 border-cyan-300' 
      }
    `}
    > 
      { Icon && 
        <span className={props.customStyle?.icon ?? ''}>
          <Icon/> 
        </span>
      }

      { props.label }
    </button>
  )
}

export default Default