import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../utils/i18n';
import Button from '../components/Button';
import Card from '../components/Card';
import PhotoGallery from '../components/PhotoGallery';

const Home = () => {
  const { t } = useLanguage();
  
  const [departments, setDepartments] = useState([]);
  const [events, setEvents] = useState([]);
  const [deptsLoading, setDeptsLoading] = useState(true);
  const [eventsLoading, setEventsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Simulated API fetch
  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        // Attempting to fetch from hypothetical API
        // const deptRes = await fetch('/api/departments/featured');
        // const evtRes = await fetch('/api/events/upcoming');
        // if (!deptRes.ok || !evtRes.ok) throw new Error('API Error');
        
        // Simulating network delay for mock data
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Mock Data Fallbacks
        const mockDepts = [
          { id: 1, name: 'Oral Medicine', icon: '🦷', desc: 'Comprehensive diagnosis and medical management of oro-facial diseases.' },
          { id: 2, name: 'Prosthodontics', icon: '😁', desc: 'Restoration and replacement of teeth for optimal oral function.' },
          { id: 3, name: 'Orthodontics', icon: '😬', desc: 'Prevention and correction of malpositioned teeth and jaws.' },
          { id: 4, name: 'Oral Surgery', icon: '🏥', desc: 'Surgical treatment of diseases, injuries and defects of the face.' }
        ];

        const mockEvents = [
          { id: 1, title: 'Annual Dental Conference 2026', date: 'Oct 15, 2026', location: 'Main Auditorium' },
          { id: 2, rural: true, title: 'Rural Free Checkup Camp', date: 'Nov 02, 2026', location: 'Kumbalgodu Village' },
          { id: 3, title: 'Alumni Meet & Greet', date: 'Dec 10, 2026', location: 'Campus Grounds' }
        ];

        setDepartments(mockDepts);
        setEvents(mockEvents);
      } catch (err) {
        console.error('Failed to fetch home data:', err);
        setError('Failed to load dynamic content.');
      } finally {
        setDeptsLoading(false);
        setEventsLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  return (
    <div className="flex flex-col gap-16 md:gap-24 -mt-8">
      {/* 1. Hero Section - Integrated Design */}
      <section className="relative w-full min-h-[600px] flex items-center justify-center overflow-hidden -mx-4 sm:-mx-6 lg:-mx-8 w-[calc(100%+2rem)] sm:w-[calc(100%+3rem)] lg:w-[calc(100%+4rem)] -mt-8">
        {/* Professional Background Image */}
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url("file:///C:/Users/PC/.gemini/antigravity/brain/edf29dfc-b96a-4dde-8b58-68570917d24a/rrdch_hero_bg_1776924994119.png")' }}
        >
          {/* Subtle overlay for depth */}
          <div className="absolute inset-0 bg-secondary-blue/10"></div>
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 py-12 flex flex-col items-center text-center">
          
          {/* Main Hero Card - Centered */}
          <div className="animate-fade-in">
            <div className="bg-white/70 backdrop-blur-xl border border-white/80 p-12 md:p-16 rounded-[40px] shadow-2xl max-w-3xl">
              <h1 className="text-4xl md:text-6xl font-black text-secondary-blue leading-tight mb-8 tracking-tight">
                RRDCH — <br/>
                Leading the Way in <br/>
                <span className="text-primary-blue">Dental Excellence.</span>
              </h1>
              <p className="text-xl text-text-muted font-bold mb-12 max-w-xl mx-auto">
                Seamless Appointments, Expert Care. <br/>
                Experience the future of dentistry today.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <Link to="/book-appointment">
                  <button className="bg-primary-blue hover:bg-secondary-blue text-white px-10 py-5 rounded-2xl font-black text-xl shadow-xl shadow-primary-blue/30 transition-all transform hover:-translate-y-1 active:scale-95">
                    Book Appointment
                  </button>
                </Link>
                <Link to="/ai-checker">
                  <button className="bg-white/50 hover:bg-white text-secondary-blue border border-white/80 px-10 py-5 rounded-2xl font-bold text-xl backdrop-blur-sm shadow-xl transition-all transform hover:-translate-y-1 active:scale-95">
                    Try AI Checker
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 1.5 Stats and Queue Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full -mt-20 relative z-20 space-y-8">
        
        {/* Quick Stats Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/80 backdrop-blur-md border border-white p-8 rounded-3xl shadow-xl flex items-center gap-6 group hover:bg-white transition-colors">
            <div className="text-4xl font-black text-secondary-blue group-hover:text-primary-blue transition-colors">50,000+</div>
            <div className="text-sm font-bold text-text-muted leading-tight">Happy<br/>Patients</div>
          </div>
          <div className="bg-white/80 backdrop-blur-md border border-white p-8 rounded-3xl shadow-xl flex items-center gap-6 group hover:bg-white transition-colors">
            <div className="text-4xl font-black text-secondary-blue group-hover:text-primary-blue transition-colors">200+</div>
            <div className="text-sm font-bold text-text-muted leading-tight">Expert<br/>Dentists</div>
          </div>
          <div className="bg-white/80 backdrop-blur-md border border-white p-8 rounded-3xl shadow-xl flex items-center gap-6 group hover:bg-white transition-colors">
            <div className="text-4xl font-black text-secondary-blue group-hover:text-primary-blue transition-colors">230k+</div>
            <div className="text-sm font-bold text-text-muted leading-tight">Successful<br/>Procedures</div>
          </div>
        </div>

        {/* Real-time Queue Display */}
        <div className="bg-white p-10 rounded-[40px] shadow-premium border border-border-soft">
          <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
            <h2 className="text-2xl font-black text-secondary-blue mb-0 tracking-tight">Real-time Queue Display</h2>
            <div className="flex items-center gap-2 px-4 py-2 bg-success-green/10 text-success-green rounded-full text-sm font-black uppercase tracking-widest">
              <span className="w-2 h-2 rounded-full bg-success-green animate-pulse"></span>
              Live Tracking
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-success-green p-6 rounded-2xl text-white shadow-lg shadow-success-green/20 group hover:scale-[1.02] transition-transform">
              <div className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-1">Oral Surgery</div>
              <div className="text-4xl font-black mb-1">99</div>
              <div className="text-[10px] font-bold opacity-90">est. wait time: 12 min</div>
            </div>
            <div className="bg-secondary-blue p-6 rounded-2xl text-white shadow-lg shadow-secondary-blue/20 group hover:scale-[1.02] transition-transform">
              <div className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-1">Orthodontics</div>
              <div className="text-4xl font-black mb-1">107</div>
              <div className="text-[10px] font-bold opacity-90">est. wait time: 25 min</div>
            </div>
            <div className="bg-primary-blue p-6 rounded-2xl text-white shadow-lg shadow-primary-blue/20 group hover:scale-[1.02] transition-transform">
              <div className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-1">Current Token</div>
              <div className="text-4xl font-black mb-1">163</div>
              <div className="text-[10px] font-bold opacity-90">est. wait time: 5 min</div>
            </div>
            <div className="bg-[#FF9F43] p-6 rounded-2xl text-white shadow-lg shadow-[#FF9F43]/20 group hover:scale-[1.02] transition-transform">
              <div className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-1">Department OPD</div>
              <div className="text-4xl font-black mb-1">139</div>
              <div className="text-[10px] font-bold opacity-90">est. wait time: 18 min</div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Featured Departments */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center mb-12">
          <h2 className="heading-2 inline-block relative pb-3">
            {t('home.featuredDepartments')}
            <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-primary-blue rounded-full"></span>
          </h2>
        </div>

        {deptsLoading ? (
          <div className="flex justify-center items-center h-48">
             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-blue"></div>
          </div>
        ) : error ? (
          <div className="text-center text-error-red p-8 bg-red-50 rounded-xl">{error}</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {departments.map(dept => (
              <Card key={dept.id} className="text-center group cursor-pointer border-t-4 border-t-transparent hover:border-t-primary-blue transition-all">
                <div className="text-5xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                  {dept.icon}
                </div>
                <h3 className="text-lg font-bold text-secondary-blue mb-2">{dept.name}</h3>
                <p className="text-sm text-neutral-gray mb-4">{dept.desc}</p>
                <Link to={`/departments/${dept.id}`} className="text-primary-blue text-sm font-semibold hover:underline">
                  {t('home.learnMore')} →
                </Link>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* 3. Why Choose RRDCH (Stats) */}
      <section className="bg-secondary-blue w-full py-24 relative overflow-hidden rounded-[40px] shadow-2xl">
        {/* Dynamic background accents */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary-blue/30 rounded-full blur-[100px]"></div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-accent-emerald/20 rounded-full blur-[100px]"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-white tracking-tight lg:text-5xl">{t('home.whyChooseTitle')}</h2>
            <div className="w-24 h-1.5 bg-accent-emerald mx-auto mt-6 rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
            <div className="text-center group p-6 rounded-3xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300">
              <div className="text-5xl md:text-6xl font-black text-white mb-2 group-hover:text-primary-blue transition-colors">250+</div>
              <div className="text-blue-200 font-bold text-sm uppercase tracking-widest">{t('home.stats.dentalUnits')}</div>
            </div>
            <div className="text-center group p-6 rounded-3xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300">
              <div className="text-5xl md:text-6xl font-black text-white mb-2 group-hover:text-primary-blue transition-colors">1992</div>
              <div className="text-blue-200 font-bold text-sm uppercase tracking-widest">{t('home.stats.establishment')}</div>
            </div>
            <div className="text-center group p-6 rounded-3xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300">
              <div className="text-5xl md:text-6xl font-black text-white mb-2 group-hover:text-primary-blue transition-colors">450+</div>
              <div className="text-blue-200 font-bold text-sm uppercase tracking-widest">{t('home.stats.patients')}</div>
            </div>
            <div className="text-center group p-6 rounded-3xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300">
              <div className="text-5xl md:text-6xl font-black text-white mb-2 group-hover:text-primary-blue transition-colors">11</div>
              <div className="text-blue-200 font-bold text-sm uppercase tracking-widest">{t('home.stats.specializations')}</div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Upcoming Events Preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex justify-between items-end mb-10 border-b border-border-light pb-4">
          <h2 className="heading-2 mb-0">{t('home.upcomingEvents')}</h2>
          <Link to="/events" className="text-primary-blue font-semibold hover:underline hidden sm:block">
            {t('home.viewAllEvents')} →
          </Link>
        </div>

        {eventsLoading ? (
          <div className="flex justify-center items-center h-32">
             <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-blue"></div>
          </div>
        ) : error ? (
           <div className="text-center text-error-red p-8 bg-red-50 rounded-xl">{error}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {events.map(event => (
              <div key={event.id} className="group bg-white rounded-3xl shadow-premium border border-border-soft overflow-hidden hover:shadow-premium-hover hover:border-primary-blue/30 transition-all duration-300 flex md:flex-col">
                <div className="bg-primary-blue/5 p-6 flex flex-col justify-center items-center min-w-[120px] border-r md:border-r-0 md:border-b border-border-soft group-hover:bg-primary-blue/10 transition-colors">
                  <span className="text-primary-blue font-extrabold text-xs uppercase tracking-[0.2em]">{event.date.split(',')[0].substring(0, 3)}</span>
                  <span className="text-4xl font-black text-secondary-blue leading-none mt-2">{event.date.split(' ')[1].replace(',', '')}</span>
                </div>
                <div className="p-6 flex-grow flex flex-col justify-between">
                  <h3 className="font-bold text-xl text-secondary-blue mb-3 group-hover:text-primary-blue transition-colors line-clamp-2 leading-snug">{event.title}</h3>
                  <div className="flex items-center text-sm font-medium text-text-muted mt-auto">
                    <svg className="w-5 h-5 mr-2 text-primary-blue/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {event.location}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="mt-6 text-center sm:hidden">
          <Link to="/events" className="text-primary-blue font-semibold hover:underline">
            {t('home.viewAllEvents')} →
          </Link>
        </div>
      </section>

      {/* 4.5 Photo Gallery Section */}
      <PhotoGallery />

      {/* 5. Call to Action */}
      <section className="mx-4 sm:mx-6 lg:mx-8 mb-24 max-w-7xl lg:mx-auto w-full">
        <div className="rounded-[40px] bg-gradient-to-r from-primary-blue to-accent-emerald overflow-hidden shadow-2xl relative p-1">
          <div className="bg-secondary-blue rounded-[38px] px-8 py-16 md:p-20 relative z-10 flex flex-col md:flex-row items-center justify-between text-center md:text-left gap-12 overflow-hidden">
            {/* Background logic/patterns */}
            <div className="absolute top-0 right-0 w-1/3 h-full bg-white/5 skew-x-12 translate-x-20"></div>
            <div className="absolute bottom-0 left-0 w-1/4 h-1/2 bg-accent-emerald/10 blur-3xl"></div>
            
            <div className="relative z-20 space-y-4">
              <h2 className="text-4xl md:text-5xl font-black text-white mb-0 tracking-tight leading-tight">
                {t('home.ctaCaption')}
              </h2>
              <p className="text-blue-100/80 text-xl font-medium max-w-lg">Experience excellence in modern dental care with our expert team.</p>
            </div>
            <Link to="/book-appointment" className="shrink-0 relative z-20">
               <button className="bg-white text-secondary-blue px-10 py-5 rounded-2xl font-black text-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300">
                 {t('home.bookNow')}
               </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
