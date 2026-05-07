import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/layout/AdminLayout.jsx';
import { api } from '../../lib/api';

// Lazy imports for pages
import AdminDashboardHome from './AdminDashboardHome.jsx';
import NewsManagement from './NewsManagement.jsx';
import EventsManagement from './EventsManagement.jsx';
import AdminsManagement from './AdminsManagement.jsx';
import FacultyManagement from './FacultyManagement.jsx';

const adminNav = [
  { id: 'dashboard', label: 'Dashboard', icon: 'fa-chart-pie' },
  { id: 'news', label: 'News Management', icon: 'fa-newspaper' },
  { id: 'events', label: 'Events Management', icon: 'fa-calendar-days' },
  { id: 'faculty', label: 'Faculty Management', icon: 'fa-user-tie' },
  { id: 'admins', label: 'Manage Admins', icon: 'fa-user-shield' },
];

export default function AdminPortal() {
  const navigate = useNavigate();
  const [sessionLoading, setSessionLoading] = useState(true);
  const [userEmail, setUserEmail] = useState('');
  const [activePage, setActivePage] = useState('dashboard');

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      navigate('/admin/login', { replace: true });
    } else {
      setUserEmail(localStorage.getItem('admin_email') || 'Admin');
      setSessionLoading(false);
    }
  }, [navigate]);

  const handleLogout = useCallback(() => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_email');
    navigate('/admin/login');
  }, [navigate]);

  if (sessionLoading) {
    return (
      <div className="min-h-screen bg-lightbg flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-primary/10 border-t-primary rounded-full animate-spin" />
        <p className="text-xs font-black text-primary tracking-[0.2em] animate-pulse font-poppins">Loading Portal...</p>
      </div>
    );
  }

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard': return <AdminDashboardHome />;
      case 'news': return <NewsManagement />;
      case 'events': return <EventsManagement />;
      case 'faculty': return <FacultyManagement />;
      case 'admins': return <AdminsManagement />;
      default: return <AdminDashboardHome />;
    }
  };

  return (
    <AdminLayout
      userEmail={userEmail}
      onLogout={handleLogout}
      activePage={activePage}
      setActivePage={setActivePage}
      navItems={adminNav}
    >
      <div className="animate-fade-in">
        {renderPage()}
      </div>
    </AdminLayout>
  );
}
