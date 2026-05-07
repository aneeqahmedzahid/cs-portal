import React, { useState, useEffect } from 'react';
import { api } from '../../lib/api';

export default function AdminDashboardHome() {
  const [news, setNews] = useState([]);
  const [events, setEvents] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [n, e, a, f] = await Promise.all([
          api.getNews(),
          api.getEvents(),
          api.getAdmins(),
          api.getFaculty()
        ]);
        setNews(n || []);
        setEvents(e || []);
        setAdmins(a || []);
        setFaculty(f || []);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      }
      setLoading(false);
    };
    fetchAll();
  }, []);

  const stats = [
    { label: 'News Articles', count: news.length, icon: 'fa-newspaper', color: 'bg-blue-500', bgLight: 'bg-blue-50', textColor: 'text-blue-600' },
    { label: 'Events', count: events.length, icon: 'fa-calendar-days', color: 'bg-emerald-500', bgLight: 'bg-emerald-50', textColor: 'text-emerald-600' },
    { label: 'Faculty Members', count: faculty.length, icon: 'fa-user-tie', color: 'bg-purple-500', bgLight: 'bg-purple-50', textColor: 'text-purple-600' },
    { label: 'Admins', count: admins.length, icon: 'fa-user-shield', color: 'bg-amber-500', bgLight: 'bg-amber-50', textColor: 'text-amber-600' },
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-4">
        <div className="w-12 h-12 border-4 border-primary/10 border-t-primary rounded-full animate-spin" />
        <p className="text-xs font-black text-primary tracking-[0.2em] animate-pulse">Fetching Data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-white p-4 md:p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-xl md:text-2xl font-black text-gray-800 tracking-tight">CS Department Portal Control</h2>
          <p className="text-xs md:text-sm text-gray-500 font-medium mt-1">Manage news, events, faculty members, and administrator accounts.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-primary/5 rounded-xl border border-primary/10">
            <div className="text-[10px] font-bold text-primary uppercase tracking-widest">Portal Status</div>
            <div className="text-sm font-black text-primary flex items-center gap-2 mt-0.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              Active
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {stats.map((s, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className={`w-12 h-12 ${s.color} rounded-xl flex items-center justify-center text-white text-xl shadow-lg`}>
              <i className={`fas ${s.icon}`}></i>
            </div>
            <div>
              <div className="text-2xl font-black text-gray-800">{s.count}</div>
              <div className="text-xs font-medium text-gray-400 tracking-wider uppercase">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent News */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-500">
              <i className="fas fa-newspaper"></i>
            </div>
            <div>
              <h3 className="text-base font-black text-gray-800">Recent News</h3>
              <p className="text-[10px] text-gray-400 font-bold">Latest published articles</p>
            </div>
          </div>
          <div className="space-y-3">
            {news.slice(0, 5).map((item, i) => (
              <div key={item.id || i} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50/50 border border-gray-50 hover:bg-gray-50 transition-colors">
                {item.image_url && <img src={item.image_url} alt="" className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />}
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-bold text-gray-700 truncate">{item.title}</div>
                  <div className="text-[10px] text-gray-400 font-medium">{item.author || 'Admin'}</div>
                </div>
              </div>
            ))}
            {news.length === 0 && <p className="text-sm text-gray-400 text-center py-8">No news articles yet</p>}
          </div>
        </div>

        {/* Recent Events */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-500">
              <i className="fas fa-calendar-days"></i>
            </div>
            <div>
              <h3 className="text-base font-black text-gray-800">Upcoming Events</h3>
              <p className="text-[10px] text-gray-400 font-bold">Scheduled department events</p>
            </div>
          </div>
          <div className="space-y-3">
            {events.slice(0, 5).map((item, i) => (
              <div key={item.id || i} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50/50 border border-gray-50 hover:bg-gray-50 transition-colors">
                <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-600 text-xs font-black flex-shrink-0">
                  {item.event_date ? new Date(item.event_date).toLocaleDateString('en-US', { day: 'numeric' }) : '—'}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-bold text-gray-700 truncate">{item.title}</div>
                  <div className="text-[10px] text-gray-400 font-medium">{item.location || 'TBD'}</div>
                </div>
              </div>
            ))}
            {events.length === 0 && <p className="text-sm text-gray-400 text-center py-8">No events scheduled</p>}
          </div>
        </div>
      </div>

      {/* Admin Info */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 md:w-16 md:h-16 bg-gray-100 rounded-full flex items-center justify-center text-xl md:text-2xl text-gray-400 overflow-hidden border-2 border-primary/10">
            <i className="fas fa-user-shield"></i>
          </div>
          <div>
            <h2 className="text-lg md:text-xl font-bold text-gray-800">Administrator</h2>
            <p className="text-xs md:text-sm text-gray-400">CS Department Portal • {sessionStorage.getItem('admin_email')}</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
            <div className="text-[10px] font-bold text-primary mb-1 uppercase tracking-widest">Role</div>
            <div className="text-sm font-medium">System Administrator</div>
          </div>
          <div className="p-4 rounded-xl bg-secondary/5 border border-secondary/10">
            <div className="text-[10px] font-bold text-secondary mb-1 uppercase tracking-widest">Campus</div>
            <div className="text-sm font-medium">CUI Abbottabad</div>
          </div>
        </div>
      </div>
    </div>
  );
}
