import React from 'react';

const ACHIEVEMENTS = [
  { id: 1, title: "NAAC 'A' Grade Accreditation", type: "Institutional", desc: "Recognized for maintaining high standards in dental education and clinical practice.", size: "large" },
  { id: 2, title: "1st Rank - University Exams", type: "Student", desc: "Our student secured the overall 1st rank in BDS final year university exams.", size: "medium" },
  { id: 3, title: "Best Outreach Program 2025", type: "Award", desc: "Recognized for our rural dental camps serving over 50,000 patients.", size: "small" },
  { id: 4, title: "Global Innovation Award", type: "Research", desc: "For patented 'Smart-Brace' technology developed in our R&D lab.", size: "medium" },
  { id: 5, title: "DCI Sports Excellence", type: "Sports", desc: "Overall champions in the inter-college dental sports meet.", size: "small" },
  { id: 6, title: "5 Star Patient Satisfaction", type: "Clinical", desc: "Maintaining consistently high ratings for treatment quality and patient care.", size: "large" },
  { id: 7, title: "Community Leader Award", type: "Faculty", desc: "Dr. Sarah Smith awarded for her contribution to oral cancer awareness.", size: "small" },
  { id: 8, title: "Advanced CBCT Center", type: "Facility", desc: "First dental college in the region to install AI-assisted CBCT imaging.", size: "medium" }
];

const Achievements = () => {
  return (
    <div className="min-h-screen bg-[#020617] text-white relative font-sans overflow-hidden">
      {/* Background Teal Blur */}
      <div className="fixed top-[-20%] left-[-10%] w-[80%] h-[80%] bg-teal-500/5 rounded-full blur-[200px] -z-10"></div>
      
      <div className="max-w-7xl mx-auto px-4 py-24 relative z-10">
        <header className="text-center mb-24">
          <div className="inline-block px-4 py-1 rounded-full bg-teal-500/10 backdrop-blur-xl border border-teal-500/20 text-[10px] font-black uppercase tracking-[0.4em] mb-6 text-teal-400">Hall of Fame</div>
          <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter">Our Achievements</h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto font-medium">Celebrating milestones in clinical excellence, research innovation, and academic brilliance.</p>
        </header>

        {/* Masonry-Style Gallery Grid */}
        <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
          {ACHIEVEMENTS.map(item => (
            <div 
              key={item.id} 
              className="break-inside-avoid relative group bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[40px] p-10 hover:bg-white/10 transition-all duration-700 shadow-2xl hover:shadow-[0_0_40px_rgba(20,184,166,0.2)] hover:border-teal-500/30"
            >
              {/* Subtle Teal Glow Border Overlay */}
              <div className="absolute inset-0 rounded-[40px] border border-teal-500/0 group-hover:border-teal-500/30 transition-all duration-700 pointer-events-none"></div>

              <div className="flex justify-between items-start mb-10">
                <div className="w-12 h-12 bg-teal-500/20 rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                  {item.type === 'Institutional' ? '🏫' : item.type === 'Student' ? '🎓' : item.type === 'Award' ? '🏆' : '🔬'}
                </div>
                <div className="text-[9px] font-black uppercase tracking-widest text-slate-500 bg-white/5 px-3 py-1 rounded-full">
                  {item.type}
                </div>
              </div>

              <h3 className="text-2xl font-black mb-4 leading-tight group-hover:text-teal-300 transition-colors">{item.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed font-medium mb-10">
                {item.desc}
              </p>

              <div className="pt-6 border-t border-white/5 flex items-center gap-4">
                 <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-blue-500 p-[2px]">
                   <div className="w-full h-full rounded-full bg-[#020617] flex items-center justify-center text-xs">⭐</div>
                 </div>
                 <div>
                   <div className="text-[10px] font-black uppercase tracking-widest">Verified Distinction</div>
                   <div className="text-[9px] text-slate-500 font-bold">Awarded 2025-26</div>
                 </div>
              </div>
            </div>
          ))}
        </div>

        {/* Impact Section */}
        <div className="mt-32 p-16 rounded-[60px] bg-white/5 backdrop-blur-2xl border border-white/10 text-center relative overflow-hidden">
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-teal-500/5 rounded-full blur-[100px] -z-10"></div>
           <h2 className="text-4xl font-black mb-10">Excellence is a Habit</h2>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-4xl mx-auto">
             <div>
               <div className="text-5xl font-black text-teal-400 mb-2">15+</div>
               <div className="text-xs font-black uppercase tracking-widest text-slate-400">University Gold Medals</div>
             </div>
             <div>
               <div className="text-5xl font-black text-blue-400 mb-2">500+</div>
               <div className="text-xs font-black uppercase tracking-widest text-slate-400">Research Citations</div>
             </div>
             <div>
               <div className="text-5xl font-black text-purple-400 mb-2">98%</div>
               <div className="text-xs font-black uppercase tracking-widest text-slate-400">Career Placement</div>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Achievements;
