import React from 'react';
import { Link } from 'react-router-dom';
import { getCloudinaryUrl } from '../../lib/cloudinary';

export default function AdminSidebar({ collapsed, onToggle, showMobileSidebar, setShowMobileSidebar, activePage, setActivePage, navItems, onLogout }) {
  return (
    <div className={`bg-primary font-poppins flex flex-col flex-shrink-0 transition-all duration-300 overflow-hidden 
      fixed lg:relative z-[50] h-full
      ${showMobileSidebar ? 'translate-x-0 w-64 shadow-2xl' : '-translate-x-full lg:translate-x-0'}
      ${collapsed ? 'lg:w-[68px]' : 'lg:w-64'}`}>

      {/* Brand Header */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-white/10">
        <Link to="/" className="flex-shrink-0">
          <div className="w-9 h-9 bg-white/15 rounded-xl flex items-center justify-center">
            <img 
              src={getCloudinaryUrl('FOOTERLOGO_zyaqbf')} 
              alt="Logo" 
              className="w-7 h-7 object-contain brightness-0 invert"
            />
          </div>
        </Link>
        {(!collapsed || showMobileSidebar) && (
          <div className="overflow-hidden">
            <div className="text-white text-sm font-bold whitespace-nowrap">CS Portal</div>
            <div className="text-white/60 text-xs whitespace-nowrap leading-tight">Admin Panel</div>
          </div>
        )}

        <button
          onClick={onToggle}
          className="ml-auto hidden lg:flex bg-transparent border-0 text-white cursor-pointer flex-shrink-0 p-1 rounded-lg hover:bg-white/15 transition-colors">
          <i className={`fas ${collapsed ? 'fa-chevron-right' : 'fa-chevron-left'} text-sm`}></i>
        </button>

        <button
          onClick={() => setShowMobileSidebar(false)}
          className="ml-auto lg:hidden bg-transparent border-0 text-white cursor-pointer p-1 rounded-lg hover:bg-white/15 transition-colors">
          <i className="fas fa-times text-lg"></i>
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-2 sidebar-nav mt-2">
        {/* Go Home Button */}
        <Link 
          to="/" 
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 outline-none cursor-pointer mb-1 text-white/90 hover:bg-white/15 hover:text-white"
          title={collapsed && !showMobileSidebar ? "Go Home" : ""}
        >
          <i className="fas fa-home text-sm w-5 text-center flex-shrink-0"></i>
          {(!collapsed || showMobileSidebar) && (
            <span className="text-sm font-medium whitespace-nowrap overflow-hidden flex-1">Go Home</span>
          )}
        </Link>
        
        {navItems.map(item => {
          const isActive = activePage === item.id;
          return (
            <div key={item.id} className="mb-1">
              <div
                role="button"
                tabIndex={0}
                title={collapsed && !showMobileSidebar ? item.label : ''}
                onClick={() => {
                  setActivePage(item.id);
                  if (window.innerWidth < 1024) setShowMobileSidebar(false);
                }}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { setActivePage(item.id); } }}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 outline-none cursor-pointer
                  ${isActive
                    ? 'bg-secondary text-white shadow-lg shadow-blue-600/30 font-bold'
                    : 'text-white/90 hover:bg-white/15 hover:text-white'}`}>
                <i className={`fas ${item.icon} text-sm w-5 text-center flex-shrink-0`}></i>
                {(!collapsed || showMobileSidebar) && (
                  <span className="text-sm font-medium whitespace-nowrap overflow-hidden flex-1">{item.label}</span>
                )}
              </div>
            </div>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-2 border-t border-white/10">
        <div
          role="button"
          tabIndex={0}
          onClick={onLogout}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onLogout(); }}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer text-white/90 hover:bg-white/15 hover:text-white transition-all duration-200 outline-none">
          <i className="fas fa-right-from-bracket text-sm w-5 text-center flex-shrink-0"></i>
          {(!collapsed || showMobileSidebar) && <span className="text-sm font-medium">Logout</span>}
        </div>
      </div>
    </div>
  );
}
