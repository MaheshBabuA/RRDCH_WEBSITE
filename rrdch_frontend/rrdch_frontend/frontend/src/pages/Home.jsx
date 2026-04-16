import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../utils/i18n';
import Button from '../components/Button';
import Card from '../components/Card';

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
      {/* 1. Hero Section */}
      <section className="relative w-full h-[600px] flex items-center justify-center overflow-hidden">
        {/* Placeholder Background Image */}
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80")' }}
        >
          {/* Dark Overlay for text readability */}
          <div className="absolute inset-0 bg-secondary-blue/70 mix-blend-multiply"></div>
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto space-y-6">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight drop-shadow-lg mb-0 text-balance">
            {t('home.heroTitle')}
          </h1>
          <p className="text-xl md:text-2xl text-blue-50 font-medium drop-shadow-md">
            {t('home.heroSubtitle')}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
            <Link to="/book-appointment">
              <Button type="primary" text={t('home.bookAppointmentBtn')} className="w-full sm:w-auto text-lg px-8 py-3" />
            </Link>
            <Link to="/about">
              <Button type="secondary" text={t('home.learnMore')} className="w-full sm:w-auto text-lg px-8 py-3 bg-white/10 text-white border-white hover:bg-white hover:text-secondary-blue" />
            </Link>
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
      <section className="bg-secondary-blue w-full py-16 relative overflow-hidden">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white tracking-tight">{t('home.whyChooseTitle')}</h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 divide-y sm:divide-y-0 sm:divide-x divide-white/20">
            <div className="text-center p-4">
              <div className="text-4xl md:text-5xl font-bold text-primary-blue text-white mb-2">250+</div>
              <div className="text-blue-100 font-medium text-lg">{t('home.stats.dentalUnits')}</div>
            </div>
            <div className="text-center p-4">
              <div className="text-4xl md:text-5xl font-bold text-primary-blue text-white mb-2">1992</div>
              <div className="text-blue-100 font-medium text-lg">{t('home.stats.establishment')}</div>
            </div>
            <div className="text-center p-4">
              <div className="text-4xl md:text-5xl font-bold text-primary-blue text-white mb-2">450+</div>
              <div className="text-blue-100 font-medium text-lg">{t('home.stats.patients')}</div>
            </div>
            <div className="text-center p-4">
              <div className="text-4xl md:text-5xl font-bold text-primary-blue text-white mb-2">11</div>
              <div className="text-blue-100 font-medium text-lg">{t('home.stats.specializations')}</div>
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {events.map(event => (
              <div key={event.id} className="bg-white rounded-xl shadow-sm border border-border-light overflow-hidden hover:shadow-md transition-shadow flex sm:flex-col">
                <div className="bg-light-bg p-4 flex flex-col justify-center items-center min-w-[100px] border-r sm:border-r-0 sm:border-b border-border-light">
                  <span className="text-primary-blue font-bold text-sm uppercase">{event.date.split(',')[0].substring(0, 3)}</span>
                  <span className="text-2xl font-bold text-secondary-blue leading-none mt-1">{event.date.split(' ')[1].replace(',', '')}</span>
                </div>
                <div className="p-5 flex-grow">
                  <h3 className="font-bold text-lg text-secondary-blue mb-1 line-clamp-2">{event.title}</h3>
                  <div className="flex items-center text-sm text-neutral-gray mt-3">
                    <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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

      {/* 5. Call to Action */}
      <section className="mx-4 sm:mx-6 lg:mx-8 mb-12">
        <div className="max-w-5xl mx-auto rounded-3xl bg-success-green overflow-hidden shadow-xl relative">
          <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-white/10 skew-x-12 translate-x-32 hidden md:block"></div>
          <div className="px-6 py-12 md:p-16 relative z-10 flex flex-col md:flex-row items-center justify-between text-center md:text-left gap-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
                {t('home.ctaCaption')}
              </h2>
              <p className="text-green-50 text-lg">Experience excellence in dental care.</p>
            </div>
            <Link to="/book-appointment" className="shrink-0">
               <button className="bg-white text-success-green px-8 py-4 rounded-xl font-bold text-lg hover:shadow-lg hover:scale-105 active:scale-95 transition-all shadow-md mt-4 md:mt-0">
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
