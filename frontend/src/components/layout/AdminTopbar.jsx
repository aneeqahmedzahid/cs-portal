import React, { useState } from 'react';

export default function AdminTopbar({ userEmail, activePage, navItems, onLogout, onMenuToggle }) {
  const [showDD, setShowDD] = useState(false);
  const pageLabel = navItems.find(n => n.id === activePage)?.label || 'Dashboard';

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

  return (
    <div className="bg-white border-b border-gray-100 px-3 md:px-6 h-14 md:h-16 flex items-center justify-between shadow-sm flex-shrink-0 z-[30] gap-3 font-poppins">
      <div className="flex items-center gap-2 md:gap-3 min-w-0">
        <button
          onClick={onMenuToggle}
          className="w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center text-gray-500 hover:bg-gray-100 hover:text-primary transition-all border-0 cursor-pointer flex-shrink-0">
          <i className="fas fa-bars text-sm" />
        </button>
        <div className="min-w-0">
          <h2 className="text-sm md:text-base font-bold text-primary leading-tight truncate">{pageLabel}</h2>
          <p className="text-[10px] text-gray-400 leading-tight hidden sm:block">CUI Abbottabad · {today}</p>
        </div>
      </div>

      <div className="flex items-center gap-1.5 md:gap-2 flex-shrink-0">
        {/* Admin badge */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-bold text-emerald-700 whitespace-nowrap">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span>Admin Active</span>
        </div>

        {/* User Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowDD(!showDD)}
            className="flex items-center gap-2 p-1 md:px-2.5 md:py-1.5 bg-gray-50 rounded-xl cursor-pointer border border-gray-100 hover:bg-blue-50 hover:border-blue-100 transition-all">
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary text-xs font-bold shadow-sm overflow-hidden flex-shrink-0">
              <i className="fas fa-user-shield"></i>
            </div>
            <div className="text-left hidden sm:block">
              <div className="text-xs font-bold text-gray-800 leading-tight truncate max-w-28">{userEmail}</div>
              <div className="text-[10px] text-gray-400 leading-tight font-bold">Administrator</div>
            </div>
            <i className="fas fa-chevron-down text-gray-400 ml-0.5 hidden sm:block text-[9px]" />
          </button>

          {showDD && (
            <div className="absolute right-0 top-12 bg-white border border-gray-100 rounded-xl p-2 min-w-48 shadow-xl z-50 animate-slide-in">
              <div className="px-3 py-2 sm:hidden border-b border-gray-50 mb-1">
                <div className="text-xs font-bold text-gray-800">{userEmail}</div>
                <div className="text-[10px] text-gray-400 font-bold">Administrator</div>
              </div>
              <div onClick={() => { setShowDD(false); onLogout(); }} className="flex items-center gap-2 px-3 py-2.5 rounded-lg hover:bg-red-50 text-sm text-red-500 cursor-pointer transition-colors">
                <i className="fas fa-power-off w-4" /> Sign Out
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
