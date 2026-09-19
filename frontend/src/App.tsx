import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AlertProvider } from './context/AlertContext';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute/ProtectedRoute';
import { PublicRoute } from './components/PublicRoute/PublicRoute';
import { AppLayout } from './components/AppLayout/AppLayout';
import { LoginPage } from './pages/LoginPage/LoginPage';
import { DashboardPage } from './pages/DashboardPage/DashboardPage';
import { TransactionsPage } from './pages/TransactionsPage/TransactionsPage';
import { ReportsPage } from './pages/ReportsPage/ReportsPage';
import { SettingsPage } from './pages/SettingsPage/SettingsPage';
import { NotFoundPage } from './pages/NotFoundPage/NotFoundPage';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AlertProvider>
          <AuthProvider>
            <Routes>
              {/* Public authentication route */}
              <Route
                path="/login"
                element={
                  <PublicRoute>
                    <LoginPage />
                  </PublicRoute>
                }
              />

              {/* Protected application routes with Enterprise Layout */}
              <Route element={<ProtectedRoute />}>
                <Route element={<AppLayout />}>
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/transactions" element={<TransactionsPage />} />
                  <Route path="/reports" element={<ReportsPage />} />
                  <Route path="/settings" element={<SettingsPage />} />
                  <Route path="/" element={<Navigate to="/dashboard" replace />} />
                </Route>
              </Route>

              {/* 404 Catch-All Route */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </AuthProvider>
        </AlertProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
};

export default App;
