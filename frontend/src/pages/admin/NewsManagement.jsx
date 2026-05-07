import React, { useState, useEffect, useCallback, useRef } from 'react';
import { api } from '../../lib/api';

export default function NewsManagement() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({ title: '', content: '', image_url: '', author: '' });
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const formRef = useRef(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try { setNews((await api.getNews()) || []); } catch (err) { console.error(err); }
    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);
  useEffect(() => { if (showForm && formRef.current) formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, [showForm]);

  const openCreate = () => { setEditingItem(null); setFormData({ title: '', content: '', image_url: '', author: '' }); setShowForm(true); };
  const openEdit = (item) => { setEditingItem(item); setFormData({ title: item.title, content: item.content, image_url: item.image_url || '', author: item.author || '' }); setShowForm(true); };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (editingItem) await api.updateNews(editingItem.id, formData);
      else await api.createNews(formData);
      setShowForm(false); fetchData();
    } catch (err) { alert('Error: ' + err.message); }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this news article?')) return;
    try { await api.deleteNews(id); fetchData(); } catch (err) { alert('Error: ' + err.message); }
  };

  const fmt = (d) => d ? new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : '';
  const filtered = news.filter(n => n.title?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="max-w-[1400px] mx-auto space-y-6 pb-20">
      {/* Header */}
      <div className="bg-white rounded-[32px] shadow-sm border border-slate-200 p-8 lg:p-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 rounded-2xl bg-blue-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
            <i className="fas fa-newspaper text-xl"></i>
          </div>
          <div>
            <h2 className="text-2xl lg:text-3xl font-black text-slate-800 tracking-tight">News Management</h2>
            <p className="text-xs text-slate-400 font-bold mt-1">Create and manage department news articles</p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
          <div className="relative w-full sm:w-72">
            <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 text-sm"></i>
            <input type="text" placeholder="Search news..." className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 placeholder:text-slate-300 focus:ring-4 focus:ring-primary/5 outline-none transition-all" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <button onClick={openCreate} className="flex items-center justify-center gap-3 px-8 py-3.5 rounded-2xl font-black text-[11px] bg-primary text-white hover:bg-blue-800 shadow-lg shadow-primary/20 transition-all w-full lg:w-auto">
            <i className="fas fa-plus text-xs"></i> Create Article
          </button>
        </div>
      </div>

      {/* Inline Form */}
      {showForm && (
        <div ref={formRef} className="bg-white rounded-[32px] shadow-sm border border-slate-200 p-8 animate-fade-in">
          <div className="flex items-center justify-between pb-6 border-b border-slate-50 mb-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary"><i className="fas fa-newspaper text-lg"></i></div>
              <div>
                <h3 className="text-lg font-black text-slate-800">{editingItem ? 'Edit' : 'Create'} News Article</h3>
                <p className="text-[10px] text-slate-400 font-bold">Fill in the article details below</p>
              </div>
            </div>
            <button onClick={() => setShowForm(false)} className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"><i className="fas fa-xmark text-lg"></i></button>
          </div>
          <div className="space-y-4 max-w-2xl">
            <div><label className="block text-[11px] font-black text-slate-500 mb-2 uppercase tracking-wider">Title</label>
              <input value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-sm font-bold text-slate-700 placeholder:text-slate-300 focus:ring-4 focus:ring-primary/5 outline-none" /></div>
            <div><label className="block text-[11px] font-black text-slate-500 mb-2 uppercase tracking-wider">Content</label>
              <textarea value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} rows={5} className="w-full px-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-sm font-bold text-slate-700 placeholder:text-slate-300 focus:ring-4 focus:ring-primary/5 outline-none resize-none" /></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><label className="block text-[11px] font-black text-slate-500 mb-2 uppercase tracking-wider">Image URL (optional)</label>
                <input value={formData.image_url} onChange={e => setFormData({...formData, image_url: e.target.value})} placeholder="https://..." className="w-full px-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-sm font-bold text-slate-700 placeholder:text-slate-300 focus:ring-4 focus:ring-primary/5 outline-none" /></div>
              <div><label className="block text-[11px] font-black text-slate-500 mb-2 uppercase tracking-wider">Author</label>
                <input value={formData.author} onChange={e => setFormData({...formData, author: e.target.value})} placeholder="Author name" className="w-full px-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-sm font-bold text-slate-700 placeholder:text-slate-300 focus:ring-4 focus:ring-primary/5 outline-none" /></div>
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setShowForm(false)} className="px-8 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-600 font-black rounded-2xl text-[11px] transition-colors">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="px-8 py-3.5 bg-primary hover:bg-blue-800 text-white font-black rounded-2xl text-[11px] shadow-lg shadow-primary/20 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                {saving ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> Saving...</> : editingItem ? 'Update Article' : 'Publish Article'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* News List */}
      <div className="bg-white rounded-[32px] shadow-sm border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-20"><div className="w-10 h-10 border-3 border-gray-100 border-t-primary rounded-full animate-spin" /></div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 space-y-4">
            <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto border border-slate-100"><i className="fas fa-newspaper text-slate-200 text-3xl"></i></div>
            <h4 className="text-slate-500 font-extrabold text-lg">No News Found</h4>
            <p className="text-slate-400 text-xs font-bold">Click "Create Article" to add your first news</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {filtered.map((item) => (
              <div key={item.id} className="p-5 lg:p-6 flex items-center gap-5 hover:bg-slate-50/50 transition-colors group">
                {item.image_url && <img src={item.image_url} alt="" className="w-16 h-16 lg:w-20 lg:h-20 rounded-2xl object-cover shrink-0 border border-slate-100" />}
                <div className="flex-grow min-w-0">
                  <h3 className="text-sm lg:text-base font-black text-slate-800 truncate">{item.title}</h3>
                  <p className="text-slate-400 text-xs mt-1 line-clamp-1">{item.content}</p>
                  <div className="flex gap-4 mt-2 text-[10px] text-slate-400 font-bold">
                    <span>{fmt(item.created_at)}</span>
                    <span>by {item.author || 'Admin'}</span>
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
