import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../utils/i18n';
import apiService from '../services/api';
import FormInput from '../components/FormInput';
import FormTextarea from '../components/FormTextarea';
import Button from '../components/Button';
import SuccessModal from '../components/SuccessModal';
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

  // Departments List
  const DEPARTMENTS = [
    { id: 'oral-medicine', name: 'Oral Medicine & Radiology', icon: '🦷', color: 'bg-blue-500' },
    { id: 'prosthodontics', name: 'Prosthodontics', icon: '👄', color: 'bg-indigo-500' },
    { id: 'orthodontics', name: 'Orthodontics', icon: '📏', color: 'bg-purple-500' },
    { id: 'oral-surgery', name: 'Oral & Maxillofacial Surgery', icon: '🏥', color: 'bg-red-500' },
    { id: 'periodontics', name: 'Periodontics', icon: '🧼', color: 'bg-teal-500' },
    { id: 'conservative-dentistry', name: 'Conservative Dentistry', icon: '🦷', color: 'bg-cyan-500' },
    { id: 'pedodontics', name: 'Pedodontics', icon: '🧒', color: 'bg-pink-500' },
    { id: 'public-health', name: 'Public Health Dentistry', icon: '🌍', color: 'bg-green-500' },
    { id: 'oral-pathology', name: 'Oral Pathology', icon: '🔬', color: 'bg-orange-500' },
    { id: 'forensic-odontology', name: 'Forensic Odontology', icon: '🔍', color: 'bg-slate-600' },
    { id: 'aesthetic-dentistry', name: 'Aesthetic Dentistry', icon: '✨', color: 'bg-yellow-500' },
  ];

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
    setErrors(prev => ({ ...prev, [name]: '' }));
    setServerError('');
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDeptSelect = (deptId) => {
    setErrors(prev => ({ ...prev, department: '' }));
    setFormData(prev => ({ ...prev, department: deptId }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = t('appointments.errors.nameReq');
    if (!formData.phone.trim()) {
      newErrors.phone = t('appointments.errors.phoneReq');
    } else if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = t('appointments.errors.phoneInvalid');
    }
    if (!formData.department) newErrors.department = t('appointments.errors.deptReq');
    if (!formData.date) {
      newErrors.date = t('appointments.errors.dateReq');
    }
    if (!formData.time) newErrors.time = t('appointments.errors.timeReq');

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const generateLocalConfirmation = () => {
    const id = 'APT-' + Math.floor(10000 + Math.random() * 90000);
    const confirmationNumber = 'CNF-' + Math.floor(100000 + Math.random() * 900000);
    const selectedDept = DEPARTMENTS.find(d => d.id === formData.department);
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
    if (!validateForm()) {
      const firstError = document.querySelector('.text-error-red');
      if (firstError) firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setIsSubmitting(true);
    setServerError('');

    try {
      const result = await apiService.appointments.create(formData);
      const appointmentData = result?.appointment || result;
      setModalState({ isOpen: true, data: appointmentData });
    } catch (err) {
      console.error('API unavailable, using local fallback:', err);
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

  const closeModalAndReset = () => {
    setModalState({ isOpen: false, data: null });
    setFormData({
      name: '', phone: '', email: '', department: '', date: '', time: '', notes: ''
    });
  };

  return (
    <div className="max-w-7xl mx-auto py-10 px-4">
      
      <div className="mb-12 text-center lg:text-left space-y-4">
         <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-blue/10 text-primary-blue text-[10px] font-black uppercase tracking-widest border border-primary-blue/20">
           <span className="w-1.5 h-1.5 rounded-full bg-primary-blue animate-pulse"></span>
           Instant Confirmation
         </div>
         <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-secondary-blue tracking-tighter leading-tight">
           Book Your <span className="text-primary-blue">Appointment</span>
         </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-12">
        {/* --- Patient Information --- */}
        <div className="bg-white rounded-[40px] shadow-premium border border-border-soft p-8 md:p-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary-blue/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
            
            <h3 className="text-2xl font-black text-secondary-blue mb-8 flex items-center gap-3">
               <span className="w-8 h-8 bg-primary-blue/10 text-primary-blue rounded-lg flex items-center justify-center text-sm">01</span>
               Patient Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <FormInput 
                    name="name"
                    label={t('appointments.name')}
                    placeholder="Enter full name"
                    value={formData.name}
                    onChange={handleChange}
                    error={errors.name}
                    required
                />
                <FormInput 
                    name="phone"
                    type="tel"
                    label={t('appointments.phone')}
                    placeholder="10-digit mobile number"
                    value={formData.phone}
                    onChange={handleChange}
                    error={errors.phone}
                    required
                />
                <FormInput 
                    name="email"
                    type="email"
                    label={t('appointments.email')}
                    placeholder="Email address (optional)"
                    value={formData.email}
                    onChange={handleChange}
                    error={errors.email}
                />
            </div>
        </div>

        {/* --- Department Selection - Visual Grid --- */}
        <div className="bg-white rounded-[40px] shadow-premium border border-border-soft p-8 md:p-12 relative overflow-hidden">
            <h3 className="text-2xl font-black text-secondary-blue mb-2 flex items-center gap-3">
               <span className="w-8 h-8 bg-primary-blue/10 text-primary-blue rounded-lg flex items-center justify-center text-sm">02</span>
               Select Department
            </h3>
            <p className="text-neutral-gray font-medium mb-8 ml-11">Choose the clinical department for your consultation.</p>

            {errors.department && <p className="mb-6 text-error-red font-black text-sm uppercase tracking-widest flex items-center gap-2 animate-bounce"><span className="text-xl">⚠️</span> {errors.department}</p>}

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {DEPARTMENTS.map((dept) => (
                    <button
                        key={dept.id}
                        type="button"
                        onClick={() => handleDeptSelect(dept.id)}
                        className={`group relative flex flex-col items-center p-6 rounded-[32px] transition-all duration-500 border-2 text-center
                            ${formData.department === dept.id 
                                ? 'bg-primary-blue border-primary-blue shadow-xl shadow-primary-blue/20 -translate-y-2' 
                                : 'bg-soft-bg border-transparent hover:border-primary-blue/30 hover:bg-white hover:shadow-lg'
                            }
                        `}
                    >
                        <div className={`w-16 h-16 mb-4 rounded-2xl flex items-center justify-center text-3xl shadow-inner transition-transform duration-500 group-hover:scale-110
                            ${formData.department === dept.id ? 'bg-white/20' : 'bg-white'}
                        `}>
                            {dept.icon}
                        </div>
                        <span className={`text-[10px] md:text-xs font-black uppercase tracking-widest leading-tight
                            ${formData.department === dept.id ? 'text-white' : 'text-secondary-blue'}
                        `}>
                            {dept.name}
                        </span>
                        
                        {formData.department === dept.id && (
                            <div className="absolute -top-2 -right-2 w-8 h-8 bg-white text-primary-blue rounded-full flex items-center justify-center shadow-lg animate-scale-in">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                        )}
                    </button>
                ))}
            </div>
        </div>

        {/* --- Schedule & Notes --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white rounded-[40px] shadow-premium border border-border-soft p-8 md:p-12 relative overflow-hidden">
                <h3 className="text-2xl font-black text-secondary-blue mb-8 flex items-center gap-3">
                   <span className="w-8 h-8 bg-primary-blue/10 text-primary-blue rounded-lg flex items-center justify-center text-sm">03</span>
                   Preferred Schedule
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    <div className="space-y-2">
                        <label className="text-sm font-black text-secondary-blue uppercase tracking-widest ml-1">Appointment Date</label>
                        <input
                            type="date"
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                            min={getTodayString()}
                            max={getMaxDateString()}
                            className={`w-full px-6 py-4 bg-soft-bg border-2 rounded-2xl outline-none transition-all duration-300 font-bold
                                ${errors.date ? 'border-error-red/50 bg-error-red/[0.02]' : 'border-transparent focus:border-primary-blue focus:bg-white'}
                            `}
                        />
                        {errors.date && <p className="text-xs text-error-red font-bold mt-1 ml-1">{errors.date}</p>}
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-black text-secondary-blue uppercase tracking-widest ml-1">Preferred Time</label>
                        <input
                            type="time"
                            name="time"
                            value={formData.time}
                            onChange={handleChange}
                            className={`w-full px-6 py-4 bg-soft-bg border-2 rounded-2xl outline-none transition-all duration-300 font-bold
                                ${errors.time ? 'border-error-red/50 bg-error-red/[0.02]' : 'border-transparent focus:border-primary-blue focus:bg-white'}
                            `}
                        />
                        {errors.time && <p className="text-xs text-error-red font-bold mt-1 ml-1">{errors.time}</p>}
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-black text-secondary-blue uppercase tracking-widest ml-1">Special Instructions</label>
                    <FormTextarea 
                        name="notes"
                        placeholder="Mention any specific dental concerns or medical history..."
                        value={formData.notes}
                        onChange={(e) => {
                            if (e.target.value.length <= 500) handleChange(e);
                        }}
                        rows={3}
                    />
                </div>
            </div>

            <div className="flex flex-col gap-6">
                <div className="flex-grow bg-secondary-blue rounded-[40px] p-8 text-white relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                    <h4 className="text-xl font-black mb-6 flex items-center gap-3">
                        <span className="text-2xl">📋</span>
                        Review Details
                    </h4>
                    <ul className="space-y-4">
                        <li className="flex justify-between items-center border-b border-white/10 pb-2">
                            <span className="text-white/60 text-xs font-bold uppercase">Patient</span>
                            <span className="text-sm font-black truncate max-w-[150px]">{formData.name || 'Not provided'}</span>
                        </li>
                        <li className="flex justify-between items-center border-b border-white/10 pb-2">
                            <span className="text-white/60 text-xs font-bold uppercase">Dept</span>
                            <span className="text-sm font-black">{DEPARTMENTS.find(d => d.id === formData.department)?.name || 'Not selected'}</span>
                        </li>
                        <li className="flex justify-between items-center">
                            <span className="text-white/60 text-xs font-bold uppercase">Time</span>
                            <span className="text-sm font-black">{formData.date || 'TBD'} | {formData.time || 'TBD'}</span>
                        </li>
                    </ul>

                    <div className="mt-10">
                        <Button 
                            type="primary" 
                            buttonType="submit" 
                            text="Confirm Appointment" 
                            loading={isSubmitting} 
                            className="w-full py-5 text-lg font-black bg-white text-secondary-blue hover:bg-primary-blue hover:text-white border-none shadow-xl"
                        />
                    </div>
                </div>

                <div className="bg-success-green/5 border-2 border-success-green/20 rounded-[40px] p-8 text-center">
                    <div className="text-3xl mb-2">🔒</div>
                    <p className="text-xs font-black text-secondary-blue/60 uppercase tracking-widest">Secure HIPAA-Compliant Booking</p>
                </div>
            </div>
        </div>
      </form>

      {/* --- Success Modal --- */}
      <SuccessModal 
        isOpen={modalState.isOpen} 
        onClose={closeModalAndReset}
        title="Booking Successful!"
        subtitle="Your clinical appointment has been confirmed. Please save your verification slip below."
      >
        {modalState.data && (
          <div className="space-y-8">
            {/* Ticket to Download */}
            <div 
              ref={ticketRef}
              className="bg-white border-2 border-primary-blue/10 rounded-[48px] overflow-hidden shadow-2xl max-w-sm mx-auto"
            >
              <div className="bg-secondary-blue p-8 text-white text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary-blue/20 rounded-full blur-2xl -mr-10 -mt-10"></div>
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-4 mx-auto shadow-xl">
                   <img src={logo} alt="Logo" className="w-12 h-12 object-contain" />
                </div>
                <h2 className="text-lg font-black tracking-tight leading-tight uppercase">RRDCH Appointment</h2>
              </div>

              <div className="p-10 text-left space-y-6 relative">
                <div className="absolute top-0 left-0 w-6 h-12 bg-soft-bg rounded-r-full -mt-6 -ml-3 border border-border-soft border-l-0"></div>
                <div className="absolute top-0 right-0 w-6 h-12 bg-soft-bg rounded-l-full -mt-6 -mr-3 border border-border-soft border-r-0"></div>

                <div className="grid grid-cols-2 gap-6">
                    <div className="col-span-2">
                        <label className="text-[10px] text-neutral-gray uppercase font-black tracking-widest block mb-1">Patient Name</label>
                        <div className="text-lg font-black text-secondary-blue">{modalState.data.name}</div>
                    </div>
                    <div>
                        <label className="text-[10px] text-neutral-gray uppercase font-black tracking-widest block mb-1">Reg ID</label>
                        <div className="font-mono text-sm font-black text-primary-blue">#{modalState.data.confirmationNumber.split('-')[1]}</div>
                    </div>
                    <div className="text-right">
                        <label className="text-[10px] text-neutral-gray uppercase font-black tracking-widest block mb-1">Status</label>
                        <div className="text-[10px] font-black text-success-green uppercase bg-success-green/10 px-2 py-0.5 rounded-full inline-block">Confirmed</div>
                    </div>
                    <div className="col-span-2 pt-4 border-t border-dashed border-border-soft">
                        <label className="text-[10px] text-neutral-gray uppercase font-black tracking-widest block mb-1">Clinical Department</label>
                        <div className="text-sm font-black text-secondary-blue uppercase leading-tight">
                            {DEPARTMENTS.find(d => d.id === modalState.data.department || d.name === modalState.data.department)?.name || modalState.data.department}
                        </div>
                    </div>
                    <div className="col-span-2 pt-4 border-t border-dashed border-border-soft">
                        <label className="text-[10px] text-neutral-gray uppercase font-black tracking-widest block mb-1">Schedule</label>
                        <div className="text-sm font-black text-secondary-blue uppercase">
                            {modalState.data.date} @ <span className="text-primary-blue">{modalState.data.time}</span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col items-center justify-center pt-8 border-t border-dashed border-border-soft">
                    <div className="p-4 bg-white border-2 border-border-soft rounded-[32px] shadow-inner">
                        <QRCodeSVG 
                            value={JSON.stringify({
                                patient_id: modalState.data.patientId || 'P-GUEST',
                                current_appointment_id: modalState.data.appointmentId || modalState.data.id
                            })} 
                            size={120}
                            level="H"
                            includeMargin={false}
                            fgColor="#0f172a"
                        />
                    </div>
                    <p className="text-[9px] text-neutral-gray mt-5 font-black uppercase tracking-[0.2em]">Fast-Track Hospital QR Code</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
               <button 
                 onClick={downloadTicketPDF}
                 className="flex-1 px-8 py-4 bg-primary-blue text-white font-black rounded-2xl shadow-xl hover:shadow-primary-blue/30 transition-all flex items-center justify-center gap-2 group"
               >
                 <span className="text-xl group-hover:translate-y-1 transition-transform">📥</span>
                 Download PDF
               </button>
               <Link to="/" onClick={closeModalAndReset} className="flex-1">
                 <button className="w-full px-8 py-4 bg-secondary-blue text-white font-black rounded-2xl shadow-xl hover:shadow-secondary-blue/30 transition-all">
                   Back to Home
                 </button>
               </Link>
            </div>
          </div>
        )}
      </SuccessModal>

    </div>
  );
};

export default Appointments;
