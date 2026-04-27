import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { QRCodeSVG } from 'qrcode.react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { useLanguage } from '../utils/i18n';
import { useVoiceGuidance } from '../hooks/useVoiceGuidance';

const API_URL = 'http://localhost:5000/api';

const DEPARTMENTS = [
  { id: 1, name: 'Oral Medicine \u0026 Radiology', icon: '📸', color: 'from-blue-400 to-blue-600' },
  { id: 2, name: 'Prosthetics \u0026 Crown \u0026 Bridge', icon: '😁', color: 'from-emerald-400 to-emerald-600' },
  { id: 3, name: 'Oral \u0026 Maxillofacial Surgery', icon: '🏥', color: 'from-red-400 to-red-600' },
  { id: 4, name: 'Periodontology', icon: '🛡️', color: 'from-teal-400 to-teal-600' },
  { id: 5, name: 'Pedodontics \u0026 Preventive Dentistry', icon: '👶', color: 'from-pink-400 to-pink-600' },
  { id: 6, name: 'Conservative Dentistry \u0026 Endodontics', icon: '🩹', color: 'from-indigo-400 to-indigo-600' },
  { id: 7, name: 'Orthodontics \u0026 Dentofacial Orthopedics', icon: '😬', color: 'from-purple-400 to-purple-600' },
  { id: 8, name: 'Public Health Dentistry', icon: '🌍', color: 'from-green-400 to-green-600' },
  { id: 9, name: 'Oral \u0026 Maxillofacial Pathology', icon: '🔬', color: 'from-amber-400 to-amber-600' },
  { id: 10, name: 'Implantology', icon: '🔩', color: 'from-slate-400 to-slate-600' },
  { id: 11, name: 'Orofacial Pain', icon: '⚡', color: 'from-orange-400 to-orange-600' }
];

const TIME_SLOTS = [
  "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
  "12:00 PM", "12:30 PM", "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM"
];

const Appointments = () => {
  const { t } = useLanguage();
  const { speak, isMuted, toggleMute } = useVoiceGuidance();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    dept: '',
    date: '',
    time: '',
    name: '',
    phone: ''
  });
  const [isListening, setIsListening] = useState(false);
  const [activeVoiceField, setActiveVoiceField] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successData, setSuccessData] = useState(null);
  const receiptRef = useRef(null);

  useEffect(() => {
    if (step === 1) speak(t('voice.step1'));
    else if (step === 2) speak(t('voice.step2'));
    else if (step === 4) speak(t('voice.success'));
  }, [step, speak, t]);

  // --- Voice Recognition Logic ---
  const startListening = (field) => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice recognition not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-IN';
    recognition.onstart = () => {
      setIsListening(true);
      setActiveVoiceField(field);
    };
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setFormData(prev => ({
        ...prev,
        [field]: field === 'phone' ? transcript.replace(/\D/g, '') : transcript
      }));
    };
    recognition.onend = () => {
      setIsListening(false);
      setActiveVoiceField(null);
    };
    recognition.start();
  };

  const [syncError, setSyncError] = useState(false);

  const handleBooking = async () => {
    const optimisticId = `OPT-${Math.floor(Math.random() * 10000)}`;
    const optimisticConfirm = `RRDCH-${Math.random().toString(36).substring(7).toUpperCase()}`;
    
    const localSuccessData = {
      success: true,
      appointmentId: optimisticId,
      confirmationNumber: optimisticConfirm,
      verificationHash: 'OPTIMISTIC_PENDING',
      isOptimistic: true
    };

    setSuccessData(localSuccessData);
    setStep(4);
    setIsSubmitting(false);

    try {
      const res = await fetch(`${API_URL}/book-appointment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patient_name: formData.name,
          patient_phone: formData.phone,
          dept: formData.dept,
          date: formData.date,
          time_slot: formData.time
        })
      });
      
      const data = await res.json();
      
      if (data.appointment_id) {
        setSuccessData({
          success: true,
          appointmentId: data.appointment_id,
          confirmationNumber: data.appointment_id,
          verificationHash: data.token_no,
          isOptimistic: false
        });
        setSyncError(false);
        console.log('✅ Appointment synced with server:', data.appointment_id);
      } else if (data.error) {
        console.error('❌ Booking error:', data.error);
        setSyncError(true);
      }
    } catch (err) {
      console.error('Background Sync Failed:', err);
      setSyncError(true);
    }
  };


  const downloadReceipt = async () => {
    if (!receiptRef.current) return;
    const canvas = await html2canvas(receiptRef.current);
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF();
    pdf.addImage(imgData, 'PNG', 10, 10, 190, 0);
    pdf.save(`RRDCH-Receipt-${successData.confirmationNumber}.pdf`);
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="animate-fade-in space-y-8 pb-20 md:pb-0">
            <div className="text-center">
              <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">{t('booking.selectDept')}</h2>
              <p className="text-slate-500 font-bold mt-2 uppercase text-xs tracking-widest">{t('booking.step1')}</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {DEPARTMENTS.map(dept => (
                <button
                  key={dept.id}
                  onClick={() => {
                    setFormData({ ...formData, dept: dept.name });
                    setStep(2);
                  }}
                  className="neumorphic-card group relative h-56 flex flex-col items-center justify-center gap-6 overflow-hidden border-2 border-transparent hover:border-sky-200"
                >
                  <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-sky-200 group-hover:bg-teal-400 animate-pulse"></div>
                  
                  <div className="text-7xl group-hover:scale-110 transition-transform duration-500 flex items-center justify-center">
                    <span className="drop-shadow-sm group-hover:drop-shadow-xl transition-all grayscale group-hover:grayscale-0 opacity-40 group-hover:opacity-100">
                      {dept.icon}
                    </span>
                  </div>

                  <div className="px-6 text-center space-y-1">
                    <span className="block text-[11px] font-black uppercase text-slate-400 tracking-[0.15em] group-hover:text-teal-600 transition-colors">
                      {t(`deptNames.${dept.id}`).split(' & ')[0]}
                    </span>
                    <span className="block text-[9px] font-bold text-slate-300 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                      {t('booking.clinicalExcellence')}
                    </span>
                  </div>

                  <div className={`absolute bottom-0 left-0 w-full h-1.5 bg-gradient-to-r from-sky-400 to-teal-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`}></div>
                </button>
              ))}
            </div>

          </div>
        );

      case 2:
        return (
          <div className="animate-fade-in space-y-10 max-w-4xl mx-auto pb-20 md:pb-0">
            <div className="text-center">
              <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">{t('booking.pickSlot')}</h2>
              <p className="text-slate-500 font-bold mt-2 uppercase text-xs tracking-widest">{t('booking.step2')}</p>
            </div>
            
            <div className="bg-white rounded-[48px] p-10 shadow-2xl border border-slate-100 space-y-10">
              <div className="space-y-4">
                <label className="text-xs font-black uppercase text-slate-400 tracking-widest ml-2">{t('booking.availableDates')}</label>
                <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
                  {[...Array(7)].map((_, i) => {
                    const date = new Date();
                    date.setDate(date.getDate() + i);
                    const dateStr = date.toISOString().split('T')[0];
                    const isSelected = formData.date === dateStr;
                    return (
                      <button
                        key={i}
                        onClick={() => setFormData({ ...formData, date: dateStr })}
                        className={`min-w-[120px] p-6 rounded-3xl border-2 transition-all flex flex-col items-center gap-1 ${
                          isSelected ? 'border-primary-blue bg-primary-blue text-white shadow-lg' : 'border-slate-50 bg-slate-50 hover:bg-slate-100'
                        }`}
                      >
                        <span className="text-[10px] font-black uppercase opacity-60">
                          {date.toLocaleDateString('en-US', { weekday: 'short' })}
                        </span>
                        <span className="text-2xl font-black">{date.getDate()}</span>
                        <span className="text-[10px] font-bold opacity-60">
                          {date.toLocaleDateString('en-US', { month: 'short' })}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-xs font-black uppercase text-slate-400 tracking-widest ml-2">{t('booking.timeSlots')}</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {TIME_SLOTS.map(ts => (
                    <button
                      key={ts}
                      onClick={() => setFormData({ ...formData, time: ts })}
                      className={`py-4 rounded-2xl border-2 font-black text-xs transition-all ${
                        formData.time === ts ? 'border-primary-blue bg-primary-blue text-white shadow-lg' : 'border-slate-50 bg-slate-50 hover:bg-slate-100'
                      }`}
                    >
                      {ts}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center px-4">
              <button onClick={() => setStep(1)} className="text-slate-400 font-black uppercase text-xs hover:text-slate-900 transition-colors">{t('booking.backToDepts')}</button>
              <button 
                disabled={!formData.date || !formData.time}
                onClick={() => setStep(3)}
                className="bg-slate-900 text-white px-10 py-5 rounded-[24px] font-black text-sm uppercase tracking-widest shadow-xl disabled:opacity-30 disabled:cursor-not-allowed hover:scale-105 transition-all"
              >
                {t('booking.continue')}
              </button>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="animate-fade-in space-y-10 max-w-2xl mx-auto pb-20 md:pb-0">
            <div className="text-center">
              <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">{t('booking.yourIdentity')}</h2>
              <p className="text-slate-500 font-bold mt-2 uppercase text-xs tracking-widest">{t('booking.step3')}</p>
            </div>

            <div className="bg-white rounded-[48px] p-12 shadow-2xl border border-slate-100 space-y-12">
              <div className="relative group">
                <label className="absolute -top-3 left-6 bg-white px-2 text-[10px] font-black text-primary-blue uppercase tracking-widest">{t('booking.fullName')}</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  onFocus={() => speak(t('voice.step3Name'))}
                  placeholder={t('booking.enterName')}
                  className="w-full h-20 px-8 rounded-3xl bg-slate-50 border-2 border-transparent focus:border-primary-blue outline-none font-bold text-xl text-slate-800 transition-all"
                />
                <button 
                  onClick={() => startListening('name')}
                  className={`absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                    isListening && activeVoiceField === 'name' ? 'bg-red-500 text-white animate-pulse' : 'bg-white text-slate-400 hover:text-primary-blue shadow-md'
                  }`}
                >
                  🎤
                </button>
              </div>

              <div className="relative group">
                <label className="absolute -top-3 left-6 bg-white px-2 text-[10px] font-black text-primary-blue uppercase tracking-widest">{t('booking.phoneNumber')}</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  onFocus={() => speak(t('voice.step3Phone'))}
                  placeholder={t('booking.phonePlaceholder')}
                  className="w-full h-20 px-8 rounded-3xl bg-slate-50 border-2 border-transparent focus:border-primary-blue outline-none font-bold text-xl text-slate-800 transition-all"
                />
                <button 
                  onClick={() => startListening('phone')}
                  className={`absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                    isListening && activeVoiceField === 'phone' ? 'bg-red-500 text-white animate-pulse' : 'bg-white text-slate-400 hover:text-primary-blue shadow-md'
                  }`}
                >
                  🎤
                </button>
              </div>
            </div>

            <button
              onClick={handleBooking}
              disabled={!formData.name || formData.phone.length < 10 || isSubmitting}
              className="w-full py-6 md:py-8 bg-primary-blue text-white rounded-[32px] font-black text-xl md:text-2xl uppercase tracking-tighter shadow-2xl shadow-primary-blue/30 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-30"
            >
              {isSubmitting ? t('booking.processing') : t('booking.confirmAppointment')}
            </button>
            <button onClick={() => setStep(2)} className="w-full text-slate-400 font-black uppercase text-xs hover:text-slate-900 transition-colors">{t('booking.backToSchedule')}</button>
          </div>
        );

      case 4:
        return (
          <div className="animate-scale-in max-w-2xl mx-auto py-10 pb-24 md:pb-10 px-4 md:px-0">
            <div className="text-center mb-10 space-y-2">
              <div className="text-6xl mb-4">✅</div>
              <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">{t('booking.confirmed')}</h2>
              <p className="text-slate-500 font-bold uppercase text-xs tracking-widest">{t('booking.savePass')}</p>
            </div>

            {syncError && (
              <div className="mb-6 flex items-center justify-between glass-panel p-4 rounded-2xl border-amber-200 bg-amber-50/50 animate-pulse">
                 <div className="flex items-center gap-3">
                    <span className="text-xl">🔄</span>
                    <span className="text-[10px] font-black text-amber-700 uppercase tracking-[0.2em]">{t('booking.syncing')}</span>
                 </div>
                 <button onClick={handleBooking} className="text-[10px] font-black text-amber-900 underline">{t('booking.retryNow')}</button>
              </div>
            )}

            <div ref={receiptRef} className="bg-white rounded-[48px] shadow-2xl border border-slate-100 overflow-hidden mb-10">
              <div className="bg-slate-900 p-10 text-white flex justify-between items-center">
                <div>
                   <h3 className="text-2xl font-black tracking-tight">{successData.confirmationNumber}</h3>
                   <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">{t('booking.transactionId')}</p>
                </div>
                <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center text-4xl">🦷</div>
              </div>
              
              <div className="p-12 space-y-10">
                <div className="flex flex-col items-center gap-6 bg-slate-50 p-6 md:p-10 rounded-[40px] border border-slate-100 shadow-inner">
                  <div className="relative p-4 bg-white rounded-3xl shadow-lg border border-slate-100 w-full max-w-[250px] mx-auto">
                    <QRCodeSVG 
                      value={JSON.stringify({ 
                        aptId: successData.appointmentId, 
                        phone: formData.phone, 
                        ts: Date.now(),
                        hash: successData.verificationHash
                      })} 
                      size="100%"
                      level="H"
                      className="w-full h-auto"
                    />
                  </div>
                  
                  <div className="w-full bg-slate-900/5 py-4 px-6 rounded-2xl flex items-center gap-4 animate-pulse">
                     <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></div>
                     <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">
                       {t('booking.liveStatus')}
                     </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-1">
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('booking.patient')}</div>
                    <div className="text-lg font-black text-slate-900 uppercase">{formData.name}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('booking.department')}</div>
                    <div className="text-lg font-black text-primary-blue uppercase">{formData.dept}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('booking.date')}</div>
                    <div className="text-lg font-black text-slate-900 uppercase">{formData.date}</div>
                  </div>
                  <div className="space-y-1 text-right">
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('booking.reportingTime')}</div>
                    <div className="text-lg font-black text-primary-blue uppercase">{formData.time}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button 
                onClick={downloadReceipt}
                className="flex-1 py-6 bg-slate-900 text-white rounded-[24px] font-black uppercase text-sm tracking-widest shadow-xl hover:scale-105 transition-all"
              >
                {t('booking.downloadReceipt')}
              </button>
              <button 
                onClick={() => window.location.reload()}
                className="flex-1 py-6 bg-white border-2 border-slate-900 text-slate-900 rounded-[24px] font-black uppercase text-sm tracking-widest shadow-xl hover:scale-105 transition-all"
              >
                {t('booking.newBooking')}
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-8">
      <div className="max-w-[1440px] mx-auto">
        <header className="mb-12 flex items-center justify-between">
           <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary-blue rounded-2xl flex items-center justify-center text-white text-2xl font-black">R</div>
              <div>
                <h1 className="text-xl font-black text-slate-900 uppercase tracking-tighter">{t('booking.clinicalPortal')}</h1>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('booking.appointmentGateway')}</p>
              </div>
           </div>
           {step < 4 && (
             <div className="flex items-center gap-6">
               <button 
                 onClick={toggleMute}
                 className={`w-12 h-12 rounded-full flex items-center justify-center text-xl transition-all ${isMuted ? 'bg-slate-100 text-slate-400' : 'bg-primary-blue text-white shadow-lg shadow-primary-blue/30'}`}
                 title={isMuted ? "Unmute Voice Guidance" : "Mute Voice Guidance"}
               >
                 {isMuted ? '🔇' : '🔊'}
               </button>
               <div className="flex gap-2">
                 {[1,2,3].map(i => (
                   <div key={i} className={`h-1.5 w-8 rounded-full transition-all ${i === step ? 'bg-primary-blue w-12' : 'bg-slate-200'}`}></div>
                 ))}
               </div>
             </div>
           )}
        </header>

        <main>
          {renderStep()}
        </main>
      </div>

      <style>{`
        .animate-fade-in {
          animation: fadeIn 0.4s ease-out;
        }
        .animate-scale-in {
          animation: scaleIn 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default Appointments;
