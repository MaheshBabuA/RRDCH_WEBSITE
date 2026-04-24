import React, { useState, useEffect, useCallback } from 'react';
import { io } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:4000';
const API_URL = 'http://localhost:4000/api';

const DEPARTMENTS = [
  'Oral Surgery', 'Orthodontics', 'Periodontics', 'Prosthodontics',
  'Conservative Dentistry', 'Pedodontics', 'Oral Medicine', 'Oral Pathology'
];

const STATUS_FLOW = ['scheduled', 'confirmed', 'in_queue', 'treatment'];
const STATUS_LABELS = { scheduled: 'Scheduled', confirmed: 'Confirmed', in_queue: 'In Queue', treatment: 'Treatment' };
const STATUS_COLORS = {
  scheduled: 'bg-blue-100 text-blue-700 border-blue-200',
  confirmed: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  in_queue: 'bg-amber-100 text-amber-700 border-amber-200',
  treatment: 'bg-purple-100 text-purple-700 border-purple-200',
};

const DoctorDashboard = () => {
  const [selectedDept, setSelectedDept] = useState('');
  const [appointments, setAppointments] = useState([]);
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [notification, setNotification] = useState(null);

  // Connect socket on mount
  useEffect(() => {
    const s = io(SOCKET_URL);
    s.on('connect', () => setIsConnected(true));
    s.on('disconnect', () => setIsConnected(false));
    setSocket(s);
    return () => s.disconnect();
  }, []);

  // Join department room & fetch data when dept changes
  const fetchDeptAppointments = useCallback(async (dept) => {
    try {
      const res = await fetch(`${API_URL}/appointments/department/${encodeURIComponent(dept)}`);
      const data = await res.json();
      setAppointments(data);
    } catch (err) { console.error(err); }
  }, []);

  useEffect(() => {
    if (!socket || !selectedDept) return;

    socket.emit('join_department', selectedDept);
    fetchDeptAppointments(selectedDept);

    const handleNew = (apt) => {
      setAppointments(prev => [apt, ...prev]);
      setNotification(`New appointment: ${apt.patient_name}`);
      setTimeout(() => setNotification(null), 4000);
    };

    const handleStatusUpdate = ({ id, status }) => {
      setAppointments(prev => prev.map(a => a.id === id ? { ...a, status } : a));
    };

    socket.on('new_appointment', handleNew);
    socket.on('status_update', handleStatusUpdate);

    return () => {
      socket.off('new_appointment', handleNew);
      socket.off('status_update', handleStatusUpdate);
    };
  }, [socket, selectedDept, fetchDeptAppointments]);

  const advanceStatus = async (apt) => {
    const currentIdx = STATUS_FLOW.indexOf(apt.status);
    if (currentIdx >= STATUS_FLOW.length - 1) return;
    const nextStatus = STATUS_FLOW[currentIdx + 1];
    try {
      await fetch(`${API_URL}/appointments/${apt.id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      });
      setAppointments(prev => prev.map(a => a.id === apt.id ? { ...a, status: nextStatus } : a));
    } catch (err) { console.error(err); }
  };

  const countByStatus = (s) => appointments.filter(a => a.status === s).length;

  return (
    <div className="min-h-screen bg-[#0f172a] text-white">
      {/* Notification Toast */}
      {notification && (
        <div className="fixed top-6 right-6 z-50 animate-fade-in bg-emerald-500 text-white px-6 py-4 rounded-2xl shadow-2xl font-bold flex items-center gap-3">
          <span className="w-3 h-3 bg-white rounded-full animate-ping"></span>
          {notification}
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse"></div>
              <span className="text-xs font-black uppercase tracking-[0.2em] text-emerald-400">
                {isConnected ? 'Live Connected' : 'Disconnected'}
              </span>
            </div>
            <h1 className="text-4xl font-black tracking-tight">Doctor Dashboard</h1>
            <p className="text-slate-400 font-medium mt-1">Real-time appointment management & patient flow control</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl px-6 py-3 backdrop-blur-md">
            <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Staff Access Only</div>
            <div className="text-lg font-black font-mono text-amber-400">RRDCH-STAFF</div>
          </div>
        </div>

        {/* Department Selector */}
        <div className="mb-10">
          <label className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3 block">Select Your Department</label>
          <div className="flex flex-wrap gap-3">
            {DEPARTMENTS.map(dept => (
              <button
                key={dept}
                onClick={() => setSelectedDept(dept)}
                className={`px-6 py-3 rounded-2xl font-bold text-sm transition-all ${
                  selectedDept === dept
                    ? 'bg-[#008080] text-white shadow-lg shadow-[#008080]/30 scale-105'
                    : 'bg-white/5 text-slate-300 border border-white/10 hover:bg-white/10'
                }`}
              >
                {dept}
              </button>
            ))}
          </div>
        </div>

        {selectedDept ? (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
              {STATUS_FLOW.map(s => (
                <div key={s} className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md">
                  <div className="text-3xl font-black">{countByStatus(s)}</div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">{STATUS_LABELS[s]}</div>
                </div>
              ))}
            </div>

            {/* Appointments Table */}
            <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-md">
              <div className="px-8 py-5 border-b border-white/10 flex justify-between items-center">
                <h2 className="text-lg font-black">{selectedDept} — Today's Queue</h2>
                <span className="text-xs font-bold text-slate-400">{appointments.length} patients</span>
              </div>

              {appointments.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-white/10 text-xs font-black uppercase tracking-widest text-slate-500">
                        <th className="px-8 py-4">Token</th>
                        <th className="px-8 py-4">Patient</th>
                        <th className="px-8 py-4">Date</th>
                        <th className="px-8 py-4">Time</th>
                        <th className="px-8 py-4">Status</th>
                        <th className="px-8 py-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {appointments.map(apt => (
                        <tr key={apt.id} className="hover:bg-white/5 transition-colors">
                          <td className="px-8 py-5 font-black text-[#008080] text-lg">{apt.token_no}</td>
                          <td className="px-8 py-5">
                            <div className="font-bold">{apt.patient_name}</div>
                            <div className="text-xs text-slate-500">{apt.id}</div>
                          </td>
                          <td className="px-8 py-5 font-medium text-slate-300">{apt.date}</td>
                          <td className="px-8 py-5 font-medium text-slate-300">{apt.time_slot}</td>
                          <td className="px-8 py-5">
                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase border ${STATUS_COLORS[apt.status]}`}>
                              {STATUS_LABELS[apt.status]}
                            </span>
                          </td>
                          <td className="px-8 py-5 text-right">
                            {STATUS_FLOW.indexOf(apt.status) < STATUS_FLOW.length - 1 ? (
                              <button
                                onClick={() => advanceStatus(apt)}
                                className="px-5 py-2.5 bg-[#008080] text-white rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-[#006666] transition-all shadow-lg shadow-[#008080]/20"
                              >
                                → {STATUS_LABELS[STATUS_FLOW[STATUS_FLOW.indexOf(apt.status) + 1]]}
                              </button>
                            ) : (
                              <span className="text-xs font-bold text-emerald-400">✓ Complete</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-20">
                  <div className="text-5xl mb-4 opacity-30">🩺</div>
                  <h3 className="text-xl font-black text-slate-400">No appointments yet</h3>
                  <p className="text-slate-500 font-medium mt-1">Patients will appear here in real-time when they book.</p>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="text-center py-32 bg-white/5 border border-dashed border-white/10 rounded-[40px]">
            <div className="text-6xl mb-6 opacity-30">🏥</div>
            <h3 className="text-2xl font-black text-slate-400">Select a Department</h3>
            <p className="text-slate-500 font-medium mt-2">Choose your department above to view the live patient queue.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorDashboard;
