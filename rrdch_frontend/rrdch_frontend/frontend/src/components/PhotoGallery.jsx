import React from 'react';

const PhotoGallery = () => {
  const photos = [
    {
      id: 1,
      title: 'Graduation Day 2023',
      url: 'file:///C:/Users/PC/.gemini/antigravity/brain/edf29dfc-b96a-4dde-8b58-68570917d24a/graduation_day_2023_1776928946898.png'
    },
    {
      id: 2,
      title: 'Clinical Excellence 2024',
      url: 'file:///C:/Users/PC/.gemini/antigravity/brain/edf29dfc-b96a-4dde-8b58-68570917d24a/clinical_excellence_2024_1776929001391.png'
    },
    {
      id: 3,
      title: 'Campus Main Building',
      url: 'file:///C:/Users/PC/.gemini/antigravity/brain/edf29dfc-b96a-4dde-8b58-68570917d24a/campus_view_rrdch_1776929101441.png'
    },
    {
      id: 4,
      title: 'Annual Sports Meet',
      url: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 5,
      title: 'Community Outreach',
      url: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: 6,
      title: 'Advanced Lab Research',
      url: 'https://images.unsplash.com/photo-1579152276503-34e8c158580b?auto=format&fit=crop&w=800&q=80'
    }
  ];

  return (
    <div className="w-full max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between border-b-2 border-[#008080]/10 pb-6 gap-4">
         <div>
            <h2 className="text-3xl font-black text-secondary-blue tracking-tight mb-2">Photo Gallery</h2>
            <p className="text-text-muted font-bold">Capturing moments of excellence at RRDCH</p>
         </div>
         <button className="text-[#008080] font-black uppercase tracking-widest text-xs hover:underline flex items-center">
            View All Albums
            <svg className="ml-2 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
         </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {photos.map((photo) => (
          <div 
            key={photo.id} 
            className="group relative bg-white border border-[#008080] rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 cursor-pointer"
          >
            {/* Image Container */}
            <div className="aspect-[4/3] overflow-hidden bg-gray-100">
               <img 
                 src={photo.url} 
                 alt={photo.title} 
                 className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
               />
               {/* Hover Overlay */}
               <div className="absolute inset-0 bg-gradient-to-t from-secondary-blue/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6">
                  <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white">
                     <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                     </svg>
                  </div>
               </div>
            </div>

            {/* Label */}
            <div className="bg-white p-5 border-t border-[#008080]/10 flex items-center justify-between group-hover:bg-[#008080]/5 transition-colors">
              <span className="text-sm font-black text-secondary-blue tracking-tight group-hover:text-[#008080] transition-colors">{photo.title}</span>
              <div className="w-2 h-2 rounded-full bg-[#008080] opacity-0 group-hover:opacity-100 transition-all scale-0 group-hover:scale-100 shadow-lg shadow-[#008080]/50"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PhotoGallery;
