import React, { useState } from 'react';
import { useLanguage } from '../utils/i18n';
import apiService from '../services/api';
import FormInput from '../components/FormInput';
import FormSelect from '../components/FormSelect';
import FormTextarea from '../components/FormTextarea';
import Button from '../components/Button';
import Card from '../components/Card';
import Toast from '../components/Toast';

const HostelComplaints = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('submit');
  
  // --- SUBMIT TAB STATE ---
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    category: '',
    description: '',
    attachment: null
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState(null);
  
  // --- TRACK TAB STATE ---
  const [searchPhone, setSearchPhone] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [complaints, setComplaints] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [expandedId, setExpandedId] = useState(null);

  const categories = [
    { value: 'maintenance', label: t('hostelComplaints.categories.maintenance'), icon: '🛠️' },
    { value: 'food', label: t('hostelComplaints.categories.food'), icon: '🍲' },
    { value: 'hygiene', label: t('hostelComplaints.categories.hygiene'), icon: '🧼' },
    { value: 'noise', label: t('hostelComplaints.categories.noise'), icon: '📢' },
    { value: 'other', label: t('hostelComplaints.categories.other'), icon: '📝' }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'open': return 'bg-error-red text-white shadow-error-red/20';
      case 'in-progress': return 'bg-yellow-500 text-white shadow-yellow-500/20';
      case 'resolved': return 'bg-success-green text-white shadow-success-green/20';
      default: return 'bg-gray-400 text-white shadow-gray-400/20';
    }
  };

  // --- HANDLERS ---
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) setFormErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setFormData(prev => ({ ...prev, attachment: file.name }));
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = t('appointments.errors.nameReq');
    if (!formData.phone.trim() || !/^\d{10}$/.test(formData.phone)) errors.phone = t('appointments.errors.phoneInvalid');
    if (!formData.category) errors.category = t('appointments.errors.deptReq');
    if (formData.description.length < 20) errors.description = t('hostelComplaints.minChars');
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const result = await apiService.complaints.create(formData);
      if (result.success) {
        setToast({ 
          type: 'success', 
          message: `${t('hostelComplaints.success')} ${t('hostelComplaints.idLabel')}: ${result.complaintId}` 
        });
        setFormData({ name: '', phone: '', email: '', category: '', description: '', attachment: null });
        setTimeout(() => setActiveTab('track'), 2000);
      }
    } catch (err) {
      setToast({ type: 'error', message: 'Failed to submit complaint.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchPhone) return;
    
    setIsSearching(true);
    setHasSearched(true);
    try {
      const results = await apiService.complaints.getByPhone(searchPhone);
      setComplaints(results);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="relative animate-fade-in pb-24">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      
      {/* Background Styling */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-br from-secondary-blue to-primary-blue overflow-hidden -z-10 rounded-b-[60px] md:rounded-b-[100px]">
         <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-white/5 rounded-full blur-[100px] -mr-60 -mt-60 pointer-events-none"></div>
         <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-soft-bg to-transparent"></div>
      </div>

      <div className="max-w-5xl mx-auto py-16 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16 text-white space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-[12px] font-bold uppercase tracking-widest shadow-lg">
             Campus Services
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-2 tracking-tight drop-shadow-md">{t('hostelComplaints.title')}</h1>
          <p className="text-lg text-blue-100/90 font-medium max-w-xl mx-auto">
             Submit and track maintenance or service requests for hostel facilities.
          </p>
        </div>

        {/* Tab Navigation - Glassmorphism */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex p-1.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-lg relative">
            <div 
               className={`absolute top-1.5 bottom-1.5 w-[calc(50%-0.375rem)] bg-white rounded-xl shadow-md transition-all duration-300 ease-in-out ${activeTab === 'submit' ? 'left-1.5' : 'left-[calc(50%+0.375rem)]'}`}
            ></div>
            <button 
              onClick={() => setActiveTab('submit')}
              className={`px-8 py-3 text-sm md:text-base font-black rounded-xl transition-colors relative z-10 w-40 text-center ${activeTab === 'submit' ? 'text-secondary-blue' : 'text-white hover:text-white/80'}`}
            >
              {t('hostelComplaints.tabSubmit')}
            </button>
            <button 
              onClick={() => setActiveTab('track')}
              className={`px-8 py-3 text-sm md:text-base font-black rounded-xl transition-colors relative z-10 w-40 text-center ${activeTab === 'track' ? 'text-secondary-blue' : 'text-white hover:text-white/80'}`}
            >
              {t('hostelComplaints.tabTrack')}
            </button>
          </div>
        </div>

        <div className="max-w-3xl mx-auto">
          {activeTab === 'submit' ? (
            /* SUBMIT TAB */
            <div className="bg-white/90 backdrop-blur-3xl rounded-[40px] shadow-2xl p-8 md:p-12 border border-white/50 animate-fade-in relative overflow-hidden">
              <div className="absolute -top-16 -right-16 w-32 h-32 bg-primary-blue/10 rounded-full blur-2xl"></div>
              
              <form onSubmit={handleFormSubmit} className="space-y-8 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormInput 
                    label={t('hostelComplaints.studentName')}
                    name="name"
                    value={formData.name}
                    onChange={handleFormChange}
                    error={formErrors.name}
                    required
                    placeholder="Enter full name"
                  />
                  <FormInput 
                    label={t('hostelComplaints.phone')}
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleFormChange}
                    error={formErrors.phone}
                    required
                    placeholder="10-digit mobile number"
                  />
                </div>
                
                <FormSelect 
                  label={t('hostelComplaints.category')}
                  name="category"
                  value={formData.category}
                  onChange={handleFormChange}
                  options={categories.map(c => ({ id: c.value, name: `${c.icon} ${c.label}` }))}
                  error={formErrors.category}
                  required
                />

                <div className="relative">
                  <FormTextarea 
                    label={t('hostelComplaints.description')}
                    name="description"
                    value={formData.description}
                    onChange={(e) => {
                        if (e.target.value.length <= 500) handleFormChange(e);
                    }}
                    error={formErrors.description}
                    required
                    rows={5}
                    placeholder="Briefly describe the issue..."
                  />
                  <div className="absolute right-4 bottom-4 text-xs font-bold text-neutral-gray bg-white px-2 py-1 rounded-md shadow-sm border border-border-soft">
                    {formData.description.length}/500
                  </div>
                </div>

                <div className="p-6 bg-soft-bg rounded-2xl border border-border-light shadow-inner">
                  <label className="block text-sm font-bold text-secondary-blue mb-4">{t('hostelComplaints.attachment')} <span className="text-neutral-gray font-normal">(Optional)</span></label>
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    <input 
                      type="file" 
                      id="attachment"
                      className="hidden" 
                      onChange={handleFileChange}
                      accept=".pdf,.doc,.docx,.jpg,.png"
                    />
                    <label 
                      htmlFor="attachment"
                      className="w-full sm:w-auto px-6 py-3 bg-white border border-border-light shadow-sm rounded-xl cursor-pointer hover:border-primary-blue hover:text-primary-blue transition-all text-sm font-bold text-neutral-gray flex justify-center items-center gap-2 group"
                    >
                      <span className="text-xl group-hover:scale-110 transition-transform">📁</span> 
                      {formData.attachment ? 'Change File' : 'Upload File'}
                    </label>
                    {formData.attachment && (
                      <div className="text-sm font-bold text-primary-blue truncate max-w-[200px] border-b border-primary-blue">
                         {formData.attachment}
                      </div>
                    )}
                  </div>
                </div>

                <Button 
                  type="primary" 
                  text={t('hostelComplaints.submit')} 
                  loading={isSubmitting} 
                  className="w-full py-5 text-xl font-black shadow-xl hover:shadow-2xl hover:-translate-y-1 rounded-2xl"
                  buttonType="submit"
                />
              </form>
            </div>
          ) : (
            /* TRACK TAB */
            <div className="space-y-10 animate-fade-in">
              <div className="bg-white/90 backdrop-blur-3xl rounded-[40px] shadow-2xl p-8 md:p-12 border border-white/50">
                <div className="text-center mb-8">
                   <h3 className="text-2xl font-black text-secondary-blue tracking-tight">Track Your Complaint</h3>
                   <p className="text-neutral-gray font-medium">Use your registered phone number</p>
                </div>
                <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4 relative">
                  <div className="flex-grow relative">
                    <FormInput 
                      placeholder="Enter 10-digit phone number"
                      value={searchPhone}
                      onChange={(e) => setSearchPhone(e.target.value)}
                      noMargin
                    />
                  </div>
                  <Button 
                    type="primary" 
                    text={t('hostelComplaints.track')} 
                    loading={isSearching} 
                    buttonType="submit"
                    className="sm:w-auto px-10 py-4 shadow-lg rounded-xl font-bold"
                  />
                </form>
              </div>

              {hasSearched && (
                <div className="space-y-6">
                  {complaints.length === 0 ? (
                    <div className="bg-white rounded-3xl p-10 text-center shadow-sm border border-border-light">
                       <span className="text-5xl mb-4 opacity-50 block">📭</span>
                       <h4 className="text-xl font-bold text-secondary-blue">{t('hostelComplaints.noComplaints')}</h4>
                    </div>
                  ) : (
                    complaints.map(complaint => (
                      <Card 
                        key={complaint.id} 
                        className="cursor-pointer group border-l-4 overflow-hidden p-0 rounded-3xl transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                        style={{ borderLeftColor: complaint.status === 'open' ? '#ef4444' : complaint.status === 'in-progress' ? '#eab308' : '#10b981' }}
                        onClick={() => setExpandedId(expandedId === complaint.id ? null : complaint.id)}
                      >
                        <div className="p-6 md:p-8 bg-white relative">
                          <div className="flex justify-between items-start mb-6">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-soft-bg rounded-2xl flex items-center justify-center text-2xl shadow-inner border border-border-light group-hover:scale-110 transition-transform">
                                 {categories.find(c => c.value === complaint.category)?.icon}
                              </div>
                              <div>
                                <div className="text-[10px] font-black uppercase tracking-widest text-neutral-gray mb-1">ID: {complaint.id}</div>
                                <h4 className="text-lg font-black text-secondary-blue tracking-tight">{t(`hostelComplaints.categories.${complaint.category}`)}</h4>
                              </div>
                            </div>
                            <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest shadow-sm ${getStatusColor(complaint.status)}`}>
                              {t(`hostelComplaints.statuses.${complaint.status}`)}
                            </span>
                          </div>
                          
                          <div className="flex gap-4 text-sm font-bold text-neutral-gray">
                            <div className="flex items-center gap-1.5">
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              {complaint.date}
                            </div>
                            <div className="ml-auto text-primary-blue group-hover:underline">
                               {expandedId === complaint.id ? 'Hide Details' : 'View Details'}
                            </div>
                          </div>

                          {expandedId === complaint.id && (
                            <div className="mt-8 pt-8 border-t border-dashed border-border-light animate-fade-in">
                              <div className="bg-soft-bg p-5 rounded-2xl border border-border-light mb-4">
                                <h5 className="font-black text-secondary-blue text-xs uppercase tracking-widest mb-2">{t('hostelComplaints.description')}</h5>
                                <p className="text-sm text-neutral-gray leading-relaxed font-medium">{complaint.description}</p>
                              </div>
                              
                              {complaint.resolutionNotes && (
                                <div className="bg-success-green/5 p-5 rounded-2xl border border-success-green/20 relative overflow-hidden">
                                  <div className="absolute right-0 bottom-0 text-6xl opacity-5 translate-x-1/4 translate-y-1/4">✓</div>
                                  <h5 className="font-black text-success-green text-xs uppercase tracking-widest mb-2">{t('hostelComplaints.notes')}</h5>
                                  <p className="text-sm text-neutral-gray font-medium mb-3">{complaint.resolutionNotes}</p>
                                  <div className="text-xs font-bold text-success-green/70 flex items-center gap-1.5">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                    </svg>
                                    {t('hostelComplaints.resolvedOn')}: {complaint.resolvedDate}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </Card>
                    ))
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HostelComplaints;
