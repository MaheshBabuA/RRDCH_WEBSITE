import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const campusImages = [
  '/assets/campus/VEN_0090.jpg',
  '/assets/campus/VEN_0096.jpg',
  '/assets/campus/2e63bc73d3b74711809f29550fea647a.jpg',
  '/assets/campus/unnamed.jpg',
  '/assets/campus/3-15.jpg',
  '/assets/campus/images.jpg',
  '/assets/campus/images (1).jpg',
  '/assets/campus/images (2).jpg'
];

const AutoSlideshow = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-slide every 3 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % campusImages.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="w-full py-16 px-4 md:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-10">
          <div>
            <span className="text-blue-600 font-bold tracking-wider uppercase text-sm">Gallery</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mt-2">Our Campus Highlights</h2>
          </div>
          <div className="text-gray-400 font-medium text-sm hidden md:block">
            {currentIndex + 1} / {campusImages.length}
          </div>
        </div>

        {/* GLASSMORPHIC CONTAINER */}
        <div className="relative h-[300px] md:h-[450px] w-full rounded-[40px] overflow-hidden border border-[rgba(0,121,191,0.3)] shadow-2xl bg-white/70 backdrop-blur-[12px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              className="absolute inset-0 flex"
            >
              {/* DESKTOP VIEW: Show 4 images in a grid-like slide or a single wide one? 
                  The user asked: "On Desktop, show 3-4 images at once. On Mobile, show 1 image at a time."
                  This implies a slider/carousel of 4 items.
              */}
              <div className="hidden md:grid grid-cols-4 w-full h-full gap-1 p-2">
                {[0, 1, 2, 3].map((offset) => {
                  const idx = (currentIndex + offset) % campusImages.length;
                  return (
                    <motion.div 
                      key={idx}
                      className="relative h-full w-full overflow-hidden rounded-2xl"
                    >
                      <img 
                        src={campusImages[idx]} 
                        alt={`Campus ${idx}`} 
                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60"></div>
                    </motion.div>
                  );
                })}
              </div>

              {/* MOBILE VIEW: Show 1 image */}
              <div className="md:hidden w-full h-full">
                <img 
                  src={campusImages[currentIndex]} 
                  alt={`Campus ${currentIndex}`} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* OVERLAY GRADIENT FOR FOOTER BLENDING */}
          <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-gray-50 to-transparent pointer-events-none"></div>
          
          {/* NAVIGATION DOTS */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
            {campusImages.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`w-2 h-2 rounded-full transition-all ${i === currentIndex ? 'bg-blue-600 w-6' : 'bg-white/50'}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AutoSlideshow;
