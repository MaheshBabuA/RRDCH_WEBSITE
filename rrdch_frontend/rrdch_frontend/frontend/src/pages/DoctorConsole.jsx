import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

const API_URL = 'http://localhost:5000/api';
const socket = io('http://localhost:5000');

const DoctorConsole = () => {
  const [appointments, setAppointments] = useState([]);
  const [dutySchedule, setDutySchedule] = useState([]);
  const [activeDoctor, setActiveDoctor] = useState({ id: 'DOC-101', name: 'Dr. Sarah Smith' });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000); // Poll every 30s as fallback
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      const [aptRes, dutyRes] = await Promise.all([
        fetch(`${API_URL}/doctor/appointments?doctor_id=${activeDoctor.id}`),
        fetch(`${API_URL}/doctor/duty-schedule`)
      ]);
      const aptData = await aptRes.json();
      const dutyData = await dutyRes.json();
      
      if (aptData.success) setAppointments(aptData.appointments);
      if (dutyData.success) setDutySchedule(dutyData.schedule);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const callNextPatient = (apt) => {
    // Emit WebSocket event
    socket.emit('next-patient-called', {
      doctor_id: activeDoctor.id,
      doctor_name: activeDoctor.name,
      patient_name: apt.patient_name,
      appointment_id: apt.id
    });
    alert(`Calling patient: ${apt.patient_name}`);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans p-8">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-black text-slate-900">Doctor Console</h1>
            <p className="text-slate-500 font-bold uppercase text-xs tracking-widest mt-1">Live Clinical Dashboard • {activeDoctor.name}</p>
          </div>
          <div className="flex items-center gap-4">
             <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
             <span className="text-xs font-black text-slate-400 uppercase tracking-widest">System Live</span>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Live Appointments */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-[32px] shadow-xl border border-slate-200 overflow-hidden">
              <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">Today's Queue</h2>
                <span className="bg-primary-blue text-white text-[10px] font-black px-3 py-1 rounded-full">{appointments.length} Total</span>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50">
                      <th className="px-8 py-4 text-[10px] font-black uppercase text-slate-400 tracking-widest">Time</th>
                      <th className="px-8 py-4 text-[10px] font-black uppercase text-slate-400 tracking-widest">Patient Name</th>
                      <th className="px-8 py-4 text-[10px] font-black uppercase text-slate-400 tracking-widest text-center">Status</th>
                      <th className="px-8 py-4 text-[10px] font-black uppercase text-slate-400 tracking-widest text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {appointments.map((apt) => (
                      <tr key={apt.id} className="hover:bg-blue-50/30 transition-colors group">
                        <td className="px-8 py-6 font-black text-slate-900 text-sm">{apt.time}</td>
                        <td className="px-8 py-6">
                          <div className="font-bold text-slate-700">{apt.patient_name}</div>
                          <div className="text-[10px] text-slate-400 font-bold uppercase">{apt.id}</div>
                        </td>
                        <td className="px-8 py-6 text-center">
                          <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase ${
                            apt.status === 'confirmed' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'
                          }`}>
                            {apt.status}
                          </span>
                        </td>
                        <td className="px-8 py-6 text-right">
                          <button 
                            onClick={() => callNextPatient(apt)}
                            className="bg-primary-blue text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-700 hover:scale-105 transition-all shadow-lg"
                          >
                            Next Patient
                          </button>
                        </td>
                      </tr>
                    ))}
                    {appointments.length === 0 && (
                      <tr>
                        <td colSpan="4" className="px-8 py-20 text-center text-slate-400 font-bold italic">No appointments scheduled for today.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Duty Schedule Sidebar */}
          <div className="space-y-8">
            <div className="bg-slate-900 text-white rounded-[40px] p-8 shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl"></div>
               <h3 className="text-xl font-black mb-8 relative z-10 flex items-center gap-3">
                 <span>⏰</span>
                 <span>Duty Schedule</span>
               </h3>
               
               <div className="space-y-4 relative z-10">
                 {dutySchedule.map((item) => (
                   <div key={item.id} className="p-5 bg-white/5 rounded-[24px] border border-white/10 hover:bg-white/10 transition-all">
                     <div className="flex justify-between items-start mb-2">
                       <div className="font-bold text-sm">{item.doctor}</div>
                       <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded ${
                         item.status === 'Available' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                       }`}>
                         {item.status}
                       </span>
                     </div>
                     <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.dept}</div>
                   </div>
                 ))}
               </div>
            </div>

            <div className="bg-white rounded-[40px] p-10 border border-slate-200 shadow-xl">
               <div className="w-16 h-16 bg-blue-100 text-3xl rounded-3xl flex items-center justify-center mb-6">🩺</div>
               <h3 className="text-xl font-black text-slate-800 mb-4">Clinical Stats</h3>
               <div className="grid grid-cols-2 gap-4">
                 <div className="p-4 bg-slate-50 rounded-2xl">
                   <div className="text-2xl font-black text-primary-blue">14</div>
                   <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Seen Today</div>
                 </div>
                 <div className="p-4 bg-slate-50 rounded-2xl">
                   <div className="text-2xl font-black text-emerald-500">22m</div>
                   <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Avg Time</div>
                 </div>
               </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default DoctorConsole;
