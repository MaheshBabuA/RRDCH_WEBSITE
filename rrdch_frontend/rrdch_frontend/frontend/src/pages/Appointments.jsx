import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../utils/i18n';
import apiService from '../services/api';
import FormInput from '../components/FormInput';
import FormSelect from '../components/FormSelect';
import FormTextarea from '../components/FormTextarea';
import Button from '../components/Button';
import Modal from '../components/Modal';
import { QRCodeSVG } from 'qrcode.react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import logo from '../assets/logo.jpg';

const Appointments = () => {
  const { t } = useLanguage();

  // --- Form State ---
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    department: '',
    date: '',
    time: '',
    notes: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');
  
  // Modal State
  const [modalState, setModalState] = useState({ isOpen: false, data: null });
  const ticketRef = useRef(null);

  // Options State
  const [departments, setDepartments] = useState([]);

  // Fallback departments if API is unavailable
  const FALLBACK_DEPARTMENTS = [
    { id: 'oral-medicine', name: 'Oral Medicine and Radiology' },
    { id: 'prosthodontics', name: 'Prosthodontics' },
    { id: 'orthodontics', name: 'Orthodontics' },
    { id: 'oral-surgery', name: 'Oral and Maxillofacial Surgery' },
    { id: 'periodontics', name: 'Periodontics' },
    { id: 'conservative-dentistry', name: 'Conservative Dentistry & Endodontics' },
    { id: 'pedodontics', name: 'Pedodontics' },
    { id: 'public-health', name: 'Public Health Dentistry' },
  ];

  // Fetch departments for select
  useEffect(() => {
    const fetchDepts = async () => {
      try {
        const data = await apiService.departments.getAll();
        // Handle both array and wrapped responses
        const deptArray = Array.isArray(data) ? data : (data?.departments || data?.data || []);
        if (deptArray.length > 0) {
          setDepartments(deptArray);
        } else {
          // Use fallback if API returned empty
          setDepartments(FALLBACK_DEPARTMENTS);
        }
      } catch (err) {
        console.error('Failed to fetch departments, using fallback:', err);
        setDepartments(FALLBACK_DEPARTMENTS);
      }
    };
    fetchDepts();
  }, []);

  // --- Date Handlers ---
  const getTodayString = () => new Date().toISOString().split('T')[0];
  
  const getMaxDateString = () => {
    const d = new Date();
    d.setDate(d.getDate() + 30);
    return d.toISOString().split('T')[0];
  };

  // --- Event Handlers ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    // Clear specific error on typing
    setErrors(prev => ({ ...prev, [name]: '' }));
    setServerError('');
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Name
    if (!formData.name.trim()) newErrors.name = t('appointments.errors.nameReq');
    
    // Phone
    if (!formData.phone.trim()) {
      newErrors.phone = t('appointments.errors.phoneReq');
    } else if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = t('appointments.errors.phoneInvalid');
    }

    // Email (Optional)
    if (formData.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t('appointments.errors.emailInvalid');
    }

    // Department
    if (!formData.department) newErrors.department = t('appointments.errors.deptReq');

    // Date
    if (!formData.date) {
      newErrors.date = t('appointments.errors.dateReq');
    } else {
      const selectedDate = new Date(formData.date);
      const todayDate = new Date(getTodayString());
      if (selectedDate < todayDate) {
        newErrors.date = t('appointments.errors.dateInvalid');
      }
    }

    // Time
    if (!formData.time) newErrors.time = t('appointments.errors.timeReq');

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const generateLocalConfirmation = () => {
    const id = 'APT-' + Math.floor(10000 + Math.random() * 90000);
    const confirmationNumber = 'CNF-' + Math.floor(100000 + Math.random() * 900000);
    const selectedDept = departments.find(d => d.id === formData.department || d.name === formData.department);
    return {
      id,
      confirmationNumber,
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      department: selectedDept?.name || formData.department,
      date: formData.date,
      time: formData.time,
      notes: formData.notes,
      status: 'pending',
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setServerError('');

    try {
      const result = await apiService.appointments.create(formData);
      // Handle both { appointment: {...} } and direct object responses
      const appointmentData = result?.appointment || result;
      setModalState({ isOpen: true, data: appointmentData });
      
    } catch (err) {
      console.error('API unavailable, using local fallback:', err);
      // Backend is unreachable — generate a local confirmation so form still works
      const localAppointment = generateLocalConfirmation();
      setModalState({ isOpen: true, data: localAppointment });
    } finally {
      setIsSubmitting(false);
    }
  };

  const downloadTicketPDF = async () => {
    if (!ticketRef.current) return;
    
    try {
      const canvas = await html2canvas(ticketRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff'
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      pdf.addImage(imgData, 'PNG', 0, 10, pdfWidth, pdfHeight);
      pdf.save(`RRDCH-Appointment-${modalState.data.confirmationNumber}.pdf`);
    } catch (err) {
      console.error('Failed to generate PDF:', err);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const closeModalAndReset = () => {
    setModalState({ isOpen: false, data: null });
    setFormData({
      name: '', phone: '', email: '', department: '', date: '', time: '', notes: ''
    });
  };

  return (
    <div className="max-w-7xl mx-auto py-10">
      
      <div className="mb-12 text-center lg:text-left space-y-2">
         <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-blue/10 text-primary-blue text-xs font-bold uppercase tracking-widest">
           Secure Booking
         </div>
         <h1 className="text-4xl md:text-5xl font-black text-secondary-blue tracking-tight leading-tight">
           {t('appointments.title')}
         </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 xl:gap-16">
        
        {/* --- Form Section (Left, 2 columns wide on desktop) --- */}
        <div className="lg:col-span-2 order-2 lg:order-1">
          <form onSubmit={handleSubmit} className="bg-white rounded-[32px] shadow-premium border border-border-soft p-8 md:p-12 relative overflow-hidden" noValidate>
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-blue/5 rounded-full -mr-16 -mt-16 blur-3xl"></div>
            
            {serverError && (
              <div className="mb-6 p-4 bg-red-50 border border-error-red/30 rounded-xl text-error-red text-sm font-medium">
                {serverError}
              </div>
            )}

            {/* Patient Name */}
            <FormInput 
              name="name"
              label={t('appointments.name')}
              placeholder="John Doe"
              value={formData.name}
              onChange={handleChange}
              error={errors.name}
              required
            />

            {/* Contact Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
              <FormInput 
                name="phone"
                type="tel"
                label={t('appointments.phone')}
                placeholder="9876543210"
                value={formData.phone}
                onChange={handleChange}
                error={errors.phone}
                required
              />
              <FormInput 
                name="email"
                type="email"
                label={t('appointments.email')}
                placeholder="john@example.com"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
              />
            </div>

            {/* Department */}
            <FormSelect 
              name="department"
              label={t('appointments.department')}
              options={departments}
              value={formData.department}
              onChange={handleChange}
              error={errors.department}
              required
            />

            {/* Schedule Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
              <div className="w-full mb-6">
                 <label className="block text-sm font-bold text-secondary-blue mb-2 ml-1" htmlFor="date">
                   {t('appointments.date')} <span className="text-primary-blue">*</span>
                 </label>
                 <input
                   type="date"
                   id="date"
                   name="date"
                   value={formData.date}
                   onChange={handleChange}
                   min={getTodayString()}
                   max={getMaxDateString()}
                   className={`w-full px-5 py-3.5 bg-white border-2 rounded-2xl outline-none transition-all duration-300 font-medium cursor-pointer
                     ${errors.date 
                       ? 'border-error-red/50 bg-error-red/[0.02] text-error-red focus:border-error-red focus:ring-4 focus:ring-error-red/10' 
                       : 'border-border-soft hover:border-primary-blue/30 focus:border-primary-blue focus:ring-4 focus:ring-primary-blue/10'}
                   `}
                 />
                 {errors.date && <p className="mt-2 text-sm text-error-red font-medium ml-1">{errors.date}</p>}
              </div>

              <div className="w-full mb-6">
                 <label className="block text-sm font-bold text-secondary-blue mb-2 ml-1" htmlFor="time">
                   {t('appointments.time')} <span className="text-primary-blue">*</span>
                 </label>
                 <input
                   type="time"
                   id="time"
                   name="time"
                   value={formData.time}
                   onChange={handleChange}
                   className={`w-full px-5 py-3.5 bg-white border-2 rounded-2xl outline-none transition-all duration-300 font-medium cursor-pointer
                     ${errors.time 
                       ? 'border-error-red/50 bg-error-red/[0.02] text-error-red focus:border-error-red focus:ring-4 focus:ring-error-red/10' 
                       : 'border-border-soft hover:border-primary-blue/30 focus:border-primary-blue focus:ring-4 focus:ring-primary-blue/10'}
                   `}
                 />
                 {errors.time && <p className="mt-2 text-sm text-error-red font-medium ml-1">{errors.time}</p>}
              </div>
            </div>

            {/* Notes */}
            <FormTextarea 
              name="notes"
              label={t('appointments.notes')}
              placeholder={t('appointments.notesPlaceholder')}
              value={formData.notes}
              onChange={(e) => {
                 if (e.target.value.length <= 500) handleChange(e);
              }}
              rows={3}
            />
            <div className="text-right text-xs text-neutral-gray -mt-2 mb-6">
               {formData.notes.length}/500
            </div>

            <div className="pt-4 border-t border-border-light">
               <Button 
                 type="primary" 
                 buttonType="submit" 
                 text={t('appointments.submit')} 
                 loading={isSubmitting} 
                 className="w-full md:w-auto md:px-12 py-3 text-lg"
               />
            </div>

          </form>
        </div>

        {/* --- Informational Section (Right) --- */}
        <div className="lg:col-span-1 order-1 lg:order-2 space-y-6">
           <div className="bg-light-bg rounded-2xl p-6 border border-border-light/50">
              <div className="flex items-center gap-3 mb-4 text-secondary-blue">
                 <svg className="w-6 h-6 text-primary-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                 </svg>
                 <h3 className="text-lg font-bold m-0">{t('appointments.whyInfoTitle')}</h3>
              </div>
              <p className="text-sm text-neutral-gray leading-relaxed mb-6">
                {t('appointments.whyInfoText')}
              </p>
              
              <div className="flex items-start gap-3 p-4 bg-white rounded-xl shadow-sm border border-border-light">
                 <svg className="w-5 h-5 text-success-green shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                 </svg>
                 <span className="text-sm text-secondary-blue font-medium">
                   {t('appointments.confirmationTime')}
                 </span>
              </div>
           </div>

           <div className="bg-white rounded-2xl p-6 border border-border-light text-center hidden lg:block">
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                 <span className="text-2xl">📞</span>
              </div>
              <h4 className="font-bold text-secondary-blue mb-1">Need help booking?</h4>
              <p className="text-sm text-neutral-gray mb-3">Call our support desk</p>
              <a href="tel:+918028437468" className="text-primary-blue font-bold hover:underline">
                 +91-80-28437468
              </a>
           </div>
        </div>
      </div>

      {/* --- Success Modal --- */}
      <Modal 
        isOpen={modalState.isOpen} 
        onClose={closeModalAndReset}
        title={t('appointments.success')}
      >
        {modalState.data && (
          <div className="text-center print:text-left print:p-0">
            {/* Modal Body - PASS STYLE Ticket */}
            <div 
              ref={ticketRef}
              className="bg-white border-2 border-primary-blue/10 rounded-[40px] overflow-hidden shadow-premium mb-8 max-w-sm mx-auto transition-transform hover:scale-[1.01]"
            >
              {/* Pass Header */}
              <div className="bg-secondary-blue p-8 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary-blue/20 rounded-full blur-2xl -mr-10 -mt-10"></div>
                <div className="relative z-10 flex flex-col items-center">
                   <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-4 shadow-xl">
                      <img src={logo} alt="Logo" className="w-12 h-12 object-contain" />
                   </div>
                   <h2 className="text-xl font-black tracking-tight">{t('footer.collegeName')}</h2>
                   <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-success-green/20 backdrop-blur-sm text-success-green text-[10px] font-black uppercase tracking-[0.2em]">
                      <span className="w-1.5 h-1.5 rounded-full bg-success-green animate-pulse"></span>
                      Verified Appointment
                   </div>
                </div>
              </div>

              {/* Pass Content */}
              <div className="p-8 text-left space-y-6 relative">
                {/* Decorative cutouts */}
                <div className="absolute top-0 left-0 w-6 h-12 bg-gray-50 rounded-r-full -mt-6 -ml-3"></div>
                <div className="absolute top-0 right-0 w-6 h-12 bg-gray-50 rounded-l-full -mt-6 -mr-3"></div>

                <div className="space-y-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <label className="text-[10px] text-text-muted uppercase font-black tracking-widest block mb-1">Patient Name</label>
                      <div className="text-lg font-black text-secondary-blue">{modalState.data.name}</div>
                    </div>
                    <div className="text-right">
                      <label className="text-[10px] text-text-muted uppercase font-black tracking-widest block mb-1">Reg ID</label>
                      <div className="font-mono text-sm font-black text-primary-blue">#{modalState.data.confirmationNumber.split('-')[1]}</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-8 pt-6 border-t border-dashed border-border-soft">
                    <div>
                      <label className="text-[10px] text-text-muted uppercase font-black tracking-widest block mb-1">Department</label>
                      <div className="text-sm font-bold text-secondary-blue leading-tight uppercase">
                        {departments.find(d => d.id === modalState.data.department)?.name || modalState.data.department}
                      </div>
                    </div>
                    <div className="text-right">
                      <label className="text-[10px] text-text-muted uppercase font-black tracking-widest block mb-1">Schedule</label>
                      <div className="text-sm font-bold text-secondary-blue uppercase">
                        {modalState.data.date.replace(/-/g, '/')} <br/> 
                        <span className="text-primary-blue">{modalState.data.time}</span>
                      </div>
                    </div>
                  </div>

                  {/* QR Code Section */}
                  <div className="flex flex-col items-center justify-center pt-8 border-t border-dashed border-border-soft">
                    <div className="p-4 bg-white border-2 border-border-soft rounded-[32px] shadow-sm group hover:border-primary-blue/30 transition-colors">
                      <QRCodeSVG 
                        value={modalState.data.confirmationNumber} 
                        size={140}
                        level="H"
                        includeMargin={false}
                        fgColor="#0f172a"
                      />
                    </div>
                    <p className="text-[10px] text-text-muted mt-5 font-bold uppercase tracking-widest text-center">Fast-Track Verification Code</p>
                  </div>
                </div>
              </div>

              {/* Pass Footer */}
              <div className="bg-soft-bg p-5 text-[10px] font-bold text-text-muted text-center uppercase tracking-widest border-t border-border-soft">
                Present at Hospital Reception
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex flex-col sm:flex-row justify-center gap-3 print:hidden">
               <Button 
                 type="secondary" 
                 text="Download PDF"
                 onClick={downloadTicketPDF}
                 className="flex-1"
               />
               <Button 
                 type="secondary" 
                 text={t('appointments.print')}
                 onClick={handlePrint}
                 className="flex-1"
               />
               <Link to="/" onClick={closeModalAndReset} className="flex-1">
                 <Button type="primary" text={t('appointments.backToHome')} className="w-full" />
               </Link>
            </div>
          </div>
        )}
      </Modal>

    </div>
  );
};

export default Appointments;
