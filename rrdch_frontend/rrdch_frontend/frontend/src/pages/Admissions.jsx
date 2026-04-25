import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../utils/i18n';

const Admissions = () => {
  const { t } = useLanguage();
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    { title: "NEET Qualification", desc: "Mandatory qualification in NEET-UG (for BDS) or NEET-MDS (for PG) as per DCI norms.", icon: "📝" },
    { title: "Counseling Registration", desc: "Register on the KEA (Karnataka Examination Authority) portal for state-level counseling.", icon: "🖥️" },
    { title: "Document Verification", desc: "Submit original certificates at the designated nodal center for physical verification.", icon: "📂" },
    { title: "Seat Allotment", desc: "Choose RRDCH as your preferred college during the choice filling rounds.", icon: "🏥" },
    { title: "College Reporting", desc: "Report to the RRDCH campus with the allotment letter to complete final formalities.", icon: "🤝" }
  ];

  return (
    <div className="min-h-screen bg-[#0f172a] text-white overflow-hidden relative font-sans">
      {/* Dynamic Glass Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary-blue/20 rounded-full blur-[150px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-accent-emerald/10 rounded-full blur-[150px] animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-20">
        {/* Glass Hero */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 text-[10px] font-black uppercase tracking-[0.3em] mb-6 shadow-2xl">
            Admission 2026-27
          </div>
          <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">
            Join the Next Generation <br/> of Dental Excellence
          </h1>
          <p className="text-lg text-slate-400 font-medium max-w-2xl mx-auto">
            Rajarajeshwari Dental College & Hospital offers world-class infrastructure and clinical exposure for BDS and MDS aspirants.
          </p>
        </div>

        {/* Step-by-Step Visual Guide */}
        <section className="mb-32">
          <h2 className="text-2xl font-black mb-12 text-center uppercase tracking-widest text-[#008080]">Enrollment Journey</h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
            {/* Connection Line */}
            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-white/5 hidden md:block"></div>
            
            {steps.map((step, idx) => (
              <div 
                key={idx}
                onMouseEnter={() => setActiveStep(idx)}
                className={`relative p-8 rounded-[32px] backdrop-blur-2xl border transition-all duration-500 cursor-pointer group ${
                  activeStep === idx 
                  ? 'bg-white/10 border-white/20 shadow-2xl scale-105 z-20' 
                  : 'bg-white/5 border-white/5 opacity-60'
                }`}
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-6 shadow-inner transition-all ${
                  activeStep === idx ? 'bg-primary-blue text-white' : 'bg-white/5 text-slate-400'
                }`}>
                  {step.icon}
                </div>
                <h3 className="font-black text-sm uppercase tracking-widest mb-3">{step.title}</h3>
                <p className="text-[11px] leading-relaxed text-slate-400 font-medium">{step.desc}</p>
                <div className={`absolute -top-3 -right-3 w-8 h-8 rounded-full flex items-center justify-center font-black text-xs ${
                   activeStep === idx ? 'bg-accent-emerald text-white shadow-lg' : 'bg-white/10 text-slate-500'
                }`}>
                  0{idx + 1}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Program Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="p-12 rounded-[48px] bg-gradient-to-br from-white/10 to-transparent backdrop-blur-3xl border border-white/10 group hover:border-[#008080]/50 transition-all shadow-2xl">
            <h3 className="text-4xl font-black mb-6">BDS Program</h3>
            <p className="text-slate-400 mb-10 text-lg leading-relaxed">A 5-year comprehensive course (4 years academic + 1 year internship) recognized by the Dental Council of India.</p>
            <ul className="space-y-4 mb-12">
              {["100 seats annual intake", "NEET-UG Qualification mandatory", "State-of-the-art simulation labs"].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-sm font-bold">
                  <span className="w-5 h-5 rounded-full bg-accent-emerald/20 flex items-center justify-center text-accent-emerald text-[10px]">✓</span>
                  {item}
                </li>
              ))}
            </ul>
            <button className="w-full py-4 bg-white text-secondary-blue font-black rounded-2xl shadow-xl hover:scale-[1.02] transition-all">Download Prospectus</button>
          </div>

          <div className="p-12 rounded-[48px] bg-gradient-to-br from-white/10 to-transparent backdrop-blur-3xl border border-white/10 group hover:border-primary-blue/50 transition-all shadow-2xl">
            <h3 className="text-4xl font-black mb-6">MDS Program</h3>
            <p className="text-slate-400 mb-10 text-lg leading-relaxed">Specialized 3-year postgraduate degree across 9 distinct dental specialties with intensive clinical training.</p>
            <ul className="space-y-4 mb-12">
              {["NEET-MDS Qualification mandatory", "High patient inflow for clinicals", "International student exchange"].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-sm font-bold">
                  <span className="w-5 h-5 rounded-full bg-primary-blue/20 flex items-center justify-center text-primary-blue text-[10px]">✓</span>
                  {item}
                </li>
              ))}
            </ul>
            <button className="w-full py-4 bg-primary-blue text-white font-black rounded-2xl shadow-xl hover:scale-[1.02] transition-all">View Specialties</button>
          </div>
        </div>

        {/* Footer CTA */}
        <div className="mt-32 p-16 rounded-[60px] bg-white/5 backdrop-blur-xl border border-white/10 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#008080]/10 rounded-full blur-[80px]"></div>
          <h2 className="text-4xl font-black mb-6">Have Questions?</h2>
          <p className="text-slate-400 mb-10 max-w-xl mx-auto">Our admissions office is ready to help you with the counseling process and document verification details.</p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
             <Link to="/contact" className="px-12 py-5 bg-[#008080] text-white font-black rounded-2xl shadow-lg shadow-[#008080]/20 hover:scale-105 transition-all uppercase tracking-widest text-xs">Contact Admissions</Link>
             <a href="tel:+918028437150" className="px-12 py-5 bg-white/5 text-white border border-white/20 font-black rounded-2xl hover:bg-white/10 transition-all uppercase tracking-widest text-xs">Call Us Now</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admissions;
