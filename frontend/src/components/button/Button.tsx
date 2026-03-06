import { ButtonHTMLAttributes } from 'react';
import style from './css/Button.module.css';
import Spinner from '../ui/Spinner';
import { ButtonType } from '../../types/buttons';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  buttonType: ButtonType;
  loading?: boolean;
};

const Button = ({ 
  children, 
  buttonType,
  loading,
  ...buttonAttributes
}:Props) => {

  const buttonStyle:string =
    buttonType === 'mainButton'
      ? style.main_button
    : buttonType === 'modalProceedButton'
      ? style.modal_proceed_button
    : buttonType === 'modalReturnButton'
      ? style.modal_return_button
    :   style.tab_switch_button
  ;

  return (
    <button 
    {...buttonAttributes}
    className={buttonStyle}
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