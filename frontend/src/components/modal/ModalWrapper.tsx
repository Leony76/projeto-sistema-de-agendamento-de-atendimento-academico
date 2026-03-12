import style from './css/Modal.module.css';
import { IoClose } from "react-icons/io5";

type Props = {
  children: React.ReactNode;
  title: string;
  message: string;
  isOpen: boolean;
  onCloseActions: () => void;
  hasXClose?: boolean;
};

const ModalWrapper = ({
  isOpen,
  title,
  message,
  onCloseActions,
  hasXClose,
  children,
}:Props) => {
  return (
    isOpen && (
      <>
      <div 
        className={style.bg_overlay}
        onClick={onCloseActions}
      />
      
      <div className={style.main_container}>
        <div className={style.title_xclose_container}>
          <h2>
            {title}
          </h2>
          {hasXClose && 
            <button onClick={onCloseActions}>
              <IoClose/>
            </button>
          }
        </div>
        <div className={style.content_container}>
          <p>
            {message}
          </p>
          {children}
        </div>
      </div>
      </>
    )    
  )
}

export default ModalWrapper