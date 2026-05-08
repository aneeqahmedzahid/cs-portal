import React from 'react';
import { useContributors } from '../hooks/useContributors';

const ensureAbsoluteUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return `https://${url}`;
};

export default function ContributorsSection() {
  const { contributors, loading } = useContributors();

  if (loading || contributors.length === 0) return null;

  return (
    <section className="py-32 relative overflow-hidden bg-slate-950">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] animate-pulse-slow"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-20">
          <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-indigo-400 text-sm font-bold tracking-widest uppercase mb-6">
            The Visionaries
          </span>
          <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight mb-6">
            Meet the <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-blue-400">Contributors</span>
          </h2>
          <div className="w-24 h-1.5 bg-gradient-to-r from-indigo-500 to-blue-500 mx-auto rounded-full"></div>
          <p className="mt-8 text-slate-400 text-lg max-w-2xl mx-auto font-light leading-relaxed">
            The dedicated team behind the modernization and development of the CS Department Digital Portal.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {contributors.map((person) => (
            <div key={person._id} className="group relative">
              {/* Card Container - Horizontal & Compact */}
              <div className="relative h-full backdrop-blur-xl bg-white/5 border border-white/10 rounded-[32px] p-5 transition-all duration-500 hover:bg-white/10 hover:border-white/20 hover:-translate-y-1 overflow-hidden shadow-2xl">
                
                <div className="relative z-10 flex flex-col items-center text-center h-full">
                  {/* Large Image - Taking up most of the ratio */}
                  <div className="relative mb-4 w-full aspect-square max-w-[180px] mx-auto">
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-[28px] blur-xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
                    <img 
                      src={person.image_url || 'https://via.placeholder.com/150'} 
                      alt={person.name} 
                      className="w-full h-full rounded-[24px] object-cover relative z-10 border-4 border-white/10 group-hover:border-white/20 transition-all duration-500 shadow-xl"
                    />
                  </div>
                  
                  {/* Compact Info Section */}
                  <div className="flex-grow flex flex-col justify-center">
                    <h3 className="text-xl font-black text-white mb-0.5 truncate group-hover:text-indigo-300 transition-colors">
                      {person.name}
                    </h3>
                    <p className="text-indigo-400 font-bold text-[10px] uppercase tracking-widest mb-3">
                      {person.role}
                    </p>
                    
                    {/* Social Links - Compact */}
                    <div className="flex items-center justify-center gap-3">
                      {person.github && (
                        <a href={ensureAbsoluteUrl(person.github)} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-slate-300 hover:bg-white hover:text-slate-900 transition-all duration-300">
                          <i className="fab fa-github text-sm"></i>
                        </a>
                      )}
                      {person.linkedin && (
                        <a href={ensureAbsoluteUrl(person.linkedin)} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-slate-300 hover:bg-[#0077b5] hover:text-white transition-all duration-300">
                          <i className="fab fa-linkedin-in text-sm"></i>
                        </a>
                      )}
                      {person.portfolio && (
                        <a href={ensureAbsoluteUrl(person.portfolio)} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-slate-300 hover:bg-indigo-600 hover:text-white transition-all duration-300">
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
    </section>
  );
}
