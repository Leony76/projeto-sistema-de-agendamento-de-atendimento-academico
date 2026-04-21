import type React from "react";
import type { ButtonHTMLAttributes } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  onClick : () => void;
  label   : React.ReactNode;
  Icon?   : React.ElementType;
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
      flex items-center justify-center gap-1.5 bg-cyan-100 text-cyan-500 hover:brightness-97 active:brightness-90 hover:cursor-pointer w-full p-3 rounded-xl border border-cyan-300
      ${ props.customStyle?.button ?? '' }
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