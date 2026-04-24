import React, { useState, useEffect, useCallback } from 'react';
import { useLanguage } from '../utils/i18n';
import apiService from '../services/api';
import Card from '../components/Card';
import Button from '../components/Button';
import FormInput from '../components/FormInput';

const StudentPortal = () => {
  const { t } = useLanguage();

  const [activeTab, setActiveTab] = useState('academics');
  const [phone, setPhone] = useState('');
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
      setMessages(prev => [...prev, { role: 'assistant', content: "I'm having trouble connecting to the knowledge base. Please ensure the RAG service is running on port 8000." }]);
    } finally { setIsThinking(false); }
  };

  return (
    <div className="relative animate-fade-in pb-24 min-h-screen">
      {/* Background */}
      <div className="absolute top-0 left-0 w-full h-[550px] bg-gradient-to-br from-secondary-blue via-[#1e293b] to-primary-blue overflow-hidden -z-10 rounded-b-[60px] md:rounded-b-[100px]">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary-blue/20 rounded-full blur-[120px] -mr-40 -mt-40 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-soft-bg to-transparent"></div>
      </div>

      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-16 text-white space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[12px] font-bold uppercase tracking-widest shadow-lg">Academic Hub</div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight drop-shadow-lg">{t('studentPortal.title')}</h1>
          <p className="text-lg text-blue-100/90 font-medium max-w-2xl mx-auto">Manage appointments, access academic resources, and view schedules.</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-16">
          <div className="inline-flex p-1.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-xl relative">
            <div className={`absolute top-1.5 bottom-1.5 w-[calc(50%-0.375rem)] bg-white rounded-xl shadow-md transition-all duration-300 ease-in-out ${activeTab === 'status' ? 'left-1.5' : 'left-[calc(50%+0.375rem)]'}`}></div>
            <button onClick={() => setActiveTab('status')} className={`px-8 py-4 text-sm font-black rounded-xl transition-colors relative z-10 w-48 text-center ${activeTab === 'status' ? 'text-secondary-blue' : 'text-white hover:text-white/80'}`}>{t('studentPortal.tabStatus')}</button>
            <button onClick={() => setActiveTab('academics')} className={`px-8 py-4 text-sm font-black rounded-xl transition-colors relative z-10 w-48 text-center ${activeTab === 'academics' ? 'text-secondary-blue' : 'text-white hover:text-white/80'}`}>{t('studentPortal.tabAcademics')}</button>
          </div>
        </div>

        {activeTab === 'status' ? (
          <div className="space-y-10">
            <div className="max-w-2xl mx-auto bg-white/80 backdrop-blur-3xl rounded-[32px] p-8 border border-white/50 shadow-xl">
              <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4 items-end">
                <div className="flex-1 w-full">
                  <FormInput label={t('studentPortal.searchLabel')} value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Enter patient 10-digit number" noMargin />
                </div>
                <Button type="primary" text="Track Status" loading={isLoading} className="h-[52px] px-10 rounded-xl font-bold shadow-lg w-full sm:w-auto" buttonType="submit" />
              </form>
            </div>

            {appointments.length > 0 ? (
              <div className="overflow-hidden bg-white/90 backdrop-blur-2xl rounded-[40px] shadow-2xl border border-white/50">
                <div className="overflow-x-auto p-4 md:p-8">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b-2 border-border-light bg-soft-bg/50">
                        <th className="px-6 py-5 font-black text-secondary-blue uppercase tracking-widest text-xs">{t('studentPortal.aptTable.date')}</th>
                        <th className="px-6 py-5 font-black text-secondary-blue uppercase tracking-widest text-xs">{t('studentPortal.aptTable.dept')}</th>
                        <th className="px-6 py-5 font-black text-secondary-blue uppercase tracking-widest text-xs text-center">{t('studentPortal.aptTable.status')}</th>
                        <th className="px-6 py-5 font-black text-secondary-blue uppercase tracking-widest text-xs">{t('studentPortal.aptTable.conf')}</th>
                        <th className="px-6 py-5 font-black text-secondary-blue uppercase tracking-widest text-xs text-right">{t('studentPortal.aptTable.actions')}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border-light/50">
                      {appointments.map((apt) => (
                        <tr key={apt.id} className="hover:bg-primary-blue/5 transition-colors group">
                          <td className="px-6 py-6"><div className="font-black text-secondary-blue">{apt.date}</div><div className="text-sm text-neutral-gray">{apt.time}</div></td>
                          <td className="px-6 py-6 font-bold text-neutral-gray">{apt.department}</td>
                          <td className="px-6 py-6 text-center"><span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase ${getStatusColor(apt.status)}`}>{t(`studentPortal.statuses.${apt.status}`)}</span></td>
                          <td className="px-6 py-6 font-mono font-bold text-primary-blue">{apt.confirmationNumber}</td>
                          <td className="px-6 py-6 text-right">
                            {apt.status !== 'cancelled' && (
                              <button onClick={() => handleStatusAction(apt.id, 'cancel')} className="text-xs font-black text-error-red hover:bg-error-red hover:text-white px-4 py-2 rounded-xl transition-all border border-error-red/20">{t('studentPortal.actions.cancel')}</button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : phone && !isLoading && (
              <div className="text-center py-24 bg-white/50 backdrop-blur-xl rounded-[40px] border border-dashed border-border-light max-w-3xl mx-auto">
                <span className="text-4xl">📭</span>
                <h3 className="text-2xl font-black text-secondary-blue mb-2 mt-4">No Appointments Found</h3>
                <p className="text-neutral-gray font-medium">No clinical records found for {phone}.</p>
              </div>
            )}
          </div>
        ) : (
          /* ===== ACADEMICS TAB ===== */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 space-y-10">
              {/* Course Selector + Info */}
              <div className="bg-white rounded-[40px] shadow-xl p-8 md:p-12 border border-border-soft">
                <div className="flex flex-wrap gap-4 mb-10 pb-4 border-b border-border-light">
                  {['bds', 'mds', 'fellowship'].map(course => (
                    <button key={course} onClick={() => setSelectedCourse(course)} className={`px-8 py-3 rounded-2xl font-black transition-all ${selectedCourse === course ? 'bg-secondary-blue text-white shadow-xl scale-105' : 'bg-soft-bg text-neutral-gray hover:bg-border-light'}`}>{course.toUpperCase()}</button>
                  ))}
                </div>
                {academics && academics[selectedCourse] && (
                  <div className="animate-fade-in">
                    <h2 className="text-3xl font-black text-secondary-blue mb-8 uppercase tracking-tight">{selectedCourse.toUpperCase()} {t('studentPortal.academics.course')}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                      <div className="p-6 bg-primary-blue/10 rounded-[24px] border border-primary-blue/20">
                        <div className="text-xs font-black text-primary-blue uppercase tracking-widest">{t('studentPortal.academics.duration')}</div>
                        <div className="text-2xl font-black text-secondary-blue mt-2">{academics[selectedCourse].duration}</div>
                      </div>
                      <div className="p-6 bg-accent-emerald/10 rounded-[24px] border border-accent-emerald/20">
                        <div className="text-xs font-black text-accent-emerald uppercase tracking-widest">{t('studentPortal.academics.intake')}</div>
                        <div className="text-2xl font-black text-secondary-blue mt-2">{academics[selectedCourse].intake}</div>
                      </div>
                    </div>
                    <p className="text-neutral-gray leading-relaxed text-lg font-medium mb-10 p-6 bg-soft-bg rounded-2xl border border-border-light">{academics[selectedCourse].description}</p>
                  </div>
                )}
              </div>

              {/* RAG Academic Assistant Chat */}
              <div className="bg-white rounded-[40px] shadow-xl p-8 md:p-12 border border-border-soft">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-[#008080] rounded-xl flex items-center justify-center text-white shadow-lg">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
                  </div>
                  <h3 className="text-xl font-black text-secondary-blue uppercase tracking-tight">Academic Assistant</h3>
                </div>

                <div className="bg-gray-50/50 rounded-3xl border border-border-light p-6 h-[400px] flex flex-col relative overflow-hidden">
                  <div className="flex-grow overflow-y-auto space-y-4 pr-2">
                    {messages.map((msg, idx) => (
                      <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] p-4 rounded-2xl shadow-md text-sm leading-relaxed animate-fade-in ${msg.role === 'user' ? 'bg-white border border-border-light text-secondary-blue rounded-tr-none font-bold' : 'bg-[#008080] text-white rounded-tl-none font-medium'}`}>
                          {msg.content}
                          {msg.source && (
                            <div className="mt-2 pt-2 border-t border-white/20 text-[10px] font-black uppercase tracking-widest opacity-70">Source: {msg.source.split('\\').pop()}</div>
                          )}
                        </div>
                      </div>
                    ))}
                    {isThinking && (
                      <div className="flex justify-start">
                        <div className="bg-[#008080]/20 text-[#008080] p-4 rounded-2xl rounded-tl-none border border-[#008080]/30 flex items-center gap-3">
                          <div className="flex gap-1">
                            <span className="w-2 h-2 bg-[#008080] rounded-full animate-bounce"></span>
                            <span className="w-2 h-2 bg-[#008080] rounded-full animate-bounce" style={{animationDelay: '0.15s'}}></span>
                            <span className="w-2 h-2 bg-[#008080] rounded-full animate-bounce" style={{animationDelay: '0.3s'}}></span>
                          </div>
                          <span className="text-[10px] font-black uppercase tracking-widest">Thinking...</span>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="mt-4 pt-4 border-t border-border-light">
                    <form onSubmit={handleQuery} className="relative">
                      <input type="text" value={chatInput} onChange={(e) => setChatInput(e.target.value)} placeholder="Ask about your course, syllabus, or schedule..." className="w-full pl-6 pr-24 py-4 bg-white border-2 border-[#008080]/20 rounded-2xl focus:outline-none focus:border-[#008080] transition-all text-sm font-bold text-secondary-blue" />
                      <button type="submit" className="absolute right-2 top-2 bottom-2 bg-[#008080] text-white px-6 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-secondary-blue transition-colors shadow-lg">Send</button>
                    </form>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-[10px] font-black text-text-muted uppercase tracking-widest px-2 mt-4">
                  <span className="flex items-center gap-1">
                    <span className={`w-1.5 h-1.5 rounded-full ${isThinking ? 'bg-orange-400 animate-pulse' : 'bg-success-green'}`}></span>
                    {isThinking ? 'Processing Query' : 'RAG Engine Active'}
                  </span>
                </div>
              </div>

              {/* Schedule Table */}
              <div className="bg-white rounded-[40px] shadow-xl p-8 md:p-12 border border-border-soft">
                <h3 className="text-2xl font-black text-secondary-blue mb-8 tracking-tight">{t('studentPortal.schedules.title')}</h3>
                <div className="overflow-x-auto rounded-3xl border border-border-light">
                  <table className="w-full text-left">
                    <thead className="bg-soft-bg">
                      <tr>
                        <th className="px-6 py-5 font-black text-neutral-gray uppercase tracking-widest text-xs">{t('studentPortal.schedules.dept')}</th>
                        <th className="px-6 py-5 font-black text-neutral-gray uppercase tracking-widest text-xs">{t('studentPortal.schedules.hours')}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border-light bg-white">
                      {departments.map((dept) => (
                        <tr key={dept.id} className="hover:bg-primary-blue/5 transition-colors">
                          <td className="px-6 py-5 font-bold text-secondary-blue">{dept.name}</td>
                          <td className="px-6 py-5 text-neutral-gray font-medium">{dept.schedule}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              <div className="bg-gradient-to-br from-primary-blue to-blue-700 text-white rounded-[40px] p-10 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                <h3 className="text-2xl font-black mb-6 relative z-10">Exam Notices</h3>
                <ul className="space-y-4 relative z-10">
                  <li className="p-5 bg-white/10 rounded-[20px] backdrop-blur-sm border border-white/10">
                    <div className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-2">12 Oct 2026</div>
                    <div className="font-bold leading-tight">MDS Part-I Supplementary Exams Scheduled</div>
                  </li>
                  <li className="p-5 bg-white/10 rounded-[20px] backdrop-blur-sm border border-white/10">
                    <div className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-2">05 Oct 2026</div>
                    <div className="font-bold leading-tight">BDS Final Year Internal Assessment Result</div>
                  </li>
                </ul>
              </div>
              <div className="bg-white rounded-[40px] p-10 shadow-xl border border-border-soft text-center lg:text-left">
                <div className="w-16 h-16 bg-accent-emerald/10 text-3xl rounded-2xl flex items-center justify-center mx-auto lg:mx-0 mb-6">📚</div>
                <h3 className="text-2xl font-black text-secondary-blue mb-4">Library Access</h3>
                <p className="text-base font-medium text-neutral-gray leading-relaxed mb-8">Access 5000+ digital dental journals and research papers.</p>
                <button className="w-full py-4 bg-accent-emerald text-white font-black rounded-2xl shadow-lg hover:-translate-y-1 transition-all">Access e-Library</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentPortal;
