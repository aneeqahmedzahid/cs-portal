import React, { useState, useEffect, useCallback, useRef } from 'react';
import { api } from '../../lib/api';

export default function EventsManagement() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({ title: '', description: '', image_url: '', author: '', event_date: '', location: '' });
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const formRef = useRef(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try { setEvents((await api.getEvents()) || []); } catch (err) { console.error(err); }
    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);
  useEffect(() => { if (showForm && formRef.current) formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, [showForm]);

  const openCreate = () => { setEditingItem(null); setFormData({ title: '', description: '', image_url: '', author: '', event_date: '', location: '' }); setShowForm(true); };
  const openEdit = (item) => {
    setEditingItem(item);
    setFormData({ title: item.title, description: item.description, image_url: item.image_url || '', author: item.author || '', event_date: item.event_date ? item.event_date.slice(0, 16) : '', location: item.location || '' });
    setShowForm(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = { title: formData.title, description: formData.description, image_url: formData.image_url || null, author: formData.author, event_date: formData.event_date, location: formData.location };
      if (editingItem) await api.updateEvent(editingItem.id, payload);
      else await api.createEvent(payload);
      setShowForm(false); fetchData();
    } catch (err) { alert('Error: ' + err.message); }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this event?')) return;
    try { await api.deleteEvent(id); fetchData(); } catch (err) { alert('Error: ' + err.message); }
  };

  const fmt = (d) => d ? new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : '';
  const filtered = events.filter(e => e.title?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="max-w-[1400px] mx-auto space-y-6 pb-20">
      {/* Header */}
      <div className="bg-white rounded-[32px] shadow-sm border border-slate-200 p-8 lg:p-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
            <i className="fas fa-calendar-days text-xl"></i>
          </div>
          <div>
            <h2 className="text-2xl lg:text-3xl font-black text-slate-800 tracking-tight">Events Management</h2>
            <p className="text-xs text-slate-400 font-bold mt-1">Schedule and manage department events</p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
          <div className="relative w-full sm:w-72">
            <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 text-sm"></i>
            <input type="text" placeholder="Search events..." className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 placeholder:text-slate-300 focus:ring-4 focus:ring-primary/5 outline-none transition-all" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <button onClick={openCreate} className="flex items-center justify-center gap-3 px-8 py-3.5 rounded-2xl font-black text-[11px] bg-primary text-white hover:bg-blue-800 shadow-lg shadow-primary/20 transition-all w-full lg:w-auto">
            <i className="fas fa-plus text-xs"></i> Create Event
          </button>
        </div>
      </div>

      {/* Inline Form */}
      {showForm && (
        <div ref={formRef} className="bg-white rounded-[32px] shadow-sm border border-slate-200 p-8 animate-fade-in">
          <div className="flex items-center justify-between pb-6 border-b border-slate-50 mb-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600"><i className="fas fa-calendar-plus text-lg"></i></div>
              <div>
                <h3 className="text-lg font-black text-slate-800">{editingItem ? 'Edit' : 'Create'} Event</h3>
                <p className="text-[10px] text-slate-400 font-bold">Fill in the event details below</p>
              </div>
            </div>
            <button onClick={() => setShowForm(false)} className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"><i className="fas fa-xmark text-lg"></i></button>
          </div>
          <div className="space-y-4 max-w-2xl">
            <div><label className="block text-[11px] font-black text-slate-500 mb-2 uppercase tracking-wider">Title</label>
              <input value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-sm font-bold text-slate-700 placeholder:text-slate-300 focus:ring-4 focus:ring-primary/5 outline-none" /></div>
            <div><label className="block text-[11px] font-black text-slate-500 mb-2 uppercase tracking-wider">Description</label>
              <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} rows={4} className="w-full px-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-sm font-bold text-slate-700 placeholder:text-slate-300 focus:ring-4 focus:ring-primary/5 outline-none resize-none" /></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><label className="block text-[11px] font-black text-slate-500 mb-2 uppercase tracking-wider">Event Date</label>
                <input type="datetime-local" value={formData.event_date} onChange={e => setFormData({...formData, event_date: e.target.value})} className="w-full px-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-sm font-bold text-slate-700 focus:ring-4 focus:ring-primary/5 outline-none" /></div>
              <div><label className="block text-[11px] font-black text-slate-500 mb-2 uppercase tracking-wider">Location</label>
                <input value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="w-full px-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-sm font-bold text-slate-700 placeholder:text-slate-300 focus:ring-4 focus:ring-primary/5 outline-none" /></div>
            </div>
            <div><label className="block text-[11px] font-black text-slate-500 mb-2 uppercase tracking-wider">Image URL (optional)</label>
              <input value={formData.image_url} onChange={e => setFormData({...formData, image_url: e.target.value})} placeholder="https://..." className="w-full px-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-sm font-bold text-slate-700 placeholder:text-slate-300 focus:ring-4 focus:ring-primary/5 outline-none" /></div>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setShowForm(false)} className="px-8 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-600 font-black rounded-2xl text-[11px] transition-colors">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="px-8 py-3.5 bg-primary hover:bg-blue-800 text-white font-black rounded-2xl text-[11px] shadow-lg shadow-primary/20 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                {saving ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> Saving...</> : editingItem ? 'Update Event' : 'Schedule Event'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Events List */}
      <div className="bg-white rounded-[32px] shadow-sm border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-20"><div className="w-10 h-10 border-3 border-gray-100 border-t-primary rounded-full animate-spin" /></div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 space-y-4">
            <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto border border-slate-100"><i className="fas fa-calendar-xmark text-slate-200 text-3xl"></i></div>
            <h4 className="text-slate-500 font-extrabold text-lg">No Events Found</h4>
            <p className="text-slate-400 text-xs font-bold">Click "Create Event" to schedule your first event</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {filtered.map((item) => (
              <div key={item.id} className="p-5 lg:p-6 flex items-center gap-5 hover:bg-slate-50/50 transition-colors group">
                <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex flex-col items-center justify-center text-emerald-600 flex-shrink-0 border border-emerald-100">
                  <span className="text-lg font-black leading-none">{item.event_date ? new Date(item.event_date).getDate() : '—'}</span>
                  <span className="text-[9px] font-bold uppercase">{item.event_date ? new Date(item.event_date).toLocaleDateString('en-US', { month: 'short' }) : ''}</span>
                </div>
                <div className="flex-grow min-w-0">
                  <h3 className="text-sm lg:text-base font-black text-slate-800 truncate">{item.title}</h3>
                  <p className="text-slate-400 text-xs mt-1 line-clamp-1">{item.description}</p>
                  <div className="flex gap-4 mt-2 text-[10px] text-slate-400 font-bold">
                    {item.location && <span><i className="fas fa-map-pin mr-1"></i>{item.location}</span>}
                    <span>{fmt(item.event_date)}</span>
                  </div>
                </div>
                <div className="flex gap-2 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => openEdit(item)} className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-primary hover:text-white hover:border-primary transition-all shadow-sm"><i className="fas fa-edit text-sm"></i></button>
                  <button onClick={() => handleDelete(item.id)} className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-rose-300 hover:bg-rose-500 hover:text-white hover:border-rose-600 transition-all shadow-sm"><i className="fas fa-trash-can text-sm"></i></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
