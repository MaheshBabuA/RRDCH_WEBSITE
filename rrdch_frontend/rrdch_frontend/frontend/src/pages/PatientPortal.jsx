import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';

// Points to the Node.js backend (server.js)
const API_URL = 'http://localhost:5000/api';

const DEPARTMENTS = [
  { name: 'Oral Surgery', icon: '🦷' },
  { name: 'Orthodontics', icon: '📏' },
  { name: 'Periodontics', icon: '🦷' },
  { name: 'Prosthodontics', icon: '👄' },
  { name: 'Conservative Dentistry', icon: '🩹' },
  { name: 'Pedodontics', icon: '👶' },
  { name: 'Oral Medicine', icon: '🧪' },
  { name: 'Oral Pathology', icon: '🔬' }
];

const TIME_SLOTS = [
  "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
  "02:00 PM", "02:30 PM", "03:00 PM"
];

// Refined Status Colors
const STATUS_COLORS = { 
  Pending: 'bg-amber-400 text-white shadow-amber-400/20', // In-Queue
  Confirmed: 'bg-emerald-500 text-white shadow-emerald-500/20', // Doctor is ready
  Completed: 'bg-slate-400 text-white shadow-slate-400/20' // Completed
};

const STATUS_LABELS = {
  Pending: 'In-Queue',
  Confirmed: 'Doctor is Ready',
  Completed: 'Completed'
};

const PatientPortal = () => {
  const [view, setView] = useState('home'); // home, booking, tracking
  const [bookingStep, setBookingStep] = useState(1);
  const [phone, setPhone] = useState(localStorage.getItem('rrdch_patient_phone') || '');
  const [isSearching, setIsSearching] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [selectedApt, setSelectedApt] = useState(null);
  const [bookingForm, setBookingForm] = useState({ patient_name: '', dept: '', date: '', time_slot: '' });
  const [isBooking, setIsBooking] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(null);

  // Sound Feedback Helpers
  const playSound = (type) => {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    if (type === 'success') {
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(880, audioCtx.currentTime); // A5
      oscillator.frequency.exponentialRampToValueAtTime(1320, audioCtx.currentTime + 0.1); // E6
      gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.3);
    } else {
      oscillator.type = 'square';
      oscillator.frequency.setValueAtTime(220, audioCtx.currentTime); // A3
      gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.2);
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.2);
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
        if (data.appointments.length > 0) setSelectedApt(data.appointments[0]);
      }
    } catch (err) {
      console.error(err);
    } finally { setIsSearching(false); }
  };

  const handleBook = async () => {
    setIsBooking(true);
    try {
      const res = await fetch(`${API_URL}/appointments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            patient_name: bookingForm.patient_name,
            patient_phone: phone,
            department_id: bookingForm.dept,
            appointment_date: bookingForm.date,
            appointment_time: bookingForm.time_slot.split(' ')[0]
        }),
      });
      const data = await res.json();
      if (data.success) {
          playSound('success');
          localStorage.setItem('rrdch_patient_phone', phone);
          setBookingSuccess(data);
          setView('tracking');
          fetchAppointments();
      } else {
          playSound('error');
          alert("Booking failed. Please try again.");
      }
    } catch (err) { 
        playSound('error');
        console.error(err); 
    }
    finally { setIsBooking(false); }
  };

  // --- UI COMPONENTS ---

  const GiantButton = ({ onClick, children, className = "", icon = "" }) => (
    <button 
      onClick={onClick}
      className={`w-full h-24 md:h-32 flex flex-col items-center justify-center gap-2 rounded-[32px] font-black text-lg md:text-xl transition-all active:scale-95 shadow-xl ${className}`}
    >
      {icon && <span className="text-4xl md:text-5xl">{icon}</span>}
      {children}
    </button>
  );

  const StepWrapper = ({ title, children, onNext, nextDisabled, onBack }) => (
    <div className="max-w-2xl mx-auto space-y-10 animate-fade-in py-10">
      <div className="space-y-2 text-center">
        <h2 className="text-3xl md:text-4xl font-black text-secondary-blue tracking-tight">{title}</h2>
        <div className="flex justify-center gap-1">
          {[1,2,3,4,5].map(i => (
            <div key={i} className={`h-1.5 w-8 rounded-full ${i <= bookingStep ? 'bg-[#008080]' : 'bg-gray-200'}`}></div>
          ))}
        </div>
      </div>
      
      <div className="bg-white rounded-[48px] p-10 shadow-2xl border border-gray-100 min-h-[300px] flex flex-col justify-center">
        {children}
      </div>

      <div className="flex gap-4">
        {onBack && (
          <button onClick={onBack} className="flex-1 h-20 bg-gray-100 text-slate-600 rounded-[28px] font-black text-lg hover:bg-gray-200 transition-all">
            ← BACK
          </button>
        )}
        {onNext && (
          <button 
            disabled={nextDisabled} 
            onClick={onNext} 
            className="flex-[2] h-20 bg-[#008080] text-white rounded-[28px] font-black text-lg shadow-xl shadow-[#008080]/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-30"
          >
            NEXT →
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f4f7f6] py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-5xl mx-auto">
        
        {/* --- HOME VIEW --- */}
        {view === 'home' && (
          <div className="space-y-12 animate-fade-in">
            <div className="text-center space-y-4">
              <h1 className="text-5xl md:text-6xl font-black text-secondary-blue tracking-tight">RRDCH Portal</h1>
              <p className="text-xl text-text-muted font-bold italic">Select an action to continue</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <GiantButton 
                onClick={() => setView('booking')}
                icon="🏥"
                className="bg-white text-secondary-blue border-4 border-transparent hover:border-[#008080]"
              >
                Book Appointment
              </GiantButton>
              <GiantButton 
                onClick={() => {
                   if (phone) setView('tracking');
                   else {
                     const p = prompt("Enter your registered phone number:");
                     if (p) {
                       setPhone(p);
                       localStorage.setItem('rrdch_patient_phone', p);
                       setView('tracking');
                     }
                   }
                }}
                icon="📱"
                className="bg-[#008080] text-white"
              >
                Track Status
              </GiantButton>
            </div>

            {/* Quick Status Preview */}
            {phone && appointments.length > 0 && (
              <div className="bg-white rounded-[40px] p-8 shadow-xl border border-gray-100 max-w-2xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-black text-secondary-blue uppercase tracking-widest text-sm">Active Appointment</h3>
                  <button onClick={() => setView('tracking')} className="text-[#008080] font-black text-xs hover:underline">VIEW FULL PASS →</button>
                </div>
                <div className="flex items-center gap-6">
                   <div className={`w-4 h-4 rounded-full ${STATUS_COLORS[appointments[0].status] || 'bg-gray-400'}`}></div>
                   <div>
                     <div className="font-black text-xl">{appointments[0].dept}</div>
                     <div className="text-sm text-text-muted font-bold">{appointments[0].time_slot} • {appointments[0].date}</div>
                   </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* --- BOOKING VIEW (Multi-Step) --- */}
        {view === 'booking' && (
          <>
            {bookingStep === 1 && (
              <StepWrapper 
                title="Phone Number?" 
                onNext={() => setBookingStep(2)} 
                nextDisabled={!phone || phone.length < 10}
                onBack={() => setView('home')}
              >
                <input 
                  type="tel" 
                  value={phone} 
                  onChange={e => setPhone(e.target.value)} 
                  className="w-full text-center text-4xl md:text-5xl font-black text-secondary-blue bg-transparent border-none outline-none placeholder-gray-100"
                  placeholder="9876543210"
                  autoFocus
                />
              </StepWrapper>
            )}

            {bookingStep === 2 && (
              <StepWrapper 
                title="What is your name?" 
                onNext={() => setBookingStep(3)} 
                nextDisabled={!bookingForm.patient_name}
                onBack={() => setBookingStep(1)}
              >
                <input 
                  type="text" 
                  value={bookingForm.patient_name} 
                  onChange={e => setBookingForm(p => ({...p, patient_name: e.target.value}))} 
                  className="w-full text-center text-3xl md:text-4xl font-black text-secondary-blue bg-transparent border-none outline-none"
                  placeholder="Full Name"
                  autoFocus
                />
              </StepWrapper>
            )}

            {bookingStep === 3 && (
              <StepWrapper title="Select Department" onBack={() => setBookingStep(2)}>
                <div className="grid grid-cols-2 gap-4">
                  {DEPARTMENTS.map(d => (
                    <button 
                      key={d.name}
                      onClick={() => {
                        setBookingForm(p => ({...p, dept: d.name}));
                        setBookingStep(4);
                      }}
                      className={`p-6 rounded-3xl border-4 transition-all flex flex-col items-center gap-2 ${
                        bookingForm.dept === d.name ? 'border-[#008080] bg-[#008080]/5' : 'border-gray-50 bg-gray-50 hover:bg-gray-100'
                      }`}
                    >
                      <span className="text-3xl">{d.icon}</span>
                      <span className="text-[10px] font-black uppercase text-center">{d.name}</span>
                    </button>
                  ))}
                </div>
              </StepWrapper>
            )}

            {bookingStep === 4 && (
              <StepWrapper 
                title="Choose a Date" 
                onNext={() => setBookingStep(5)} 
                nextDisabled={!bookingForm.date}
                onBack={() => setBookingStep(3)}
              >
                <input 
                  type="date" 
                  value={bookingForm.date} 
                  onChange={e => setBookingForm(p => ({...p, date: e.target.value}))} 
                  className="w-full text-center text-3xl font-black text-secondary-blue bg-transparent outline-none"
                />
              </StepWrapper>
            )}

            {bookingStep === 5 && (
              <StepWrapper title="Pick a Time" onBack={() => setBookingStep(4)}>
                <div className="grid grid-cols-3 gap-3">
                  {TIME_SLOTS.map(t => (
                    <button 
                      key={t}
                      onClick={() => {
                        setBookingForm(p => ({...p, time_slot: t}));
                        // We use a small delay for the "Complete" action
                        setTimeout(handleBook, 100);
                      }}
                      className={`py-4 rounded-2xl border-2 font-bold text-sm transition-all ${
                        bookingForm.time_slot === t ? 'border-[#008080] bg-[#008080] text-white' : 'border-gray-100 bg-gray-50 hover:bg-gray-100'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
                {isBooking && <div className="mt-8 text-center font-black animate-pulse text-[#008080]">CONFIRMING...</div>}
              </StepWrapper>
            )}
          </>
        )}

        {/* --- TRACKING VIEW --- */}
        {view === 'tracking' && (
          <div className="space-y-8 animate-fade-in">
             <div className="flex justify-between items-center bg-white p-6 rounded-[32px] shadow-lg border border-gray-100">
               <button onClick={() => setView('home')} className="p-3 bg-gray-100 rounded-2xl hover:bg-gray-200 transition-all font-black text-xl">←</button>
               <h2 className="text-xl font-black text-secondary-blue">Patient Status</h2>
               <div className="w-12"></div>
             </div>

             {selectedApt ? (
               <div className="bg-white rounded-[48px] shadow-2xl overflow-hidden border border-gray-100">
                  <div className={`p-10 text-white flex justify-between items-center ${STATUS_COLORS[selectedApt.status] || 'bg-slate-400'}`}>
                    <div>
                      <div className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80 mb-1">Appointment Pass</div>
                      <h2 className="text-3xl font-black">{selectedApt.id}</h2>
                    </div>
                    <div className="px-6 py-3 bg-white/20 backdrop-blur-md rounded-2xl font-black uppercase text-xs">
                      {STATUS_LABELS[selectedApt.status]}
                    </div>
                  </div>

                  <div className="p-10 space-y-10">
                    <div className="flex flex-col items-center gap-4 py-6">
                       <div className="bg-white p-6 rounded-[40px] shadow-2xl border border-gray-100">
                         <QRCodeSVG 
                           value={JSON.stringify({
                             patient_id: selectedApt.patient_id || selectedApt.patientId, 
                             current_appointment_id: selectedApt.id
                           })} 
                           size={200} 
                         />
                       </div>
                       <p className="text-sm font-bold text-text-muted">Scan at OPD for Quick Entry</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                       <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100">
                         <div className="text-[10px] font-black text-text-muted uppercase mb-1">Department</div>
                         <div className="text-lg font-black">{selectedApt.dept}</div>
                       </div>
                       <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100">
                         <div className="text-[10px] font-black text-text-muted uppercase mb-1">Time Slot</div>
                         <div className="text-lg font-black">{selectedApt.time_slot}</div>
                       </div>
                    </div>

                    <button 
                      onClick={() => window.print()}
                      className="w-full py-5 bg-secondary-blue text-white rounded-3xl font-black text-lg shadow-xl"
                    >
                      Download Pass
                    </button>
                  </div>
               </div>
             ) : (
               <div className="text-center py-32 bg-white rounded-[48px] border-4 border-dashed border-gray-100">
                  <div className="text-6xl mb-6">🔍</div>
                  <h3 className="text-2xl font-black text-secondary-blue">No Appointments</h3>
                  <p className="text-text-muted font-bold mt-2">Book your first visit today!</p>
               </div>
             )}

             {appointments.length > 1 && (
                <div className="space-y-4">
                  <h3 className="font-black text-secondary-blue uppercase tracking-widest text-xs px-6">Other Appointments</h3>
                  <div className="flex gap-4 overflow-x-auto pb-4 px-2 no-scrollbar">
                    {appointments.map(apt => (
                      <button 
                        key={apt.id} 
                        onClick={() => setSelectedApt(apt)}
                        className={`min-w-[200px] p-6 rounded-[32px] border-2 transition-all text-left ${
                          selectedApt?.id === apt.id ? 'border-[#008080] bg-[#008080]/5' : 'border-white bg-white shadow-lg'
                        }`}
                      >
                        <div className="font-black text-lg">{apt.dept}</div>
                        <div className="text-xs font-bold text-text-muted">{apt.date}</div>
                      </button>
                    ))}
                  </div>
                </div>
             )}
          </div>
        )}

      </div>
      
      <style>{`
        .animate-fade-in {
          animation: fadeIn 0.4s ease-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
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

export default PatientPortal;
