import React from 'react';

const PAPERS = [
  { id: 1, title: "Advancements in Nano-Hydroxyapatite for Enamel Remineralization", author: "Dr. Arun Patel", date: "Jan 2026", category: "Biomaterials" },
  { id: 2, title: "Comparison of 3D-Printed vs Traditional Orthodontic Aligners", author: "Dr. Priya Sharma", date: "Dec 2025", category: "Orthodontics" },
  { id: 3, title: "AI-Based Early Detection of Oral Squamous Cell Carcinoma", author: "Dr. Sarah Smith", date: "Nov 2025", category: "Oral Pathology" },
  { id: 4, title: "Microbial Diversity in Peri-Implantitis: A Metagenomic Analysis", author: "Dr. Rajesh Kumar", date: "Oct 2025", category: "Periodontology" },
  { id: 5, title: "Psychological Impact of Aesthetic Dental Procedures in Teens", author: "Dr. Vikram Seth", date: "Sep 2025", category: "Pedodontics" },
  { id: 6, title: "Evaluating Longevity of Zirconia Crowns in Bruxist Patients", author: "Dr. Meena Rao", date: "Aug 2025", category: "Prosthodontics" }
];

const Research = () => {
  return (
    <div className="min-h-screen bg-[#020617] text-white relative font-sans overflow-hidden">
      {/* Background Glows */}
      <div className="fixed top-0 right-0 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] -z-10"></div>
      <div className="fixed bottom-0 left-0 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px] -z-10"></div>

      <div className="max-w-7xl mx-auto px-4 py-24 relative z-10">
        <header className="text-center mb-24">
          <div className="inline-block px-4 py-1 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 text-[10px] font-black uppercase tracking-[0.4em] mb-6">Scientific Excellence</div>
          <h1 className="text-5xl md:text-6xl font-black mb-6 tracking-tighter">Dental Research Journal</h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto font-medium italic">"Pushing the boundaries of oral healthcare through evidence-based practice and innovation."</p>
        </header>

        {/* Search & Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-16 p-2 bg-white/5 backdrop-blur-3xl border border-white/10 rounded-3xl">
          <input 
            type="text" 
            placeholder="Search papers by keyword, author, or category..." 
            className="flex-1 bg-transparent border-none outline-none px-6 py-4 text-sm font-medium"
          />
          <button className="bg-primary-blue text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 transition-all">Search Archive</button>
        </div>

        {/* Papers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {PAPERS.map(paper => (
            <div key={paper.id} className="group relative bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[40px] p-10 hover:bg-white/10 transition-all duration-500 overflow-hidden shadow-2xl">
              {/* Decorative Corner */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary-blue/10 rounded-bl-[100px] -mr-12 -mt-12 group-hover:bg-primary-blue/20 transition-all"></div>
              
              <div className="text-[10px] font-black text-primary-blue uppercase tracking-widest mb-6 px-3 py-1 bg-primary-blue/10 rounded-full inline-block">
                {paper.category}
              </div>
              
              <h3 className="text-xl font-black mb-4 leading-tight group-hover:text-blue-200 transition-colors">{paper.title}</h3>
              
              <div className="space-y-2 mb-10">
                <div className="text-xs text-slate-400 font-bold">Principal Investigator: <span className="text-white">{paper.author}</span></div>
                <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest">{paper.date}</div>
              </div>
              
              <div className="flex items-center justify-between pt-6 border-t border-white/5">
                <button className="text-[10px] font-black uppercase tracking-widest text-primary-blue hover:underline">Read Abstract</button>
                <button className="flex items-center gap-2 px-6 py-3 bg-white/10 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-white hover:text-black transition-all">
                  <span>Download</span>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-32 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { label: "Published Papers", val: "450+" },
            { label: "Ongoing Trials", val: "12" },
            { label: "Research Grants", val: "₹2.5Cr" },
            { label: "Patents Filed", val: "08" }
          ].map((stat, i) => (
            <div key={i} className="p-8 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 text-center">
              <div className="text-3xl font-black mb-2">{stat.val}</div>
              <div className="text-[10px] font-black uppercase tracking-widest text-slate-500">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Research;
