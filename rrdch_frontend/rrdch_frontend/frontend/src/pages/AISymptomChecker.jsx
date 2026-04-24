import React, { useState } from 'react';

const AISymptomChecker = () => {
  const [severity, setSeverity] = useState(50);
  const [duration, setDuration] = useState(30);

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="bg-white/70 backdrop-blur-2xl border border-white rounded-[40px] shadow-2xl overflow-hidden">
        <div className="bg-secondary-blue p-10 text-white text-center">
          <h1 className="text-4xl font-black mb-4 tracking-tight">AI Symptom Checker</h1>
          <p className="text-blue-100 text-lg max-w-xl mx-auto">
            Our AI-powered diagnostic assistant helps you understand your dental symptoms before you visit our specialists.
          </p>
        </div>

        <div className="p-10 grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Left Column: Visual & Info */}
          <div className="space-y-8">
            <div className="aspect-square bg-gradient-to-br from-primary-blue/10 to-success-green/10 rounded-[32px] flex items-center justify-center border border-primary-blue/20 relative group">
               <div className="w-48 h-48 bg-white rounded-full flex items-center justify-center shadow-2xl transition-transform group-hover:scale-110">
                  <span className="text-8xl">🦷</span>
               </div>
               <div className="absolute inset-0 bg-primary-blue/5 animate-pulse rounded-[32px]"></div>
            </div>
            
            <div className="p-6 bg-primary-blue/5 rounded-2xl border border-primary-blue/10">
              <h3 className="font-bold text-secondary-blue mb-2 flex items-center">
                <svg className="w-5 h-5 mr-2 text-primary-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                How it works
              </h3>
              <p className="text-sm text-text-muted leading-relaxed">
                Adjust the sliders based on your current experience. Our neural network analyzes these parameters against thousands of clinical cases to provide a preliminary assessment.
              </p>
            </div>
          </div>

          {/* Right Column: Controls */}
          <div className="space-y-10">
            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm font-black uppercase tracking-widest text-secondary-blue">
                <span>Pain Severity</span>
                <span className={`px-3 py-1 rounded-full text-[10px] ${severity > 70 ? 'bg-error-red text-white' : severity > 30 ? 'bg-primary-blue text-white' : 'bg-success-green text-white'}`}>
                  {severity > 70 ? 'High' : severity > 30 ? 'Moderate' : 'Low'}
                </span>
              </div>
              <input 
                type="range" 
                value={severity}
                onChange={(e) => setSeverity(e.target.value)}
                className="w-full h-3 bg-gray-100 rounded-full appearance-none cursor-pointer accent-primary-blue" 
              />
              <div className="flex justify-between text-[10px] font-bold text-text-muted/60 uppercase">
                <span>Dull Ache</span>
                <span>Pulsating</span>
                <span>Excruciating</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm font-black uppercase tracking-widest text-secondary-blue">
                <span>Symptom Duration</span>
                <span className="text-primary-blue font-bold">{duration < 20 ? 'Just started' : duration < 60 ? 'Few days' : 'Chronic'}</span>
              </div>
              <input 
                type="range" 
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full h-3 bg-gray-100 rounded-full appearance-none cursor-pointer accent-secondary-blue" 
              />
              <div className="flex justify-between text-[10px] font-bold text-text-muted/60 uppercase">
                <span>Hours</span>
                <span>Days</span>
                <span>Weeks+</span>
              </div>
            </div>

            <div className="space-y-4">
               <h3 className="text-sm font-black uppercase tracking-widest text-secondary-blue">Additional Factors</h3>
               <div className="grid grid-cols-2 gap-3">
                  {['Bleeding', 'Swelling', 'Sensitivity', 'Fever'].map(factor => (
                    <button key={factor} className="px-4 py-3 border border-gray-200 rounded-xl text-xs font-bold hover:border-primary-blue hover:bg-primary-blue/5 transition-all text-left flex justify-between items-center group">
                      {factor}
                      <div className="w-4 h-4 rounded-full border-2 border-gray-200 group-hover:border-primary-blue"></div>
                    </button>
                  ))}
               </div>
            </div>

            <button className="w-full py-5 bg-primary-blue hover:bg-secondary-blue text-white rounded-2xl font-black text-lg shadow-xl shadow-primary-blue/20 transition-all transform hover:-translate-y-1">
              Generate AI Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AISymptomChecker;
