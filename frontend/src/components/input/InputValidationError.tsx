import style from './css/InputValidationError.module.css';
import { MdError } from "react-icons/md";

type Props = {
  error: string; 
};

const InputValidationError = ({error}:Props) => {
  return (
    <span className={style.main_class}>
      <MdError/>
      {error}
    </span>
  )
}

export default InputValidationError