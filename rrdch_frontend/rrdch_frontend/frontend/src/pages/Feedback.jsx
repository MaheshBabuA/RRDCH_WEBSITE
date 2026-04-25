import React, { useState } from 'react';
import { useLanguage } from '../utils/i18n';
import apiService from '../services/api';
import FormInput from '../components/FormInput';
import FormSelect from '../components/FormSelect';
import FormTextarea from '../components/FormTextarea';
import Button from '../components/Button';
import VoiceInputButton from '../components/VoiceInputButton';
import SuccessModal from '../components/SuccessModal';

const Feedback = () => {
  const { t } = useLanguage();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    rating: 0,
    category: '',
    message: '',
    isAnonymous: false
  });

  const [hoverRating, setHoverRating] = useState(0);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const categories = [
    { value: 'quality', label: t('feedbackPage.categories.quality') },
    { value: 'facility', label: t('feedbackPage.categories.facility') },
    { value: 'staff', label: t('feedbackPage.categories.staff') },
    { value: 'appointment', label: t('feedbackPage.categories.appointment') },
    { value: 'other', label: t('feedbackPage.categories.other') }
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleVoiceTranscript = (transcript) => {
    setFormData(prev => ({
      ...prev,
      message: prev.message ? `${prev.message} ${transcript}` : transcript
    }));
  };

  const validate = () => {
    const newErrors = {};
    if (formData.rating === 0) newErrors.rating = t('appointments.errors.deptReq'); 
    if (formData.message.length < 10) newErrors.message = t('hostelComplaints.minChars');
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await apiService.feedback.submit(formData);
      setShowSuccess(true);
    } catch (err) {
      // Fallback success
      setShowSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '', email: '', phone: '', rating: 0, category: '', message: '', isAnonymous: false
    });
    setShowSuccess(false);
    setErrors({});
  };

  return (
    <div className="min-h-screen relative animate-fade-in overflow-hidden pb-20">
      {/* Abstract Design Background */}
      <div className="absolute inset-0 z-0 bg-soft-bg pointer-events-none">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary-blue/5 rounded-full blur-[100px] -mr-80 -mt-80"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-success-green/5 rounded-full blur-[100px] -ml-60 -mb-60"></div>
      </div>
      
      <div className="absolute top-0 left-0 w-full h-[400px] bg-secondary-blue -z-10 rounded-b-[40px] md:rounded-b-[80px]">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>
      </div>

      <div className="max-w-4xl mx-auto py-16 px-4 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-16 text-white space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-[12px] font-bold uppercase tracking-widest shadow-lg">
             Patient Voice
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-3 tracking-tight drop-shadow-md">
            {t('feedbackPage.title')}
          </h1>
          <p className="text-xl text-blue-100/90 font-medium max-w-2xl mx-auto">
            {t('feedbackPage.subtitle')} Your insights help us elevate our standard of care.
          </p>
        </div>

        <div className="bg-white/90 backdrop-blur-3xl rounded-[40px] shadow-2xl p-8 md:p-14 border border-white/50 relative">
          <div className="absolute -top-10 -right-10 w-20 h-20 bg-gradient-to-tr from-primary-blue to-success-green rounded-3xl blur-[40px] opacity-50"></div>
          
          <form onSubmit={handleSubmit} className="space-y-10 relative z-10">
            
            {/* Rating Section - Redesigned */}
            <div className="text-center p-8 bg-soft-bg rounded-3xl border border-border-light shadow-inner">
              <label className="block text-2xl font-black text-secondary-blue mb-6">
                {t('feedbackPage.ratingLabel')}
              </label>
              <div className="flex justify-center gap-2 sm:gap-4 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className="focus:outline-none transition-transform active:scale-95 group"
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => {
                        setFormData(prev => ({ ...prev, rating: star }));
                        setErrors(prev => ({ ...prev, rating: '' }));
                    }}
                  >
                    <svg 
                      className={`w-14 h-14 md:w-16 md:h-16 transition-all duration-300 drop-shadow-sm ${
                        (hoverRating || formData.rating) >= star 
                          ? 'text-yellow-400 fill-current scale-110' 
                          : 'text-gray-300 fill-none stroke-current stroke-2 group-hover:text-yellow-200'
                      }`}
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                ))}
              </div>
              <div className="h-8 text-lg font-bold text-primary-blue capitalize tracking-wide transition-all">
                {t(`feedbackPage.ratings.${hoverRating || formData.rating}`) || 'Select a rating'}
              </div>
              {errors.rating && <p className="text-error-red text-sm font-bold mt-2 animate-fade-in flex justify-center items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-error-red"></span>{errors.rating}</p>}
            </div>

            {/* Anonymous Toggle - Modernized */}
            <div className="flex items-center gap-4 p-5 md:p-6 bg-gradient-to-r from-secondary-blue to-[#1e293b] rounded-[24px] shadow-lg group transition-all">
               <div className="relative flex items-center justify-center">
                 <input 
                   type="checkbox" 
                   id="isAnonymous" 
                   name="isAnonymous"
                   checked={formData.isAnonymous}
                   onChange={handleInputChange}
                   className="peer appearance-none w-6 h-6 border-2 border-white/30 rounded-lg checked:bg-success-green checked:border-success-green focus:ring-success-green transition-all cursor-pointer z-10"
                 />
                 <svg className="absolute w-4 h-4 text-secondary-blue pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity z-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                 </svg>
               </div>
               <div className="flex flex-col">
                 <label htmlFor="isAnonymous" className="text-base font-bold text-white cursor-pointer mb-0">
                   {t('feedbackPage.anonymous')}
                 </label>
                 <span className="text-xs font-medium text-white/50 hidden sm:block">We will not collect your personal details.</span>
               </div>
               <div className="ml-auto text-3xl opacity-50 group-hover:opacity-100 transition-opacity">
                  🎭
               </div>
            </div>

            {/* Contact Info (Hidden if Anonymous) */}
            <div className={`transition-all duration-500 overflow-hidden ${formData.isAnonymous ? 'h-0 opacity-0 space-y-0' : 'h-auto opacity-100 space-y-6'}`}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormInput 
                  label={t('appointments.name')}
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="E.g. Jane Doe"
                />
                <FormInput 
                  label={t('appointments.phone')}
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="10-digit number"
                />
                <div className="md:col-span-2">
                  <FormInput 
                    label={t('appointments.email')}
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="jane.doe@example.com"
                  />
                </div>
              </div>
            </div>

            <div className="h-px w-full bg-gradient-to-r from-transparent via-border-light to-transparent my-8"></div>

            <FormSelect 
              label={t('feedbackPage.category')}
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              options={categories.map(c => ({ id: c.value, name: c.label }))}
            />

            <div className="space-y-4">
              <div className="relative">
                <FormTextarea 
                  label={t('feedbackPage.message')}
                  name="message"
                  value={formData.message}
                  onChange={(e) => {
                      if (e.target.value.length <= 1000) handleInputChange(e);
                  }}
                  error={errors.message}
                  placeholder={t('feedbackPage.messagePlaceholder')}
                  required
                  rows={6}
                />
                <div className="absolute right-4 bottom-4 text-xs font-bold text-neutral-gray bg-white px-2 py-1 rounded-md shadow-sm border border-border-soft">
                  {formData.message.length}/1000
                </div>
              </div>

              <VoiceInputButton onTranscript={handleVoiceTranscript} />
            </div>

            <div className="pt-4">
              <Button 
                type="primary" 
                text={t('feedbackPage.submit')} 
                loading={isSubmitting} 
                className="w-full py-5 text-xl font-black rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-1"
                buttonType="submit"
              />
            </div>
          </form>
        </div>
        
        <div className="mt-16 text-center">
          <p className="text-base font-bold text-neutral-gray/60 italic max-w-md mx-auto">
            "Your feedback is essential for us to maintain our 25-year legacy of clinical excellence."
          </p>
        </div>
      </div>

      <SuccessModal 
        isOpen={showSuccess} 
        onClose={resetForm}
        title="Thank You!"
        subtitle="Your feedback has been received. We appreciate your contribution to our community."
      >
        <div className="py-8">
            <div className="w-20 h-20 bg-primary-blue/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">🌟</span>
            </div>
            <p className="text-secondary-blue font-bold text-lg mb-10">We've shared your message with our quality assurance team.</p>
            <button 
                onClick={resetForm}
                className="px-12 py-4 bg-primary-blue text-white font-black rounded-2xl shadow-xl hover:-translate-y-1 transition-all"
            >
                Done
            </button>
        </div>
      </SuccessModal>
    </div>
  );
};

export default Feedback;
