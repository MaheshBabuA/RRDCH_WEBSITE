import React, { useState } from 'react';
import { useLanguage } from '../utils/i18n';
import apiService from '../services/api';
import FormInput from '../components/FormInput';
import FormSelect from '../components/FormSelect';
import FormTextarea from '../components/FormTextarea';
import Button from '../components/Button';
import Card from '../components/Card';

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
  const [isSuccess, setIsSuccess] = useState(false);

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

  const validate = () => {
    const newErrors = {};
    if (formData.rating === 0) newErrors.rating = t('appointments.errors.deptReq'); // Reuse general req error
    if (formData.message.length < 20) newErrors.message = t('hostelComplaints.minChars');
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await apiService.feedback.submit(formData);
      setIsSuccess(true);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '', email: '', phone: '', rating: 0, category: '', message: '', isAnonymous: false
    });
    setIsSuccess(false);
    setErrors({});
  };

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-secondary-blue mb-3">{t('feedbackPage.title')}</h1>
        <p className="text-neutral-gray">{t('feedbackPage.subtitle')}</p>
      </div>

      {!isSuccess ? (
        <Card className="shadow-xl p-8 border-t-4 border-t-primary-blue">
          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Rating Section */}
            <div className="text-center">
              <label className="block text-lg font-bold text-secondary-blue mb-4">
                {t('feedbackPage.ratingLabel')}
              </label>
              <div className="flex items-center justify-center gap-2 mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className="focus:outline-none transition-transform active:scale-90"
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => {
                        setFormData(prev => ({ ...prev, rating: star }));
                        setErrors(prev => ({ ...prev, rating: '' }));
                    }}
                  >
                    <svg 
                      className={`w-12 h-12 transition-colors ${
                        (hoverRating || formData.rating) >= star ? 'text-yellow-400 fill-current' : 'text-gray-300 fill-none stroke-current'
                      }`}
                      viewBox="0 0 24 24" 
                      strokeWidth="1.5"
                    >
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  </button>
                ))}
              </div>
              <div className="h-6 text-sm font-bold text-primary-blue capitalize">
                {t(`feedbackPage.ratings.${hoverRating || formData.rating}`) || ''}
              </div>
              {errors.rating && <p className="text-error-red text-xs mt-1">{errors.rating}</p>}
            </div>

            {/* Anonymous Toggle */}
            <div className="flex items-center gap-3 p-4 bg-light-bg rounded-xl border border-border-light/50">
               <input 
                 type="checkbox" 
                 id="isAnonymous" 
                 name="isAnonymous"
                 checked={formData.isAnonymous}
                 onChange={handleInputChange}
                 className="w-5 h-5 rounded border-gray-300 text-primary-blue focus:ring-primary-blue"
               />
               <label htmlFor="isAnonymous" className="text-sm font-bold text-secondary-blue cursor-pointer">
                 {t('feedbackPage.anonymous')}
               </label>
            </div>

            {/* Contact Info (Hidden if Anonymous) */}
            {!formData.isAnonymous && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
                <FormInput 
                  label={t('appointments.name')}
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="John Doe"
                />
                <FormInput 
                  label={t('appointments.phone')}
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="9876543210"
                />
                <div className="md:col-span-2">
                  <FormInput 
                    label={t('appointments.email')}
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="john@example.com"
                  />
                </div>
              </div>
            )}

            <FormSelect 
              label={t('feedbackPage.category')}
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              options={categories.map(c => ({ id: c.value, name: c.label }))}
            />

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
                rows={5}
              />
              <div className="text-right text-xs text-neutral-gray mt-1">
                {formData.message.length}/1000
              </div>
            </div>

            <Button 
              type="primary" 
              text={t('feedbackPage.submit')} 
              loading={isSubmitting} 
              className="w-full py-4 text-lg shadow-lg"
              buttonType="submit"
            />
          </form>
        </Card>
      ) : (
        /* Success State */
        <Card className="text-center p-12 border-t-8 border-t-success-green animate-fade-in shadow-2xl">
          <div className="w-20 h-20 bg-success-green/10 rounded-full flex items-center justify-center mx-auto mb-6">
             <svg className="w-10 h-10 text-success-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
             </svg>
          </div>
          <h2 className="text-3xl font-bold text-secondary-blue mb-4">{t('feedbackPage.successTitle')}</h2>
          <p className="text-neutral-gray mb-10 text-lg leading-relaxed">
            {t('feedbackPage.successMessage')}
          </p>
          <Button 
            type="secondary" 
            text={t('feedbackPage.submitAnother')} 
            onClick={resetForm}
            className="w-full sm:w-auto px-10"
          />
        </Card>
      )}
      
      <div className="mt-12 text-center text-sm text-neutral-gray italic px-6">
        "Your feedback is essential for us to maintain our 25-year legacy of clinical excellence."
      </div>
    </div>
  );
};

export default Feedback;
