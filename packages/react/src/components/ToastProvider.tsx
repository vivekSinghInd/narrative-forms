/**
 * ToastProvider — manages toast notifications for validation errors.
 *
 * @remarks
 * Provides a context to dispatch toasts, and renders them in a fixed container.
 */

import React, { createContext, useContext, useState, useCallback } from "react";

export interface ToastMessage {
  id: string;
  message: string;
  icon?: boolean;
  iconChar?: string;
}

interface ToastContextValue {
  showToast: (message: string, icon?: boolean, iconChar?: string) => void;
  hideToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback((message: string, icon = false, iconChar = "⚠") => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, icon, iconChar }]);

    // Auto dismiss after 3 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  const hideToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      {toasts.length > 0 && (
        <div className="ns-toast-container" aria-live="polite">
          {toasts.map((toast) => (
            <div key={toast.id} className="ns-toast ns-animate-fade-up">
              {toast.icon && <span className="ns-toast-icon">{toast.iconChar} </span>}
              <span className="ns-toast-message">{toast.message}</span>
              <button 
                type="button" 
                className="ns-toast-close" 
                onClick={() => hideToast(toast.id)}
                aria-label="Close"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </ToastContext.Provider>
  );
};
