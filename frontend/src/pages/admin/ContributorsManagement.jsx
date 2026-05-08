import React, { useState, useRef } from 'react';
import { useContributors } from '../../hooks/useContributors';
import { api } from '../../services/api';

const emptyForm = { name: '', role: '', bio: '', image_url: '', github: '', linkedin: '', portfolio: '' };

export default function ContributorsManagement() {
  const { contributors, loading, saving, createContributor, updateContributor, deleteContributor } = useContributors();
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({ ...emptyForm });
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef(null);
  const formRef = useRef(null);

  const openCreate = () => { setEditingItem(null); setFormData({ ...emptyForm }); setShowForm(true); };
  const openEdit = (item) => { setEditingItem(item); setFormData({ ...item }); setShowForm(true); };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const uploadData = new FormData();
      uploadData.append('file', file);
      const res = await api.createContributor({ uploadOnly: true, file }); // We need an upload helper
      // Wait, let's use the existing upload logic
      const token = sessionStorage.getItem('admin_token');
      const formDataUpload = new FormData();
      formDataUpload.append('file', file);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/upload`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formDataUpload
      });
      const data = await response.json();
      setFormData(prev => ({ ...prev, image_url: data.url }));
    } catch (err) { alert('Upload failed'); }
    setUploading(false);
  };

  const handleSave = async () => {
    try {
      if (editingItem) await updateContributor(editingItem._id, formData);
      else await createContributor(formData);
      setShowForm(false);
    } catch (err) { alert(err.message); }
  };

  const handleDelete = async (id) => {
    if (confirm('Delete contributor?')) await deleteContributor(id);
  };

  return (
    <div className="max-w-[1400px] mx-auto space-y-6 pb-20">
      <div className="bg-white rounded-[32px] shadow-sm border border-slate-200 p-8 lg:p-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 rounded-2xl bg-indigo-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
            <i className="fas fa-users text-xl"></i>
          </div>
          <div>
            <h2 className="text-2xl lg:text-3xl font-black text-slate-800 tracking-tight">Contributors</h2>
            <p className="text-xs text-slate-400 font-bold mt-1">Manage project contributors and developers</p>
          </div>
        </div>
        <button onClick={openCreate} className="px-8 py-3.5 rounded-2xl font-black text-[11px] bg-primary text-white hover:bg-blue-800 transition-all">
          Add Contributor
        </button>
      </div>

      {showForm && (
        <div ref={formRef} className="bg-white rounded-[32px] shadow-sm border border-slate-200 p-8 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div><label className="block text-[11px] font-black text-slate-500 mb-2 uppercase">Name</label>
                <input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-sm font-bold" /></div>
              <div><label className="block text-[11px] font-black text-slate-500 mb-2 uppercase">Role</label>
                <input value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="w-full px-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-sm font-bold" /></div>
              <div><label className="block text-[11px] font-black text-slate-500 mb-2 uppercase">Bio</label>
                <textarea value={formData.bio} onChange={e => setFormData({...formData, bio: e.target.value})} rows={3} className="w-full px-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-sm font-bold resize-none" /></div>
            </div>
            <div className="space-y-4">
              <div><label className="block text-[11px] font-black text-slate-500 mb-2 uppercase">GitHub URL</label>
                <input value={formData.github} onChange={e => setFormData({...formData, github: e.target.value})} className="w-full px-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-sm font-bold" /></div>
              <div><label className="block text-[11px] font-black text-slate-500 mb-2 uppercase">LinkedIn URL</label>
                <input value={formData.linkedin} onChange={e => setFormData({...formData, linkedin: e.target.value})} className="w-full px-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-sm font-bold" /></div>
              <div><label className="block text-[11px] font-black text-slate-500 mb-2 uppercase">Portfolio URL</label>
                <input value={formData.portfolio} onChange={e => setFormData({...formData, portfolio: e.target.value})} className="w-full px-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-sm font-bold" /></div>
              <div className="flex items-center gap-4">
                <button onClick={() => fileRef.current.click()} className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-xs font-bold border border-indigo-100">
                  {uploading ? 'Uploading...' : 'Upload Image'}
                </button>
                <input ref={fileRef} type="file" className="hidden" onChange={handleImageUpload} />
                {formData.image_url && <img src={formData.image_url} className="w-12 h-12 rounded-xl object-cover" />}
              </div>
            </div>
          </div>
          <div className="flex gap-3 mt-8">
            <button onClick={() => setShowForm(false)} className="px-8 py-3.5 bg-slate-100 text-slate-600 font-black rounded-2xl text-[11px]">Cancel</button>
            <button onClick={handleSave} disabled={saving} className="px-8 py-3.5 bg-primary text-white font-black rounded-2xl text-[11px]">
              {saving ? 'Saving...' : editingItem ? 'Update' : 'Create'}
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {contributors.map(c => (
          <div key={c._id} className="bg-white rounded-[32px] p-6 border border-slate-200 group relative">
            <div className="flex items-center gap-4">
              <img src={c.image_url || 'https://via.placeholder.com/150'} className="w-16 h-16 rounded-2xl object-cover" />
              <div className="min-w-0">
                <h3 className="font-black text-slate-800 truncate">{c.name}</h3>
                <p className="text-xs text-indigo-500 font-bold">{c.role}</p>
              </div>
            </div>
            <p className="mt-4 text-xs text-slate-400 font-bold line-clamp-2">{c.bio}</p>
            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => openEdit(c)} className="w-8 h-8 rounded-lg bg-slate-50 text-slate-400 hover:bg-primary hover:text-white transition-all"><i className="fas fa-edit text-xs"></i></button>
              <button onClick={() => handleDelete(c._id)} className="w-8 h-8 rounded-lg bg-slate-50 text-slate-400 hover:bg-rose-500 hover:text-white transition-all"><i className="fas fa-trash text-xs"></i></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
