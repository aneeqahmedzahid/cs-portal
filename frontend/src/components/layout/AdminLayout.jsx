import React, { useState, useEffect } from 'react';
import AdminSidebar from './AdminSidebar.jsx';
import AdminTopbar from './AdminTopbar.jsx';

export default function AdminLayout({ userEmail, onLogout, activePage, setActivePage, navItems, children }) {
  const [collapsed, setCollapsed] = useState(false);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);

  useEffect(() => {
    if (window.innerWidth >= 1024 && window.innerWidth < 1280) {
      setCollapsed(true);
    }
  }, []);

  return (
    <div className="flex h-screen overflow-hidden relative bg-lightbg selection:bg-secondary/20 font-poppins">
      <AdminSidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed(!collapsed)}
        showMobileSidebar={showMobileSidebar}
        setShowMobileSidebar={setShowMobileSidebar}
        activePage={activePage}
        setActivePage={setActivePage}
        navItems={navItems}
        onLogout={onLogout}
      />

      {showMobileSidebar && (
        <div
          className="fixed inset-0 bg-black/50 z-[40] lg:hidden backdrop-blur-sm"
          onClick={() => setShowMobileSidebar(false)}
        />
      )}

      <div className="flex-1 flex flex-col overflow-hidden w-full transition-all duration-300 ease-in-out">
        <AdminTopbar
          userEmail={userEmail}
          activePage={activePage}
          navItems={navItems}
          onLogout={onLogout}
          onMenuToggle={() => {
            if (window.innerWidth >= 1024) {
              setCollapsed(!collapsed);
            } else {
              setShowMobileSidebar(!showMobileSidebar);
            }
          }}
        />
        <main className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-5 lg:p-6 bg-lightbg scroll-smooth">
          <div className="max-w-[1600px] mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
