import React, { useState, useEffect, useCallback, useRef } from 'react';
import { api } from '../../lib/api';

export default function AdminsManagement() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const formRef = useRef(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try { setAdmins((await api.getAdmins()) || []); } catch (err) { console.error(err); }
    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);
  useEffect(() => { if (showForm && formRef.current) formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, [showForm]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.createAdmin(formData);
      setShowForm(false); fetchData();
    } catch (err) { alert('Error: ' + err.message); }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this admin?')) return;
    try { await api.deleteAdmin(id); fetchData(); } catch (err) { alert('Error: ' + err.message); }
  };

  const filtered = admins.filter(a => a.email?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="max-w-[1400px] mx-auto space-y-6 pb-20">
      <div className="bg-white rounded-[32px] shadow-sm border border-slate-200 p-8 lg:p-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 rounded-2xl bg-amber-500 flex items-center justify-center text-white shadow-lg shadow-amber-500/20">
            <i className="fas fa-user-shield text-xl"></i>
          </div>
          <div>
            <h2 className="text-2xl lg:text-3xl font-black text-slate-800 tracking-tight">Admin Management</h2>
            <p className="text-xs text-slate-400 font-bold mt-1">Manage portal administrators</p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
          <div className="relative w-full sm:w-72">
            <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 text-sm"></i>
            <input type="text" placeholder="Search admins..." className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 placeholder:text-slate-300 focus:ring-4 focus:ring-primary/5 outline-none transition-all" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <button onClick={() => { setFormData({ email: '', password: '' }); setShowForm(true); }} className="flex items-center justify-center gap-3 px-8 py-3.5 rounded-2xl font-black text-[11px] bg-primary text-white hover:bg-blue-800 shadow-lg shadow-primary/20 transition-all w-full lg:w-auto">
            <i className="fas fa-plus text-xs"></i> Add Admin
          </button>
        </div>
      </div>

      {/* Inline Form */}
      {showForm && (
        <div ref={formRef} className="bg-white rounded-[32px] shadow-sm border border-slate-200 p-8 animate-fade-in">
          <div className="flex items-center justify-between pb-6 border-b border-slate-50 mb-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-500"><i className="fas fa-user-plus text-lg"></i></div>
              <div>
                <h3 className="text-lg font-black text-slate-800">Add Admin</h3>
                <p className="text-[10px] text-slate-400 font-bold">Create a new administrator</p>
              </div>
            </div>
            <button onClick={() => setShowForm(false)} className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"><i className="fas fa-xmark text-lg"></i></button>
          </div>
          <div className="space-y-4 max-w-md">
            <div><label className="block text-[11px] font-black text-slate-500 mb-2 uppercase tracking-wider">Email</label>
              <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-sm font-bold text-slate-700 focus:ring-4 focus:ring-primary/5 outline-none" /></div>
            <div><label className="block text-[11px] font-black text-slate-500 mb-2 uppercase tracking-wider">Password</label>
              <input type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full px-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-sm font-bold text-slate-700 focus:ring-4 focus:ring-primary/5 outline-none" /></div>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setShowForm(false)} className="px-8 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-600 font-black rounded-2xl text-[11px] transition-colors">Cancel</button>
              <button onClick={handleSave} disabled={saving || !formData.email || !formData.password} className="px-8 py-3.5 bg-primary hover:bg-blue-800 text-white font-black rounded-2xl text-[11px] shadow-lg shadow-primary/20 transition-all disabled:opacity-50">
                {saving ? 'Saving...' : 'Add Admin'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-[32px] shadow-sm border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-20"><div className="w-10 h-10 border-3 border-gray-100 border-t-primary rounded-full animate-spin" /></div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 space-y-4">
            <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto border border-slate-100"><i className="fas fa-users-slash text-slate-200 text-3xl"></i></div>
            <h4 className="text-slate-500 font-extrabold text-lg">No Admins Found</h4>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {filtered.map((item) => (
              <div key={item.id} className="p-5 lg:p-6 flex items-center gap-5 hover:bg-slate-50/50 transition-colors group">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 shrink-0"><i className="fas fa-user"></i></div>
                <div className="flex-grow min-w-0">
                  <h3 className="text-sm lg:text-base font-black text-slate-800 truncate">{item.email}</h3>
                  <div className="text-[10px] text-slate-400 font-bold mt-1">Administrator</div>
                </div>
                <div className="flex gap-2 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
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
