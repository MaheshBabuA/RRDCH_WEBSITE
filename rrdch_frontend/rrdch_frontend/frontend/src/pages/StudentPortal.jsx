import React, { useState, useEffect, useCallback } from 'react';
import { useLanguage } from '../utils/i18n';
import apiService from '../services/api';
import Card from '../components/Card';
import Button from '../components/Button';
import FormInput from '../components/FormInput';

const SYLLABUS_UPDATES = [
  { id: 1, subject: 'Oral Medicine', topic: 'Digital Radiology Update', date: '2026-04-20', status: 'Updated', version: 'v2.4' },
  { id: 2, subject: 'Prosthodontics', topic: 'Implantology Module 4', date: '2026-04-18', status: 'New', version: 'v1.0' },
  { id: 3, subject: 'Orthodontics', topic: 'Clear Aligner Biomechanics', date: '2026-04-15', status: 'Revised', version: 'v3.1' },
  { id: 4, subject: 'Pedodontics', topic: 'Behavior Management', date: '2026-04-12', status: 'Updated', version: 'v2.0' },
];

const StudentPortal = () => {
  const { t } = useLanguage();

  const [activeTab, setActiveTab] = useState('academics');
  const [phone, setPhone] = useState(localStorage.getItem('current_user_phone') || '');
  const [appointments, setAppointments] = useState([]);
  const [academics, setAcademics] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const [selectedCourse, setSelectedCourse] = useState('bds');

  // RAG Chat State
  const [chatInput, setChatInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hello! I'm your Academic Assistant. I've indexed the complete BDS syllabus and current clinical schedules. How can I help you today?" }
  ]);

  useEffect(() => {
    const fetchStaticData = async () => {
      try {
        const [acadData, deptData] = await Promise.all([
          apiService.academics.getAll(),
          apiService.departments.getAll()
        ]);
        setAcademics(acadData);
        setDepartments(deptData);
      } catch (err) {
        console.error('Failed to fetch static data:', err);
      }
    };
    fetchStaticData();
  }, []);

  const fetchAppointments = useCallback(async (searchPhone) => {
    if (!searchPhone) return;
    try {
      const data = await apiService.appointments.getByPhone(searchPhone);
      setAppointments(data);
      setCountdown(30);
    } catch (err) {
      console.error('Failed to fetch appointments:', err);
    }
  }, []);

  useEffect(() => {
    let timer;
    if (activeTab === 'status' && appointments.length > 0) {
      timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) { fetchAppointments(phone); return 30; }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [activeTab, appointments.length, phone, fetchAppointments]);

  const handleSearch = (e) => {
    e.preventDefault();
    setIsLoading(true);
    fetchAppointments(phone).finally(() => setIsLoading(false));
  };

  const handleStatusAction = async (id, action) => {
    const newStatus = action === 'cancel' ? 'cancelled' : 'confirmed';
    try {
      await apiService.appointments.updateStatus(id, newStatus);
      fetchAppointments(phone);
    } catch (err) { console.error('Failed to update status:', err); }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-success-green text-white';
      case 'in_progress': return 'bg-accent-emerald text-white';
      case 'scheduled': return 'bg-primary-blue text-white';
      case 'cancelled': return 'bg-error-red text-white';
      default: return 'bg-neutral-gray text-white';
    }
  };

  // RAG Chat Handler
  const handleQuery = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!chatInput.trim()) return;
    setMessages(prev => [...prev, { role: 'user', content: chatInput }]);
    setChatInput('');
    setIsThinking(true);
    try {
      const response = await fetch('http://localhost:8000/api/academic-query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: chatInput }),
      });
      const data = await response.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.answer, source: data.source }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: "I'm having trouble connecting to the knowledge base. I can provide general syllabus information based on standard BDS guidelines." }]);
    } finally { setIsThinking(false); }
  };

  return (
    <div className="relative animate-fade-in pb-24 min-h-screen bg-soft-bg font-sans">
      {/* Professional Header */}
      <div className="bg-secondary-blue text-white py-12 border-b-4 border-accent-emerald">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-black tracking-tight">{t('studentPortal.title')}</h1>
            <p className="text-blue-200 text-sm font-bold uppercase tracking-widest mt-1">Academic Administration Console</p>
          </div>
          <div className="flex gap-4">
             <button onClick={() => setActiveTab('status')} className={`px-6 py-2 rounded-lg font-black text-xs uppercase tracking-widest transition-all ${activeTab === 'status' ? 'bg-white text-secondary-blue' : 'bg-white/10 text-white hover:bg-white/20'}`}>Apt Status</button>
             <button onClick={() => setActiveTab('academics')} className={`px-6 py-2 rounded-lg font-black text-xs uppercase tracking-widest transition-all ${activeTab === 'academics' ? 'bg-white text-secondary-blue' : 'bg-white/10 text-white hover:bg-white/20'}`}>Academics</button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-10 px-4">
        {activeTab === 'status' ? (
          /* ===== APPOINTMENT TRACKING (Standard Table) ===== */
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-md border border-border-light flex flex-col md:flex-row gap-4 items-end">
              <div className="flex-1 w-full">
                <FormInput label="Track by Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="10-digit registered number" noMargin />
              </div>
              <Button type="primary" text="Search Records" loading={isLoading} className="h-[48px] px-8 rounded-lg font-bold" onClick={handleSearch} />
            </div>

            {appointments.length > 0 && (
              <div className="bg-white rounded-2xl shadow-md border border-border-light overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-gray-50 border-b border-border-light">
                    <tr>
                      <th className="px-6 py-4 font-black text-secondary-blue uppercase tracking-widest text-[10px]">Date & Time</th>
                      <th className="px-6 py-4 font-black text-secondary-blue uppercase tracking-widest text-[10px]">Department</th>
                      <th className="px-6 py-4 font-black text-secondary-blue uppercase tracking-widest text-[10px]">Status</th>
                      <th className="px-6 py-4 font-black text-secondary-blue uppercase tracking-widest text-[10px]">Confirmation</th>
                      <th className="px-6 py-4 font-black text-secondary-blue uppercase tracking-widest text-[10px] text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-light">
                    {appointments.map((apt) => (
                      <tr key={apt.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4"><div className="font-bold text-sm text-secondary-blue">{apt.date}</div><div className="text-xs text-neutral-gray">{apt.time}</div></td>
                        <td className="px-6 py-4 font-bold text-xs text-neutral-gray">{apt.department}</td>
                        <td className="px-6 py-4"><span className={`px-3 py-1 rounded-md text-[9px] font-black uppercase ${getStatusColor(apt.status)}`}>{apt.status}</span></td>
                        <td className="px-6 py-4 font-mono font-bold text-xs text-primary-blue">{apt.confirmationNumber}</td>
                        <td className="px-6 py-4 text-right">
                          <button onClick={() => handleStatusAction(apt.id, 'cancel')} className="text-[10px] font-black text-error-red hover:underline uppercase">Cancel</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ) : (
          /* ===== ACADEMICS VIEW (Sidebar Layout) ===== */
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            
            {/* MAIN CONTENT (Tables) */}
            <div className="lg:col-span-3 space-y-8">
              
              {/* Syllabus Updates Table (High Density) */}
              <div className="bg-white rounded-2xl shadow-md border border-border-light overflow-hidden">
                <div className="px-6 py-4 border-b border-border-light bg-gray-50 flex justify-between items-center">
                  <h3 className="text-sm font-black text-secondary-blue uppercase tracking-widest">Syllabus Updates (BDS 2026)</h3>
                  <span className="text-[10px] font-bold text-accent-emerald bg-accent-emerald/10 px-2 py-0.5 rounded">Live Feed</span>
                </div>
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-soft-bg border-b border-border-light">
                      <th className="px-6 py-3 font-black text-neutral-gray uppercase tracking-widest text-[10px]">Subject</th>
                      <th className="px-6 py-3 font-black text-neutral-gray uppercase tracking-widest text-[10px]">Topic / Module</th>
                      <th className="px-6 py-3 font-black text-neutral-gray uppercase tracking-widest text-[10px]">Date</th>
                      <th className="px-6 py-3 font-black text-neutral-gray uppercase tracking-widest text-[10px]">Status</th>
                      <th className="px-6 py-3 font-black text-neutral-gray uppercase tracking-widest text-[10px]">Ver.</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-light">
                    {SYLLABUS_UPDATES.map(update => (
                      <tr key={update.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-3 font-bold text-sm text-secondary-blue">{update.subject}</td>
                        <td className="px-6 py-3 text-xs text-neutral-gray font-medium">{update.topic}</td>
                        <td className="px-6 py-3 text-xs text-neutral-gray">{update.date}</td>
                        <td className="px-6 py-3 text-[9px] font-black uppercase text-accent-emerald">{update.status}</td>
                        <td className="px-6 py-3 text-[10px] font-mono font-bold text-primary-blue">{update.version}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Department Schedules (High Density) */}
              <div className="bg-white rounded-2xl shadow-md border border-border-light overflow-hidden">
                <div className="px-6 py-4 border-b border-border-light bg-gray-50">
                  <h3 className="text-sm font-black text-secondary-blue uppercase tracking-widest">Clinical Posting Schedules</h3>
                </div>
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-soft-bg border-b border-border-light">
                      <th className="px-6 py-3 font-black text-neutral-gray uppercase tracking-widest text-[10px]">Department</th>
                      <th className="px-6 py-3 font-black text-neutral-gray uppercase tracking-widest text-[10px]">OPD Hours</th>
                      <th className="px-6 py-3 font-black text-neutral-gray uppercase tracking-widest text-[10px]">Head of Dept.</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-light">
                    {departments.map(dept => (
                      <tr key={dept.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-3 font-bold text-sm text-secondary-blue">{dept.name}</td>
                        <td className="px-6 py-3 text-xs text-neutral-gray">{dept.schedule}</td>
                        <td className="px-6 py-3 text-[10px] font-black uppercase text-primary-blue">{dept.headName || "Senior Consultant"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* SIDEBAR (RAG Assistant) */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-xl border border-[#008080]/30 h-[calc(100vh-200px)] flex flex-col sticky top-6 overflow-hidden">
                <div className="bg-[#008080] p-4 text-white flex items-center gap-3">
                   <span className="text-2xl">🤖</span>
                   <div>
                     <div className="text-xs font-black uppercase tracking-widest">Academic Bot</div>
                     <div className="text-[9px] font-bold opacity-80">RAG-Powered Syllabus Assistant</div>
                   </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                  {messages.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[90%] p-3 rounded-xl shadow-sm text-[11px] leading-relaxed ${msg.role === 'user' ? 'bg-secondary-blue text-white rounded-tr-none' : 'bg-white border border-border-light text-slate-700 rounded-tl-none'}`}>
                        {msg.content}
                        {msg.source && (
                          <div className="mt-2 pt-2 border-t border-gray-100 text-[8px] font-black uppercase text-[#008080]">Source: {msg.source.split('\\').pop()}</div>
                        )}
                      </div>
                    </div>
                  ))}
                  {isThinking && <div className="text-[9px] font-black text-[#008080] animate-pulse">Assistant is thinking...</div>}
                </div>

                <div className="p-3 bg-white border-t border-border-light">
                  <form onSubmit={handleQuery} className="relative">
                    <input 
                      type="text" 
                      value={chatInput} 
                      onChange={(e) => setChatInput(e.target.value)} 
                      placeholder="Ask syllabus query..." 
                      className="w-full pl-3 pr-10 py-2.5 bg-gray-50 border-2 border-transparent focus:border-[#008080] rounded-xl text-[11px] font-bold text-secondary-blue outline-none transition-all" 
                    />
                    <button type="submit" className="absolute right-2 top-2 text-[#008080] p-1 font-black">↵</button>
                  </form>
                  <p className="text-[8px] text-center text-text-muted mt-2 font-bold uppercase tracking-tighter">AI-indexed from PDF Syllabus v2.4</p>
                </div>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default StudentPortal;

