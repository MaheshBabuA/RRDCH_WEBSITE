import React from 'react';
import Button from '../components/Button';

const ContactUs = () => {
  const mapUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.751225841022!2d77.447171575747!3d12.8915440173003!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae3f707f433767%3A0xa632a4e9b9423c!2sRajarajeswari%20Dental%20College%20and%20Hospital!5e0!3m2!1sen!2sin!4v1713858000000!5m2!1sen!2sin";
  const googleMapsDeepLink = "https://www.google.com/maps/dir/?api=1&destination=Rajarajeswari+Dental+College+and+Hospital";

  return (
    <div className="min-h-screen bg-soft-bg animate-fade-in pb-20">
      
      {/* Hero Header */}
      <div className="bg-secondary-blue py-24 px-4 text-center relative overflow-hidden">
         <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>
         <div className="max-w-4xl mx-auto relative z-10 space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-[10px] font-black uppercase tracking-widest shadow-lg">
               Reach Out to Us
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase leading-tight">Get In <span className="text-primary-blue">Touch</span></h1>
            <p className="text-xl text-blue-100/80 font-medium">Have questions? Our support team and clinical staff are here to assist you.</p>
         </div>
      </div>

      <div className="max-w-7xl mx-auto -mt-12 px-4 sm:px-6 lg:px-8 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Contact Form (2 Cols) */}
          <div className="lg:col-span-2 bg-white/90 backdrop-blur-3xl rounded-[48px] shadow-2xl p-10 border border-white">
            <h2 className="text-3xl font-black text-secondary-blue mb-10 tracking-tight flex items-center gap-4">
              <span className="w-12 h-12 bg-primary-blue/10 text-primary-blue rounded-2xl flex items-center justify-center shadow-inner">📧</span>
              Send us a Message
            </h2>
            <form className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-neutral-gray uppercase tracking-widest ml-2">Your Name</label>
                  <input type="text" placeholder="John Doe" className="w-full px-8 py-5 bg-soft-bg border-2 border-transparent focus:border-primary-blue focus:bg-white rounded-[24px] transition-all font-bold text-secondary-blue outline-none shadow-sm" />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-neutral-gray uppercase tracking-widest ml-2">Email Address</label>
                  <input type="email" placeholder="john@example.com" className="w-full px-8 py-5 bg-soft-bg border-2 border-transparent focus:border-primary-blue focus:bg-white rounded-[24px] transition-all font-bold text-secondary-blue outline-none shadow-sm" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-black text-neutral-gray uppercase tracking-widest ml-2">Inquiry Type</label>
                <select className="w-full px-8 py-5 bg-soft-bg border-2 border-transparent focus:border-primary-blue focus:bg-white rounded-[24px] transition-all font-bold text-secondary-blue outline-none shadow-sm appearance-none cursor-pointer">
                    <option>General Inquiry</option>
                    <option>Admissions</option>
                    <option>Patient Appointments</option>
                    <option>Hostel Facilities</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-black text-neutral-gray uppercase tracking-widest ml-2">Detailed Message</label>
                <textarea rows="5" placeholder="Tell us more about your inquiry..." className="w-full px-8 py-5 bg-soft-bg border-2 border-transparent focus:border-primary-blue focus:bg-white rounded-[24px] transition-all font-bold text-secondary-blue outline-none resize-none shadow-sm"></textarea>
              </div>
              <button className="w-full py-6 bg-secondary-blue text-white rounded-[24px] font-black text-xl shadow-2xl hover:bg-primary-blue hover:-translate-y-1 transition-all">
                Send Inquiry
              </button>
            </form>
          </div>

          {/* Contact Details & Directions (1 Col) */}
          <div className="space-y-8">
            <div className="bg-white rounded-[48px] shadow-xl p-10 border border-border-soft overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary-blue/5 rounded-full blur-3xl -mr-10 -mt-10"></div>
              <h3 className="text-2xl font-black text-secondary-blue mb-8 tracking-tight">Campus Info</h3>
              <div className="space-y-8">
                <div className="flex gap-6">
                    <span className="text-3xl w-14 h-14 bg-soft-bg rounded-2xl flex items-center justify-center shrink-0 border border-border-light shadow-sm">📍</span>
                    <div>
                        <p className="text-[10px] font-black text-neutral-gray uppercase tracking-widest mb-1">Location</p>
                        <p className="text-sm font-bold text-secondary-blue leading-relaxed">No.14, Ramohalli Cross, Kumbalgodu, Mysore Road, Bangalore - 560074.</p>
                    </div>
                </div>
                <div className="flex gap-6">
                    <span className="text-3xl w-14 h-14 bg-soft-bg rounded-2xl flex items-center justify-center shrink-0 border border-border-light shadow-sm">📞</span>
                    <div>
                        <p className="text-[10px] font-black text-neutral-gray uppercase tracking-widest mb-1">Call Desk</p>
                        <p className="text-sm font-bold text-secondary-blue">+91-80-28437102</p>
                    </div>
                </div>
                <div className="flex gap-6">
                    <span className="text-3xl w-14 h-14 bg-soft-bg rounded-2xl flex items-center justify-center shrink-0 border border-border-light shadow-sm">🕒</span>
                    <div>
                        <p className="text-[10px] font-black text-neutral-gray uppercase tracking-widest mb-1">Hospital Hours</p>
                        <p className="text-sm font-bold text-secondary-blue">Mon - Sat: 9:00 AM - 4:00 PM</p>
                    </div>
                </div>
              </div>
            </div>

            {/* Hospital Directions Section */}
            <div className="bg-white rounded-[48px] shadow-2xl overflow-hidden border-4 border-white flex flex-col group">
                <div className="h-64 relative overflow-hidden">
                    <iframe 
                        src={mapUrl} 
                        className="w-full h-full grayscale-[0.2] group-hover:grayscale-0 transition-all duration-700"
                        style={{ border: 0 }} 
                        allowFullScreen="" 
                        loading="lazy" 
                        referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                    <div className="absolute inset-0 bg-secondary-blue/10 pointer-events-none"></div>
                </div>
                <div className="p-8 bg-white border-t border-border-light text-center">
                    <h4 className="text-lg font-black text-secondary-blue mb-2 tracking-tight">Need Navigation?</h4>
                    <p className="text-xs text-neutral-gray font-bold mb-6">Get real-time directions to our Mysore Road campus.</p>
                    <a 
                        href={googleMapsDeepLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-3 w-full py-4 bg-success-green text-white font-black rounded-2xl shadow-lg hover:shadow-success-green/30 hover:-translate-y-1 transition-all group/btn"
                    >
                        <span className="text-xl">🗺️</span>
                        Open in Google Maps
                        <svg className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </a>
                </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ContactUs;
