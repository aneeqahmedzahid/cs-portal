import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../lib/api';
import { getCloudinaryUrl } from '../lib/cloudinary';

export default function EventDetail() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const data = await api.getEventById(id);
        if (data) setItem(data);
      } catch (err) {
        console.error("Error fetching event:", err);
      }
      setLoading(false);
    };
    fetchEvent();
  }, [id]);

  const fmt = (d) => new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  const fmtTime = (d) => new Date(d).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-comsats-blue border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Not Found</h1>
          <p className="text-slate-500 mb-6">This event could not be found.</p>
          <Link to="/" className="px-6 py-3 bg-comsats-blue text-white rounded-full font-semibold hover:bg-comsats-blue-dark transition-colors">
            Back to Portal
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header with Logo */}
      <nav className="bg-white/80 backdrop-blur-xl border-b border-slate-200/50 shadow-sm sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center group">
            <img src={getCloudinaryUrl('WhatsApp_20Image_202026-04-22_20at_207.03.53_20PM_ldw4ql')} alt="COMSATS Logo" className="h-12 w-auto mix-blend-multiply group-hover:scale-105 transition-transform object-contain" />
          </Link>
          <Link to="/" className="flex items-center gap-2 text-slate-500 hover:text-comsats-blue transition-colors text-sm font-medium">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            Back to Portal
          </Link>
        </div>
      </nav>

      {/* Hero Image */}
      {item.image_url && (
        <div className="w-full h-[400px] relative">
          <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-50 via-transparent to-transparent"></div>
        </div>
      )}

      {/* Content */}
      <article className="max-w-4xl mx-auto px-6 py-16">
        <div className="mb-8">
          <div className="flex items-center gap-3 text-sm text-comsats-blue font-semibold tracking-wider uppercase mb-4">
            <span className="px-3 py-1 bg-blue-50 rounded-full">Event</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight mb-6">{item.title}</h1>

          {/* Event Info Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
              <div className="text-xs text-slate-400 uppercase font-semibold tracking-wider mb-1">Date</div>
              <div className="text-slate-900 font-bold">{fmt(item.event_date)}</div>
              <div className="text-slate-500 text-sm">{fmtTime(item.event_date)}</div>
            </div>
            <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
              <div className="text-xs text-slate-400 uppercase font-semibold tracking-wider mb-1">Location</div>
              <div className="text-slate-900 font-bold flex items-center gap-1.5">
                <svg className="w-4 h-4 text-comsats-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                {item.location}
              </div>
            </div>
            <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
              <div className="text-xs text-slate-400 uppercase font-semibold tracking-wider mb-1">Organized By</div>
              <div className="text-slate-900 font-bold">{item.author || 'Admin'}</div>
            </div>
          </div>
        </div>

        <div className="w-full h-px bg-slate-200 mb-10"></div>

        <div className="prose prose-lg prose-slate max-w-none">
          {item.description && item.description.split('\n').map((paragraph, idx) => (
            <p key={idx} className="text-slate-700 leading-relaxed text-lg mb-6">{paragraph}</p>
          ))}
        </div>

        <div className="mt-16 pt-8 border-t border-slate-200">
          <Link to="/" className="inline-flex items-center gap-2 text-comsats-blue hover:text-comsats-blue-dark font-semibold transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            Back to News & Events
          </Link>
        </div>
      </article>
    </div>
  );
}
