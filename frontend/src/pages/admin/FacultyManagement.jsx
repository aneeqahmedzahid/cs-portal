import React, { useState, useEffect, useCallback, useRef } from 'react';
import { api } from '../../lib/api';
import { uploadToCloudinary } from '../../lib/cloudinary';

const DESIGNATIONS = ['Professor', 'Tenured Associate Professor', 'Associate Professor', 'Associate Professor(Tenured)', 'Assistant Professor', 'Senior Engineer', 'Lecturer'];

const emptyForm = { name: '', designation: 'Lecturer', interests: '', image_url: '', link: '' };

export default function FacultyManagement() {
  const [faculty, setFaculty] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({ ...emptyForm });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState('');
  const [filterDesignation, setFilterDesignation] = useState('all');
  const [previewImg, setPreviewImg] = useState('');
  const fileRef = useRef(null);
  const formRef = useRef(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const apiData = (await api.getFaculty()) || [];
      setFaculty(apiData);
    } catch (err) {
      console.error('Failed to fetch faculty from database:', err);
      setFaculty([]);
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  // Auto-scroll to form when it opens
  useEffect(() => {
    if (showForm && formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [showForm]);

  const openCreate = () => {
    setEditingItem(null);
    setFormData({ ...emptyForm });
    setPreviewImg('');
    setShowForm(true);
  };

  const openEdit = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name || '',
      designation: item.designation || 'Lecturer',
      interests: item.interests || '',
      image_url: item.image_url || '',
      link: item.link || '',
    });
    setPreviewImg(item.image_url || '');
    setShowForm(true);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('Image must be less than 5MB');
      return;
    }

    setUploading(true);
    try {
      const reader = new FileReader();
      reader.onload = (ev) => setPreviewImg(ev.target.result);
      reader.readAsDataURL(file);

      const publicUrl = await uploadToCloudinary(file);
      setFormData(prev => ({ ...prev, image_url: publicUrl }));
      setPreviewImg(publicUrl);
    } catch (err) {
      alert('Upload failed: ' + err.message);
      setPreviewImg(formData.image_url);
    }
    setUploading(false);
  };

  const handleSave = async () => {
    if (!formData.name || !formData.designation) {
      alert('Name and Designation are required');
      return;
    }
    setSaving(true);
    try {
      if (editingItem && !editingItem._isStatic) {
        await api.updateFaculty(editingItem.id, formData);
      } else {
        await api.createFaculty(formData);
      }
      setShowForm(false);
      fetchData();
    } catch (err) {
      alert('Error: ' + err.message);
    }
    setSaving(false);
  };

  const handleDelete = async (id, isStatic) => {
    if (isStatic) {
      alert('This faculty member is from the static data file. To remove them, edit facultyData.json.');
      return;
    }
    if (!confirm('Delete this faculty member?')) return;
    try { await api.deleteFaculty(id); fetchData(); } catch (err) { alert('Error: ' + err.message); }
  };

  const filtered = faculty.filter(f => {
    const matchesSearch = f.name?.toLowerCase().includes(search.toLowerCase()) || f.interests?.toLowerCase().includes(search.toLowerCase());
    const matchesDesig = filterDesignation === 'all' || f.designation === filterDesignation;
    return matchesSearch && matchesDesig;
  });

  const designationCounts = {};
  faculty.forEach(f => { designationCounts[f.designation] = (designationCounts[f.designation] || 0) + 1; });

  return (
    <div className="max-w-[1400px] mx-auto space-y-6 pb-20">
      {/* Header */}
      <div className="bg-white rounded-[32px] shadow-sm border border-slate-200 p-8 lg:p-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 rounded-2xl bg-purple-500 flex items-center justify-center text-white shadow-lg shadow-purple-500/20">
            <i className="fas fa-user-tie text-xl"></i>
          </div>
          <div>
            <h2 className="text-2xl lg:text-3xl font-black text-slate-800 tracking-tight">Faculty Management</h2>
            <p className="text-xs text-slate-400 font-bold mt-1">Manage department faculty members • {faculty.length} total</p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
          <div className="relative w-full sm:w-72">
            <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 text-sm"></i>
            <input type="text" placeholder="Search by name or interest..." className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 placeholder:text-slate-300 focus:ring-4 focus:ring-primary/5 outline-none transition-all" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <button onClick={openCreate} className="flex items-center justify-center gap-3 px-8 py-3.5 rounded-2xl font-black text-[11px] bg-primary text-white hover:bg-blue-800 shadow-lg shadow-primary/20 transition-all w-full lg:w-auto whitespace-nowrap">
            <i className="fas fa-plus text-xs"></i> Add Faculty
          </button>
        </div>
      </div>

      {/* Inline Form (replaces modal) */}
      {showForm && (
        <div ref={formRef} className="bg-white rounded-[32px] shadow-sm border border-slate-200 p-8 animate-fade-in">
          <div className="flex items-center justify-between pb-6 border-b border-slate-50 mb-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
                <i className="fas fa-user-tie text-lg"></i>
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-800">{editingItem ? 'Edit' : 'Add'} Faculty Member</h3>
                <p className="text-[10px] text-slate-400 font-bold">Fill in the faculty member details</p>
              </div>
            </div>
            <button onClick={() => setShowForm(false)} className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors">
              <i className="fas fa-xmark text-lg"></i>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
            {/* Image Upload Section */}
            <div className="flex flex-col items-center space-y-3">
              <div className="w-32 h-32 rounded-2xl bg-slate-50 border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden relative">
                {previewImg ? (
                  <img src={previewImg} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center">
                    <i className="fas fa-camera text-slate-300 text-2xl"></i>
                    <p className="text-[9px] text-slate-300 font-bold mt-1">No Image</p>
                  </div>
                )}
                {uploading && (
                  <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                    <div className="w-8 h-8 border-3 border-purple-100 border-t-purple-500 rounded-full animate-spin"></div>
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  disabled={uploading}
                  className="px-4 py-2 rounded-xl bg-purple-50 text-purple-600 text-xs font-bold border border-purple-100 hover:bg-purple-100 transition-colors disabled:opacity-50"
                >
                  <i className="fas fa-cloud-arrow-up mr-2"></i>
                  {uploading ? 'Uploading...' : 'Upload Image'}
                </button>
                {previewImg && (
                  <button
                    type="button"
                    onClick={() => { setPreviewImg(''); setFormData(prev => ({ ...prev, image_url: '' })); }}
                    className="px-3 py-2 rounded-xl bg-rose-50 text-rose-500 text-xs font-bold border border-rose-100 hover:bg-rose-100 transition-colors"
                  >
                    <i className="fas fa-xmark"></i>
                  </button>
                )}
              </div>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
              <div className="w-full">
                <label className="block text-[10px] font-black text-slate-400 mb-1.5 uppercase tracking-wider text-center">Or paste image URL</label>
                <input
                  value={formData.image_url}
                  onChange={e => { setFormData({...formData, image_url: e.target.value}); setPreviewImg(e.target.value); }}
                  placeholder="https://..."
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-100 text-sm font-bold text-slate-700 placeholder:text-slate-300 focus:ring-4 focus:ring-primary/5 outline-none text-center"
                />
              </div>
            </div>

            {/* Fields */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-black text-slate-500 mb-2 uppercase tracking-wider">Full Name *</label>
                  <input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Dr. John Doe" className="w-full px-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-sm font-bold text-slate-700 placeholder:text-slate-300 focus:ring-4 focus:ring-primary/5 outline-none" />
                </div>
                <div>
                  <label className="block text-[11px] font-black text-slate-500 mb-2 uppercase tracking-wider">Designation *</label>
                  <select value={formData.designation} onChange={e => setFormData({...formData, designation: e.target.value})} className="w-full px-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-sm font-bold text-slate-700 focus:ring-4 focus:ring-primary/5 outline-none appearance-none cursor-pointer">
                    {DESIGNATIONS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-black text-slate-500 mb-2 uppercase tracking-wider">Research Interests</label>
                <textarea value={formData.interests} onChange={e => setFormData({...formData, interests: e.target.value})} rows={3} placeholder="Machine Learning, Cloud Computing, etc." className="w-full px-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-sm font-bold text-slate-700 placeholder:text-slate-300 focus:ring-4 focus:ring-primary/5 outline-none resize-none" />
              </div>

              <div>
                <label className="block text-[11px] font-black text-slate-500 mb-2 uppercase tracking-wider">Profile Link</label>
                <input value={formData.link} onChange={e => setFormData({...formData, link: e.target.value})} placeholder="https://www.cuiatd.edu.pk/faculty/..." className="w-full px-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-sm font-bold text-slate-700 placeholder:text-slate-300 focus:ring-4 focus:ring-primary/5 outline-none" />
              </div>

              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowForm(false)} className="px-8 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-600 font-black rounded-2xl text-[11px] transition-colors">Cancel</button>
                <button onClick={handleSave} disabled={saving || uploading} className="px-8 py-3.5 bg-primary hover:bg-blue-800 text-white font-black rounded-2xl text-[11px] shadow-lg shadow-primary/20 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                  {saving ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> Saving...</> : editingItem ? 'Update Member' : 'Add Member'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filter Chips */}
      <div className="flex gap-2 flex-wrap">
        <button onClick={() => setFilterDesignation('all')} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${filterDesignation === 'all' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'}`}>
          All ({faculty.length})
        </button>
        {DESIGNATIONS.filter(d => designationCounts[d]).map(d => (
          <button key={d} onClick={() => setFilterDesignation(d)} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${filterDesignation === d ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'}`}>
            {d} ({designationCounts[d] || 0})
          </button>
        ))}
      </div>

      {/* Faculty List */}
      <div className="bg-white rounded-[32px] shadow-sm border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-20"><div className="w-10 h-10 border-3 border-gray-100 border-t-primary rounded-full animate-spin" /></div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 space-y-4">
            <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto border border-slate-100">
              <i className="fas fa-user-slash text-slate-200 text-3xl"></i>
            </div>
            <h4 className="text-slate-500 font-extrabold text-lg">No Faculty Found</h4>
            <p className="text-slate-400 text-xs font-bold">Click "Add Faculty" to add a new member</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {filtered.map((item) => (
              <div key={item.id} className="p-5 lg:p-6 flex items-center gap-5 hover:bg-slate-50/50 transition-colors group">
                <div className="w-14 h-14 lg:w-16 lg:h-16 rounded-2xl bg-slate-100 flex items-center justify-center overflow-hidden shrink-0 border border-slate-100">
                  {item.image_url && !item.image_url.startsWith('data:') ? (
                    <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" onError={e => { e.target.style.display = 'none'; }} />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300 text-xl">
                      <i className="fas fa-user"></i>
                    </div>
                  )}
                </div>

                <div className="flex-grow min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm lg:text-base font-black text-slate-800 truncate">{item.name}</h3>
                    {item._isStatic && (
                      <span className="px-2 py-0.5 text-[9px] font-black bg-slate-50 text-slate-400 rounded-lg border border-slate-200">Static</span>
                    )}
                  </div>
                  <div className="text-xs text-purple-500 font-bold mt-0.5">{item.designation}</div>
                  {item.interests && <p className="text-slate-400 text-[11px] mt-1 line-clamp-1">{item.interests}</p>}
                </div>

                <div className="flex gap-2 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  {item.link && (
                    <a href={item.link} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-blue-50 hover:text-blue-500 hover:border-blue-200 transition-all shadow-sm">
                      <i className="fas fa-link text-sm"></i>
                    </a>
                  )}
                  <button onClick={() => openEdit(item)} className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-primary hover:text-white hover:border-primary transition-all shadow-sm">
                    <i className="fas fa-edit text-sm"></i>
                  </button>
                  <button onClick={() => handleDelete(item.id, item._isStatic)} className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-rose-300 hover:bg-rose-500 hover:text-white hover:border-rose-600 transition-all shadow-sm">
                    <i className="fas fa-trash-can text-sm"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
