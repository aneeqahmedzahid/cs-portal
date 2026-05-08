import React from 'react';
import { useContributors } from '../hooks/useContributors';

const ensureAbsoluteUrl = (url) => {
  if (!url) return '#';
  let trimmedUrl = url.trim();
  if (trimmedUrl.startsWith('http://') || trimmedUrl.startsWith('https://')) return trimmedUrl;
  return `https://${trimmedUrl}`;
};

export default function ContributorsSection() {
  const { contributors, loading } = useContributors();

  if (loading || contributors.length === 0) return null;

  return (
    <section className="w-full relative overflow-hidden flex flex-col lg:flex-row shadow-2xl z-20">
      {/* Left Side: Dark Blue Introduction Section */}
      <div className="lg:w-4/12 bg-gradient-to-br from-slate-900 via-comsats-blue-dark to-comsats-blue relative p-10 md:p-16 xl:p-20 flex flex-col justify-center group overflow-hidden">
        {/* Animated decorative circles */}
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-400/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 group-hover:scale-110 group-hover:bg-teal-400/20 transition-all duration-1000"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-teal-400/20 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3 group-hover:scale-110 group-hover:bg-blue-400/20 transition-all duration-1000"></div>
        
        <div className="relative z-10 w-full max-w-sm mx-auto lg:mx-0">
          <div className="transform transition-all duration-700 translate-y-4 group-hover:translate-y-0">
            <span className="inline-block px-5 py-2 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-100 uppercase tracking-[0.2em] text-xs font-bold mb-6 backdrop-blur-sm shadow-sm">
              The Visionaries
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 tracking-tight drop-shadow-md leading-[1.1]">
              Meet The <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-300">Contributors</span>
            </h2>
            <div className="w-20 h-1.5 bg-gradient-to-r from-blue-400 to-teal-400 rounded-full mb-8"></div>
            <p className="text-blue-100/90 leading-relaxed font-light text-lg">
              The dedicated team of brilliant developers and designers behind the modernization of the CS Department Digital Portal.
            </p>
          </div>
        </div>
      </div>

      {/* Right Side: Light Background Contributors Grid */}
      <div className="lg:w-8/12 bg-slate-50 relative p-10 md:p-16 xl:p-20 flex flex-col justify-center min-h-[600px]">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#1f5ca9 2px, transparent 2px)', backgroundSize: '30px 30px' }}></div>
        
        <div className="relative z-10 w-full max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {contributors.map((person) => (
              <div key={person._id} className="group/card relative">
                {/* Contributor Card */}
                <div className="relative h-full bg-white rounded-3xl p-6 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(31,92,169,0.1)] border border-slate-100 overflow-hidden shadow-sm">
                  
                  {/* Accent Top Border */}
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-comsats-blue to-teal-400 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300"></div>

                  <div className="flex flex-col items-center text-center h-full pt-4">
                    {/* Avatar */}
                    <div className="relative mb-5 w-24 h-24 mx-auto group-hover/card:scale-105 transition-transform duration-500">
                      <div className="absolute inset-0 bg-blue-100 rounded-full blur-xl opacity-0 group-hover/card:opacity-60 transition-opacity duration-500"></div>
                      <img 
                        src={person.image_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(person.name)}&background=random`} 
                        alt={person.name} 
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(person.name)}&background=1f5ca9&color=fff`;
                        }}
                        className="w-full h-full rounded-full object-cover relative z-10 border-4 border-white shadow-md"
                      />
                    </div>
                    
                    {/* Details */}
                    <div className="flex-grow flex flex-col justify-center w-full">
                      <h3 className="text-xl font-bold text-slate-900 mb-1 truncate group-hover/card:text-comsats-blue transition-colors">
                        {person.name}
                      </h3>
                      <p className="text-teal-600 font-semibold text-[10px] uppercase tracking-[0.2em] mb-4">
                        {person.role}
                      </p>
                      
                      {/* Social Links */}
                      <div className="flex items-center justify-center gap-3 mt-auto pt-5 border-t border-slate-100">
                        {person.github && (
                          <a href={ensureAbsoluteUrl(person.github)} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-slate-900 hover:text-white transition-all duration-300 hover:shadow-md">
                            <i className="fab fa-github text-sm"></i>
                          </a>
                        )}
                        {person.linkedin && (
                          <a href={ensureAbsoluteUrl(person.linkedin)} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-[#0077b5] hover:text-white transition-all duration-300 hover:shadow-md">
                            <i className="fab fa-linkedin-in text-sm"></i>
                          </a>
                        )}
                        {person.portfolio && (
                          <a href={ensureAbsoluteUrl(person.portfolio)} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-teal-500 hover:text-white transition-all duration-300 hover:shadow-md">
                            <i className="fas fa-globe text-sm"></i>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
