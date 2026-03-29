import style from './css/Default.module.css';
import { FaChevronLeft } from "react-icons/fa6";

export type Props = {
  title:       string;
  description: string;
  children:    React.ReactNode;
  onSubmit:    React.SubmitEventHandler<HTMLFormElement>;
  onClose:     () => void;
}

const Default = ({
  children,
  description,
  title,
  onClose,
  onSubmit,
}:Props) => {  
  return (
    <div className={style.add_container}>
      <div className={style.title_switch_show_form_container}>
        <h3>
          {title}
        </h3>

        <FaChevronLeft onClick={onClose}/> 
      </div>

      <p>
        {description}
      </p>

      <form onSubmit={onSubmit}>
        {children}
      </form>
    </div>
  );
}

export default Default;