import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';

export const AppLayout: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('loopr_sidebar_collapsed');
      return saved ? JSON.parse(saved) : false;
    } catch {
      return false;
    }
  });

  const toggleCollapse = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('loopr_sidebar_collapsed', JSON.stringify(next));
      } catch (e) {
        // Ignore storage errors
      }
      return next;
    });
  };

  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        backgroundColor: 'var(--bg-app)',
        color: 'var(--text-primary)'
      }}
    >
      {/* Enterprise Collapsible Sidebar */}
      <Sidebar isCollapsed={isCollapsed} onToggleCollapse={toggleCollapse} />

      {/* Main App Workspace */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
          overflowX: 'hidden'
        }}
      >
        {/* Crisp, Non-Wrapping Sticky Top Bar */}
        <TopBar />

        {/* Dynamic Nested Route Page Body */}
        <main
          style={{
            flex: 1,
            position: 'relative'
          }}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
