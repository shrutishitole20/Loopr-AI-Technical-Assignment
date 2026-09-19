import React, { useState } from 'react';
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
  const [isMobileOpen, setIsMobileOpen] = useState<boolean>(false);

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
      {/* Enterprise Collapsible & Mobile Drawer Sidebar */}
      <Sidebar
        isCollapsed={isCollapsed}
        onToggleCollapse={toggleCollapse}
        isMobileOpen={isMobileOpen}
        onCloseMobile={() => setIsMobileOpen(false)}
      />

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
        {/* Crisp, Non-Wrapping Sticky Top Bar with Mobile Toggle */}
        <TopBar
          onToggleMobile={() => setIsMobileOpen((prev) => !prev)}
          isMobileOpen={isMobileOpen}
        />

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

