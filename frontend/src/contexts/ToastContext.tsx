import React, { createContext, useContext, useState, useCallback } from 'react';
import { ToastType } from '../types/toast';
import Toast from '../components/toast/Toast';

interface ToastProps {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastContextData {
  showToast: (message: string, type: ToastType) => void;
  removeToast: (id: number) => void;
}

const ToastContext = createContext<ToastContextData>({} as ToastContextData);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  const removeToast = useCallback((id: number) => {
    setToasts((state) => state.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback((message: string, type: ToastType) => {
    const id = Date.now();
    const toast = { id, message, type };

    setToasts((state) => [...state, toast]);

    // Timer de 5 segundos
    setTimeout(() => {
      removeToast(id);
    }, 10000);
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ showToast, removeToast }}>
      {children}
      <Toast toasts={toasts} />
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);