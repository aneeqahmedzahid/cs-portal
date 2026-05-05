const fs = require('fs');
const facultyData = require('./frontend/src/data/facultyData.json');

let html = `<div class="max-w-7xl mx-auto px-6 mt-10">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
`;

facultyData.forEach(faculty => {
    html += `        <div class="group bg-white rounded-3xl border border-slate-200 overflow-hidden hover:shadow-[0_20px_40px_rgba(31,92,169,0.12)] hover:-translate-y-1 transition-all duration-300 flex flex-col h-full">
            <div class="relative pt-[100%] bg-slate-100 overflow-hidden">
                <a href="${faculty.link}" target="_blank" rel="noopener noreferrer">
                    <img src="${faculty.image}" alt="${faculty.name}" class="absolute inset-0 w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500" onerror="this.src='https://www.cuiatd.edu.pk/wp-content/uploads/2020/10/sample_profile.png'">
                </a>
                <div class="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            
            <div class="p-6 flex flex-col flex-grow relative">
                ${faculty.hecApproved ? `<div class="absolute -top-4 right-4 bg-teal-500 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg shadow-teal-500/30 ring-2 ring-white">HEC Approved</div>` : ''}
                
                <h3 class="text-xl font-bold text-slate-900 mb-1 group-hover:text-[#1f5ca9] transition-colors">
                    <a href="${faculty.link}" target="_blank" rel="noopener noreferrer">${faculty.name}</a>
                </h3>
                <p class="text-sm font-medium text-[#1f5ca9] mb-4 line-clamp-2">
                    ${faculty.designation}
                </p>
                
                ${faculty.interests ? `
                <div class="mt-auto pt-4 border-t border-slate-100">
                    <span class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Area of Interest:</span>
                    <div class="text-sm text-slate-600 line-clamp-3 leading-relaxed">
                        ${faculty.interests}
                    </div>
                </div>` : '<div class="mt-auto"></div>'}
                
                <a href="${faculty.link}" target="_blank" rel="noopener noreferrer" class="mt-6 w-full py-2.5 rounded-xl border-2 border-slate-100 text-slate-600 font-semibold text-sm text-center hover:bg-[#1f5ca9] hover:border-[#1f5ca9] hover:text-white transition-all flex items-center justify-center gap-2">
                    View Profile
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                </a>
            </div>
        </div>
`;
});

html += `    </div>\n</div>`;

fs.writeFileSync('scratch.html', html);
console.log('Done generating stylized HTML in scratch.html');
