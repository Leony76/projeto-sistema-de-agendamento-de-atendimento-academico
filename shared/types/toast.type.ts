export type ToastType = 'success' | 'error' | 'warning';

export type Toast = {
  id      : string;
  message : string;
  type    : ToastType;
};