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
      case 'confirmed': return 'bg-success-green/10 text-success-green border-success-green/20';
      case 'in_progress': return 'bg-accent-green/10 text-accent-green border-accent-green/20';
      case 'scheduled': return 'bg-primary-blue/10 text-primary-blue border-primary-blue/20';
      case 'cancelled': return 'bg-error-red/10 text-error-red border-error-red/20';
      default: return 'bg-neutral-gray/10 text-neutral-gray border-neutral-gray/20';
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 animate-fade-in">
      
      {/* Header & Tabs */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-secondary-blue mb-2">{t('studentPortal.title')}</h1>
          <div className="flex gap-4 mt-6">
            <button 
              onClick={() => setActiveTab('status')}
              className={`pb-2 px-1 font-bold transition-all border-b-4 ${activeTab === 'status' ? 'border-primary-blue text-primary-blue' : 'border-transparent text-neutral-gray hover:text-secondary-blue'}`}
            >
              {t('studentPortal.tabStatus')}
            </button>
            <button 
              onClick={() => setActiveTab('academics')}
              className={`pb-2 px-1 font-bold transition-all border-b-4 ${activeTab === 'academics' ? 'border-primary-blue text-primary-blue' : 'border-transparent text-neutral-gray hover:text-secondary-blue'}`}
            >
              {t('studentPortal.tabAcademics')}
            </button>
          </div>
        </div>
        
        {activeTab === 'status' && appointments.length > 0 && (
          <div className="flex items-center gap-2 text-xs font-bold text-neutral-gray bg-light-bg px-4 py-2 rounded-full border border-border-light">
            <span className="w-2 h-2 rounded-full bg-accent-green animate-pulse"></span>
            {t('studentPortal.polling')} {countdown}s
          </div>
        )}
      </div>

      {activeTab === 'status' ? (
        <div className="space-y-8">
          {/* Search Section */}
          <Card className="max-w-xl mx-auto">
            <form onSubmit={handleSearch} className="flex gap-4 items-end">
              <div className="flex-1">
                <FormInput 
                  label={t('studentPortal.searchLabel')}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. 9876543210"
                />
              </div>
              <Button 
                type="primary" 
                text="Search" 
                loading={isLoading} 
                className="h-[48px] px-8"
                buttonType="submit"
              />
            </form>
          </Card>

          {/* Results Table */}
          {appointments.length > 0 ? (
            <div className="overflow-x-auto rounded-3xl border border-border-light shadow-xl bg-white">
              <table className="w-full text-left">
                <thead className="bg-secondary-blue text-white">
                  <tr>
                    <th className="px-6 py-4 font-bold">{t('studentPortal.aptTable.date')}</th>
                    <th className="px-6 py-4 font-bold">{t('studentPortal.aptTable.dept')}</th>
                    <th className="px-6 py-4 font-bold text-center">{t('studentPortal.aptTable.status')}</th>
                    <th className="px-6 py-4 font-bold">{t('studentPortal.aptTable.conf')}</th>
                    <th className="px-6 py-4 font-bold text-right print:hidden">{t('studentPortal.aptTable.actions')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-light">
                  {appointments.map((apt) => (
                    <tr key={apt.id} className="hover:bg-light-bg transition-colors group">
                      <td className="px-6 py-5">
                        <div className="font-bold text-secondary-blue">{apt.date}</div>
                        <div className="text-xs text-neutral-gray">{apt.time}</div>
                      </td>
                      <td className="px-6 py-5 font-medium text-neutral-gray">{apt.department}</td>
                      <td className="px-6 py-5">
                        <div className="flex justify-center">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border tracking-widest ${getStatusColor(apt.status)}`}>
                            {t(`studentPortal.statuses.${apt.status}`)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-5 font-mono text-sm text-primary-blue">{apt.confirmationNumber}</td>
                      <td className="px-6 py-5 text-right print:hidden">
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          {apt.status !== 'cancelled' && (
                            <>
                              <button 
                                onClick={() => handleStatusAction(apt.id, 'cancel')}
                                className="text-xs font-bold text-error-red hover:bg-error-red/10 px-3 py-1.5 rounded-lg transition-colors"
                              >
                                {t('studentPortal.actions.cancel')}
                              </button>
                              <button 
                                onClick={() => window.print()}
                                className="text-xs font-bold text-primary-blue hover:bg-primary-blue/10 px-3 py-1.5 rounded-lg transition-colors border border-primary-blue/20"
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
          ) : phone && !isLoading && (
            <div className="text-center py-20 bg-light-bg rounded-[40px] border-2 border-dashed border-border-light">
               <div className="text-4xl mb-4">🔍</div>
               <p className="text-neutral-gray font-bold">No clinical appointments found for this number.</p>
            </div>
          )}
        </div>
      ) : (
        /* Academics Tab */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-8">
            <Card className="p-8">
               <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
                 {['bds', 'mds', 'fellowship'].map(course => (
                   <button 
                    key={course}
                    onClick={() => setSelectedCourse(course)}
                    className={`px-6 py-2 rounded-xl font-bold transition-all ${selectedCourse === course ? 'bg-primary-blue text-white shadow-lg' : 'bg-light-bg text-neutral-gray hover:bg-border-light'}`}
                   >
                     {course.toUpperCase()}
                   </button>
                 ))}
               </div>
               
               {academics && academics[selectedCourse] && (
                 <div className="animate-fade-in">
                    <h2 className="text-2xl font-bold text-secondary-blue mb-4 uppercase">{selectedCourse} {t('studentPortal.academics.course')}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                       <div className="p-4 bg-light-bg rounded-2xl border border-border-light">
                          <div className="text-xs font-bold text-neutral-gray uppercase tracking-widest mb-1">{t('studentPortal.academics.duration')}</div>
                          <div className="font-bold text-secondary-blue">{academics[selectedCourse].duration}</div>
                       </div>
                       <div className="p-4 bg-light-bg rounded-2xl border border-border-light">
                          <div className="text-xs font-bold text-neutral-gray uppercase tracking-widest mb-1">{t('studentPortal.academics.intake')}</div>
                          <div className="font-bold text-secondary-blue">{academics[selectedCourse].intake}</div>
                       </div>
                    </div>
                    <p className="text-neutral-gray leading-relaxed mb-10">
                      {academics[selectedCourse].description}
                    </p>
                    <Button 
                      type="secondary" 
                      text={t('studentPortal.actions.download')}
                      className="w-full sm:w-auto px-8"
                      onClick={() => alert('Syllabus PDF download simulation started...')}
                    />
                 </div>
               )}
            </Card>

            {/* Timetable/Schedule Table */}
            <div className="overflow-hidden rounded-3xl border border-border-light bg-white shadow-sm">
               <div className="p-6 bg-secondary-blue text-white font-bold flex items-center gap-3">
                 📅 {t('studentPortal.schedules.title')}
               </div>
               <div className="overflow-x-auto">
                 <table className="w-full text-left text-sm">
                   <thead className="bg-light-bg border-b">
                     <tr>
                       <th className="px-6 py-3 font-bold text-secondary-blue">{t('studentPortal.schedules.dept')}</th>
                       <th className="px-6 py-3 font-bold text-secondary-blue">{t('studentPortal.schedules.hours')}</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y">
                     {departments.map((dept) => (
                       <tr key={dept.id}>
                         <td className="px-6 py-4 font-bold text-primary-blue">{dept.name}</td>
                         <td className="px-6 py-4 text-neutral-gray">{dept.schedule}</td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
               </div>
            </div>
          </div>

          {/* Sidebar Info */}
          <div className="space-y-6">
             <Card className="bg-primary-blue text-white border-none p-8">
                <h3 className="text-xl font-bold mb-4">Exam Notices</h3>
                <ul className="space-y-4">
                  <li className="p-3 bg-white/10 rounded-xl hover:bg-white/20 transition-colors cursor-pointer">
                    <div className="text-xs font-bold opacity-60">12 Oct 2026</div>
                    <div className="font-bold text-sm">MDS Part-I Supplementary Exams Scheduled</div>
                  </li>
                  <li className="p-3 bg-white/10 rounded-xl hover:bg-white/20 transition-colors cursor-pointer">
                    <div className="text-xs font-bold opacity-60">05 Oct 2026</div>
                    <div className="font-bold text-sm">BDS Final Year Internal Assessment Result</div>
                  </li>
                </ul>
             </Card>
             <Card className="bg-accent-green text-white border-none p-8">
                <h3 className="text-xl font-bold mb-4">Library Access</h3>
                <p className="text-sm font-medium opacity-90 mb-6">Access 5000+ digital dental journals and research papers from campus network.</p>
                <button className="w-full py-3 bg-white text-accent-green font-bold rounded-xl shadow-lg hover:bg-white/90 transition-all">
                  Access e-Library
                </button>
             </Card>
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
          .rounded-3xl { border-radius: 0 !important; border: 1px solid #ccc !important; }
          thead { background-color: #004d80 !important; color: white !important; -webkit-print-color-adjust: exact; }
          .bg-success-green\\/10 { background-color: #e6f7ef !important; border-color: #2fb17c !important; color: #2fb17c !important; -webkit-print-color-adjust: exact; }
        }
      `}</style>
    </div>
  );
};

export default StudentPortal;
