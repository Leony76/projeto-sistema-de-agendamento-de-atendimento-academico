import { ButtonHTMLAttributes } from 'react';
import style from './css/Button.module.css';
import Spinner from '../ui/Spinner';
import { IconType } from 'react-icons';
import { ButtonBorderSize } from '../../types/button/buttonBorderSize';
import { ButtonColor } from '../../types/button/buttonColor';
import { ButtonFontSize } from '../../types/button/buttonFontSize';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  buttonStyle: {
    border: ButtonBorderSize;
    fontSize: ButtonFontSize; 
    color: ButtonColor;
    filled: boolean;
  };
  loading?: boolean;
  className?: string;
  icon?: IconType;
};

const Button = ({ 
  children, 
  buttonStyle,
  loading,
  className,
  icon: Icon,
  ...buttonAttributes
}:Props) => {

  const BUTTON_BORDER: Record<ButtonBorderSize, string> = {
    MD: style.MD_border,
    XL: style.XL_border,
  };

  const BUTTON_FONT: Record<ButtonFontSize, string> = {
    MD: style.MD_font,
    XL: style.XL_font,
  };

  const BUTTON_COLOR: Record<ButtonColor, string> = {
    PRIMARY: style.primary_color,
    SECONDARY: style.secondary_color,
    NEUTRAL: style.neutral,
  };

  const FILLED_BUTTON_COLOR: Record<ButtonColor, string> = {
    PRIMARY: style.filled_primary_color,
    SECONDARY: style.filled_secondary_color,
    NEUTRAL: style.neutral,
  };

  const SPINNER_COLOR: Record<ButtonColor, string> = {
    PRIMARY: 'rgb(79, 158, 255)',
    SECONDARY: 'rgb(255, 255, 255)',
    NEUTRAL: style.neutral,
  };

  const font = BUTTON_FONT[buttonStyle.fontSize];
  const border = BUTTON_BORDER[buttonStyle.border];
  const color = buttonStyle.filled
    ? FILLED_BUTTON_COLOR[buttonStyle.color]
    : BUTTON_COLOR[buttonStyle.color];

  return (
    <button 
    {...buttonAttributes}
    className={`${color} ${border} ${font} ${className ?? ''}`}
    >
      {loading &&
        <Spinner 
        size={18}
        color={SPINNER_COLOR[buttonStyle.color]}
        />
      }
      {(Icon && !loading) && <Icon/>}
      {children}
    </button>
  )
}

export default Button