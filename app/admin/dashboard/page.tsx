"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { supabase, NewsItem, EventItem } from '@/lib/supabase';

type Tab = 'news' | 'events' | 'admins';

export default function AdminDashboard() {
  const [tab, setTab] = useState<Tab>('news');
  const [news, setNews] = useState<NewsItem[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<NewsItem | EventItem | null>(null);
  const [formData, setFormData] = useState({ title: '', content: '', description: '', image_url: '', author: '', event_date: '', location: '' });
  const [saving, setSaving] = useState(false);
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminMsg, setAdminMsg] = useState('');

  const fetchData = useCallback(async () => {
    setLoading(true);
    const [newsRes, eventsRes] = await Promise.all([
      supabase.from('news').select('*').order('created_at', { ascending: false }),
      supabase.from('events').select('*').order('event_date', { ascending: true }),
    ]);
    if (newsRes.data) setNews(newsRes.data);
    if (eventsRes.data) setEvents(eventsRes.data);
    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const openCreate = () => {
    setEditingItem(null);
    setFormData({ title: '', content: '', description: '', image_url: '', author: '', event_date: '', location: '' });
    setShowModal(true);
  };

  const openEdit = (item: NewsItem | EventItem) => {
    setEditingItem(item);
    if (tab === 'news') {
      const n = item as NewsItem;
      setFormData({ title: n.title, content: n.content, description: '', image_url: n.image_url || '', author: n.author, event_date: '', location: '' });
    } else {
      const ev = item as EventItem;
      setFormData({ title: ev.title, content: '', description: ev.description, image_url: ev.image_url || '', author: ev.author, event_date: ev.event_date.slice(0, 16), location: ev.location });
    }
    setShowModal(true);
  };

  const handleSave = async () => {
    setSaving(true);
    const table = tab === 'news' ? 'news' : 'events';
    const payload = tab === 'news'
      ? { title: formData.title, content: formData.content, image_url: formData.image_url || null, author: formData.author }
      : { title: formData.title, description: formData.description, image_url: formData.image_url || null, author: formData.author, event_date: formData.event_date, location: formData.location };

    if (editingItem) {
      await supabase.from(table).update({ ...payload, updated_at: new Date().toISOString() }).eq('id', editingItem.id);
    } else {
      await supabase.from(table).insert(payload);
    }
    setSaving(false);
    setShowModal(false);
    fetchData();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this?')) return;
    await supabase.from(tab === 'news' ? 'news' : 'events').delete().eq('id', id);
    fetchData();
  };

  const handleAddAdmin = async () => {
    setAdminMsg('');
    if (!adminEmail || !adminPassword) { setAdminMsg('Please fill in both fields.'); return; }
    const { error } = await supabase.auth.signUp({ email: adminEmail, password: adminPassword });
    if (error) setAdminMsg('Error: ' + error.message);
    else { setAdminMsg('Admin invited successfully! They can now log in.'); setAdminEmail(''); setAdminPassword(''); }
  };

  const fmt = (d: string) => new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

  const tabs: { key: Tab; label: string; icon: string }[] = [
    { key: 'news', label: 'News', icon: 'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z' },
    { key: 'events', label: 'Events', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
    { key: 'admins', label: 'Add Admin', icon: 'M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z' },
  ];

  return (
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
        <div className="max-w-md">
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
                      {'content' in item ? (item as NewsItem).content : (item as EventItem).description}
                    </p>
                    <div className="flex gap-4 mt-2 text-xs text-slate-500">
                      <span>{fmt(item.created_at)}</span>
                      <span>by {item.author}</span>
                      {'event_date' in item && <span>📍 {(item as EventItem).location}</span>}
                      {'event_date' in item && <span>📅 {fmt((item as EventItem).event_date)}</span>}
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
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
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
  );
}
