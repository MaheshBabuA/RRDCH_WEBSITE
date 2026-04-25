import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';

// Points to the Node.js backend (server.js)
const API_URL = 'http://localhost:5000/api';

const DEPARTMENTS = [
  'Oral Surgery', 'Orthodontics', 'Periodontics', 'Prosthodontics',
  'Conservative Dentistry', 'Pedodontics', 'Oral Medicine', 'Oral Pathology'
];

// Aligned with the backend API response status labels
const STATUS_STEPS = ['Pending', 'Confirmed', 'Completed'];
const STATUS_LABELS = { 
  Pending: 'Under Review', 
  Confirmed: 'Confirmed', 
  Completed: 'Treatment Done' 
};
const STATUS_ICONS = { 
  Pending: '📋', 
  Confirmed: '✅', 
  Completed: '🦷' 
};

const PatientPortal = () => {
  const [phone, setPhone] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [selectedApt, setSelectedApt] = useState(null);
  const [showBooking, setShowBooking] = useState(false);
  const [bookingForm, setBookingForm] = useState({ patient_name: '', dept: '', date: '', time_slot: '' });
  const [isBooking, setIsBooking] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(null);

  const [queueStatus, setQueueStatus] = useState({
    'Oral Surgery': 12, 'Orthodontics': 8, 'Periodontics': 15
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setQueueStatus(prev => ({
        'Oral Surgery': Math.max(1, prev['Oral Surgery'] + (Math.random() > 0.5 ? 1 : -1)),
        'Orthodontics': Math.max(1, prev['Orthodontics'] + (Math.random() > 0.6 ? 1 : -1)),
        'Periodontics': Math.max(1, prev['Periodontics'] + (Math.random() > 0.4 ? 1 : -1))
      }));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!phone.trim()) return;
    setIsSearching(true);
    setSelectedApt(null);
    try {
      // Using the newly created Node.js API endpoint
      const res = await fetch(`${API_URL}/get-patient-appointments?phone_number=${phone}`);
      const data = await res.json();
      
      if (data.success) {
        setAppointments(data.appointments);
        if (data.appointments.length > 0) setSelectedApt(data.appointments[0]);
      } else {
        setAppointments([]);
      }
    } catch (err) {
      console.error('Search Error:', err);
      setAppointments([]);
    } finally { setIsSearching(false); }
  };

  const handleBook = async (e) => {
    e.preventDefault();
    setIsBooking(true);
    try {
      // Maps to existing appointments router logic
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
          setBookingSuccess(data);
          // Refresh search to show new appointment with progress bar
          handleSearch(new Event('submit'));
          setShowBooking(false);
          setBookingForm({ patient_name: '', dept: '', date: '', time_slot: '' });
      }
    } catch (err) { console.error(err); }
    finally { setIsBooking(false); }
  };

  const getStepIndex = (status) => STATUS_STEPS.indexOf(status);

  const ProgressBar = ({ status }) => {
    const currentStep = getStepIndex(status);
    return (
      <div className="w-full py-6">
        <div className="flex items-center justify-between relative">
          {/* Background Line */}
          <div className="absolute top-5 left-[10%] right-[10%] h-1 bg-gray-200 rounded-full"></div>
          <div className="absolute top-5 left-[10%] h-1 bg-[#008080] rounded-full transition-all duration-700" style={{ width: `${(currentStep / (STATUS_STEPS.length - 1)) * 80}%` }}></div>

          {STATUS_STEPS.map((step, idx) => (
            <div key={step} className="flex flex-col items-center relative z-10 flex-1">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg shadow-md transition-all duration-500 ${
                idx <= currentStep
                  ? 'bg-[#008080] text-white scale-110 shadow-[#008080]/30'
                  : 'bg-gray-100 text-gray-400 border-2 border-gray-200'
              }`}>
                {STATUS_ICONS[step]}
              </div>
              <span className={`text-[10px] font-black uppercase tracking-wider mt-2 ${
                idx <= currentStep ? 'text-[#008080]' : 'text-gray-400'
              }`}>{STATUS_LABELS[step]}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#f4f7f6] py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Live Queue Ticker */}
        <div className="bg-secondary-blue text-white overflow-hidden rounded-2xl shadow-lg border border-white/10">
          <div className="flex items-center px-6 py-3 bg-white/5 border-b border-white/10">
            <span className="flex items-center text-[10px] font-black uppercase tracking-[0.2em] text-primary-blue">
               <span className="w-2 h-2 rounded-full bg-primary-blue animate-ping mr-2"></span>
               Live Queue Ticker
            </span>
          </div>
          <div className="flex whitespace-nowrap animate-marquee py-4 px-6 items-center space-x-12">
            {Object.entries(queueStatus).map(([dept, mins]) => (
              <span key={dept} className="text-sm font-bold">{dept}: <span className="text-primary-blue">{mins} mins wait</span></span>
            ))}
            {Object.entries(queueStatus).map(([dept, mins]) => (
              <span key={`dup-${dept}`} className="text-sm font-bold">{dept}: <span className="text-primary-blue">{mins} mins wait</span></span>
            ))}
          </div>
        </div>

        {/* Header */}
        <div className="bg-white rounded-3xl p-10 shadow-xl border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="space-y-2 text-center md:text-left">
             <h1 className="text-4xl font-black text-secondary-blue tracking-tight">Patient Portal</h1>
             <p className="text-text-muted font-bold text-lg italic">Book, Track & Verify Appointments</p>
          </div>
          <button onClick={() => setShowBooking(!showBooking)} className="px-8 py-4 bg-[#008080] text-white rounded-2xl font-black shadow-lg shadow-[#008080]/20 hover:scale-105 active:scale-95 transition-all">
            {showBooking ? '← Back to Tracking' : '+ Book Appointment'}
          </button>
        </div>

        {/* Booking Success Toast */}
        {bookingSuccess && (
          <div className="animate-fade-in bg-emerald-50 border border-emerald-200 rounded-2xl p-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-3xl">✅</span>
              <div>
                <div className="font-black text-emerald-800">Appointment Booked Successfully!</div>
                <div className="text-sm text-emerald-600 font-medium">Confirmation: {bookingSuccess.confirmationNumber}</div>
              </div>
            </div>
            <button onClick={() => setBookingSuccess(null)} className="text-emerald-400 hover:text-emerald-600 font-bold text-xl">✕</button>
          </div>
        )}

        {showBooking ? (
          /* ===== BOOKING FORM ===== */
          <div className="bg-white rounded-[32px] p-10 shadow-xl border border-gray-100 max-w-2xl mx-auto animate-fade-in">
            <h2 className="text-2xl font-black text-secondary-blue mb-8 flex items-center gap-3">
              <span className="w-10 h-10 bg-[#008080]/10 rounded-xl flex items-center justify-center text-xl">📅</span>
              New Appointment
            </h2>
            <form onSubmit={handleBook} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-[11px] font-black text-text-muted uppercase tracking-wider mb-2 block">Patient Name</label>
                  <input required value={bookingForm.patient_name} onChange={e => setBookingForm(p => ({...p, patient_name: e.target.value}))} className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent focus:border-[#008080] focus:bg-white rounded-2xl font-bold text-secondary-blue outline-none transition-all" placeholder="Full name" />
                </div>
                <div>
                  <label className="text-[11px] font-black text-text-muted uppercase tracking-wider mb-2 block">Phone Number</label>
                  <input required value={phone} onChange={e => setPhone(e.target.value)} className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent focus:border-[#008080] focus:bg-white rounded-2xl font-bold text-secondary-blue outline-none transition-all" placeholder="10-digit number" />
                </div>
                <div>
                  <label className="text-[11px] font-black text-text-muted uppercase tracking-wider mb-2 block">Department</label>
                  <select required value={bookingForm.dept} onChange={e => setBookingForm(p => ({...p, dept: e.target.value}))} className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent focus:border-[#008080] focus:bg-white rounded-2xl font-bold text-secondary-blue outline-none transition-all">
                    <option value="">Select...</option>
                    {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-black text-text-muted uppercase tracking-wider mb-2 block">Date</label>
                  <input required type="date" value={bookingForm.date} onChange={e => setBookingForm(p => ({...p, date: e.target.value}))} className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent focus:border-[#008080] focus:bg-white rounded-2xl font-bold text-secondary-blue outline-none transition-all" />
                </div>
                <div className="md:col-span-2">
                  <label className="text-[11px] font-black text-text-muted uppercase tracking-wider mb-2 block">Time Slot</label>
                  <select required value={bookingForm.time_slot} onChange={e => setBookingForm(p => ({...p, time_slot: e.target.value}))} className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent focus:border-[#008080] focus:bg-white rounded-2xl font-bold text-secondary-blue outline-none transition-all">
                    <option value="">Select...</option>
                    <option value="09:00 AM">09:00 AM</option>
                    <option value="09:30 AM">09:30 AM</option>
                    <option value="10:00 AM">10:00 AM</option>
                    <option value="10:30 AM">10:30 AM</option>
                    <option value="11:00 AM">11:00 AM</option>
                    <option value="11:30 AM">11:30 AM</option>
                    <option value="02:00 PM">02:00 PM</option>
                    <option value="02:30 PM">02:30 PM</option>
                    <option value="03:00 PM">03:00 PM</option>
                  </select>
                </div>
              </div>
              <button type="submit" disabled={isBooking} className="w-full py-5 bg-[#008080] text-white rounded-2xl font-black text-lg shadow-xl shadow-[#008080]/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50">
                {isBooking ? 'Booking...' : 'Confirm Appointment'}
              </button>
            </form>
          </div>
        ) : (
          /* ===== TRACKING VIEW ===== */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: Search */}
            <div className="lg:col-span-1 space-y-8">
              <div className="bg-white rounded-[32px] p-8 shadow-lg border border-gray-100">
                <h2 className="text-xl font-black text-secondary-blue mb-6 flex items-center">
                  <svg className="w-6 h-6 mr-3 text-[#008080]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                  Find Appointment
                </h2>
                <form onSubmit={handleSearch} className="space-y-4">
                  <div>
                    <label className="text-[11px] font-black text-text-muted uppercase tracking-wider ml-1 mb-2 block">Phone Number</label>
                    <input type="text" placeholder="e.g. 9876543210" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent focus:border-[#008080] focus:bg-white rounded-2xl transition-all font-bold text-secondary-blue outline-none" />
                  </div>
                  <button disabled={isSearching} className="w-full py-4 bg-[#008080] text-white rounded-2xl font-black shadow-lg shadow-[#008080]/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50">
                    {isSearching ? 'Searching...' : 'Track My Appointment'}
                  </button>
                </form>
              </div>

              {/* List of appointments for this phone */}
              {appointments.length > 1 && (
                <div className="bg-white rounded-[32px] p-6 shadow-lg border border-gray-100">
                  <h3 className="text-sm font-black text-secondary-blue mb-4 uppercase tracking-wider">Your Appointments ({appointments.length})</h3>
                  <div className="space-y-3">
                    {appointments.map(apt => (
                      <button key={apt.id} onClick={() => setSelectedApt(apt)} className={`w-full text-left p-4 rounded-2xl transition-all border-2 ${selectedApt?.id === apt.id ? 'border-[#008080] bg-[#008080]/5' : 'border-transparent bg-gray-50 hover:bg-gray-100'}`}>
                        <div className="font-black text-secondary-blue text-sm">{apt.doctor_name || 'Consultation'}</div>
                        <div className="text-xs text-text-muted font-medium">{apt.time_slot}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="bg-secondary-blue text-white rounded-[32px] p-8 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16"></div>
                <h3 className="text-lg font-black mb-4">Patient Support</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-4"><div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">📞</div><div className="text-sm font-bold">1800-425-XXXX</div></div>
                  <div className="flex items-center gap-4"><div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">💬</div><div className="text-sm font-bold">Chat with Concierge</div></div>
                </div>
              </div>
            </div>

            {/* Right: Results */}
            <div className="lg:col-span-2">
              {selectedApt ? (
                <div className="animate-fade-in bg-white rounded-[40px] shadow-2xl overflow-hidden border border-gray-100">
                  <div className="bg-gradient-to-r from-[#008080] to-primary-blue p-10 text-white flex justify-between items-center">
                    <div>
                      <div className="text-xs font-black uppercase tracking-[0.2em] opacity-80 mb-2">Electronic Appointment Pass</div>
                      <h2 className="text-3xl font-black tracking-tight">{selectedApt.appointment_id || selectedApt.id}</h2>
                    </div>
                    <div className="px-4 py-2 bg-white/20 backdrop-blur-md rounded-xl font-black uppercase text-xs">
                      {STATUS_LABELS[selectedApt.status] || selectedApt.status}
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="px-10 pt-6">
                    <ProgressBar status={selectedApt.status} />
                  </div>
                  
                  <div className="p-10 pt-4 grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <div className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-1">Doctor Name</div>
                          <div className="text-lg font-black text-secondary-blue">{selectedApt.doctor_name || 'Assigned on arrival'}</div>
                        </div>
                        <div>
                          <div className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-1">Status</div>
                          <div className="text-lg font-black text-[#008080]">{selectedApt.status}</div>
                        </div>
                        <div className="col-span-2">
                          <div className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-1">Time Slot</div>
                          <div className="text-lg font-black text-secondary-blue">{selectedApt.time_slot}</div>
                        </div>
                      </div>
                      <div className="pt-6 border-t border-gray-100 flex items-center gap-6">
                        <button className="bg-gray-100 hover:bg-gray-200 text-secondary-blue px-6 py-3 rounded-xl font-bold text-sm transition-all">Download PDF</button>
                        <button className="text-[#008080] font-black text-sm hover:underline">Request Reschedule</button>
                      </div>
                    </div>

                    <div className="flex flex-col items-center justify-center space-y-6 bg-gray-50 p-8 rounded-[32px] border border-dashed border-gray-200">
                      <div className="bg-white p-4 rounded-3xl shadow-lg">
                        <QRCodeSVG 
                          value={JSON.stringify({
                            patient_id: selectedApt.patient_id, 
                            current_appointment_id: selectedApt.appointment_id
                          })} 
                          size={160} 
                        />
                      </div>
                      <div className="text-center">
                         <div className="text-sm font-black text-secondary-blue mb-1">Digital QR Pass</div>
                         <div className="text-[10px] font-bold text-text-muted">Scan at OPD reception for quick entry</div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-full min-h-[500px] bg-white/50 backdrop-blur-sm border-4 border-dashed border-gray-200 rounded-[40px] flex flex-col items-center justify-center text-center p-12">
                   <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mb-8 text-5xl grayscale opacity-50">📂</div>
                   <h3 className="text-2xl font-black text-secondary-blue mb-2 opacity-50">No Data Displayed</h3>
                   <p className="max-w-md text-text-muted font-bold opacity-60">Enter your phone number to track your appointments, or click "Book Appointment" to create a new one.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: inline-flex;
          animation: marquee 20s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default PatientPortal;
