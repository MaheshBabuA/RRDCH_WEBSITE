import React from 'react';
import { useLanguage } from '../utils/i18n';
import Card from '../components/Card';

const About = () => {
  const { t } = useLanguage();

  return (
    <div className="animate-fade-in">
      {/* 1. Hero Header */}
      <section className="relative h-[300px] md:h-[400px] flex items-center justify-center overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=2000" 
          alt="Medical Campus" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-secondary-blue/60 backdrop-blur-[2px]"></div>
        <div className="relative z-10 text-center px-4">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 tracking-tight">
            {t('aboutPage.title')}
          </h1>
          <div className="w-20 h-1.5 bg-accent-green mx-auto rounded-full"></div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 space-y-24">
        
        {/* 2. Institution Overview */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-secondary-blue mb-6">{t('aboutPage.overviewTitle')}</h2>
            <p className="text-lg text-neutral-gray leading-relaxed mb-8">
              {t('aboutPage.historyStory')}
            </p>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(t('aboutPage.stats')).map(([key, value]) => (
                <div key={key} className="bg-white p-6 rounded-2xl shadow-sm border border-border-light hover:border-primary-blue transition-colors group">
                  <div className="text-2xl font-bold text-primary-blue group-hover:scale-110 transition-transform origin-left">{value.split(' ')[0]}</div>
                  <div className="text-xs font-bold text-neutral-gray uppercase tracking-widest mt-1">{value.split(' ').slice(1).join(' ')}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
             <img 
               src="https://images.unsplash.com/photo-1581056771107-24ca5f033842?auto=format&fit=crop&q=80&w=1200" 
               alt="Dental Surgery" 
               className="rounded-3xl shadow-2xl relative z-10"
             />
             <div className="absolute -bottom-6 -right-6 w-64 h-64 bg-accent-green/10 rounded-full blur-3xl -z-0"></div>
             <div className="absolute -top-6 -left-6 w-64 h-64 bg-primary-blue/10 rounded-full blur-3xl -z-0"></div>
          </div>
        </section>

        {/* 3. Vision & Mission */}
        <section className="bg-light-bg rounded-[40px] p-8 md:p-16 border border-border-light/50">
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2 space-y-12">
                 <div>
                    <h3 className="text-sm font-bold text-primary-blue uppercase tracking-widest mb-4 inline-block border-b-2 border-primary-blue pb-1">
                      {t('aboutPage.vision.title')}
                    </h3>
                    <p className="text-2xl md:text-3xl font-medium text-secondary-blue leading-tight italic">
                      "{t('aboutPage.vision.text')}"
                    </p>
                 </div>
                 <div>
                    <h3 className="text-sm font-bold text-primary-blue uppercase tracking-widest mb-6 inline-block border-b-2 border-primary-blue pb-1">
                      {t('aboutPage.mission.title')}
                    </h3>
                    <ul className="space-y-4">
                       {t('aboutPage.mission.points').map((point, i) => (
                         <li key={i} className="flex items-start gap-3 text-neutral-gray leading-relaxed">
                            <span className="mt-1.5 w-2 h-2 rounded-full bg-accent-green flex-shrink-0"></span>
                            {point}
                         </li>
                       ))}
                    </ul>
                 </div>
              </div>
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-border-light">
                 <h3 className="text-xl font-bold text-secondary-blue mb-8 text-center">{t('aboutPage.values.title')}</h3>
                 <div className="grid grid-cols-1 gap-4">
                    {t('aboutPage.values.items').map((val, i) => (
                      <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-light-bg border border-border-light/50 group hover:bg-primary-blue transition-colors">
                         <span className="text-xl group-hover:scale-125 transition-transform">💎</span>
                         <span className="font-bold text-secondary-blue group-hover:text-white transition-colors">{val}</span>
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
        <section className="max-w-4xl mx-auto">
           <Card className="flex flex-col md:flex-row gap-10 items-center overflow-hidden p-0 shadow-2xl">
              <div className="w-full md:w-1/3 h-80 md:h-auto">
                 <img 
                   src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=800" 
                   alt="Leadership" 
                   className="w-full h-full object-cover"
                 />
              </div>
              <div className="w-full md:w-2/3 p-10 relative">
                 <div className="text-5xl text-primary-blue/10 absolute top-4 left-4 font-serif">"</div>
                 <h2 className="text-sm font-bold text-primary-blue uppercase tracking-widest mb-6">{t('aboutPage.leadership.title')}</h2>
                 <p className="text-xl text-secondary-blue font-medium italic mb-8 relative z-10">
                   {t('aboutPage.leadership.quote')}
                 </p>
                 <div>
                    <div className="font-bold text-secondary-blue text-lg">{t('aboutPage.leadership.name')}</div>
                    <div className="text-sm font-bold text-accent-green">{t('aboutPage.leadership.role')}</div>
                 </div>
              </div>
           </Card>
        </section>

        {/* 6. Facilities */}
        <section>
           <h2 className="text-3xl font-bold text-secondary-blue mb-12 text-center">{t('aboutPage.facilities.title')}</h2>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Object.entries(t('aboutPage.facilities')).filter(([k]) => k !== 'title').map(([key, data]) => (
                <div key={key} className="group overflow-hidden rounded-3xl border border-border-light hover:border-primary-blue transition-all duration-300">
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={`https://images.unsplash.com/photo-${
                        key === 'audio' ? '1475721027187-3c12e35a19ec' : 
                        key === 'library' ? '1507842217343-583bb7270b66' : 
                        key === 'hostel' ? '1555854816-802f1f26671f' : 
                        key === 'radiology' ? '1516549655169-df83a0774514' : 
                        key === 'cafeteria' ? '1567521464027-f127ff144326' : '1504450758481-7338eba7524a'
                      }?auto=format&fit=crop&q=80&w=800`} 
                      alt={data.t} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  </div>
                  <div className="p-6 bg-white">
                    <h4 className="font-bold text-secondary-blue mb-2 group-hover:text-primary-blue transition-colors">{data.t}</h4>
                    <p className="text-sm text-neutral-gray leading-relaxed">{data.d}</p>
                  </div>
                </div>
              ))}
           </div>
        </section>

        {/* 7. Why Choose RRDCH */}
        <section className="bg-secondary-blue rounded-[40px] p-10 md:p-20 text-white">
           <h2 className="text-3xl md:text-4xl font-bold mb-16 text-center">{t('aboutPage.whyChoose.title')}</h2>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-12 gap-x-16">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="flex gap-6">
                   <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center flex-shrink-0 text-2xl">
                     {i === 1 ? '🌍' : i === 2 ? '🦷' : i === 3 ? '👨‍🏫' : i === 4 ? '🔬' : i === 5 ? '🤝' : '🎓'}
                   </div>
                   <div>
                      <h4 className="font-bold text-lg mb-2 text-white">{t(`aboutPage.whyChoose.point${i}.t`)}</h4>
                      <p className="text-sm text-white/70 leading-relaxed font-medium">
                        {t(`aboutPage.whyChoose.point${i}.d`)}
                      </p>
                   </div>
                </div>
              ))}
           </div>
        </section>

      </div>
    </div>
  );
};

export default About;
