
import { ToastContainer } from '@frontend/components/misc/Toast';
import type { Toast, ToastType,  } from '@shared/types/toast.type';
import { createContext, useContext, useState } from 'react';

type ToastContextType = {
  toasts      : Toast[];
  toast    : (message: string, type?: ToastType) => void;
  removeToast : (id: string) => void;
};

const ToastContext = createContext({} as ToastContextType);

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = (message: string, type: ToastType = 'success') => {
    const id = crypto.randomUUID();

    setToasts((prev) => [...prev, { id, message, type }]);

  }

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }

  return (
    <ToastContext.Provider value={{ toasts, toast, removeToast }}>
      {children}
      <ToastContainer/>
    </ToastContext.Provider>
  );
}

export const useToast = () => {
  return useContext(ToastContext);
}