import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { authService } from '../services/authService';
import { useAlert } from './AlertContext';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, role?: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => authService.getCurrentUser());
  const [token, setToken] = useState<string | null>(() => authService.getToken());
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { showError, showSuccess, showWarning } = useAlert();

  useEffect(() => {
    const verifyUser = async () => {
      if (token) {
        try {
          const profile = await authService.getMe();
          setUser(profile);
          localStorage.setItem('crackit_user', JSON.stringify(profile));
        } catch {
          // If token verification fails, clear session
          authService.logout();
          setUser(null);
          setToken(null);
        }
      }
      setIsLoading(false);
    };

    verifyUser();

    // Listen for unauthorized 401 events dispatched by Axios interceptor
    const handleUnauthorized = (event: any) => {
      setUser(null);
      setToken(null);
      showWarning(event.detail?.message || 'Unauthorized session. Please log in again.');
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
  }, [token, showWarning]);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      const res = await authService.login(email, password);
      setUser(res.user);
      setToken(res.token);
      showSuccess(`Welcome back, ${res.user.name || 'Analyst'}!`);
      return true;
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Login failed. Please verify credentials.';
      showError(msg);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, role?: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      const res = await authService.register(name, email, password, role);
      setUser(res.user);
      setToken(res.token);
      showSuccess(`Account created successfully! Welcome, ${res.user.name}!`);
      return true;
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Registration failed. Please check your information.';
      showError(msg);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setToken(null);
    showSuccess('You have been logged out successfully.');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        isLoading,
        login,
        register,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
