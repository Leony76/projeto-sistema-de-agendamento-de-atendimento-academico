import { IoClose, IoCheckmarkCircle, IoInformationCircle, IoWarning } from "react-icons/io5";
import { MdError } from "react-icons/md";
import style from './css/Toast.module.css';
import { ToastType } from "../../types/toast";
import { useToast } from "../../contexts/ToastContext";

const icons = {
  SUCCESS: <IoCheckmarkCircle size={24}/>,
  ERROR: <MdError size={24}/>,
  INFO: <IoInformationCircle size={24}/>,
  WARNING: <IoWarning size={24}/>,
};

interface ContainerProps {
  toasts: { 
    id: number; 
    message: string; 
    type: ToastType 
  }[];
}

const Toast = ({ toasts }: ContainerProps) => {
  const { removeToast } = useToast();

  return (
    <div className={style.wrapper}>
      {toasts.map((toast) => (
        <div 
        key={toast.id} 
        className={`${style.toast} ${style[toast.type]}`}
        >
          <span 
          className={style.icon}>
            {icons[toast.type]}
          </span>

          <p>
            {toast.message}
          </p>

          <button 
          onClick={() => removeToast(toast.id)} 
          className={style.closeBtn}>
            <IoClose size={18} />
          </button>
        </div>
      ))}
    </div>
  );
};

export default Toast;