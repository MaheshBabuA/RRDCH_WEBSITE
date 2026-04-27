import React, { useState } from 'react';
import VoiceInputButton from '../components/VoiceInputButton';
import { useLanguage } from '../utils/i18n';
import axios from 'axios';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

const AISymptomChecker = () => {
  const { t, language } = useLanguage();
  const [severity, setSeverity] = useState(50);
  const [duration, setDuration] = useState(30);
  const [symptomText, setSymptomText] = useState('');
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState(null);
  const [error, setError] = useState(null);
  const [interimText, setInterimText] = useState('');
  const [sttLanguage, setSttLanguage] = useState(language === 'kn' ? 'kn' : 'en');
  const [shouldTriggerReport, setShouldTriggerReport] = useState(false);

  React.useEffect(() => {
    if (shouldTriggerReport && symptomText.trim() && !loading) {
      handleGenerateReport();
      setShouldTriggerReport(false);
    }
  }, [shouldTriggerReport, symptomText, loading]);

  const handleVoiceTranscript = (transcript, isFinal) => {
    if (isFinal) {
      setSymptomText(prev => prev ? `${prev} ${transcript}` : transcript);
      setInterimText('');
    } else {
      setInterimText(transcript);
    }
  };

  const getFallbackReport = (symptoms, duration, severity) => {
    let urgency = 3;
    let dept = 'General Dentistry';
    let summary = 'Based on your symptoms, we recommend a general checkup.';
    let advice = ['Rinse mouth with warm salt water', 'Avoid very hot or cold foods', 'Take over-the-counter pain relievers if needed'];

    const sLower = symptoms.toLowerCase();
    if (sLower.includes('bleed') || severity > 80) {
      urgency = 9;
      dept = 'Oral Surgery / Emergency';
      summary = 'High severity symptoms or bleeding detected. Please seek immediate attention.';
      advice = ['Apply gentle pressure to any bleeding', 'Go to the emergency department or clinic immediately'];
    } else if (sLower.includes('swell') || sLower.includes('fever')) {
      urgency = 7;
      dept = 'Endodontics / General';
      summary = 'Possible infection indicated by swelling or fever.';
      advice = ['Use a cold compress on the outside of your cheek', 'Do not pop or drain any swelling'];
    } else if (sLower.includes('cavity') || sLower.includes('sweet') || sLower.includes('cold')) {
      urgency = 5;
      dept = 'Conservative Dentistry & Endodontics';
      summary = 'Symptoms suggest a possible cavity or tooth sensitivity.';
      advice = ['Avoid triggering foods (sweet, hot, cold)', 'Keep the area clean'];
    }

    return {
      Summary: summary,
      UrgencyMeter: urgency,
      RecommendedDepartment: dept,
      PreVisitAdvice: advice
    };
  };

  const handleGenerateReport = async () => {
    if (!symptomText.trim()) return;
    setLoading(true);
    setReport(null);
    setError(null);

    try {
      const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const res = await axios.post(`${API_BASE}/symptomChecker`, {
        symptoms: symptomText,
        duration: duration,
        language: language === 'kn' ? 'Kannada' : 'English'
      });
      if (res.data.success) {
        setReport(res.data.report);
      } else {
        throw new Error(res.data.message || 'Failed');
      }
    } catch (err) {
      console.error(err);
      const fallback = getFallbackReport(symptomText, duration, severity);
      setReport(fallback);
      setError('AI service unavailable. Showing offline assessment.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    const element = document.getElementById('ai-report-card');
    if (!element) return;
    
    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    
    pdf.setFontSize(22);
    pdf.setTextColor(41, 128, 185);
    pdf.text("RRDCH Smart Triage Report", 105, 20, { align: 'center' });
    
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    
    pdf.addImage(imgData, 'PNG', 0, 30, pdfWidth, pdfHeight);
    pdf.save('RRDCH_Triage_Report.pdf');
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="bg-white/70 backdrop-blur-[12px] border border-[rgba(0,121,191,0.3)] rounded-[40px] shadow-2xl overflow-hidden">
        <div className="bg-secondary-blue p-10 text-white text-center">
          <h1 className="text-4xl font-black mb-4 tracking-tight">{t('aiChecker.title')}</h1>
          <p className="text-blue-100 text-lg max-w-xl mx-auto">
            {t('aiChecker.subtitle')}
          </p>
        </div>

        <div className="p-10 grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Left Column: Visual & Info */}
          <div className="space-y-8">
            <div className="aspect-square bg-gradient-to-br from-primary-blue/10 to-success-green/10 rounded-[32px] flex items-center justify-center border border-primary-blue/20 relative group">
               <div className="w-48 h-48 bg-white rounded-full flex items-center justify-center shadow-2xl transition-transform group-hover:scale-110">
                  <span className="text-8xl">🦷</span>
               </div>
               <div className="absolute inset-0 bg-primary-blue/5 animate-pulse rounded-[32px]"></div>
            </div>
            
            <div className="p-6 bg-primary-blue/5 rounded-2xl border border-primary-blue/10">
              <h3 className="font-bold text-secondary-blue mb-2 flex items-center">
                <svg className="w-5 h-5 mr-2 text-primary-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {t('aiChecker.howItWorks')}
              </h3>
              <p className="text-sm text-text-muted leading-relaxed">
                {t('aiChecker.howItWorksDesc')}
              </p>
            </div>
          </div>

          {/* Right Column: Controls & Output */}
          <div className="space-y-10">
            {loading ? (
              <div className="h-full flex flex-col items-center justify-center space-y-6">
                <div className="relative">
                  <div className="w-24 h-24 bg-primary-blue/20 rounded-full flex items-center justify-center animate-pulse">
                    <span className="text-5xl animate-bounce">🧠</span>
                  </div>
                  <div className="absolute inset-0 border-4 border-primary-blue rounded-full animate-ping opacity-20"></div>
                </div>
                <h3 className="text-xl font-bold text-secondary-blue animate-pulse">
                  {language === 'kn' ? 'ರೋಗಲಕ್ಷಣಗಳನ್ನು ಸ್ಕ್ಯಾನ್ ಮಾಡಲಾಗುತ್ತಿದೆ...' : 'Scanning Symptoms...'}
                </h3>
              </div>
            ) : report ? (
              <div className="space-y-6">
                <div id="ai-report-card" className="bg-white/80 backdrop-blur-xl border border-[rgba(0,121,191,0.3)] p-6 rounded-2xl shadow-xl">
                  {error && (
                    <div className="mb-4 p-3 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl text-sm font-medium">
                      ⚠️ {error}
                    </div>
                  )}
                  <h2 className="text-2xl font-black text-secondary-blue mb-4 border-b border-gray-100 pb-3">
                    {language === 'kn' ? 'AI ಸ್ಮಾರ್ಟ್ ಟ್ರೈಯೇಜ್ ವರದಿ' : 'AI Smart Triage Report'}
                  </h2>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-end border-b border-gray-100 pb-2">
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                          {language === 'kn' ? 'ಸಾರಾಂಶ' : 'Summary'}
                        </h4>
                        <p className="text-gray-800 font-medium">{report.Summary}</p>
                      </div>
                      {report.DetectedLanguage && (
                        <div className="ml-4 flex-shrink-0 text-right">
                          <span className="text-[10px] font-black uppercase tracking-wider text-gray-400">Detected Lang</span>
                          <div className="text-primary-blue font-bold text-sm bg-primary-blue/5 px-2 py-1 rounded-md border border-primary-blue/10">
                            {report.DetectedLanguage}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                          {language === 'kn' ? 'ತುರ್ತು ಮಟ್ಟ' : 'Urgency Meter'}
                        </h4>
                        <div className="flex items-center space-x-2">
                          <span className={`text-2xl font-black ${report.UrgencyMeter > 7 ? 'text-error-red' : report.UrgencyMeter > 4 ? 'text-amber-500' : 'text-success-green'}`}>
                            {report.UrgencyMeter}/10
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                          <div 
                            className={`h-1.5 rounded-full ${report.UrgencyMeter > 7 ? 'bg-error-red' : report.UrgencyMeter > 4 ? 'bg-amber-500' : 'bg-success-green'}`} 
                            style={{ width: `${(report.UrgencyMeter / 10) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div className="bg-primary-blue/5 p-3 rounded-xl border border-primary-blue/10">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                          {language === 'kn' ? 'ಶಿಫಾರಸು ಮಾಡಿದ ವಿಭಾಗ' : 'Recommended Dept'}
                        </h4>
                        <p className="text-primary-blue font-bold text-sm">{report.RecommendedDepartment}</p>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                        {language === 'kn' ? 'ಭೇಟಿ ನೀಡುವ ಮುನ್ನ ಸಲಹೆ' : 'Pre-Visit Advice'}
                      </h4>
                      <ul className="space-y-2">
                        {report.PreVisitAdvice?.map((advice, idx) => (
                          <li key={idx} className="flex items-start">
                            <svg className="w-4 h-4 text-success-green mt-0.5 mr-2 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span className="text-sm text-gray-700">{advice}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={() => setReport(null)}
                    className="py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold transition-colors text-sm"
                  >
                    {language === 'kn' ? 'ಹೊಸ ತಪಾಸಣೆ' : 'New Check'}
                  </button>
                  <button 
                    onClick={handleDownloadPDF}
                    className="py-3 px-4 bg-secondary-blue hover:bg-primary-blue text-white rounded-xl font-bold transition-all shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 text-sm"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    <span>{language === 'kn' ? 'ವರದಿ ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ' : 'Download PDF'}</span>
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="space-y-4">
                  <h3 className="text-sm font-black uppercase tracking-widest text-secondary-blue">{t('aiChecker.describeSymptoms')}</h3>
                  <div className="relative">
                    <textarea 
                      value={symptomText + (interimText ? (symptomText ? ' ' : '') + interimText : '')}
                      onChange={(e) => {
                        setSymptomText(e.target.value);
                        setInterimText('');
                      }}
                      placeholder={t('aiChecker.placeholder')}
                      className="w-full p-4 pb-20 bg-gray-50 border-2 border-transparent focus:border-primary-blue rounded-2xl text-sm font-medium outline-none h-48 transition-all resize-none"
                    />
                    <div className="absolute bottom-4 left-0 right-0 flex justify-between items-end px-4">
                      <select 
                        value={sttLanguage}
                        onChange={(e) => setSttLanguage(e.target.value)}
                        className="text-xs font-bold bg-white border border-gray-200 text-gray-600 rounded-full px-3 py-1.5 outline-none focus:border-primary-blue shadow-sm appearance-none pr-6 cursor-pointer hover:bg-gray-50"
                        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.5rem center', backgroundSize: '0.75rem' }}
                      >
                        <option value="en">English</option>
                        <option value="kn">ಕನ್ನಡ (Kannada)</option>
                        <option value="hi">हिन्दी (Hindi)</option>
                        <option value="ta">தமிழ் (Tamil)</option>
                        <option value="te">తెలుగు (Telugu)</option>
                      </select>
                      
                      <div className="relative -top-2">
                        <VoiceInputButton 
                          targetLanguage={sttLanguage}
                          onTranscript={handleVoiceTranscript} 
                          onListeningEnd={() => setShouldTriggerReport(true)}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center text-sm font-black uppercase tracking-widest text-secondary-blue">
                    <span>{t('aiChecker.painSeverity')}</span>
                    <span className={`px-3 py-1 rounded-full text-[10px] ${severity > 70 ? 'bg-error-red text-white' : severity > 30 ? 'bg-primary-blue text-white' : 'bg-success-green text-white'}`}>
                      {severity > 70 ? t('aiChecker.high') : severity > 30 ? t('aiChecker.moderate') : t('aiChecker.low')}
                    </span>
                  </div>
                  <input 
                    type="range" 
                    value={severity}
                    onChange={(e) => setSeverity(e.target.value)}
                    className="w-full h-3 bg-gray-100 rounded-full appearance-none cursor-pointer accent-primary-blue" 
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center text-sm font-black uppercase tracking-widest text-secondary-blue">
                    <span>{t('aiChecker.symptomDuration')}</span>
                    <span className="text-primary-blue font-bold">{duration < 20 ? t('aiChecker.justStarted') : duration < 60 ? t('aiChecker.fewDays') : t('aiChecker.chronic')}</span>
                  </div>
                  <input 
                    type="range" 
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full h-3 bg-gray-100 rounded-full appearance-none cursor-pointer accent-secondary-blue" 
                  />
                </div>

                <button 
                  onClick={handleGenerateReport}
                  disabled={!symptomText.trim()}
                  className="w-full py-5 bg-primary-blue hover:bg-secondary-blue text-white rounded-2xl font-black text-lg shadow-xl shadow-primary-blue/20 transition-all transform hover:-translate-y-1 disabled:opacity-50 disabled:hover:translate-y-0"
                >
                  {t('aiChecker.generateReport')}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AISymptomChecker;
