import React, { useState, useEffect } from 'react';
import { api } from '../lib/api';
import staticFacultyData from '../data/facultyData.json';

export default function FacultyGrid() {
  const [showAll, setShowAll] = useState(false);
  const [faculty, setFaculty] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFaculty = async () => {
      try {
        const data = await api.getFaculty();
        let facultyData = [];
        
        if (data && data.length > 0) {
          facultyData = data;
        } else {
          // Fallback to static data if DB is empty
          facultyData = staticFacultyData.map(f => ({
            name: f.name,
            designation: f.designation,
            interests: f.interests,
            image_url: f.image,
            link: f.link,
            mainContributor: f.mainContributor
          }));
        }

        // Sort by designation priority
        const DESIGNATIONS_PRIORITY = [
          'Professor', 
          'Tenured Associate Professor', 
          'Associate Professor', 
          'Associate Professor(Tenured)', 
          'Assistant Professor', 
          'Senior Engineer', 
          'Lecturer'
        ];

        const sortedData = [...facultyData].sort((a, b) => {
          const priorityA = DESIGNATIONS_PRIORITY.indexOf(a.designation);
          const priorityB = DESIGNATIONS_PRIORITY.indexOf(b.designation);
          
          const pA = priorityA === -1 ? 99 : priorityA;
          const pB = priorityB === -1 ? 99 : priorityB;
          
          if (pA !== pB) return pA - pB;
          return a.name.localeCompare(b.name);
        });

        setFaculty(sortedData);
      } catch (err) {
        console.error("Error fetching faculty:", err);
        // Fallback on error logic would go here, but setFaculty(sortedData) handles it
      }
      setLoading(false);
    };
    fetchFaculty();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-10 h-10 border-4 border-slate-100 border-t-comsats-blue rounded-full animate-spin"></div>
      </div>
    );
  }
  
  // 8 items = 2 rows on large screens (grid-cols-4)
  const displayedFaculty = showAll ? faculty : faculty.slice(0, 8);

  return (
    <div className="flex flex-col items-center w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 w-full">
        {displayedFaculty.map((item, index) => (
          <div key={index} className="group bg-white rounded-3xl border border-slate-200 overflow-hidden hover:shadow-[0_20px_40px_rgba(31,92,169,0.12)] hover:-translate-y-1 transition-all duration-300 flex flex-col h-full">
            <div className="relative pt-[100%] bg-slate-100 overflow-hidden">
              <a href={item.link} target="_blank" rel="noopener noreferrer">
                <img 
                  src={item.image_url} 
                  alt={item.name} 
                  className="absolute inset-0 w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    e.target.src = "https://www.cuiatd.edu.pk/wp-content/uploads/2020/10/sample_profile.png";
                  }}
                />
              </a>
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            
            <div className="p-6 flex flex-col flex-grow relative">
              {item.mainContributor && (
                <div className="absolute -top-4 right-4 bg-amber-500 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg shadow-amber-500/30 ring-2 ring-white">
                  Main Contributor
                </div>
              )}
              <h3 className="text-xl font-bold text-slate-900 mb-1 group-hover:text-[#1f5ca9] transition-colors text-balance">
                <a href={item.link} target="_blank" rel="noopener noreferrer">{item.name}</a>
              </h3>
              <p className="text-sm font-medium text-[#1f5ca9] mb-4 line-clamp-2">
                {item.designation}
              </p>
              
              {item.interests ? (
                <div className="mt-auto pt-4 border-t border-slate-100">
                  <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Area of Interest</span>
                  <div className="text-sm text-slate-600 line-clamp-3 leading-relaxed" dangerouslySetInnerHTML={{ __html: item.interests }} />
                </div>
              ) : (
                <div className="mt-auto"></div>
              )}
              
              <a 
                href={item.link}
                target="_blank" 
                rel="noopener noreferrer"
                className="mt-6 w-full py-2.5 rounded-xl border-2 border-slate-100 text-slate-600 font-semibold text-sm text-center hover:bg-[#1f5ca9] hover:border-[#1f5ca9] hover:text-white transition-all flex items-center justify-center gap-2"
              >
                View Profile
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
              </a>
            </div>
          </div>
        ))}
      </div>
      
      {faculty.length > 8 && (
        <button 
          onClick={() => setShowAll(!showAll)}
          className="mt-12 px-8 py-3 bg-white border-2 border-slate-200 text-slate-700 font-bold rounded-full hover:border-[#1f5ca9] hover:text-[#1f5ca9] hover:shadow-lg transition-all flex items-center gap-2"
        >
          {showAll ? "Show Less" : "Show More Faculty"}
          <svg className={`w-5 h-5 transition-transform duration-300 ${showAll ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
        </button>
      )}
    </div>
  );
}
