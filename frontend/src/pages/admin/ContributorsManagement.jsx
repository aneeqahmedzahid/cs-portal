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
  const [search, setSearch] = useState('');
  const fileRef = useRef(null);
  const formRef = useRef(null);

  const openCreate = () => { setEditingItem(null); setFormData({ ...emptyForm }); setShowForm(true); };
  const openEdit = (item) => { setEditingItem(item); setFormData({ ...item }); setShowForm(true); };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const data = await api.uploadImage(file);
      setFormData(prev => ({ ...prev, image_url: data.url }));
    } catch (err) { 
      console.error(err);
      alert('Upload failed: ' + err.message); 
    }
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
    if (confirm('Are you sure you want to delete this contributor?')) await deleteContributor(id);
  };

  const filtered = contributors.filter(c => c.name?.toLowerCase().includes(search.toLowerCase()) || c.role?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="max-w-[1400px] mx-auto space-y-6 pb-20">
      <div className="bg-white rounded-[32px] shadow-sm border border-slate-200 p-8 lg:p-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 rounded-2xl bg-teal-500 flex items-center justify-center text-white shadow-lg shadow-teal-500/20">
            <i className="fas fa-users-cog text-xl"></i>
          </div>
          <div>
            <h2 className="text-2xl lg:text-3xl font-black text-slate-800 tracking-tight">Contributors</h2>
            <p className="text-xs text-slate-400 font-bold mt-1">Manage portal developers and designers</p>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
          <div className="relative w-full sm:w-72">
            <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 text-sm"></i>
            <input 
              type="text" 
              placeholder="Search contributors..." 
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 placeholder:text-slate-300 focus:ring-4 focus:ring-teal-500/10 outline-none transition-all" 
              value={search} 
              onChange={e => setSearch(e.target.value)} 
            />
          </div>
          <button onClick={openCreate} className="flex items-center justify-center gap-3 px-8 py-3.5 rounded-2xl font-black text-[11px] bg-teal-500 text-white hover:bg-teal-600 shadow-lg shadow-teal-500/20 transition-all w-full lg:w-auto">
            <i className="fas fa-plus text-xs"></i> Add Contributor
          </button>
        </div>
      </div>

      {showForm && (
        <div ref={formRef} className="bg-white rounded-[32px] shadow-sm border border-slate-200 p-8 animate-fade-in relative">
          <button onClick={() => setShowForm(false)} className="absolute top-6 right-6 w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"><i className="fas fa-xmark text-lg"></i></button>
          
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-xl bg-teal-50 flex items-center justify-center text-teal-500"><i className={`fas ${editingItem ? 'fa-user-edit' : 'fa-user-plus'} text-lg`}></i></div>
            <div>
              <h3 className="text-lg font-black text-slate-800">{editingItem ? 'Edit Contributor' : 'Add Contributor'}</h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{editingItem ? 'Update details' : 'Create new profile'}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <div className="space-y-4">
              <div><label className="block text-[11px] font-black text-slate-500 mb-2 uppercase tracking-wider">Full Name</label>
                <input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-sm font-bold text-slate-700 focus:ring-4 focus:ring-teal-500/10 outline-none" placeholder="Jane Doe" /></div>
              
              <div><label className="block text-[11px] font-black text-slate-500 mb-2 uppercase tracking-wider">Role</label>
                <input value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="w-full px-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-sm font-bold text-slate-700 focus:ring-4 focus:ring-teal-500/10 outline-none" placeholder="Frontend Developer" /></div>
              
              <div><label className="block text-[11px] font-black text-slate-500 mb-2 uppercase tracking-wider">Bio (Optional)</label>
                <textarea value={formData.bio} onChange={e => setFormData({...formData, bio: e.target.value})} rows={4} className="w-full px-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-sm font-bold text-slate-700 focus:ring-4 focus:ring-teal-500/10 outline-none resize-none" placeholder="Short description..." /></div>
            </div>
            
            <div className="space-y-4">
              <div><label className="block text-[11px] font-black text-slate-500 mb-2 uppercase tracking-wider">GitHub URL</label>
                <input value={formData.github} onChange={e => setFormData({...formData, github: e.target.value})} className="w-full px-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-sm font-bold text-slate-700 focus:ring-4 focus:ring-teal-500/10 outline-none" placeholder="https://github.com/..." /></div>
              
              <div><label className="block text-[11px] font-black text-slate-500 mb-2 uppercase tracking-wider">LinkedIn URL</label>
                <input value={formData.linkedin} onChange={e => setFormData({...formData, linkedin: e.target.value})} className="w-full px-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-sm font-bold text-slate-700 focus:ring-4 focus:ring-teal-500/10 outline-none" placeholder="https://linkedin.com/in/..." /></div>
              
              <div><label className="block text-[11px] font-black text-slate-500 mb-2 uppercase tracking-wider">Portfolio URL</label>
                <input value={formData.portfolio} onChange={e => setFormData({...formData, portfolio: e.target.value})} className="w-full px-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-sm font-bold text-slate-700 focus:ring-4 focus:ring-teal-500/10 outline-none" placeholder="https://..." /></div>
              
              <div className="pt-2">
                <label className="block text-[11px] font-black text-slate-500 mb-2 uppercase tracking-wider">Profile Image</label>
                <div className="flex items-center gap-4 p-4 rounded-2xl border border-dashed border-slate-200 bg-slate-50">
                  {formData.image_url ? (
                    <img src={formData.image_url} alt="Preview" className="w-16 h-16 rounded-xl object-cover border border-slate-200 shadow-sm" />
                  ) : (
                    <div className="w-16 h-16 rounded-xl bg-slate-200 flex items-center justify-center text-slate-400"><i className="fas fa-image"></i></div>
                  )}
                  <div className="flex-1">
                    <button onClick={() => fileRef.current.click()} className="w-full px-4 py-2 bg-white text-teal-600 rounded-xl text-xs font-bold border border-teal-100 hover:bg-teal-50 transition-colors">
                      {uploading ? 'Uploading...' : 'Upload Image'}
                    </button>
                    <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex gap-3 mt-8 pt-6 border-t border-slate-50 justify-end">
            <button onClick={() => setShowForm(false)} className="px-8 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-600 font-black rounded-2xl text-[11px] transition-colors">Cancel</button>
            <button onClick={handleSave} disabled={saving || !formData.name || !formData.role} className="px-8 py-3.5 bg-teal-500 hover:bg-teal-600 text-white font-black rounded-2xl text-[11px] shadow-lg shadow-teal-500/20 transition-all disabled:opacity-50">
              {saving ? 'Saving...' : editingItem ? 'Update Contributor' : 'Create Contributor'}
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-20"><div className="w-10 h-10 border-3 border-slate-100 border-t-teal-500 rounded-full animate-spin" /></div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-[32px] shadow-sm border border-slate-200 py-20 text-center space-y-4">
          <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto border border-slate-100"><i className="fas fa-users-slash text-slate-200 text-3xl"></i></div>
          <h4 className="text-slate-500 font-extrabold text-lg">No Contributors Found</h4>
          <p className="text-sm text-slate-400">Try adjusting your search or add a new contributor.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map(c => (
            <div key={c._id} className="bg-white rounded-[32px] p-6 border border-slate-200 group relative hover:shadow-xl hover:border-teal-200 transition-all duration-300">
              <div className="flex flex-col items-center text-center">
                <img src={c.image_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(c.name)}&background=random`} className="w-20 h-20 rounded-2xl object-cover mb-4 border border-slate-100 shadow-sm group-hover:scale-105 transition-transform" alt={c.name} />
                <h3 className="font-black text-slate-800 text-lg">{c.name}</h3>
                <p className="text-[10px] text-teal-600 font-bold uppercase tracking-widest mt-1 mb-3">{c.role}</p>
                <p className="text-xs text-slate-500 line-clamp-2 min-h-[32px]">{c.bio}</p>
              </div>
              
              <div className="mt-5 pt-4 border-t border-slate-50 flex justify-center gap-4 text-slate-400">
                {c.github && <a href={c.github} target="_blank" rel="noreferrer" className="hover:text-slate-900"><i className="fab fa-github"></i></a>}
                {c.linkedin && <a href={c.linkedin} target="_blank" rel="noreferrer" className="hover:text-[#0077b5]"><i className="fab fa-linkedin"></i></a>}
                {c.portfolio && <a href={c.portfolio} target="_blank" rel="noreferrer" className="hover:text-teal-500"><i className="fas fa-globe"></i></a>}
              </div>

              <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => openEdit(c)} className="w-8 h-8 rounded-xl bg-slate-50 border border-slate-200 text-slate-400 hover:bg-teal-500 hover:text-white hover:border-teal-600 transition-all shadow-sm"><i className="fas fa-edit text-xs"></i></button>
                <button onClick={() => handleDelete(c._id)} className="w-8 h-8 rounded-xl bg-slate-50 border border-slate-200 text-slate-400 hover:bg-rose-500 hover:text-white hover:border-rose-600 transition-all shadow-sm"><i className="fas fa-trash text-xs"></i></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
