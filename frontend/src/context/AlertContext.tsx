import React, { createContext, useContext, useState, useCallback } from 'react';
import { AlertItem } from '../types';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

interface AlertContextType {
  alerts: AlertItem[];
  showAlert: (message: string, type?: AlertItem['type'], duration?: number) => void;
  showError: (message: string, duration?: number) => void;
  showSuccess: (message: string, duration?: number) => void;
  showWarning: (message: string, duration?: number) => void;
  showInfo: (message: string, duration?: number) => void;
  removeAlert: (id: string) => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const AlertProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [alerts, setAlerts] = useState<AlertItem[]>([]);

  const removeAlert = useCallback((id: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  }, []);

  const showAlert = useCallback(
    (message: string, type: AlertItem['type'] = 'info', duration: number = 4500) => {
      const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const newAlert: AlertItem = { id, type, message, duration };

      setAlerts((prev) => [...prev, newAlert]);

      if (duration > 0) {
        setTimeout(() => {
          removeAlert(id);
        }, duration);
      }
    },
    [removeAlert]
  );

  const showError = useCallback((msg: string, d?: number) => showAlert(msg, 'error', d || 5000), [showAlert]);
  const showSuccess = useCallback((msg: string, d?: number) => showAlert(msg, 'success', d || 3500), [showAlert]);
  const showWarning = useCallback((msg: string, d?: number) => showAlert(msg, 'warning', d || 4500), [showAlert]);
  const showInfo = useCallback((msg: string, d?: number) => showAlert(msg, 'info', d || 4000), [showAlert]);

  return (
    <AlertContext.Provider
      value={{ alerts, showAlert, showError, showSuccess, showWarning, showInfo, removeAlert }}
    >
      {children}

      {/* Floating Alert Chips Container */}
      <div
        style={{
          position: 'fixed',
          top: '1.25rem',
          right: '1.25rem',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          gap: '0.65rem',
          maxWidth: '420px',
          width: 'calc(100% - 2.5rem)',
          pointerEvents: 'none'
        }}
      >
        {alerts.map((alert) => {
          const isError = alert.type === 'error';
          const isSuccess = alert.type === 'success';
          const isWarning = alert.type === 'warning';

          const bgColor = isError
            ? '#1f1317'
            : isSuccess
            ? '#0e1f1a'
            : isWarning
            ? '#211c10'
            : '#0f172a';

          const borderColor = isError
            ? '#f43f5e'
            : isSuccess
            ? '#10b981'
            : isWarning
            ? '#f59e0b'
            : '#7ac7ff';

          const textColor = isError
            ? '#fda4af'
            : isSuccess
            ? '#6ee7b7'
            : isWarning
            ? '#fde68a'
            : '#d0ebff';

          return (
            <div
              key={alert.id}
              className="animate-fade-in"
              style={{
                pointerEvents: 'auto',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.75rem 1rem',
                borderRadius: '12px',
                backgroundColor: bgColor,
                border: `1px solid ${borderColor}`,
                boxShadow: `0 10px 25px -5px rgba(0, 0, 0, 0.6), 0 0 15px ${borderColor}22`,
                backdropFilter: 'blur(12px)',
                color: textColor,
                fontSize: '0.875rem',
                fontWeight: 500,
                lineHeight: 1.4
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flex: 1 }}>
                {isError && <AlertCircle size={18} color="#f43f5e" style={{ flexShrink: 0 }} />}
                {isSuccess && <CheckCircle2 size={18} color="#10b981" style={{ flexShrink: 0 }} />}
                {isWarning && <AlertTriangle size={18} color="#f59e0b" style={{ flexShrink: 0 }} />}
                {!isError && !isSuccess && !isWarning && (
                  <Info size={18} color="#818cf8" style={{ flexShrink: 0 }} />
                )}
                <span>{alert.message}</span>
              </div>
              <button
                onClick={() => removeAlert(alert.id)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'currentColor',
                  opacity: 0.7,
                  cursor: 'pointer',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  marginLeft: '0.5rem'
                }}
              >
                <X size={16} />
              </button>
            </div>
          );
        })}
      </div>
    </AlertContext.Provider>
  );
};

export const useAlert = (): AlertContextType => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlert must be used within an AlertProvider');
  }
  return context;
};
