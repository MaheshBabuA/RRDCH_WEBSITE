import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { io } from 'socket.io-client';
import { useLanguage } from '../utils/i18n';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';
const socket = io(SOCKET_URL);

// Points to the Node.js backend (server.js)
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const DEPARTMENTS = [
  { id: 1, name: 'Oral Medicine \u0026 Radiology', icon: '📸' },
  { id: 2, name: 'Prosthetics \u0026 Crown \u0026 Bridge', icon: '😁' },
  { id: 3, name: 'Oral \u0026 Maxillofacial Surgery', icon: '🏥' },
  { id: 4, name: 'Periodontology', icon: '🛡️' },
  { id: 5, name: 'Pedodontics \u0026 Preventive Dentistry', icon: '👶' },
  { id: 6, name: 'Conservative Dentistry \u0026 Endodontics', icon: '🩹' },
  { id: 7, name: 'Orthodontics \u0026 Dentofacial Orthopedics', icon: '😬' },
  { id: 8, name: 'Public Health Dentistry', icon: '🌍' },
  { id: 9, name: 'Oral \u0026 Maxillofacial Pathology', icon: '🔬' },
  { id: 10, name: 'Implantology', icon: '🔩' },
  { id: 11, name: 'Orofacial Pain', icon: '⚡' }
];

const TIME_SLOTS = [
  "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
  "02:00 PM", "02:30 PM", "03:00 PM"
];

// Refined Status Colors
const STATUS_COLORS = { 
  Pending: 'bg-amber-400 text-white shadow-amber-400/20', // In-Queue
  Confirmed: 'bg-blue-500 text-white shadow-blue-400/20', // Scheduled
  in_progress: 'bg-emerald-500 text-white shadow-emerald-500/20', // Your Turn
  Completed: 'bg-slate-400 text-white shadow-slate-400/20' 
};

const PatientPortal = () => {
  const { t } = useLanguage();
  const [liveTicker, setLiveTicker] = useState(null);
  const [showCallAlert, setShowCallAlert] = useState(false);
  const [calledAptData, setCalledAptData] = useState(null);
  const [view, setView] = useState('home'); // home, booking, tracking
  const [bookingStep, setBookingStep] = useState(1);
  const [phone, setPhone] = useState(localStorage.getItem('current_user_phone') || '');
  const [isSearching, setIsSearching] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [medicalHistory, setMedicalHistory] = useState([]);
  const [patientName, setPatientName] = useState('');
  const [selectedApt, setSelectedApt] = useState(null);
  const [bookingForm, setBookingForm] = useState({ patient_name: '', dept: '', date: '', time_slot: '' });
  const [isBooking, setIsBooking] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(null);

  useEffect(() => {
    socket.on('live-ticker-update', (data) => {
      setLiveTicker(data);
      setTimeout(() => setLiveTicker(null), 10000);
    });

    socket.on('update', (data) => {
      console.log('Live appointment update received:', data);
      fetchAppointments();
    });

    socket.on('CALL_PATIENT', (data) => {
      const myAptId = localStorage.getItem('last_booked_apt_id');
      if (data.appointment_id === myAptId || appointments.some(a => a.id === data.appointment_id)) {
          setCalledAptData(data);
          setShowCallAlert(true);
          playSound('success');
          const msg = new SpeechSynthesisUtterance("It is your turn. Please enter cabin number 4.");
          msg.lang = 'en-IN';
          window.speechSynthesis.speak(msg);
      }
      fetchAppointments();
    });

    return () => {
      socket.off('live-ticker-update');
      socket.off('update');
      socket.off('CALL_PATIENT');
    };
  }, [phone, view]);

  const playSound = (type) => {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    if (type === 'success') {
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(880, audioCtx.currentTime);
      gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.3);
    }
  };

  useEffect(() => {
    if (phone && view === 'home') {
      fetchAppointments();
    }
  }, [view]);

  const fetchAppointments = async () => {
    if (!phone.trim()) return;
    setIsSearching(true);
    try {
      const res = await fetch(`${API_URL}/portal/my-appointments?phone=${phone}`);
      const data = await res.json();
      if (data.success) {
        setAppointments(data.appointments);
        setMedicalHistory(data.history || []);
        setPatientName(data.patient_name || '');
        if (data.appointments.length > 0) setSelectedApt(data.appointments[0]);
      }
    } catch (err) {
      console.error(err);
    } finally { setIsSearching(false); }
  };

  const handleBook = async () => {
    setIsBooking(true);
    try {
      const res = await fetch(`${API_URL}/book-appointment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            patient_name: bookingForm.patient_name,
            patient_phone: phone,
            dept: bookingForm.dept,
            date: bookingForm.date,
            time_slot: bookingForm.time_slot
        }),
      });
      const data = await res.json();
      if (res.status === 201) {
          playSound('success');
          localStorage.setItem('current_user_phone', phone);
          localStorage.setItem('last_booked_apt_id', data.appointment_id);
          setBookingSuccess(data);
          setView('tracking');
          fetchAppointments();
      }
    } catch (err) { console.error(err); }
    finally { setIsBooking(false); }
  };

  const StatusCircle = ({ status }) => {
    let fillLevel = '33%';
    let waveColor = '#87CEEB';
    let label = t('patientPortal.statusBooked');
    let subLabel = t('patientPortal.statusVisitScheduled');
    let isCalled = false;

    if (status === 'With Doctor') {
      fillLevel = '66%';
      waveColor = '#001F3F';
      label = t('patientPortal.statusInQueue');
      subLabel = t('patientPortal.statusWaiting');
    } else if (status === 'in_progress') {
      fillLevel = '100%';
      waveColor = '#008080';
      label = t('patientPortal.statusCalled');
      subLabel = t('patientPortal.statusEnterCabin');
      isCalled = true;
    }

    return (
      <div className="flex flex-col items-center gap-10 py-10">
        <div className={`wave-container shadow-2xl relative ${isCalled ? 'animate-pulse ring-[12px] ring-teal-400/20' : ''}`}>
           <div className="wave" style={{ bottom: fillLevel, backgroundColor: waveColor }}></div>
           <div className="absolute inset-0 flex flex-col items-center justify-center z-10 text-center">
              <span className={`text-4xl font-black ${isCalled ? 'text-white' : 'text-slate-900'} tracking-tighter`}>
                {isCalled ? t('patientPortal.cabin') : label}
              </span>
           </div>
        </div>
        <div className="text-center space-y-1">
           <div className="text-2xl font-black text-slate-900">{t('patientPortal.currentStatus')} {label}</div>
           <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t('patientPortal.passId')} {selectedApt?.id}</div>
        </div>
      </div>
    );
  };

  const GiantButton = ({ onClick, children, className = "", icon = "" }) => (
    <button onClick={onClick} className={`w-full h-32 flex flex-col items-center justify-center gap-2 rounded-[32px] font-black text-xl transition-all active:scale-95 shadow-xl ${className}`}>
      {icon && <span className="text-5xl">{icon}</span>}
      {children}
    </button>
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] p-6 pb-20">
      {showCallAlert && (
        <div className="fixed inset-0 z-[500] bg-emerald-500 flex flex-col items-center justify-center p-8 animate-fade-in text-white text-center">
           <div className="text-[120px] mb-8 animate-bounce">🔔</div>
           <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-4">{t('patientPortal.yourTurn')}</h1>
           <p className="text-2xl font-bold mb-12">{t('patientPortal.enterCabin')}</p>
           <button onClick={() => setShowCallAlert(false)} className="px-12 py-6 bg-white text-emerald-600 rounded-[32px] font-black text-xl">{t('patientPortal.iAmGoing')}</button>
        </div>
      )}

      {liveTicker && (
        <div className="fixed top-0 left-0 w-full bg-[#008080] text-white py-4 px-6 z-[100] shadow-2xl animate-slide-down flex items-center justify-between">
           <span className="text-sm font-bold">{t('patientPortal.nowServing')} <span className="text-white font-black uppercase">{liveTicker.patient_name}</span></span>
           <button onClick={() => setLiveTicker(null)} className="text-white/50">✕</button>
        </div>
      )}

      <div className="max-w-5xl mx-auto">
        {view === 'home' && (
          <div className="space-y-12 py-10 px-4 md:px-0">
            <div className="text-center space-y-4">
              <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">{t('patientPortal.title')}</h1>
              <p className="text-lg md:text-xl text-slate-500 font-bold">{t('patientPortal.subtitle')}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 max-w-4xl mx-auto">
              <GiantButton onClick={() => setView('booking')} icon="🏥" className="bg-white text-slate-900 border-4 border-transparent hover:border-[#008080]">{t('patientPortal.bookAppointment')}</GiantButton>
              <GiantButton onClick={() => {
                   const p = prompt(t('patientPortal.enterPhone'), phone);
                   if (p) { setPhone(p); localStorage.setItem('current_user_phone', p); setView('tracking'); fetchAppointments(); }
              }} icon="📱" className="bg-[#008080] text-white">{t('patientPortal.trackStatus')}</GiantButton>
            </div>
          </div>
        )}

        {view === 'tracking' && (
          <div className="space-y-8 animate-fade-in">
             <div className="flex justify-between items-center bg-white p-6 rounded-[32px] shadow-lg">
               <button onClick={() => setView('home')} className="p-3 bg-gray-100 rounded-2xl font-black">←</button>
               <h2 className="text-xl font-black text-slate-900">{t('patientPortal.patientStatus')}</h2>
               <div className="w-12"></div>
             </div>

             {selectedApt ? (
               <div className="space-y-8">
                 <div className="glass-panel p-6 md:p-8 rounded-[40px] flex items-center gap-6 teal-bloom animate-fade-in mx-4 md:mx-0">
                    <div className="w-16 h-16 md:w-20 md:h-20 shrink-0 bg-[#008080] rounded-full flex items-center justify-center text-3xl md:text-4xl text-white shadow-xl">
                       {patientName.charAt(0)}
                    </div>
                    <div>
                       <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">{t('patientPortal.welcomeBack')} {patientName}!</h2>
                       <p className="text-[10px] md:text-sm font-bold text-[#008080] uppercase tracking-widest">{t('patientPortal.verifiedProfile')}</p>
                    </div>
                 </div>

                 <div className="bg-white rounded-[48px] shadow-2xl overflow-hidden border border-gray-100 mx-4 md:mx-0">
                    <div className="p-10 bg-slate-900 text-white flex justify-between items-center">
                      <div>
                        <div className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80 mb-1">{t('patientPortal.appointmentPass')}</div>
                        <h2 className="text-3xl font-black">{selectedApt.id}</h2>
                      </div>
                      <div className="px-6 py-3 bg-white/20 rounded-2xl font-black uppercase text-xs">
                         {selectedApt.status === 'in_progress' ? t('patientPortal.statusCalled') : 
                          selectedApt.status === 'With Doctor' ? t('patientPortal.statusInQueue') : 
                          t('patientPortal.statusBooked')}
                      </div>
                    </div>
                    <div className="p-6 md:p-10 space-y-10">
                      <StatusCircle status={selectedApt.status} />
                      <div className="flex flex-col items-center gap-4 py-6">
                         <div className="bg-white p-4 md:p-6 rounded-[40px] shadow-2xl border border-gray-100 w-full max-w-[200px]">
                           <QRCodeSVG value={JSON.stringify({ patient_phone: phone, id: selectedApt.id })} size="100%" className="w-full h-auto" />
                         </div>
                         <p className="text-sm font-bold text-slate-400">{t('patientPortal.scanAtReception')}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                         <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100">
                           <div className="text-[10px] font-black text-slate-400 uppercase mb-1">{t('patientPortal.department')}</div>
                           <div className="text-lg font-black">
                             {/* Attempt to translate if matches dept id, else show original */}
                             {DEPARTMENTS.find(d => d.name === selectedApt.dept) ? t(`deptNames.${DEPARTMENTS.find(d => d.name === selectedApt.dept).id}`) : selectedApt.dept}
                           </div>
                         </div>
                         <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100">
                           <div className="text-[10px] font-black text-slate-400 uppercase mb-1">{t('patientPortal.timeSlot')}</div>
                           <div className="text-lg font-black">{selectedApt.time_slot}</div>
                         </div>
                      </div>
                    </div>
                 </div>

                 {medicalHistory.length > 0 && (
                   <div className="bg-white rounded-[40px] shadow-xl border border-gray-100 overflow-hidden">
                      <div className="p-8 bg-slate-50 border-b border-gray-100 flex justify-between items-center">
                         <h3 className="font-black text-slate-900 uppercase tracking-widest text-sm">{t('patientPortal.medicalHistory')}</h3>
                         <div className="text-[10px] font-black text-slate-400 bg-white px-3 py-1 rounded-full border border-gray-200">{medicalHistory.length} {t('patientPortal.recordsFound')}</div>
                      </div>
                      <div className="hidden md:block overflow-x-auto">
                         <table className="w-full text-left">
                            <thead>
                               <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-gray-50">
                                  <th className="px-8 py-4">{t('patientPortal.dateCol')}</th>
                                  <th className="px-8 py-4">{t('patientPortal.diagnosis')}</th>
                                  <th className="px-8 py-4">{t('patientPortal.treatment')}</th>
                                  <th className="px-8 py-4 text-right">{t('patientPortal.reports')}</th>
                               </tr>
                            </thead>
                            <tbody>
                               {medicalHistory.map((record, idx) => (
                                  <tr key={idx} className="tactile-row border-b border-gray-50 last:border-0 hover:bg-slate-50/50">
                                     <td className="px-8 py-6 font-bold text-sm text-slate-600">{record.visit_date || record.date}</td>
                                     <td className="px-8 py-6"><div className="font-black text-slate-900">{record.diagnosis}</div></td>
                                     <td className="px-8 py-6"><div className="text-xs font-bold text-slate-500">{record.treatment_plan || record.treatment}</div></td>
                                     <td className="px-8 py-6 text-right"><button className="w-10 h-10 bg-sky-50 text-sky-600 rounded-xl flex items-center justify-center hover:bg-sky-600 hover:text-white transition-all shadow-sm inline-flex">📄</button></td>
                                  </tr>
                               ))}
                            </tbody>
                         </table>
                      </div>
                      
                      {/* Mobile Cards for History */}
                      <div className="md:hidden flex flex-col gap-4 p-4">
                        {medicalHistory.map((record, idx) => (
                           <div key={idx} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col gap-4">
                              <div className="flex justify-between items-center">
                                 <span className="font-bold text-xs text-slate-400 uppercase tracking-widest">{record.visit_date || record.date}</span>
                                 <button className="w-10 h-10 bg-sky-50 text-sky-600 rounded-xl flex items-center justify-center shadow-sm">📄</button>
                              </div>
                              <div>
                                 <div className="font-black text-lg text-slate-900">{record.diagnosis}</div>
                                 <div className="text-sm font-bold text-slate-500 mt-1">{record.treatment_plan || record.treatment}</div>
                              </div>
                           </div>
                        ))}
                      </div>
                   </div>
                 )}
               </div>
             ) : (
               <div className="text-center py-32 bg-white rounded-[48px] border-4 border-dashed border-gray-100">
                  <h3 className="text-2xl font-black text-slate-400">{t('patientPortal.noAppointments')}</h3>
               </div>
             )}
          </div>
        )}

        {view === 'booking' && (
          <div className="max-w-2xl mx-auto py-10 space-y-8">
            <h2 className="text-3xl font-black text-center">{t('patientPortal.quickBooking')}</h2>
            <div className="bg-white p-10 rounded-[48px] shadow-2xl space-y-6">
               <input type="text" placeholder={t('patientPortal.patientName')} value={bookingForm.patient_name} onChange={e => setBookingForm({...bookingForm, patient_name: e.target.value})} className="w-full h-16 px-6 rounded-2xl bg-gray-50 border-none outline-none font-bold" />
               <select value={bookingForm.dept} onChange={e => setBookingForm({...bookingForm, dept: e.target.value})} className="w-full h-16 px-6 rounded-2xl bg-gray-50 border-none outline-none font-bold">
                  <option value="">{t('patientPortal.selectDept')}</option>
                  {DEPARTMENTS.map(d => <option key={d.name} value={d.name}>{t(`deptNames.${d.id}`)}</option>)}
               </select>
               <input type="date" value={bookingForm.date} onChange={e => setBookingForm({...bookingForm, date: e.target.value})} className="w-full h-16 px-6 rounded-2xl bg-gray-50 border-none outline-none font-bold" />
               <select value={bookingForm.time_slot} onChange={e => setBookingForm({...bookingForm, time_slot: e.target.value})} className="w-full h-16 px-6 rounded-2xl bg-gray-50 border-none outline-none font-bold">
                  <option value="">{t('patientPortal.selectTime')}</option>
                  {TIME_SLOTS.map(t_slot => <option key={t_slot} value={t_slot}>{t_slot}</option>)}
               </select>
               <button onClick={handleBook} disabled={isBooking} className="w-full h-20 bg-[#008080] text-white rounded-[32px] font-black text-xl shadow-xl">{isBooking ? t('patientPortal.booking') : t('patientPortal.confirmAppointment')}</button>
            </div>
            <button onClick={() => setView('home')} className="w-full text-slate-400 font-bold">{t('patientPortal.back')}</button>
          </div>
        )}
      </div>
      
      <style>{`
        .animate-fade-in { animation: fadeIn 0.4s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .glass-panel { background: rgba(255, 255, 255, 0.4); backdrop-filter: blur(25px); border: 1px solid rgba(255, 255, 255, 0.3); }
        @media (max-width: 768px) { .glass-panel { backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); } }
        .teal-bloom { position: relative; }
        .teal-bloom::after { content: ''; position: absolute; inset: 0; z-index: -1; background: radial-gradient(circle at 50% 50%, rgba(0, 128, 128, 0.2), transparent 70%); filter: blur(20px); opacity: 0.5; }
        .wave-container { position: relative; width: 80vw; height: 80vw; max-width: 250px; max-height: 250px; background: #ffffff; border-radius: 50%; overflow: hidden; border: 8px solid #f0f4f8; }
        .wave { position: absolute; bottom: 0; left: 0; width: 200%; height: 100%; opacity: 0.6; border-radius: 40%; animation: waveRotate 8s infinite linear; }
        @keyframes waveRotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default PatientPortal;
