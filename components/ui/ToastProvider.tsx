
import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import ReactDOM from 'react-dom';
import { ToastNotification, ToastType } from '../../types';
import { CheckCircle, XCircle, Info, Star } from 'lucide-react';

interface ToastContextType {
  addToast: (message: string, type: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within a ToastProvider');
  return context;
};

const Toast: React.FC<{ toast: ToastNotification; onDismiss: (id: number) => void }> = ({ toast, onDismiss }) => {
  const [isExiting, setIsExiting] = useState(false);
  const timerRef = useRef<number | null>(null);

  const startDismissal = useCallback(() => {
    setIsExiting(true);
    setTimeout(() => onDismiss(toast.id), 400);
  }, [onDismiss, toast.id]);

  React.useEffect(() => {
    timerRef.current = window.setTimeout(startDismissal, 3500);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [startDismissal]);

  const icons: Record<ToastType, React.ReactNode> = {
    success: <CheckCircle className="w-5 h-5 text-green-400" />,
    error: <XCircle className="w-5 h-5 text-red-400" />,
    info: <Info className="w-5 h-5 text-purple-400" />,
    special: <Star className="w-5 h-5 text-yellow-400 animate-pulse" />,
  };

  const styles: Record<ToastType, string> = {
    success: 'border-green-500/40 bg-green-950/20',
    error: 'border-red-500/40 bg-red-950/20',
    info: 'border-purple-500/40 bg-purple-950/20',
    special: 'border-yellow-500/40 bg-yellow-950/30 shadow-[0_0_15px_rgba(234,179,8,0.1)]',
  };

  return (
    <div
      onClick={startDismissal}
      className={`w-full max-w-sm p-3 rounded border backdrop-blur-xl flex items-center gap-3 cursor-pointer transition-all duration-400 ${isExiting ? 'opacity-0 translate-x-10' : 'opacity-100 translate-x-0'} ${styles[toast.type]}`}
    >
      <div className="flex-shrink-0">{icons[toast.type]}</div>
      <p className="flex-grow text-[11px] font-black uppercase tracking-widest text-gray-200">{toast.message}</p>
    </div>
  );
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastNotification[]>([]);
  const lastMessages = useRef<Set<string>>(new Set());

  const addToast = useCallback((message: string, type: ToastType) => {
    // Prevent same message spamming in a short interval
    if (lastMessages.current.has(message)) return;
    lastMessages.current.add(message);
    setTimeout(() => lastMessages.current.delete(message), 3000);

    setToasts(prev => [...prev, { id: Date.now() + Math.random(), message, type }]);
  }, []);

  const removeToast = useCallback((id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      {ReactDOM.createPortal(
        <div className="fixed top-6 right-6 z-[1000] space-y-2 w-full max-w-sm">
          {toasts.map(toast => (
            <Toast key={toast.id} toast={toast} onDismiss={removeToast} />
          ))}
        </div>,
        document.getElementById('toast-root') || document.body
      )}
    </ToastContext.Provider>
  );
};
