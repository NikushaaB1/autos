import React from 'react';
import { useToastStore } from '../../store/toastStore';
import type { ToastItem } from '../../store/toastStore';
import { CheckCircle, AlertTriangle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToastStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-5 right-5 z-[100] flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onRemove={removeToast} />
      ))}
    </div>
  );
};

interface ToastProps {
  toast: ToastItem;
  onRemove: (id: string) => void;
}

const Toast: React.FC<ToastProps> = ({ toast, onRemove }) => {
  const { id, type, message } = toast;

  const styles = {
    success: {
      glass: 'border-emerald-500/20 bg-emerald-950/70 text-emerald-300',
      icon: <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />,
    },
    error: {
      glass: 'border-red-500/20 bg-red-950/70 text-red-300',
      icon: <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />,
    },
    info: {
      glass: 'border-brand-blue-500/20 bg-brand-blue-950/70 text-brand-blue-300',
      icon: <Info className="w-5 h-5 text-brand-blue-400 shrink-0" />,
    },
  }[type];

  return (
    <div
      className={`flex items-start gap-3 p-4 rounded-xl border backdrop-blur-md shadow-2xl pointer-events-auto transition-all duration-300 animate-fadeIn ${styles.glass}`}
      role="alert"
    >
      {styles.icon}
      <div className="flex-1 text-xs font-semibold font-sans leading-5 tracking-wide text-left">
        {message}
      </div>
      <button
        onClick={() => onRemove(id)}
        className="text-slate-400 hover:text-slate-200 transition-colors p-0.5 rounded-md hover:bg-white/5 cursor-pointer shrink-0"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
export default ToastContainer;
