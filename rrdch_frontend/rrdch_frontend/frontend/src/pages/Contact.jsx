import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../utils/i18n';
import FormInput from '../components/FormInput';
import FormTextarea from '../components/FormTextarea';
import Button from '../components/Button';
import Card from '../components/Card';
import Toast from '../components/Toast';

const Contact = () => {
  const { t } = useLanguage();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = t('appointments.errors.nameReq');
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = t('appointments.errors.emailInvalid');
    if (!formData.subject.trim()) newErrors.subject = t('appointments.errors.nameReq'); // Generic req error
    if (!formData.message.trim()) newErrors.message = t('appointments.errors.nameReq');
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setShowToast(true);
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
  };

  return (
    <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
      {showToast && <Toast message={t('contactPage.success')} type="success" onClose={() => setShowToast(false)} />}
      
      <div className="text-center mb-16 underline-offset-8">
        <h1 className="text-4xl md:text-5xl font-bold text-secondary-blue mb-4">
          {t('contactPage.title')}
        </h1>
        <div className="w-24 h-1 bg-accent-green mx-auto rounded-full"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
        
        {/* Left Side: Hospital Info & Map */}
        <div className="space-y-12">
          
          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-secondary-blue flex items-center gap-3">
              <span className="p-2 bg-primary-blue/10 rounded-lg text-primary-blue">🏥</span>
              {t('contactPage.infoTitle')}
            </h2>
            
            <div className="space-y-6">
              <div className="flex gap-4 group">
                <div className="w-10 h-10 rounded-full bg-light-bg flex items-center justify-center flex-shrink-0 group-hover:bg-primary-blue group-hover:text-white transition-colors">
                  📍
                </div>
                <div>
                  <h4 className="font-bold text-secondary-blue leading-tight mb-1">{t('footer.collegeName')}</h4>
                  <p className="text-sm text-neutral-gray leading-relaxed max-w-sm">
                    {t('footer.address')}
                  </p>
                </div>
              </div>

              <div className="flex gap-4 group">
                <div className="w-10 h-10 rounded-full bg-light-bg flex items-center justify-center flex-shrink-0 group-hover:bg-primary-blue group-hover:text-white transition-colors">
                  📞
                </div>
                <div className="flex flex-col gap-1">
                  <a href="tel:+918028437150" className="text-sm text-neutral-gray hover:text-primary-blue transition-colors font-medium">
                    +91-80-2843 7150
                  </a>
                  <a href="tel:+918028437468" className="text-sm text-neutral-gray hover:text-primary-blue transition-colors font-medium text-bold">
                    +91-80-2843 7468
                  </a>
                  <a href="tel:+919901559955" className="text-sm text-neutral-gray hover:text-primary-blue transition-colors font-medium">
                    +91-99015 59955
                  </a>
                </div>
              </div>

              <div className="flex gap-4 group">
                <div className="w-10 h-10 rounded-full bg-light-bg flex items-center justify-center flex-shrink-0 group-hover:bg-primary-blue group-hover:text-white transition-colors">
                  📧
                </div>
                <a href={`mailto:${t('footer.email')}`} className="text-sm text-neutral-gray hover:text-primary-blue transition-colors font-medium self-center underline underline-offset-4 decoration-primary-blue/30">
                  {t('footer.email')}
                </a>
              </div>

              <div className="flex gap-4 group border-t border-border-light pt-6">
                <div className="w-10 h-10 rounded-full bg-light-bg flex items-center justify-center flex-shrink-0 group-hover:bg-accent-green group-hover:text-white transition-colors">
                  ⏰
                </div>
                <div>
                  <h4 className="font-bold text-secondary-blue text-sm mb-1">{t('contactPage.operatingHours')}</h4>
                  <p className="text-xs text-neutral-gray font-medium uppercase tracking-wide">{t('contactPage.hoursText')}</p>
                  <p className="text-xs text-error-red font-bold mt-0.5">{t('contactPage.sunday')}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Map Embed */}
          <div className="rounded-3xl overflow-hidden shadow-lg border border-border-light h-[350px] relative group">
             <iframe 
               src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3889.34968393356!2d77.4427503756358!3d12.889055987418428!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae3f4000000001%3A0x6b490453303c734!2sRajarajeswari%20Dental%20College%20and%20Hospital!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin" 
               width="100%" 
               height="100%" 
               style={{ border: 0 }} 
               allowFullScreen="" 
               loading="lazy" 
               referrerPolicy="no-referrer-when-downgrade"
               title="RRDCH Hospital Location"
               className="grayscale group-hover:grayscale-0 transition-all duration-700"
             ></iframe>
             <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1.5 rounded-full text-[10px] font-bold text-secondary-blue shadow-sm">
                RRDCH Campus, Kumbalgodu
             </div>
          </div>

          {/* Quick Links */}
          <div className="bg-light-bg rounded-2xl p-6 border border-border-light/50">
             <h3 className="font-bold text-secondary-blue mb-4 uppercase tracking-widest text-xs border-b border-border-light pb-2">
                {t('contactPage.quickHeading')}
             </h3>
             <div className="grid grid-cols-2 gap-4">
               {['Departments', 'Events', 'Admissions', 'Student Portal'].map(link => (
                 <Link key={link} to={`/${link.toLowerCase().replace(' ', '-')}`} className="text-sm text-neutral-gray hover:text-primary-blue hover:translate-x-1 transition-all flex items-center gap-2 font-medium">
                    <span className="text-primary-blue text-xs">◆</span> {link}
                 </Link>
               ))}
             </div>
          </div>
        </div>

        {/* Right Side: Contact Form */}
        <div className="lg:mt-0">
          <Card className="shadow-2xl border-t-8 border-t-primary-blue p-8 md:p-12 sticky top-24">
            <h2 className="text-2xl font-bold text-secondary-blue mb-8">
              {t('contactPage.formTitle')}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <FormInput 
                label={t('appointments.name')}
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                error={errors.name}
                required
                placeholder="John Doe"
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormInput 
                  label={t('appointments.email')}
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  error={errors.email}
                  required
                  placeholder="john@example.com"
                />
                <FormInput 
                  label={t('appointments.phone')}
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="9876543210 (Optional)"
                />
              </div>

              <FormInput 
                label={t('contactPage.subject')}
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                error={errors.subject}
                required
                placeholder="Admission Inquiry"
              />

              <FormTextarea 
                label={t('contactPage.message')}
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                error={errors.message}
                required
                rows={5}
                placeholder="Enter your message here..."
              />

              <Button 
                type="primary" 
                text={t('contactPage.formTitle')} 
                loading={isSubmitting} 
                className="w-full py-4 text-lg shadow-lg group"
                buttonType="submit"
              >
                {/* Custom children for icons if button supports it, or just use text prop */}
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Contact;
