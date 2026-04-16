import React, { useState, useEffect, useCallback } from 'react';
import { useLanguage } from '../utils/i18n';
import apiService from '../services/api';
import Card from '../components/Card';
import Button from '../components/Button';
import FormInput from '../components/FormInput';

const StudentPortal = () => {
  const { t } = useLanguage();
  
  const [activeTab, setActiveTab] = useState('status');
  const [phone, setPhone] = useState('');
  const [appointments, setAppointments] = useState([]);
  const [academics, setAcademics] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const [selectedCourse, setSelectedCourse] = useState('bds');

  // Fetch initial data
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

  // Polling logic
  useEffect(() => {
    let timer;
    if (activeTab === 'status' && appointments.length > 0) {
      timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            fetchAppointments(phone);
            return 30;
          }
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
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-success-green text-white shadow-success-green/30';
      case 'in_progress': return 'bg-accent-emerald text-white shadow-accent-emerald/30';
      case 'scheduled': return 'bg-primary-blue text-white shadow-primary-blue/30';
      case 'cancelled': return 'bg-error-red text-white shadow-error-red/30';
      default: return 'bg-neutral-gray text-white shadow-gray-400/30';
    }
  };

  return (
    <div className="relative animate-fade-in pb-24 min-h-screen">
      
      {/* Dynamic Glassmorphism Background */}
      <div className="absolute top-0 left-0 w-full h-[550px] bg-gradient-to-br from-secondary-blue via-[#1e293b] to-primary-blue overflow-hidden -z-10 rounded-b-[60px] md:rounded-b-[100px]">
         <div className="absolute top-0 left-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center opacity-10 mix-blend-screen"></div>
         <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary-blue/20 rounded-full blur-[120px] -mr-40 -mt-40 pointer-events-none"></div>
         <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-soft-bg to-transparent"></div>
      </div>

      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-16 text-white space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-[12px] font-bold uppercase tracking-widest shadow-lg">
             Academic Hub
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-2 tracking-tight drop-shadow-lg">
            {t('studentPortal.title')}
          </h1>
          <p className="text-lg text-blue-100/90 font-medium max-w-2xl mx-auto drop-shadow-md">
            Manage your clinical appointments, access academic resources, and view departmental schedules.
          </p>
        </div>

        {/* Tab Navigation - Glassmorphism */}
        <div className="flex justify-center mb-16">
          <div className="inline-flex p-1.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-xl relative">
            <div 
               className={`absolute top-1.5 bottom-1.5 w-[calc(50%-0.375rem)] bg-white rounded-xl shadow-md transition-all duration-300 ease-in-out ${activeTab === 'status' ? 'left-1.5' : 'left-[calc(50%+0.375rem)]'}`}
            ></div>
            <button 
              onClick={() => setActiveTab('status')}
              className={`px-8 py-4 text-sm md:text-base font-black rounded-xl transition-colors relative z-10 w-48 text-center ${activeTab === 'status' ? 'text-secondary-blue' : 'text-white hover:text-white/80'}`}
            >
              {t('studentPortal.tabStatus')}
            </button>
            <button 
              onClick={() => setActiveTab('academics')}
              className={`px-8 py-4 text-sm md:text-base font-black rounded-xl transition-colors relative z-10 w-48 text-center ${activeTab === 'academics' ? 'text-secondary-blue' : 'text-white hover:text-white/80'}`}
            >
              {t('studentPortal.tabAcademics')}
            </button>
          </div>
        </div>
        
        {activeTab === 'status' && appointments.length > 0 && (
          <div className="flex justify-end mb-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-border-light text-xs font-bold text-secondary-blue">
              <span className="w-2.5 h-2.5 rounded-full bg-accent-emerald animate-pulse shadow-sm shadow-accent-emerald/50"></span>
              Live Sync: {countdown}s
            </div>
          </div>
        )}

        {activeTab === 'status' ? (
          <div className="space-y-10">
            {/* Search Section */}
            <div className="max-w-2xl mx-auto bg-white/80 backdrop-blur-3xl rounded-[32px] p-8 border border-white/50 shadow-premium">
              <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4 items-end relative">
                <div className="flex-1 w-full relative">
                  <FormInput 
                    label={t('studentPortal.searchLabel')}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Enter patient 10-digit number"
                    noMargin
                  />
                  <div className="absolute right-4 top-[42px] text-xl opacity-20">🔍</div>
                </div>
                <Button 
                  type="primary" 
                  text="Track Status" 
                  loading={isLoading} 
                  className="h-[52px] px-10 rounded-xl font-bold shadow-lg w-full sm:w-auto"
                  buttonType="submit"
                />
              </form>
            </div>

            {/* Results Table */}
            {appointments.length > 0 ? (
              <div className="overflow-hidden bg-white/90 backdrop-blur-2xl rounded-[40px] shadow-2xl border border-white/50">
                <div className="overflow-x-auto p-4 md:p-8">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b-2 border-border-light bg-soft-bg/50">
                        <th className="px-6 py-5 font-black text-secondary-blue uppercase tracking-widest text-xs rounded-tl-2xl">{t('studentPortal.aptTable.date')}</th>
                        <th className="px-6 py-5 font-black text-secondary-blue uppercase tracking-widest text-xs">{t('studentPortal.aptTable.dept')}</th>
                        <th className="px-6 py-5 font-black text-secondary-blue uppercase tracking-widest text-xs text-center">{t('studentPortal.aptTable.status')}</th>
                        <th className="px-6 py-5 font-black text-secondary-blue uppercase tracking-widest text-xs">{t('studentPortal.aptTable.conf')}</th>
                        <th className="px-6 py-5 font-black text-secondary-blue uppercase tracking-widest text-xs text-right print:hidden rounded-tr-2xl">{t('studentPortal.aptTable.actions')}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border-light/50">
                      {appointments.map((apt) => (
                        <tr key={apt.id} className="hover:bg-primary-blue/5 transition-colors group">
                          <td className="px-6 py-6">
                            <div className="font-black text-secondary-blue text-base group-hover:text-primary-blue transition-colors">{apt.date}</div>
                            <div className="text-sm font-bold text-neutral-gray flex items-center gap-1 mt-1">
                               <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                               </svg>
                               {apt.time}
                            </div>
                          </td>
                          <td className="px-6 py-6 font-bold text-neutral-gray text-base">{apt.department}</td>
                          <td className="px-6 py-6">
                            <div className="flex justify-center">
                              <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-md ${getStatusColor(apt.status)}`}>
                                {t(`studentPortal.statuses.${apt.status}`)}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-6 font-mono font-bold text-base text-primary-blue bg-primary-blue/5 rounded-lg text-center m-2 inline-block">
                             {apt.confirmationNumber}
                          </td>
                          <td className="px-6 py-6 text-right print:hidden align-middle">
                            <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                              {apt.status !== 'cancelled' && (
                                <>
                                  <button 
                                    onClick={() => handleStatusAction(apt.id, 'cancel')}
                                    className="text-xs font-black uppercase tracking-widest text-error-red hover:bg-error-red hover:text-white px-4 py-2 rounded-xl transition-all shadow-sm border border-error-red/20"
                                  >
                                    {t('studentPortal.actions.cancel')}
                                  </button>
                                  <button 
                                    onClick={() => window.print()}
                                    className="text-xs font-black uppercase tracking-widest text-primary-blue hover:bg-primary-blue hover:text-white px-4 py-2 rounded-xl transition-all shadow-sm border border-primary-blue/20"
                                  >
                                    {t('studentPortal.actions.print')}
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : phone && !isLoading && (
              <div className="text-center py-24 bg-white/50 backdrop-blur-xl rounded-[40px] border border-dashed border-border-light shadow-inner max-w-3xl mx-auto">
                 <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-border-soft">
                    <span className="text-4xl">📭</span>
                 </div>
                 <h3 className="text-2xl font-black text-secondary-blue mb-2">No Appointments Found</h3>
                 <p className="text-neutral-gray font-medium text-lg">We couldn't locate any clinical records for {phone}.</p>
              </div>
            )}
          </div>
        ) : (
          /* Academics Tab */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 xl:gap-14">
            
            {/* Main Info */}
            <div className="lg:col-span-2 space-y-10">
              <div className="bg-white rounded-[40px] shadow-premium p-8 md:p-12 border border-border-soft">
                 <div className="flex flex-wrap gap-4 mb-10 pb-4 border-b border-border-light">
                   {['bds', 'mds', 'fellowship'].map(course => (
                     <button 
                      key={course}
                      onClick={() => setSelectedCourse(course)}
                      className={`px-8 py-3 rounded-2xl font-black transition-all ${selectedCourse === course ? 'bg-secondary-blue text-white shadow-xl scale-105' : 'bg-soft-bg text-neutral-gray hover:bg-border-light hover:text-secondary-blue'}`}
                     >
                       {course.toUpperCase()}
                     </button>
                   ))}
                 </div>
                 
                 {academics && academics[selectedCourse] && (
                   <div className="animate-fade-in relative z-10">
                      <h2 className="text-3xl lg:text-4xl font-black text-secondary-blue mb-8 uppercase tracking-tight">{selectedCourse} {t('studentPortal.academics.course')}</h2>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                         <div className="p-6 bg-gradient-to-br from-primary-blue/10 to-transparent rounded-[24px] border border-primary-blue/20">
                            <div className="flex items-center gap-3 mb-2">
                              <span className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-primary-blue shadow-sm">⏳</span>
                              <div className="text-xs font-black text-primary-blue uppercase tracking-widest">{t('studentPortal.academics.duration')}</div>
                            </div>
                            <div className="text-2xl font-black text-secondary-blue mt-2">{academics[selectedCourse].duration}</div>
                         </div>
                         <div className="p-6 bg-gradient-to-br from-accent-emerald/10 to-transparent rounded-[24px] border border-accent-emerald/20">
                            <div className="flex items-center gap-3 mb-2">
                              <span className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-accent-emerald shadow-sm">👥</span>
                              <div className="text-xs font-black text-accent-emerald uppercase tracking-widest">{t('studentPortal.academics.intake')}</div>
                            </div>
                            <div className="text-2xl font-black text-secondary-blue mt-2">{academics[selectedCourse].intake}</div>
                         </div>
                      </div>
                      
                      <p className="text-neutral-gray leading-relaxed text-lg font-medium mb-10 p-6 bg-soft-bg rounded-2xl border border-border-light">
                        {academics[selectedCourse].description}
                      </p>
                      
                      <Button 
                        type="secondary" 
                        text={t('studentPortal.actions.download')}
                        className="w-full sm:w-auto px-10 py-4 shadow-sm font-bold text-lg border-2 border-primary-blue rounded-xl"
                        onClick={() => alert('Syllabus PDF download simulation started...')}
                      />
                   </div>
                 )}
              </div>

              {/* Timetable/Schedule Table */}
              <div className="bg-white rounded-[40px] shadow-premium p-8 md:p-12 border border-border-soft">
                 <div className="flex items-center gap-4 mb-8">
                   <div className="w-14 h-14 bg-secondary-blue text-white rounded-2xl flex items-center justify-center text-2xl shadow-lg">
                      📅
                   </div>
                   <h3 className="text-2xl md:text-3xl font-black text-secondary-blue tracking-tight">{t('studentPortal.schedules.title')}</h3>
                 </div>
                 
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
                           <td className="px-6 py-5 font-bold text-secondary-blue text-base">{dept.name}</td>
                           <td className="px-6 py-5 text-neutral-gray font-medium">{dept.schedule}</td>
                         </tr>
                       ))}
                     </tbody>
                   </table>
                 </div>
              </div>
            </div>

            {/* Sidebar Info */}
            <div className="space-y-8">
               <div className="bg-gradient-to-br from-primary-blue to-blue-700 text-white rounded-[40px] p-10 shadow-2xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform"></div>
                  <h3 className="text-2xl font-black mb-6 relative z-10">Exam Notices</h3>
                  <ul className="space-y-4 relative z-10">
                    <li className="p-5 bg-white/10 rounded-[20px] backdrop-blur-sm border border-white/10 hover:bg-white/20 transition-all cursor-pointer shadow-lg hover:-translate-y-1">
                      <div className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-2">12 Oct 2026</div>
                      <div className="font-bold text-base leading-tight">MDS Part-I Supplementary Exams Scheduled</div>
                    </li>
                    <li className="p-5 bg-white/10 rounded-[20px] backdrop-blur-sm border border-white/10 hover:bg-white/20 transition-all cursor-pointer shadow-lg hover:-translate-y-1">
                      <div className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-2">05 Oct 2026</div>
                      <div className="font-bold text-base leading-tight">BDS Final Year Internal Assessment Result</div>
                    </li>
                  </ul>
               </div>
               
               <div className="bg-white rounded-[40px] p-10 shadow-premium border border-border-soft relative overflow-hidden group text-center lg:text-left">
                  <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-accent-emerald/10 rounded-full blur-3xl group-hover:scale-150 transition-transform"></div>
                  <div className="w-16 h-16 bg-accent-emerald/10 text-accent-emerald text-3xl rounded-2xl flex items-center justify-center mx-auto lg:mx-0 mb-6 group-hover:scale-110 transition-transform">
                     📚
                  </div>
                  <h3 className="text-2xl font-black text-secondary-blue mb-4">Library Access</h3>
                  <p className="text-base font-medium text-neutral-gray leading-relaxed mb-8">Access 5000+ digital dental journals and research papers from campus network.</p>
                  <button className="w-full py-4 bg-accent-emerald text-white font-black rounded-2xl shadow-[0_10px_30px_-10px_rgba(16,185,129,0.5)] hover:shadow-[0_15px_40px_-10px_rgba(16,185,129,0.7)] hover:-translate-y-1 transition-all">
                    Access e-Library
                  </button>
               </div>
            </div>
          </div>
        )}

        {/* Print Specific CSS */}
        <style>{`
          @media print {
            body * { visibility: hidden; }
            .max-w-7xl, .max-w-7xl * { visibility: visible; }
            .max-w-7xl { position: absolute; left: 0; top: 0; width: 100%; }
            .print\\:hidden { display: none !important; }
            .shadow-2xl, .shadow-premium { box-shadow: none !important; }
            .rounded-[40px] { border-radius: 0 !important; border: 1px solid #ccc !important; }
            thead { background-color: #0f172a !important; color: white !important; -webkit-print-color-adjust: exact; }
          }
        `}</style>
      </div>
    </div>
  );
};

export default StudentPortal;
