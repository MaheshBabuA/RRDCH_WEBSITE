import React from 'react';

const ContactUs = () => {
  return (
    <div className="min-h-screen bg-soft-bg py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 space-y-4">
           <h1 className="text-4xl md:text-5xl font-black text-secondary-blue tracking-tight uppercase">Contact Us</h1>
           <p className="text-lg text-text-muted font-bold">Rajarajeswari Dental College & Hospital - Your pathway to dental health and education.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          
          {/* Left Column: Mail Us Form */}
          <div className="bg-white rounded-[40px] shadow-2xl p-10 border border-border-soft">
            <h2 className="text-3xl font-black text-secondary-blue mb-8 uppercase tracking-tight flex items-center">
              <span className="w-10 h-10 bg-[#008080] text-white rounded-xl flex items-center justify-center mr-4 shadow-lg text-xl">📧</span>
              Mail Us
            </h2>
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-text-muted uppercase tracking-widest ml-1">Full Name</label>
                  <input type="text" placeholder="John Doe" className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-[#008080] focus:bg-white rounded-2xl transition-all font-bold text-secondary-blue outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-text-muted uppercase tracking-widest ml-1">Email Address</label>
                  <input type="email" placeholder="john@example.com" className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-[#008080] focus:bg-white rounded-2xl transition-all font-bold text-secondary-blue outline-none" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-black text-text-muted uppercase tracking-widest ml-1">Subject</label>
                <input type="text" placeholder="Admission Inquiry" className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-[#008080] focus:bg-white rounded-2xl transition-all font-bold text-secondary-blue outline-none" />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-black text-text-muted uppercase tracking-widest ml-1">Message</label>
                <textarea rows="5" placeholder="How can we help you?" className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-[#008080] focus:bg-white rounded-2xl transition-all font-bold text-secondary-blue outline-none resize-none"></textarea>
              </div>
              <button className="w-full py-5 bg-[#008080] text-white rounded-2xl font-black text-lg shadow-xl shadow-[#008080]/20 hover:scale-[1.02] active:scale-95 transition-all">
                Send Message
              </button>
            </form>
          </div>

          {/* Right Column: General Info & Map */}
          <div className="space-y-8">
            <div className="bg-white rounded-[40px] shadow-2xl p-10 border border-border-soft">
              <h2 className="text-2xl font-black text-secondary-blue mb-8 uppercase tracking-tight flex items-center">
                <span className="w-10 h-10 bg-primary-blue text-white rounded-xl flex items-center justify-center mr-4 shadow-lg text-xl">📍</span>
                General Information
              </h2>
              <div className="space-y-6">
                <div className="flex items-start gap-6">
                  <div className="w-12 h-12 bg-primary-blue/10 text-primary-blue rounded-2xl flex items-center justify-center shrink-0">🏛️</div>
                  <div>
                    <h4 className="text-sm font-black text-secondary-blue uppercase tracking-widest mb-1">Address</h4>
                    <p className="text-text-muted font-bold leading-relaxed">No.14, Ramohalli Cross, Kumbalgodu,<br/>Mysore Road, Bangalore - 560074.</p>
                  </div>
                </div>
                <div className="flex items-start gap-6">
                  <div className="w-12 h-12 bg-success-green/10 text-success-green rounded-2xl flex items-center justify-center shrink-0">📞</div>
                  <div>
                    <h4 className="text-sm font-black text-secondary-blue uppercase tracking-widest mb-1">Contact Numbers</h4>
                    <p className="text-text-muted font-bold">+91-80-28437102 / +91-80-28437103</p>
                  </div>
                </div>
                <div className="flex items-start gap-6">
                  <div className="w-12 h-12 bg-[#008080]/10 text-[#008080] rounded-2xl flex items-center justify-center shrink-0">📧</div>
                  <div>
                    <h4 className="text-sm font-black text-secondary-blue uppercase tracking-widest mb-1">General Email</h4>
                    <p className="text-text-muted font-bold">info@rrdch.edu.in</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Embedded Google Map */}
            <div className="bg-white rounded-[40px] shadow-2xl overflow-hidden border-8 border-white h-80">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.751225841022!2d77.447171575747!3d12.8915440173003!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae3f707f433767%3A0xa632a4e9b9423c!2sRajarajeswari%20Dental%20College%20and%20Hospital!5e0!3m2!1sen!2sin!4v1713858000000!5m2!1sen!2sin" 
                className="w-full h-full"
                style={{ border: 0 }} 
                allowFullScreen="" 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ContactUs;
