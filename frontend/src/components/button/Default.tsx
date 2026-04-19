import type React from "react";
import type { ButtonHTMLAttributes } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  onClick : () => void;
  label   : React.ReactNode;
  customStyle?: string;
};

const Default = (props:Props): React.JSX.Element => {
  return (
    <button 
    disabled={props.disabled}
    onClick={props.onClick}
    className={`
      bg-cyan-100 text-cyan-500 hover:brightness-97 active:brightness-90 hover:cursor-pointer w-full p-3 rounded-xl border border-cyan-300
      ${ props.customStyle ?? '' }
    `}
    >
      { props.label }
    </button>
  )
}

export default Default