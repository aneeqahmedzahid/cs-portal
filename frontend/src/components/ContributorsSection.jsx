import React from 'react';
import { useContributors } from '../hooks/useContributors';

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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {contributors.map((person) => (
            <div key={person._id} className="group relative">
              {/* Card Container with Glassmorphism */}
              <div className="relative h-full backdrop-blur-xl bg-white/5 border border-white/10 rounded-[40px] p-8 transition-all duration-500 hover:bg-white/10 hover:border-white/20 hover:-translate-y-2 overflow-hidden shadow-2xl">
                
                {/* Glow Effect on Hover */}
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-[42px] blur opacity-0 group-hover:opacity-20 transition duration-500"></div>

                <div className="relative z-10">
                  {/* Image and Identity */}
                  <div className="flex flex-col items-center text-center">
                    <div className="relative mb-6">
                      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-3xl blur-md opacity-40 group-hover:opacity-70 transition-opacity"></div>
                      <img 
                        src={person.image_url || 'https://via.placeholder.com/150'} 
                        alt={person.name} 
                        className="w-24 h-24 rounded-3xl object-cover relative z-10 border-2 border-white/20"
                      />
                    </div>
                    
                    <h3 className="text-2xl font-black text-white mb-1 group-hover:text-indigo-300 transition-colors">
                      {person.name}
                    </h3>
                    <p className="text-indigo-400 font-bold text-xs uppercase tracking-widest mb-4">
                      {person.role}
                    </p>
                    
                    <p className="text-slate-400 text-sm leading-relaxed mb-8 line-clamp-3 font-light">
                      {person.bio || 'Passionate developer contributing to the academic excellence of COMSATS University.'}
                    </p>

                    {/* Social Links */}
                    <div className="flex items-center gap-4">
                      {person.github && (
                        <a href={person.github} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-300 hover:bg-white hover:text-slate-900 transition-all duration-300">
                          <i className="fab fa-github text-lg"></i>
                        </a>
                      )}
                      {person.linkedin && (
                        <a href={person.linkedin} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-300 hover:bg-[#0077b5] hover:text-white transition-all duration-300">
                          <i className="fab fa-linkedin-in text-lg"></i>
                        </a>
                      )}
                      {person.portfolio && (
                        <a href={person.portfolio} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-300 hover:bg-indigo-600 hover:text-white transition-all duration-300">
                          <i className="fas fa-globe text-lg"></i>
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                {/* Background Pattern */}
                <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
                  <i className="fas fa-code text-8xl text-white"></i>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
