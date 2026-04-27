import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { useLanguage } from '../utils/i18n';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const DoctorConsole = () => {
  const { t } = useLanguage();
  const [appointments, setAppointments] = useState([]);
  const [activeDoctor, setActiveDoctor] = useState({ id: 'DOC-101', name: 'Dr. Sarah (Oral Surgery)' });
  const [newArrivalId, setNewArrivalId] = useState(null);
  const [dutySchedule, setDutySchedule] = useState([]);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000); // Polling as fallback

    const socket = io(SOCKET_URL, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 10
    });
    
    socket.on('connect', () => {
      console.log('✅ Socket.io Connected:', socket.id);
      setConnected(true);
    });

    socket.on('disconnect', () => {
      console.log('❌ Socket.io Disconnected');
      setConnected(false);
    });

    socket.on('connect_error', (err) => {
      console.error('Socket Connection Error:', err);
    });
    
    // Join department room for live updates
    socket.emit('join_department', 'Oral Surgery'); 

    const handleUpdate = (data) => {
      console.log('Received appointment_update:', data);
      fetchData();
    };

    const handleCreated = (data) => {
      console.log('Received appointment_created:', data);
      fetchData();
      
      // Clinical alert sound
      const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2358/2358-preview.mp3');
      audio.play().catch(e => console.log('Sound blocked'));
    };

    const handleArrived = (data) => {
      console.log('Live Arrival Event (PATIENT_ARRIVED):', data);
      setNewArrivalId(data.id);
      fetchData();
      setTimeout(() => setNewArrivalId(null), 10000);
    };

    socket.on('appointment_update', handleUpdate);
    socket.on('appointment_created', handleCreated);
    socket.on('PATIENT_ARRIVED', handleArrived);
    socket.on('test_event', (data) => {
      console.log('Test Event Received:', data);
      alert('Socket Connection Verified: ' + data.message);
    });
    
    return () => {
      clearInterval(interval);
      socket.off('appointment_update', handleUpdate);
      socket.off('appointment_created', handleCreated);
      socket.off('PATIENT_ARRIVED', handleArrived);
      socket.disconnect();
    };
  }, []);

  const fetchData = async () => {
    try {
      const [aptRes, scheduleRes] = await Promise.all([
        fetch(`${API_URL}/doctor/appointments?doctor_id=${activeDoctor.id}`),
        fetch(`${API_URL}/doctor/duty-schedule`)
      ]);
      const aptData = await aptRes.json();
      const scheduleData = await scheduleRes.json();
      
      if (aptData.success) setAppointments(aptData.appointments);
      if (scheduleData.success) setDutySchedule(scheduleData.schedule);
    } catch (err) {
      console.error('Fetch Error:', err);
    }
  };

  const callNextPatient = async (id) => {
    try {
      const res = await fetch(`${API_URL}/doctor/call-next/${id}`, {
        method: 'PATCH'
      });
      const data = await res.json();
      if (data.success) {
        fetchData();
      }
    } catch (err) {
      console.error('Call Error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-8">
      {/* Navbar Integration Area - Keeping the console native looking */}
      <div className="max-w-[1440px] mx-auto mb-12 flex justify-between items-center">
        <div className="flex items-center gap-4">
           <div className="relative">
              <div className="flex items-center gap-3 mb-3">
                 <div className={`w-3 h-3 rounded-full shadow-[0_0_10px_rgba(0,206,209,0.8)] ${connected ? 'bg-teal-500 animate-pulse' : 'bg-rose-500'}`}></div>
                 <span className={`text-[10px] font-black uppercase tracking-[0.3em] ${connected ? 'text-teal-600' : 'text-rose-600'}`}>
                   {connected ? t('doctorConsole.liveSession') : t('doctorConsole.offline')}
                 </span>
              </div>
              <h1 className="text-5xl font-black tracking-tighter text-slate-900 uppercase">{t('doctorConsole.title')}</h1>
              <p className="text-slate-400 font-bold mt-1 uppercase text-[11px] tracking-widest">{t('doctorConsole.integratedSystems')}</p>
           </div>
           <div className="glass-panel p-6 rounded-[32px] flex items-center gap-6 border-white/40 shadow-xl teal-bloom">
              <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center text-white text-4xl">👩‍⚕️</div>
              <div>
                <div className="text-[10px] font-black uppercase text-teal-600 tracking-widest mb-1">{t('doctorConsole.authenticatedProvider')}</div>
                <div className="text-xl font-black tracking-tight">{activeDoctor.name}</div>
              </div>
           </div>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Queue Area */}
          <div className="lg:col-span-2 space-y-8">
            <div className="glass-panel rounded-[48px] overflow-hidden border border-white/30 shadow-2xl relative bg-white/40">
              <div className="absolute inset-0 teal-bloom opacity-20 pointer-events-none"></div>

              <div className="px-12 py-10 border-b border-white/20 flex justify-between items-center backdrop-blur-md bg-white/20">
                <div>
                   <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase">{t('doctorConsole.waitingRoom')}</h2>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{t('doctorConsole.realTimeFlow')}</p>
                </div>
                <div className="px-6 py-3 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest">
                  {appointments.length} {t('doctorConsole.queued')}
                </div>
              </div>

              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 bg-white/50">
                      <th className="px-12 py-6">{t('doctorConsole.status')}</th>
                      <th className="px-12 py-6">{t('doctorConsole.patientDetails')}</th>
                      <th className="px-12 py-6">{t('doctorConsole.reportingTime')}</th>
                      <th className="px-12 py-6 text-right">{t('doctorConsole.action')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100/50">
                    {appointments.map((apt, idx) => (
                      <tr 
                        key={apt.id} 
                        className={`tactile-row ${idx % 2 === 0 ? 'bg-white/30' : 'bg-transparent'} group transition-all relative`}
                      >
                        <td className="px-12 py-10">
                           <div className={`w-4 h-4 rounded-full ${apt.status === 'in_progress' ? 'bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.5)]' : 'bg-amber-400'} animate-pulse`}></div>
                        </td>
                        <td className="px-12 py-10">
                          <div className="font-black text-xl text-slate-900 uppercase tracking-tight group-hover:text-teal-600 transition-colors">
                            {apt.patient_name}
                          </div>
                          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">ID: {apt.id}</div>
                        </td>
                        <td className="px-12 py-10">
                           <div className="px-6 py-3 bg-white/60 rounded-2xl border border-white/40 inline-block font-black text-slate-600 text-sm tracking-tight shadow-sm">
                             {apt.time_slot}
                           </div>
                        </td>
                        <td className="px-12 py-10 text-right">
                          <button
                            onClick={() => callNextPatient(apt.id)}
                            className={`px-10 py-5 rounded-[24px] font-black text-xs uppercase tracking-[0.2em] transition-all shadow-xl ${
                              newArrivalId === apt.id 
                                ? 'bg-teal-500 text-white animate-bounce shadow-teal-500/40 scale-105' 
                                : 'bg-slate-900 text-white hover:bg-teal-600 shadow-slate-900/20 active:scale-95'
                            }`}
                          >
                            {newArrivalId === apt.id ? t('doctorConsole.callNow') : t('doctorConsole.callPatient')}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards View */}
              <div className="md:hidden flex flex-col gap-4 p-4">
                {appointments.map((apt, idx) => (
                   <div key={apt.id} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col gap-4 relative">
                      <div className="flex justify-between items-start">
                         <div>
                            <div className="font-black text-xl text-slate-900 uppercase tracking-tight">{apt.patient_name}</div>
                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">ID: {apt.id}</div>
                         </div>
                         <div className={`w-3 h-3 rounded-full ${apt.status === 'in_progress' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-400'}`}></div>
                      </div>
                      
                      <div className="flex items-center justify-between mt-2">
                         <div className="px-4 py-2 bg-slate-50 rounded-xl font-black text-slate-600 text-xs">
                           {apt.time_slot}
                         </div>
                      </div>

                      <button
                        onClick={() => callNextPatient(apt.id)}
                        className={`w-full py-4 mt-2 rounded-[20px] font-black text-xs uppercase tracking-[0.2em] transition-all shadow-md ${
                          newArrivalId === apt.id 
                            ? 'bg-teal-500 text-white animate-bounce' 
                            : 'bg-slate-900 text-white hover:bg-teal-600'
                        }`}
                      >
                        {newArrivalId === apt.id ? t('doctorConsole.callNow') : t('doctorConsole.callPatient')}
                      </button>
                   </div>
                ))}
              </div>

              {appointments.length === 0 && (
                <div className="py-32 text-center">
                   <div className="text-7xl mb-6 opacity-20 grayscale">🛌</div>
                   <h3 className="text-2xl font-black text-slate-300 uppercase tracking-widest">{t('doctorConsole.zeroPatientsTitle')}</h3>
                   <p className="text-slate-400 font-bold mt-2">{t('doctorConsole.zeroPatientsDesc')}</p>
                </div>
              )}
            </div>
          </div>

          {/* Duty Schedule Sidebar */}
          <div className="space-y-8">
            <div className="glass-panel p-10 rounded-[48px] border-white/40 shadow-2xl relative bg-white/40">
              <div className="absolute inset-0 teal-bloom opacity-20 pointer-events-none"></div>
              <h3 className="text-sm font-black uppercase text-slate-400 tracking-[0.25em] mb-10">{t('doctorConsole.teamOnDuty')}</h3>
              <div className="space-y-8">
                {dutySchedule.map(doc => (
                  <div key={doc.id} className="flex items-center justify-between group cursor-default">
                    <div className="flex items-center gap-5">
                      <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-xl shadow-md group-hover:scale-110 transition-transform">🎓</div>
                      <div>
                        <div className="font-black text-slate-900 tracking-tight">{doc.doctor}</div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{doc.dept}</div>
                      </div>
                    </div>
                    <div className={`text-[9px] font-black uppercase px-3 py-1 rounded-full border ${
                      doc.status === 'Available' ? 'border-emerald-200 text-emerald-600 bg-emerald-50/50' : 'border-amber-200 text-amber-600 bg-amber-50/50'
                    }`}>
                      {doc.status}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-900 p-10 rounded-[48px] text-white shadow-2xl relative overflow-hidden group">
               <div className="absolute -top-10 -right-10 w-40 h-40 bg-teal-500/20 rounded-full blur-3xl group-hover:bg-teal-500/40 transition-all duration-700"></div>
               <div className="relative z-10">
                 <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-teal-400 mb-2">{t('doctorConsole.shiftInsights')}</h3>
                 <div className="text-3xl font-black tracking-tighter mb-4">{t('doctorConsole.avgWait')}</div>
                 <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                    <span className="text-emerald-400">↑ 12%</span> {t('doctorConsole.fasterYesterday')}
                 </div>
               </div>
            </div>
          </div>

        </div>
      </div>

      <style>{`
        .glass-panel {
          backdrop-filter: blur(25px);
          -webkit-backdrop-filter: blur(25px);
        }
        .teal-bloom {
          background: radial-gradient(circle at center, rgba(0, 128, 128, 0.15), transparent 70%);
        }
        .tactile-row:hover {
          transform: translateX(10px);
          background: rgba(0, 128, 128, 0.05) !important;
          box-shadow: -5px 0 0 #008080;
        }
      `}</style>
    </div>
  );
};

export default DoctorConsole;
