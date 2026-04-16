import React from 'react';
import { useLanguage } from '../utils/i18n';
import Card from '../components/Card';

const About = () => {
  const { t } = useLanguage();

  return (
    <div className="animate-fade-in">
      {/* 1. Hero Header */}
      <section className="relative h-[400px] md:h-[500px] flex items-center justify-center overflow-hidden rounded-[40px] shadow-2xl mx-auto max-w-[1400px] mb-20 mt-4">
        <img 
          src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=2000" 
          alt="Medical Campus" 
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-[2000ms] hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-secondary-blue/80 via-secondary-blue/40 to-transparent backdrop-blur-[1px]"></div>
        <div className="relative z-10 text-center px-4 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-[10px] font-black uppercase tracking-widest shadow-lg">
             Institutional Legacy
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white mb-0 tracking-tight leading-tight text-balance">
            {t('aboutPage.title')}
          </h1>
          <div className="w-24 h-2 bg-primary-blue mx-auto rounded-full shadow-lg shadow-primary-blue/50"></div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 space-y-24">
        
        {/* 2. Institution Overview */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <h2 className="text-4xl font-black text-secondary-blue tracking-tight leading-tight">{t('aboutPage.overviewTitle')}</h2>
            <p className="text-xl text-text-muted leading-relaxed font-medium">
              {t('aboutPage.historyStory')}
            </p>
            <div className="grid grid-cols-2 gap-6">
              {Object.entries(t('aboutPage.stats')).map(([key, value]) => (
                <div key={key} className="bg-white p-6 rounded-[32px] shadow-premium border border-border-soft hover:shadow-premium-hover hover:border-primary-blue/30 transition-all duration-300 group">
                  <div className="text-3xl font-black text-primary-blue group-hover:scale-110 transition-transform origin-left">{value.split(' ')[0]}</div>
                  <div className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mt-2 leading-tight">{value.split(' ').slice(1).join(' ')}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative group">
             <img 
               src="https://images.unsplash.com/photo-1581056771107-24ca5f033842?auto=format&fit=crop&q=80&w=1200" 
               alt="Dental Surgery" 
               className="rounded-[48px] shadow-2xl relative z-10 transition-transform duration-700 group-hover:scale-[1.02]"
             />
             <div className="absolute -bottom-10 -right-10 w-72 h-72 bg-accent-emerald/20 rounded-full blur-3xl -z-0 group-hover:scale-125 transition-transform duration-700"></div>
             <div className="absolute -top-10 -left-10 w-72 h-72 bg-primary-blue/20 rounded-full blur-3xl -z-0 group-hover:scale-125 transition-transform duration-700"></div>
          </div>
        </section>

        {/* 3. Vision & Mission */}
        <section className="bg-soft-bg rounded-[60px] p-10 md:p-20 shadow-inner border border-border-soft relative overflow-hidden">
           <div className="absolute top-0 right-0 w-64 h-64 bg-primary-blue/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 relative z-10">
              <div className="lg:col-span-2 space-y-16">
                 <div>
                    <div className="inline-flex items-center gap-3 mb-6">
                      <div className="w-12 h-1 bg-primary-blue rounded-full"></div>
                      <h3 className="text-xs font-black text-primary-blue uppercase tracking-[0.3em]">
                        {t('aboutPage.vision.title')}
                      </h3>
                    </div>
                    <p className="text-3xl md:text-5xl font-black text-secondary-blue leading-[1.2] tracking-tight">
                      "{t('aboutPage.vision.text')}"
                    </p>
                 </div>
                 <div>
                    <div className="inline-flex items-center gap-3 mb-8">
                      <div className="w-12 h-1 bg-primary-blue rounded-full"></div>
                      <h3 className="text-xs font-black text-primary-blue uppercase tracking-[0.3em]">
                        {t('aboutPage.mission.title')}
                      </h3>
                    </div>
                    <ul className="space-y-6">
                       {t('aboutPage.mission.points').map((point, i) => (
                         <li key={i} className="flex items-start gap-4 text-text-muted leading-relaxed text-lg font-medium group">
                            <span className="mt-2.5 w-3 h-3 rounded-full bg-accent-emerald flex-shrink-0 group-hover:scale-150 transition-transform shadow-lg shadow-accent-emerald/20"></span>
                            {point}
                         </li>
                       ))}
                    </ul>
                 </div>
              </div>
              <div className="bg-white rounded-[40px] p-10 shadow-premium border border-border-soft transition-transform hover:-translate-y-2">
                 <h3 className="text-2xl font-black text-secondary-blue mb-10 text-center tracking-tight">{t('aboutPage.values.title')}</h3>
                 <div className="grid grid-cols-1 gap-5">
                    {t('aboutPage.values.items').map((val, i) => (
                      <div key={i} className="flex items-center gap-5 p-5 rounded-[24px] bg-soft-bg border border-border-soft/50 group hover:bg-secondary-blue transition-all duration-300">
                         <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                            <span className="text-2xl">💎</span>
                         </div>
                         <span className="font-bold text-secondary-blue group-hover:text-white transition-colors tracking-tight">{val}</span>
                      </div>
                    ))}
                 </div>
              </div>
           </div>
        </section>

        {/* 4. Accreditations */}
        <section className="text-center py-10">
           <h2 className="text-2xl font-bold text-secondary-blue mb-12">{t('aboutPage.accreds.title')}</h2>
           <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {['dci', 'naac', 'royal', 'iso'].map(key => (
                <div key={key} className="flex flex-col items-center p-6 grayscale hover:grayscale-0 transition-all duration-500 opacity-70 hover:opacity-100">
                   <div className="w-16 h-16 bg-light-bg rounded-2xl flex items-center justify-center mb-4 border border-border-light text-3xl">
                     {key === 'dci' ? '🏛️' : key === 'naac' ? '⭐' : key === 'royal' ? '👑' : '📜'}
                   </div>
                   <p className="text-xs font-bold text-neutral-gray leading-tight uppercase tracking-wide">
                     {t(`aboutPage.accreds.${key}`)}
                   </p>
                </div>
              ))}
           </div>
        </section>

        {/* 5. Leadership */}
        <section className="max-w-5xl mx-auto py-10">
           <div className="bg-white rounded-[48px] shadow-premium-hover border border-border-soft overflow-hidden flex flex-col md:flex-row items-stretch transition-transform hover:-translate-y-2 duration-500">
              <div className="w-full md:w-2/5 relative">
                 <img 
                   src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=800" 
                   alt="Leadership" 
                   className="w-full h-full object-cover min-h-[400px]"
                 />
                 <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/20"></div>
              </div>
              <div className="w-full md:w-3/5 p-12 md:p-16 flex flex-col justify-center relative bg-gradient-to-br from-white to-soft-bg">
                 <div className="absolute top-8 right-8 text-7xl text-primary-blue/5 font-serif select-none pointer-events-none">"</div>
                 <div className="inline-flex items-center gap-2 mb-8">
                    <div className="w-8 h-1 bg-accent-emerald rounded-full"></div>
                    <h2 className="text-xs font-black text-accent-emerald uppercase tracking-[0.3em]">{t('aboutPage.leadership.title')}</h2>
                 </div>
                 <p className="text-2xl md:text-3xl text-secondary-blue font-bold italic mb-10 leading-tight tracking-tight relative z-10">
                   {t('aboutPage.leadership.quote')}
                 </p>
                 <div className="space-y-1">
                    <div className="font-black text-secondary-blue text-2xl tracking-tight">{t('aboutPage.leadership.name')}</div>
                    <div className="text-sm font-black text-primary-blue uppercase tracking-widest">{t('aboutPage.leadership.role')}</div>
                 </div>
              </div>
           </div>
        </section>

        {/* 6. Facilities */}
        <section className="py-10">
           <div className="text-center mb-16 space-y-4">
              <h2 className="text-4xl md:text-5xl font-black text-secondary-blue tracking-tight leading-tight">{t('aboutPage.facilities.title')}</h2>
              <div className="w-24 h-1.5 bg-primary-blue mx-auto rounded-full"></div>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {Object.entries(t('aboutPage.facilities')).filter(([k]) => k !== 'title').map(([key, data]) => (
                <div key={key} className="group overflow-hidden rounded-[40px] bg-white border border-border-soft hover:border-primary-blue/30 shadow-premium hover:shadow-premium-hover transition-all duration-500">
                  <div className="h-64 overflow-hidden relative">
                    <img 
                      src={`https://images.unsplash.com/photo-${
                        key === 'audio' ? '1475721027187-3c12e35a19ec' : 
                        key === 'library' ? '1507842217343-583bb7270b66' : 
                        key === 'hostel' ? '1555854816-802f1f26671f' : 
                        key === 'radiology' ? '1516549655169-df83a0774514' : 
                        key === 'cafeteria' ? '1567521464027-f127ff144326' : '1504450758481-7338eba7524a'
                      }?auto=format&fit=crop&q=80&w=800`} 
                      alt={data.t} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-secondary-blue/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </div>
                  <div className="p-8">
                    <h4 className="text-xl font-black text-secondary-blue mb-3 group-hover:text-primary-blue transition-colors tracking-tight">{data.t}</h4>
                    <p className="text-text-muted leading-relaxed font-medium">{data.d}</p>
                  </div>
                </div>
              ))}
           </div>
        </section>

        {/* 7. Why Choose RRDCH */}
        <section className="bg-secondary-blue rounded-[60px] p-12 md:p-24 text-white relative overflow-hidden shadow-2xl">
           {/* Decorative elements */}
           <div className="absolute top-0 right-0 w-96 h-96 bg-primary-blue/20 rounded-full blur-[120px] -mr-48 -mt-48"></div>
           <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent-emerald/10 rounded-full blur-[120px] -ml-48 -mb-48"></div>

           <div className="relative z-10">
              <div className="text-center mb-20 space-y-4">
                 <h2 className="text-4xl md:text-5xl font-black mb-0 tracking-tight leading-tight">{t('aboutPage.whyChoose.title')}</h2>
                 <div className="w-24 h-1.5 bg-accent-emerald mx-auto rounded-full"></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-16 gap-x-16">
                 {[1, 2, 3, 4, 5, 6].map(i => (
                   <div key={i} className="flex gap-8 group">
                      <div className="w-16 h-16 rounded-[24px] bg-white/10 border border-white/10 flex items-center justify-center flex-shrink-0 text-3xl group-hover:bg-primary-blue group-hover:scale-110 group-hover:-rotate-6 transition-all duration-300">
                        {i === 1 ? '🌍' : i === 2 ? '🦷' : i === 3 ? '👨‍🏫' : i === 4 ? '🔬' : i === 5 ? '🤝' : '🎓'}
                      </div>
                      <div className="space-y-3">
                         <h4 className="font-black text-xl mb-0 text-white tracking-tight">{t(`aboutPage.whyChoose.point${i}.t`)}</h4>
                         <p className="text-lg text-blue-100/60 leading-relaxed font-medium">
                           {t(`aboutPage.whyChoose.point${i}.d`)}
                         </p>
                      </div>
                   </div>
                 ))}
              </div>
           </div>
        </section>

      </div>
    </div>
  );
};

export default About;
