import React, { useState, useEffect, useCallback } from 'react';
import { api } from '../../lib/api';
import { useNavigate, Link } from 'react-router-dom';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [sessionLoading, setSessionLoading] = useState(true);
  const [userEmail, setUserEmail] = useState('');
  
  const [tab, setTab] = useState('news');
  const [news, setNews] = useState([]);
  const [events, setEvents] = useState([]);
  const [adminsList, setAdminsList] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({ title: '', content: '', description: '', image_url: '', author: '', event_date: '', location: '' });
  const [saving, setSaving] = useState(false);
  
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminMsg, setAdminMsg] = useState('');

  // Authentication check
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('admin_token');
      if (!token) {
        navigate('/admin/login', { replace: true });
      } else {
        const email = localStorage.getItem('admin_email');
        setUserEmail(email || 'Admin');
        setSessionLoading(false);
      }
    };
    checkAuth();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_email');
    navigate('/admin/login');
  };

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [newsData, eventsData, adminsData] = await Promise.all([
        api.getNews(),
        api.getEvents(),
        api.getAdmins()
      ]);
      setNews(newsData || []);
      setEvents(eventsData || []);
      setAdminsList(adminsData || []);
    } catch (err) {
      console.error('Error fetching data:', err);
      // If token is invalid, redirect to login
      if (err.message && err.message.toLowerCase().includes('token')) {
         handleLogout();
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => { 
    if (!sessionLoading) fetchData(); 
  }, [fetchData, sessionLoading]);

  const openCreate = () => {
    setEditingItem(null);
    setFormData({ title: '', content: '', description: '', image_url: '', author: '', event_date: '', location: '' });
    setShowModal(true);
  };

  const openEdit = (item) => {
    setEditingItem(item);
    if (tab === 'news') {
      setFormData({ title: item.title, content: item.content, description: '', image_url: item.image_url || '', author: item.author || '', event_date: '', location: '' });
    } else {
      setFormData({ title: item.title, content: '', description: item.description, image_url: item.image_url || '', author: item.author || '', event_date: item.event_date ? item.event_date.slice(0, 16) : '', location: item.location || '' });
    }
    setShowModal(true);
  };

  const handleSave = async () => {
    setSaving(true);
    const payload = tab === 'news'
      ? { title: formData.title, content: formData.content, image_url: formData.image_url || null, author: formData.author }
      : { title: formData.title, description: formData.description, image_url: formData.image_url || null, author: formData.author, event_date: formData.event_date, location: formData.location };

    try {
      if (editingItem) {
        if (tab === 'news') await api.updateNews(editingItem.id, payload);
        else await api.updateEvent(editingItem.id, payload);
      } else {
        if (tab === 'news') await api.createNews(payload);
        else await api.createEvent(payload);
      }
      setShowModal(false);
      fetchData();
    } catch (err) {
      alert('Error saving: ' + err.message);
    }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this?')) return;
    try {
      if (tab === 'news') await api.deleteNews(id);
      else await api.deleteEvent(id);
      fetchData();
    } catch (err) {
      alert('Error deleting: ' + err.message);
    }
  };

  const handleRemoveAdmin = async (id) => {
    if (!confirm('Are you sure you want to remove this admin?')) return;
    try {
      await api.deleteAdmin(id);
      fetchData();
    } catch (err) {
      alert('Error removing admin: ' + err.message);
    }
  };

  const handleAddAdmin = async () => {
    setAdminMsg('');
    if (!adminEmail || !adminPassword) { setAdminMsg('Please fill in both fields.'); return; }
    
    try {
      await api.createAdmin({ email: adminEmail, password: adminPassword });
      setAdminMsg('Admin added successfully!'); 
      setAdminEmail(''); 
      setAdminPassword('');
      fetchData();
    } catch (err) {
      setAdminMsg('Error: ' + err.message);
    }
  };

  const fmt = (d) => {
    if (!d) return '';
    return new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  if (sessionLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-comsats-blue border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const tabs = [
    { key: 'news', label: 'News', icon: 'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z' },
    { key: 'events', label: 'Events', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
    { key: 'admins', label: 'Manage Admins', icon: 'M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z' },
  ];

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Admin Header */}
      <header className="bg-slate-900/80 backdrop-blur-xl border-b border-slate-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-3 group">
              <img src="https://latdncjdcwtmtehhmazi.supabase.co/storage/v1/object/public/COMSATS%20CS%20PORTAL%20ASSETS/CSPORTALLOGO.png" alt="Logo" className="h-10 object-contain mix-blend-screen" />
            </Link>
            <div className="hidden sm:block h-8 w-px bg-slate-700"></div>
            <span className="hidden sm:block text-sm font-semibold text-comsats-blue tracking-wide uppercase">Admin Dashboard</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden md:block text-sm text-slate-400">{userEmail}</span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-8 border-b border-slate-800 pb-4">
          {tabs.map(t => (
            <button key={t.key} onClick={() => { setTab(t.key); setShowModal(false); }}
              className={`px-5 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 transition-all ${tab === t.key ? 'bg-comsats-blue text-white shadow-lg shadow-comsats-blue/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={t.icon} /></svg>
              {t.label}
            </button>
          ))}
        </div>

        {/* Add Admin Tab */}
        {tab === 'admins' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Current Admins</h2>
              <p className="text-slate-400 text-sm mb-6">List of administrators.</p>
              
              <div className="space-y-4">
                {adminsList.map((admin) => (
                  <div key={admin.id} className="bg-slate-900/50 border border-slate-800 rounded-2xl p-4 flex justify-between items-center group">
                    <div>
                      <div className="text-white font-medium">{admin.email}</div>
                      <div className="text-slate-500 text-xs mt-1">Added: {fmt(admin.created_at)}</div>
                    </div>
                    <button onClick={() => handleRemoveAdmin(admin.id)} className="p-2 bg-slate-800 hover:bg-red-600 text-slate-300 hover:text-white rounded-xl transition-colors opacity-0 group-hover:opacity-100" title="Remove Admin">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>
                ))}
                {adminsList.length === 0 && !loading && (
                   <p className="text-slate-500 text-sm">No admins found. Add one or create the table.</p>
                )}
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Add New Admin</h2>
              <p className="text-slate-400 text-sm mb-6">Create credentials for a new admin user.</p>
              <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
                <input type="email" placeholder="Email" value={adminEmail} onChange={e => setAdminEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-comsats-blue text-sm" />
                <input type="password" placeholder="Password (min 6 chars)" value={adminPassword} onChange={e => setAdminPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-comsats-blue text-sm" />
                <button onClick={handleAddAdmin} className="w-full py-3 bg-comsats-blue hover:bg-comsats-blue-light text-white font-bold rounded-xl transition-all text-sm">Add Admin</button>
                {adminMsg && <p className={`text-sm ${adminMsg.startsWith('Error') ? 'text-red-400' : 'text-green-400'}`}>{adminMsg}</p>}
              </div>
            </div>
          </div>
        )}

        {/* News / Events List */}
        {tab !== 'admins' && (
          <>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">{tab === 'news' ? 'Manage News' : 'Manage Events'}</h2>
              <button onClick={openCreate}
                className="px-5 py-2.5 bg-comsats-blue hover:bg-comsats-blue-light text-white font-semibold rounded-xl transition-all text-sm flex items-center gap-2 shadow-lg shadow-comsats-blue/20">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                Create {tab === 'news' ? 'News' : 'Event'}
              </button>
            </div>

            {loading ? (
              <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-comsats-blue border-t-transparent rounded-full animate-spin"></div></div>
            ) : (tab === 'news' ? news : events).length === 0 ? (
              <div className="text-center py-20 text-slate-500">
                <svg className="w-16 h-16 mx-auto mb-4 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                <p className="text-lg font-medium">No {tab} yet</p>
                <p className="text-sm mt-1">Click "Create" to add your first {tab === 'news' ? 'news article' : 'event'}.</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {(tab === 'news' ? news : events).map((item) => (
                  <div key={item.id} className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5 flex items-center gap-5 hover:border-slate-700 transition-colors group">
                    {item.image_url && <img src={item.image_url} alt="" className="w-20 h-20 rounded-xl object-cover shrink-0 border border-slate-700" />}
                    <div className="flex-grow min-w-0">
                      <h3 className="text-white font-semibold text-lg truncate">{item.title}</h3>
                      <p className="text-slate-400 text-sm mt-1 truncate">
                        {item.content || item.description}
                      </p>
                      <div className="flex gap-4 mt-2 text-xs text-slate-500">
                        <span>{fmt(item.created_at)}</span>
                        <span>by {item.author || 'Admin'}</span>
                        {item.location && <span>📍 {item.location}</span>}
                        {item.event_date && <span>📅 {fmt(item.event_date)}</span>}
                      </div>
                    </div>
                    <div className="flex gap-2 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => openEdit(item)} className="p-2.5 bg-slate-800 hover:bg-comsats-blue text-slate-300 hover:text-white rounded-xl transition-colors" title="Edit">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                      </button>
                      <button onClick={() => handleDelete(item.id)} className="p-2.5 bg-slate-800 hover:bg-red-600 text-slate-300 hover:text-white rounded-xl transition-colors" title="Delete">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Create/Edit Modal */}
        {showModal && (
          <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
            <div className="bg-slate-900 border border-slate-700 rounded-3xl p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
              <h3 className="text-xl font-bold text-white mb-6">{editingItem ? 'Edit' : 'Create'} {tab === 'news' ? 'News Article' : 'Event'}</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Title</label>
                  <input value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-comsats-blue text-sm" />
                </div>

                {tab === 'news' ? (
                  <div>
                    <label className="block text-sm text-slate-400 mb-1">Content</label>
                    <textarea value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} rows={5}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-comsats-blue text-sm resize-none" />
                  </div>
                ) : (
                  <>
                    <div>
                      <label className="block text-sm text-slate-400 mb-1">Description</label>
                      <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} rows={4}
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-comsats-blue text-sm resize-none" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-slate-400 mb-1">Event Date</label>
                        <input type="datetime-local" value={formData.event_date} onChange={e => setFormData({...formData, event_date: e.target.value})}
                          className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-comsats-blue text-sm" />
                      </div>
                      <div>
                        <label className="block text-sm text-slate-400 mb-1">Location</label>
                        <input value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})}
                          className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-comsats-blue text-sm" />
                      </div>
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-sm text-slate-400 mb-1">Image URL (optional)</label>
                  <input value={formData.image_url} onChange={e => setFormData({...formData, image_url: e.target.value})} placeholder="https://..."
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-comsats-blue text-sm" />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Author</label>
                  <input value={formData.author} onChange={e => setFormData({...formData, author: e.target.value})} placeholder="Author name"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-comsats-blue text-sm" />
                </div>

                <div className="flex gap-3 pt-2">
                  <button onClick={() => setShowModal(false)} className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-xl transition-colors text-sm">Cancel</button>
                  <button onClick={handleSave} disabled={saving}
                    className="flex-1 py-3 bg-comsats-blue hover:bg-comsats-blue-light text-white font-bold rounded-xl transition-all text-sm disabled:opacity-50 flex items-center justify-center gap-2">
                    {saving ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> Saving...</> : editingItem ? 'Update' : 'Publish'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
