import React, { useState } from 'react';

const VideoGallery = () => {
  const [selectedVideo, setSelectedVideo] = useState(null);

  const videos = [
    { id: '1', title: 'Graduation Day 2023', videoId: '4l8ejKQvbik' },
    { id: '2', title: 'Inauguration of Mobile Dental Clinic', videoId: 'GOq2adpBnaM' },
    { id: '3', title: '27th Graduation Day 2023-02', videoId: 'V1i5aMMdoI8' },
    { id: '4', title: 'Anti Tobacco Chewing Awareness', videoId: '0kshrVWf048' },
  ];

  const getThumbnail = (videoId) => {
    return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  };

  return (
    <div className="min-h-screen bg-soft-bg py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 space-y-4">
           <h1 className="text-4xl md:text-5xl font-black text-secondary-blue tracking-tight">Video Gallery</h1>
           <p className="text-lg text-text-muted font-bold max-w-2xl mx-auto">Explore RRDCH through our curated video collection, featuring campus tours, academic highlights, and clinical demonstrations.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {videos.map((video) => (
            <div 
              key={video.id}
              className="group relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer border border-border-soft"
              onClick={() => setSelectedVideo(video.videoId)}
            >
              <div className="aspect-video relative overflow-hidden">
                <img 
                  src={getThumbnail(video.videoId)} 
                  alt={video.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-secondary-blue/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-2xl scale-75 group-hover:scale-100 transition-transform">
                    <svg className="w-8 h-8 text-[#008080]" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.333-5.89a1.5 1.5 0 000-2.538L6.3 2.841z" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="p-6 bg-white flex justify-between items-center group-hover:bg-gray-50 transition-colors">
                <span className="font-black text-secondary-blue uppercase tracking-tight text-sm">{video.title}</span>
                <span className="text-[10px] font-black text-[#008080] uppercase tracking-widest bg-[#008080]/10 px-2 py-1 rounded">Watch Now</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Video Modal Overlay */}
      {selectedVideo && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-secondary-blue/95 backdrop-blur-md animate-fade-in">
          <button 
            className="absolute top-8 right-8 text-white hover:text-[#008080] transition-colors"
            onClick={() => setSelectedVideo(null)}
          >
            <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div className="w-full max-w-5xl aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl border-4 border-white/10">
            <iframe 
              className="w-full h-full"
              src={`https://www.youtube.com/embed/${selectedVideo}?autoplay=1`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoGallery;
