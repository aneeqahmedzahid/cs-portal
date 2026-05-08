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
    <section className="py-32 relative overflow-hidden bg-slate-950">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-teal-600/10 rounded-full blur-[120px] animate-pulse-slow"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-24">
          <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-400 text-sm font-bold tracking-widest uppercase mb-6 backdrop-blur-sm">
            The Visionaries
          </span>
          <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight mb-6 drop-shadow-lg">
            Meet the <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-300">Contributors</span>
          </h2>
          <div className="w-24 h-1.5 bg-gradient-to-r from-blue-500 to-teal-400 mx-auto rounded-full shadow-[0_0_15px_rgba(45,212,191,0.5)]"></div>
          <p className="mt-8 text-slate-400 text-lg md:text-xl max-w-2xl mx-auto font-light leading-relaxed">
            The dedicated team behind the modernization and development of the CS Department Digital Portal.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {contributors.map((person) => (
            <div key={person._id} className="group/card relative">
              <div className="relative h-full bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-6 transition-all duration-500 hover:bg-slate-800/60 hover:border-white/20 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] overflow-hidden">
                
                {/* Internal Card Glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 via-transparent to-teal-500/0 group-hover/card:from-blue-500/10 group-hover/card:to-teal-500/10 transition-colors duration-500 pointer-events-none"></div>

                <div className="relative z-10 flex flex-col items-center text-center h-full">
                  {/* Image Container */}
                  <div className="relative mb-6 w-full aspect-square max-w-[150px] mx-auto">
                    <div className="absolute inset-0 bg-gradient-to-tr from-blue-500 to-teal-400 rounded-[2rem] blur-xl opacity-20 group-hover/card:opacity-60 transition-opacity duration-500 scale-90 group-hover/card:scale-105"></div>
                    <img 
                      src={person.image_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(person.name)}&background=random`} 
                      alt={person.name} 
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(person.name)}&background=0D1117&color=fff&size=256`;
                      }}
                      className="w-full h-full rounded-[2rem] object-cover relative z-10 border border-white/10 group-hover/card:border-white/30 transition-all duration-500 shadow-2xl"
                    />
                  </div>
                  
                  {/* Info Section */}
                  <div className="flex-grow flex flex-col justify-center w-full">
                    <h3 className="text-xl font-bold text-white mb-1.5 truncate group-hover/card:text-blue-300 transition-colors">
                      {person.name}
                    </h3>
                    <p className="text-teal-400 font-semibold text-[11px] uppercase tracking-[0.2em] mb-5">
                      {person.role}
                    </p>
                    
                    {/* Social Links */}
                    <div className="flex items-center justify-center gap-3 mt-auto pt-5 border-t border-white/10">
                      {person.github && (
                        <a href={ensureAbsoluteUrl(person.github)} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-300 hover:bg-white hover:text-slate-900 transition-all duration-300 hover:scale-110 hover:shadow-lg">
                          <i className="fab fa-github text-lg"></i>
                        </a>
                      )}
                      {person.linkedin && (
                        <a href={ensureAbsoluteUrl(person.linkedin)} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-300 hover:bg-[#0077b5] hover:text-white transition-all duration-300 hover:scale-110 hover:shadow-lg shadow-[#0077b5]/30">
                          <i className="fab fa-linkedin-in text-lg"></i>
                        </a>
                      )}
                      {person.portfolio && (
                        <a href={ensureAbsoluteUrl(person.portfolio)} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-300 hover:bg-teal-500 hover:text-white transition-all duration-300 hover:scale-110 hover:shadow-lg shadow-teal-500/30">
                          <i className="fas fa-globe text-lg"></i>
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

      {/* Requested Gradient From Background To Transparent At Footer of Section */}
      <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-b from-slate-950 to-transparent z-20 pointer-events-none"></div>
    </section>
  );
}
