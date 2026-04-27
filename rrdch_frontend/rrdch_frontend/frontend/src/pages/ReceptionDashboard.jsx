import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import { useLanguage } from '../utils/i18n';

const SOCKET_URL = 'http://localhost:5000';
const API_URL = 'http://localhost:5000/api';

const DEPARTMENTS = [
  { id: 1, name: 'Oral Medicine & Radiology' },
  { id: 2, name: 'Prosthetics & Crown & Bridge' },
  { id: 3, name: 'Oral & Maxillofacial Surgery' },
  { id: 4, name: 'Periodontology' },
  { id: 5, name: 'Pedodontics & Preventive Dentistry' },
  { id: 6, name: 'Conservative Dentistry & Endodontics' },
  { id: 7, name: 'Orthodontics & Dentofacial Orthopedics' },
  { id: 8, name: 'Public Health Dentistry' },
  { id: 9, name: 'Oral & Maxillofacial Pathology' },
  { id: 10, name: 'Implantology' },
  { id: 11, name: 'Orofacial Pain' }
];

const STATUS_FLOW = ['scheduled', 'confirmed', 'in_queue', 'treatment'];
const STATUS_COLORS = {
  scheduled: 'text-blue-500 bg-blue-50 border-blue-100',
  confirmed: 'text-emerald-500 bg-emerald-50 border-emerald-100',
  in_queue: 'text-amber-500 bg-amber-50 border-amber-100',
  treatment: 'text-purple-500 bg-purple-50 border-purple-100',
};

const ReceptionDashboard = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [selectedDept, setSelectedDept] = useState('');
  const [appointments, setAppointments] = useState([]);
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [notification, setNotification] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [showSuccessOverlay, setShowSuccessOverlay] = useState(false);
  const [confirmedDoctor, setConfirmedDoctor] = useState('');
  const [scannedData, setScannedData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('current');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  useEffect(() => {
    const s = io(SOCKET_URL);
    s.on('connect', () => setIsConnected(true));
    s.on('disconnect', () => setIsConnected(false));
    setSocket(s);
    return () => s.disconnect();
  }, []);

  const fetchDeptAppointments = useCallback(async (dept) => {
    try {
      const res = await fetch(`${API_URL}/erp/appointments/department/${encodeURIComponent(dept)}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.appointments)) {
        setAppointments(data.appointments);
      } else {
        setAppointments([]);
      }
    } catch (err) { console.error(err); }
  }, []);

  useEffect(() => {
    if (!socket || !selectedDept) return;
    socket.emit('join_department', selectedDept);
    fetchDeptAppointments(selectedDept);

    const handleNew = (apt) => {
      setAppointments(prev => [apt, ...prev]);
      setNotification(`New arrival: ${apt.patient_name}`);
      setTimeout(() => setNotification(null), 4000);
    };
    socket.on('PATIENT_ARRIVED', handleNew);
    return () => {
      socket.off('PATIENT_ARRIVED', handleNew);
    };
  }, [socket, selectedDept, fetchDeptAppointments]);

  const handleSimulateScan = async () => {
    const scanResult = prompt("Simulate QR Scan:", '{"phone": "9876543210", "aptId": "APT-XYZ"}');
    if (!scanResult) return;
    try {
      const data = JSON.parse(scanResult);
      setIsScanning(true);
      const res = await fetch(`${API_URL}/reception/check-in?phone=${data.phone}`);
      const responseData = await res.json();
      if (responseData.success && responseData.appointment) {
          setScannedData({ ...responseData, id: data.aptId || responseData.appointment.id });
          setIsModalOpen(true);
      } else {
        alert("No active appointment found.");
      }
    } catch (err) {
      alert("Invalid QR Payload");
    } finally { setIsScanning(false); }
  };

  const handleConfirmArrival = async () => {
    try {
        const res = await fetch(`${API_URL}/appointments/${scannedData.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: 'in_queue' })
        });
        if ((await res.json()).success) {
            socket.emit('PATIENT_ARRIVED', { id: scannedData.id, patient_name: scannedData.appointment.patient_name, doctor: scannedData.appointment.doctor });
            setConfirmedDoctor(scannedData.appointment.doctor);
            setShowSuccessOverlay(true);
            setIsModalOpen(false);
            setTimeout(() => { setShowSuccessOverlay(false); setScannedData(null); }, 3000);
        }
    } catch (err) { alert("Check-in failed"); }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-12 text-slate-900 pb-24 md:pb-12">
      <div className="max-w-[1440px] mx-auto">
        <header className="mb-10 md:mb-16 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-3 h-3 bg-teal-500 rounded-full animate-pulse shadow-lg shadow-teal-500/50"></div>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-teal-600">{t('reception.active')}</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase">{t('reception.title')}</h1>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={handleSimulateScan}
              disabled={isScanning}
              className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-black shadow-lg shadow-emerald-500/20 flex items-center gap-2 transition-all active:scale-95"
            >
              <span className="text-xl">📷</span>
              {isScanning ? 'Processing...' : 'Scan Patient QR'}
            </button>
            {(user?.role === 'admin' || user?.role === 'super_admin') && (
              <button
                onClick={() => navigate('/staff/management')}
                className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-2xl font-black shadow-lg shadow-blue-500/20 flex items-center gap-2 transition-all active:scale-95"
              >
                Manage Staff
              </button>
            )}
            <div className="bg-white/5 border border-white/10 rounded-2xl px-6 py-3 backdrop-blur-md">
              <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Reception Access Only</div>
              <div className="text-lg font-black font-mono text-amber-400">RRDCH-STAFF</div>
            </div>
          </div>
        </header>

        {notification && (
          <div className="mb-6 px-6 py-4 bg-teal-50 border border-teal-200 rounded-2xl text-teal-700 font-black text-sm animate-pulse">
            🔔 {notification}
          </div>
        )}

        <div className="mb-12">
          <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-6 block">{t('reception.selectDeptQueue')}</label>
          <div className="flex flex-wrap gap-4">
            {DEPARTMENTS.map(dept => (
              <button
                key={dept.id}
                onClick={() => setSelectedDept(dept.name)}
                className={`px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${
                  selectedDept === dept.name ? 'bg-teal-500 text-white shadow-xl shadow-teal-500/30 scale-105' : 'bg-white text-slate-400 border border-slate-100 hover:border-teal-200'
                }`}
              >
                {t(`deptNames.${dept.id}`)}
              </button>
            ))}
          </div>
        </div>

        {selectedDept && (
          <div className="glass-panel rounded-[48px] overflow-hidden border border-white/30 shadow-2xl bg-white/40 relative">
            <div className="absolute inset-0 teal-bloom opacity-10 pointer-events-none"></div>
            <div className="px-6 md:px-12 py-6 md:py-10 border-b border-white/20 bg-white/20 backdrop-blur-md">
               <h2 className="text-2xl md:text-3xl font-black tracking-tighter uppercase">
                 {DEPARTMENTS.find(d => d.name === selectedDept) ? t(`deptNames.${DEPARTMENTS.find(d => d.name === selectedDept).id}`) : selectedDept} {t('reception.queue')}
               </h2>
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 bg-white/50">
                    <th className="px-12 py-6">{t('reception.patient')}</th>
                    <th className="px-12 py-6">{t('reception.reporting')}</th>
                    <th className="px-12 py-6">{t('reception.status')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100/50">
                  {appointments.map((apt, i) => (
                    <tr key={apt.id} className={`tactile-row ${i % 2 === 0 ? 'bg-white/30' : 'bg-transparent'}`}>
                      <td className="px-12 py-8 font-black text-slate-900">{apt.patient_name}</td>
                      <td className="px-12 py-8 text-sm font-bold text-slate-400">{apt.time_slot}</td>
                      <td className="px-12 py-8">
                        <span className={`px-4 py-2 rounded-full text-[9px] font-black uppercase border ${STATUS_COLORS[apt.status] || ''}`}>
                          {t(`reception.${apt.status}`) !== `reception.${apt.status}` ? t(`reception.${apt.status}`) : apt.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards View */}
            <div className="md:hidden flex flex-col gap-4 p-4">
              {appointments.map((apt) => (
                 <div key={apt.id} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col gap-4 relative">
                    <div className="flex justify-between items-start">
                       <div>
                          <div className="font-black text-xl text-slate-900 uppercase tracking-tight">{apt.patient_name}</div>
                          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">ID: {apt.id}</div>
                       </div>
                       <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase border ${STATUS_COLORS[apt.status] || ''}`}>
                          {t(`reception.${apt.status}`) !== `reception.${apt.status}` ? t(`reception.${apt.status}`) : apt.status}
                       </span>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                       <div className="px-4 py-2 bg-slate-50 rounded-xl font-black text-slate-600 text-xs">
                         {apt.time_slot}
                       </div>
                    </div>
                 </div>
              ))}
            </div>

            {appointments.length === 0 && (
              <div className="py-24 text-center">
                <div className="text-6xl mb-4 opacity-20">🏥</div>
                <p className="font-black text-slate-300 uppercase tracking-widest">Queue is empty</p>
              </div>
            )}
          </div>
        )}
      </div>

      {isModalOpen && scannedData && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-2xl" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative glass-panel bg-white/70 border border-white/50 w-full max-w-2xl rounded-[56px] shadow-2xl overflow-hidden animate-scale-up">
             <div className="p-12 bg-slate-900 text-white flex justify-between items-center">
                <div>
                   <h2 className="text-4xl font-black tracking-tighter uppercase">{scannedData.appointment.patient_name}</h2>
                   <p className="text-teal-400 font-bold uppercase text-[10px] tracking-widest mt-1">{t('reception.verificationHash')} {scannedData.appointment.hash || 'Verified'}</p>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center font-black">✕</button>
             </div>

             <div className="p-12 space-y-10">
                <div className="grid grid-cols-2 gap-8">
                   <div className="bg-slate-50 p-8 rounded-[32px] border border-slate-100">
                      <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{t('reception.clinicalArea')}</div>
                      <div className="text-xl font-black text-teal-600 uppercase">
                        {DEPARTMENTS.find(d => d.name === scannedData.appointment.department) ? t(`deptNames.${DEPARTMENTS.find(d => d.name === scannedData.appointment.department).id}`) : scannedData.appointment.department}
                      </div>
                   </div>
                   <div className="bg-slate-50 p-8 rounded-[32px] border border-slate-100">
                      <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{t('reception.assignedDoctor')}</div>
                      <div className="text-xl font-black text-slate-900 uppercase">{scannedData.appointment.doctor}</div>
                   </div>
                </div>

                <div className="space-y-6">
                   <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('reception.historyHandshake')}</h4>
                   <div className="space-y-3">
                      {scannedData.history.map((h, i) => (
                        <div key={i} className="flex justify-between items-center p-5 bg-white rounded-2xl border border-slate-100 shadow-sm">
                           <span className="font-black text-slate-900 text-sm">{h.diagnosis || 'General Checkup'}</span>
                           <span className="text-[10px] font-bold text-slate-400 uppercase">{h.past_visit_date}</span>
                        </div>
                      ))}
                      {scannedData.history.length === 0 && <div className="text-center py-10 font-black text-slate-300 uppercase tracking-widest">{t('reception.firstVisit')}</div>}
                   </div>
                </div>

                <button
                  onClick={handleConfirmArrival}
                  className="w-full py-8 bg-teal-500 text-white rounded-[32px] font-black text-2xl uppercase tracking-tighter shadow-2xl shadow-teal-500/40 hover:scale-105 active:scale-95 transition-all"
                >
                  {t('reception.confirmArrival')}
                </button>
             </div>
          </div>
        </div>
      )}

      {showSuccessOverlay && (
        <div className="fixed inset-0 z-[1000] bg-teal-500 flex flex-col items-center justify-center text-white animate-fade-in p-10 text-center">
           <div className="text-[150px] animate-bounce">✅</div>
           <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-4">{t('reception.checkInSuccess')}</h1>
           <p className="text-2xl font-bold opacity-80 uppercase tracking-widest">{t('reception.proceedToCabin')} {confirmedDoctor}</p>
        </div>
      )}

      <style>{`
        .glass-panel { backdrop-filter: blur(25px); }
        .teal-bloom { background: radial-gradient(circle at center, rgba(0, 128, 128, 0.1), transparent 70%); }
        .tactile-row:hover { transform: translateX(10px); background: rgba(0, 128, 128, 0.05) !important; box-shadow: -5px 0 0 #008080; }
        .animate-scale-up { animation: scaleUp 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
        @keyframes scaleUp { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1); } }
      `}</style>
    </div>
  );
};

export default ReceptionDashboard;
