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
      case 'open': return 'bg-error-red text-white';
      case 'in-progress': return 'bg-yellow-500 text-white';
      case 'resolved': return 'bg-success-green text-white';
      default: return 'bg-gray-400 text-white';
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
    <div className="max-w-4xl mx-auto py-10 px-4">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      
      <h1 className="text-3xl font-bold text-secondary-blue mb-8 text-center">{t('hostelComplaints.title')}</h1>

      {/* Tabs */}
      <div className="flex border-b border-border-light mb-8">
        <button 
          onClick={() => setActiveTab('submit')}
          className={`px-6 py-3 font-semibold transition-colors relative ${activeTab === 'submit' ? 'text-primary-blue' : 'text-neutral-gray hover:text-secondary-blue'}`}
        >
          {t('hostelComplaints.tabSubmit')}
          {activeTab === 'submit' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-blue"></div>}
        </button>
        <button 
          onClick={() => setActiveTab('track')}
          className={`px-6 py-3 font-semibold transition-colors relative ${activeTab === 'track' ? 'text-primary-blue' : 'text-neutral-gray hover:text-secondary-blue'}`}
        >
          {t('hostelComplaints.tabTrack')}
          {activeTab === 'track' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-blue"></div>}
        </button>
      </div>

      {activeTab === 'submit' ? (
        /* SUBMIT TAB */
        <Card className="shadow-lg border-t-4 border-t-primary-blue">
          <form onSubmit={handleFormSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormInput 
                label={t('hostelComplaints.studentName')}
                name="name"
                value={formData.name}
                onChange={handleFormChange}
                error={formErrors.name}
                required
              />
              <FormInput 
                label={t('hostelComplaints.phone')}
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleFormChange}
                error={formErrors.phone}
                required
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
                onChange={handleFormChange}
                error={formErrors.description}
                required
                rows={4}
              />
              <div className="text-right text-xs text-neutral-gray mt-1">
                {formData.description.length}/500
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-secondary-blue">{t('hostelComplaints.attachment')}</label>
              <div className="flex items-center gap-4">
                <input 
                  type="file" 
                  id="attachment"
                  className="hidden" 
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx"
                />
                <label 
                  htmlFor="attachment"
                  className="px-4 py-2 border-2 border-dashed border-border-light rounded-lg cursor-pointer hover:border-primary-blue transition-colors text-sm text-neutral-gray flex items-center gap-2"
                >
                  📁 {formData.attachment || 'Choose file'}
                </label>
              </div>
            </div>

            <Button 
              type="primary" 
              text={t('hostelComplaints.submit')} 
              loading={isSubmitting} 
              className="w-full py-4 text-lg"
              buttonType="submit"
            />
          </form>
        </Card>
      ) : (
        /* TRACK TAB */
        <div className="space-y-8">
          <form onSubmit={handleSearch} className="flex gap-4">
            <div className="flex-grow">
              <FormInput 
                placeholder={t('hostelComplaints.searchPlaceholder')}
                value={searchPhone}
                onChange={(e) => setSearchPhone(e.target.value)}
                noMargin
              />
            </div>
            <Button 
              type="secondary" 
              text={t('hostelComplaints.track')} 
              loading={isSearching} 
              buttonType="submit"
            />
          </form>

          {hasSearched && (
            <div className="space-y-4">
              {complaints.length === 0 ? (
                <div className="text-center py-10 text-neutral-gray italic">{t('hostelComplaints.noComplaints')}</div>
              ) : (
                complaints.map(complaint => (
                  <Card 
                    key={complaint.id} 
                    className="cursor-pointer hover:border-primary-blue transition-colors overflow-hidden p-0"
                    onClick={() => setExpandedId(expandedId === complaint.id ? null : complaint.id)}
                  >
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{categories.find(c => c.value === complaint.category)?.icon}</span>
                          <div>
                            <div className="text-xs font-bold text-neutral-gray">{complaint.id}</div>
                            <h4 className="font-bold text-secondary-blue">{t(`hostelComplaints.categories.${complaint.category}`)}</h4>
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(complaint.status)}`}>
                          {t(`hostelComplaints.statuses.${complaint.status}`)}
                        </span>
                      </div>
                      
                      <div className="flex gap-6 text-sm text-neutral-gray">
                        <div>
                          <span className="font-medium">{t('hostelComplaints.submittedOn')}:</span> {complaint.date}
                        </div>
                      </div>

                      {expandedId === complaint.id && (
                        <div className="mt-6 pt-6 border-t border-border-light animate-fade-in space-y-4">
                          <div>
                            <h5 className="font-bold text-secondary-blue text-sm mb-1">{t('hostelComplaints.description')}</h5>
                            <p className="text-sm text-neutral-gray leading-relaxed">{complaint.description}</p>
                          </div>
                          
                          {complaint.resolutionNotes && (
                            <div className="bg-success-green/5 p-4 rounded-xl border border-success-green/10">
                              <h5 className="font-bold text-success-green text-sm mb-1">{t('hostelComplaints.notes')}</h5>
                              <p className="text-sm text-neutral-gray">{complaint.resolutionNotes}</p>
                              <div className="text-xs text-neutral-gray mt-2">
                                <span className="font-medium">{t('hostelComplaints.resolvedOn')}:</span> {complaint.resolvedDate}
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
  );
};

export default HostelComplaints;
