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
      
      <div className="mb-16 text-center lg:text-left space-y-2">
         <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-blue/10 text-primary-blue text-[10px] font-black uppercase tracking-widest">
           Support & Inquiry
         </div>
         <h1 className="text-4xl md:text-5xl font-black text-secondary-blue tracking-tight leading-tight">
           {t('contactPage.title')}
         </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
        
        {/* Left Side: Hospital Info & Map */}
        <div className="space-y-12">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-8 rounded-[32px] shadow-premium border border-border-soft group hover:border-primary-blue/30 transition-all duration-300">
              <div className="w-12 h-12 rounded-2xl bg-primary-blue/10 flex items-center justify-center text-2xl mb-6 group-hover:bg-primary-blue group-hover:text-white transition-all">
                📍
              </div>
              <h4 className="font-black text-secondary-blue text-lg mb-2 leading-tight uppercase tracking-tight">{t('contactPage.infoTitle')}</h4>
              <p className="text-sm text-text-muted font-medium leading-relaxed">
                {t('footer.address')}
              </p>
            </div>

            <div className="bg-white p-8 rounded-[32px] shadow-premium border border-border-soft group hover:border-primary-blue/30 transition-all duration-300">
              <div className="w-12 h-12 rounded-2xl bg-primary-blue/10 flex items-center justify-center text-2xl mb-6 group-hover:bg-primary-blue group-hover:text-white transition-all">
                📞
              </div>
              <h4 className="font-black text-secondary-blue text-lg mb-4 leading-tight uppercase tracking-tight">Direct Lines</h4>
              <div className="space-y-2">
                <a href="tel:+918028437150" className="block text-sm text-text-muted hover:text-primary-blue font-bold transition-colors">
                  +91-80-2843 7150
                </a>
                <a href="tel:+918028437468" className="block text-sm text-text-muted hover:text-primary-blue font-bold transition-colors">
                  +91-80-2843 7468
                </a>
              </div>
            </div>

            <div className="bg-white p-8 rounded-[32px] shadow-premium border border-border-soft group hover:border-primary-blue/30 transition-all duration-300">
              <div className="w-12 h-12 rounded-2xl bg-primary-blue/10 flex items-center justify-center text-2xl mb-6 group-hover:bg-primary-blue group-hover:text-white transition-all">
                📧
              </div>
              <h4 className="font-black text-secondary-blue text-lg mb-2 leading-tight uppercase tracking-tight">Email Us</h4>
              <a href={`mailto:${t('footer.email')}`} className="text-sm text-text-muted hover:text-primary-blue font-bold transition-all border-b-2 border-primary-blue/10 hover:border-primary-blue">
                {t('footer.email')}
              </a>
            </div>

            <div className="bg-secondary-blue p-8 rounded-[32px] shadow-premium-hover border border-white/10 group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -mr-16 -mt-16"></div>
              <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-2xl mb-6 group-hover:bg-white group-hover:text-secondary-blue transition-all relative z-10">
                ⏰
              </div>
              <h4 className="font-black text-white text-lg mb-2 leading-tight uppercase tracking-tight relative z-10">{t('contactPage.operatingHours')}</h4>
              <p className="text-[10px] text-white/50 font-black uppercase tracking-[0.2em] mb-1 relative z-10">{t('contactPage.hoursText')}</p>
              <p className="text-xs text-accent-emerald font-black uppercase tracking-widest relative z-10">OPEN MON - SAT</p>
            </div>
          </div>

          {/* Map Embed */}
          <div className="rounded-[48px] overflow-hidden shadow-premium hover:shadow-premium-hover border-4 border-white relative group transition-all duration-500 h-[450px]">
             <iframe 
               src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3889.34968393356!2d77.4427503756358!3d12.889055987418428!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae3f4000000001%3A0x6b490453303c734!2sRajarajeswari%20Dental%20College%20and%20Hospital!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin" 
               width="100%" 
               height="100%" 
               style={{ border: 0 }} 
               allowFullScreen="" 
               loading="lazy" 
               referrerPolicy="no-referrer-when-downgrade"
               title="RRDCH Hospital Location"
               className="grayscale group-hover:grayscale-0 transition-all duration-1000 scale-[1.01] group-hover:scale-110"
             ></iframe>
             <div className="absolute bottom-8 left-8 bg-white/95 backdrop-blur-md px-6 py-3 rounded-[24px] shadow-2xl border border-white/20">
                <div className="text-[10px] font-black text-primary-blue uppercase tracking-widest mb-1">Clinic Location</div>
                <div className="text-sm font-black text-secondary-blue">RRDCH Campus, Kumbalgodu</div>
             </div>
          </div>

          {/* Quick Links */}
          <div className="bg-soft-bg rounded-[32px] p-8 border border-border-soft relative overflow-hidden group">
             <div className="absolute top-0 right-0 w-24 h-24 bg-primary-blue/5 rounded-full blur-2xl -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-700"></div>
             <h3 className="font-black text-secondary-blue mb-6 uppercase tracking-[0.2em] text-[10px] flex items-center gap-3">
                <div className="w-8 h-1 bg-primary-blue rounded-full"></div>
                {t('contactPage.quickHeading')}
             </h3>
             <div className="grid grid-cols-2 gap-y-4 gap-x-8">
               {['Departments', 'Events', 'Admissions', 'Student Portal'].map(link => (
                 <Link key={link} to={`/${link.toLowerCase().replace(' ', '-')}`} className="text-sm text-text-muted font-bold hover:text-primary-blue hover:translate-x-2 transition-all flex items-center gap-3 group/link">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary-blue/30 group-hover/link:bg-primary-blue group-hover/link:w-4 transition-all"></span> 
                    {link}
                 </Link>
               ))}
             </div>
          </div>
        </div>

        {/* Right Side: Contact Form */}
        <div className="lg:mt-0">
          <div className="bg-white rounded-[40px] shadow-premium border border-border-soft p-8 md:p-12 sticky top-24 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-blue/5 rounded-full -mr-16 -mt-16 blur-3xl"></div>
            <h2 className="text-3xl font-black text-secondary-blue mb-10 tracking-tight leading-tight">
              {t('contactPage.formTitle')}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <FormInput 
                label={t('appointments.name')}
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                error={errors.name}
                required
                placeholder="Ex. John Doe"
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                <FormInput 
                  label={t('appointments.email')}
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  error={errors.email}
                  required
                  placeholder="name@email.com"
                />
                <FormInput 
                  label={t('appointments.phone')}
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+91 91234 56789"
                />
              </div>

              <FormInput 
                label={t('contactPage.subject')}
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                error={errors.subject}
                required
                placeholder="What can we help you with?"
              />

              <FormTextarea 
                label={t('contactPage.message')}
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                error={errors.message}
                required
                rows={4}
                placeholder="Type your detailed message here..."
              />

              <div className="pt-6">
                <Button 
                  type="primary" 
                  text={t('contactPage.formTitle')} 
                  loading={isSubmitting} 
                  className="w-full py-4 text-lg shadow-premium hover:shadow-premium-hover active:scale-95 transition-all"
                  buttonType="submit"
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
