import { ButtonHTMLAttributes } from 'react';
import style from './css/Button.module.css';
import Spinner from '../ui/Spinner';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  buttonType: 'mainButton' | 'tabSwitchButton';
  loading?: boolean;
};

const Button = ({ 
  children, 
  buttonType,
  loading,
  ...buttonAttributes
}:Props) => {
  return (
    <button 
    {...buttonAttributes}
    className={
      buttonType === 'mainButton'
        ? style.main_button
        : style.tab_switch_button
    }
    >
      {loading &&
        <Spinner 
        size={18}
        color={buttonType === 'mainButton'
          ? 'rgb(230, 149, 0)'
          : ''
        }
        />
      }
      {children}
    </button>
  )
}

export default Button