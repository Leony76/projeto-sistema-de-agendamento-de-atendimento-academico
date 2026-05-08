import { useToast } from '@frontend/contexts/ToastContext';
import type { Toast } from '@shared/types/toast.type';
import { useEffect, useState } from 'react';
import { FaCheck } from 'react-icons/fa';
import { IoIosClose } from 'react-icons/io';
import { IoClose, IoWarning } from 'react-icons/io5';
import { MdErrorOutline } from 'react-icons/md';

type Props = {
  toast   : Toast;
  onClose : () => void;
};

const ToastItem = (props: Props) => {
  const [leaving, setLeaving] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(t);
  }, []);

  const handleClose = () => {
    setLeaving(true);

    setTimeout(() => {
      props.onClose();
    }, 300);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      handleClose(); 
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const bgColors = {
    success: { colorSchema: 'bg-green-100 border-green-500 text-green-500', Icon: <FaCheck /> },
    error: { colorSchema: 'bg-red-100 border-red-500 text-red-500', Icon: <MdErrorOutline size={22}/> },
    warning: { colorSchema: 'bg-yellow-50 border-yellow-500 text-yellow-500', Icon: <IoWarning size={24} /> },
  };

  let animationClass = '';

  if (!mounted) {
    animationClass = 'translate-x-full opacity-0'; 
  } else if (leaving) {
    animationClass = 'translate-x-full opacity-0'; 
  } else {
    animationClass = 'translate-x-0 opacity-100';
  }

  return (
    <div
      className={`
        flex items-center gap-3 px-4 py-3 border rounded-lg shadow-lg
        transform transition-all duration-300
        ${bgColors[props.toast.type].colorSchema}
        ${animationClass}
      `}
    >
      {bgColors[props.toast.type].Icon}

      <span className="text-sm flex-1">
        {props.toast.message}
      </span>

      <button onClick={handleClose} className="hover:opacity-70 cursor-pointer">
        <IoIosClose size={24} />
      </button>
    </div>
  );
};

export const ToastContainer = () => {

  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed top-14 right-3 flex flex-col gap-2 z-50">
      {toasts.map((toast) => (
        <ToastItem
          key={toast.id}
          toast={toast}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
}