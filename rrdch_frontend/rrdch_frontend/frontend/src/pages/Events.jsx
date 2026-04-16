import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../utils/i18n';
import apiService from '../services/api';
import Button from '../components/Button';
import Card from '../components/Card';

const Events = () => {
  const { t, language } = useLanguage();
  
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [viewDate, setViewDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const categories = {
    academic: { icon: '📖', color: 'bg-primary-blue/20 text-primary-blue border-primary-blue/30' },
    workshop: { icon: '🔧', color: 'bg-orange-500/20 text-orange-600 border-orange-500/30' },
    cultural: { icon: '⭐', color: 'bg-purple-500/20 text-purple-600 border-purple-500/30' },
    sports: { icon: '🏆', color: 'bg-accent-emerald/20 text-accent-emerald border-accent-emerald/30' },
    career: { icon: '💼', color: 'bg-gray-500/20 text-gray-700 border-gray-500/30' }
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await apiService.events.getAll();
        setEvents(data);
      } catch (err) {
        console.error('Failed to load events:', err);
        setError('Failed to load events.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchEvents();
  }, []);

  // Calendar Logic
  const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const calendarDays = useMemo(() => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const totalDays = daysInMonth(year, month);
    const startOffset = firstDayOfMonth(year, month);
    
    const days = [];
    for (let i = 0; i < startOffset; i++) {
      days.push({ day: null, date: null });
    }
    for (let i = 1; i <= totalDays; i++) {
       const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
       const dateEvents = events.filter(e => e.date === dateStr);
       days.push({ 
         day: i, 
         date: new Date(year, month, i),
         dateStr,
         hasEvents: dateEvents.length > 0,
         events: dateEvents
       });
    }
    return days;
  }, [viewDate, events]);

  const handlePrevMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
  };

  const isToday = (date) => {
    const today = new Date();
    return date && date.toDateString() === today.toDateString();
  };

  const isSelected = (date) => {
    return date && date.toDateString() === selectedDate.toDateString();
  };

  const selectedDateEvents = useMemo(() => {
    const dateStr = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`;
    return events.filter(e => e.date === dateStr);
  }, [selectedDate, events]);

  const upcomingEvents = useMemo(() => {
     return [...events].sort((a, b) => new Date(a.date) - new Date(b.date)).slice(0, 5);
  }, [events]);

  return (
    <div className="animate-fade-in relative">
      {/* Dynamic Background */}
      <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-secondary-blue to-transparent -z-10 rounded-b-[60px] md:rounded-b-[100px] overflow-hidden">
         <div className="absolute top-0 left-0 w-full h-full opacity-20" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=2000")', backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed' }}></div>
         <div className="absolute inset-0 bg-gradient-to-t from-soft-bg via-transparent to-transparent"></div>
      </div>

      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="mb-16 text-center text-white space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-[12px] font-bold uppercase tracking-widest shadow-lg">
             Campus Life & Activities
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight drop-shadow-lg mb-2">
            {t('eventsPage.title')}
          </h1>
          <p className="text-xl text-blue-100/90 font-medium max-w-2xl mx-auto drop-shadow-md">
            Discover upcoming academic programs, cultural fests, and workshops at RRDCH.
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-10">
          
          {/* Main Content: Calendar & Selected Events (3 Cols) */}
          <div className="xl:col-span-3 space-y-12">
            
            {/* Calendar Container with Glassmorphism */}
            <div className="bg-white/80 backdrop-blur-xl rounded-[40px] shadow-premium-hover border border-white/50 overflow-hidden">
              
              {/* Calendar Header */}
              <div className="flex items-center justify-between p-8 bg-gradient-to-r from-secondary-blue to-primary-blue text-white">
                 <div className="flex items-center gap-6 w-full justify-between sm:justify-start">
                   <button onClick={handlePrevMonth} className="p-3 bg-white/10 hover:bg-white/20 rounded-2xl transition-all hover:scale-105 active:scale-95 border border-white/10">
                     <svg className="w-6 h-6 text-white font-bold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
                     </svg>
                   </button>
                   <h2 className="text-2xl md:text-3xl font-black text-white min-w-[200px] text-center tracking-tight mb-0">
                     {t(`eventsPage.months`)[viewDate.getMonth()]} {viewDate.getFullYear()}
                   </h2>
                   <button onClick={handleNextMonth} className="p-3 bg-white/10 hover:bg-white/20 rounded-2xl transition-all hover:scale-105 active:scale-95 border border-white/10">
                     <svg className="w-6 h-6 text-white font-bold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                     </svg>
                   </button>
                 </div>
              </div>

              {/* Day Names */}
              <div className="grid grid-cols-7 bg-white border-b border-border-light">
                {t('eventsPage.days').map(day => (
                  <div key={day} className="py-4 text-center text-xs md:text-sm font-black text-neutral-gray uppercase tracking-widest">
                    {day}
                  </div>
                ))}
              </div>
               
              {/* Days Grid */}
              <div className="grid grid-cols-7 bg-gray-50/30">
                {calendarDays.map((item, idx) => (
                  <div 
                    key={idx} 
                    className={`h-28 md:h-36 p-2 border-b border-r border-border-light/50 transition-all relative group
                      ${item.day ? 'cursor-pointer hover:bg-primary-blue/5' : 'bg-gray-100/50'}
                      ${isSelected(item.date) ? 'bg-primary-blue/10 ring-2 ring-primary-blue ring-inset z-10 shadow-lg' : ''}
                    `}
                    onClick={() => item.date && setSelectedDate(item.date)}
                  >
                    {item.day && (
                      <>
                        <div className="flex justify-between items-start mb-2">
                          <span className={`text-sm md:text-base font-bold w-8 h-8 flex items-center justify-center rounded-2xl transition-transform group-hover:scale-110
                            ${isToday(item.date) ? 'bg-primary-blue text-white shadow-md' : 'text-secondary-blue group-hover:text-primary-blue'}
                          `}>
                            {item.day}
                          </span>
                        </div>
                        
                        <div className="space-y-1">
                           {item.events.slice(0, 2).map(event => (
                             <div key={event.id} className={`text-[10px] md:text-xs px-2 py-1 rounded-lg truncate font-bold border ${categories[event.category]?.color}`}>
                               {event.title}
                             </div>
                           ))}
                           {item.events.length > 2 && (
                             <div className="text-[10px] text-neutral-gray pl-1 font-bold mt-1">
                               + {item.events.length - 2} more
                             </div>
                           )}
                        </div>
                        
                        {item.hasEvents && (
                          <div className="absolute bottom-2 right-2 w-2.5 h-2.5 bg-accent-emerald rounded-full shadow-md animate-pulse"></div>
                        )}
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Selected Date Events List */}
            <div className="bg-white rounded-[40px] p-8 md:p-12 shadow-premium border border-border-soft">
               <div className="flex items-center gap-4 mb-10 pb-6 border-b-2 border-border-soft">
                  <div className="w-14 h-14 bg-primary-blue/10 rounded-2xl flex items-center justify-center">
                     <span className="text-2xl">📅</span>
                  </div>
                  <div>
                    <h3 className="text-2xl md:text-3xl font-black text-secondary-blue tracking-tight mb-1">
                      {t('eventsPage.selectedDate')}
                    </h3>
                    <p className="text-primary-blue font-bold text-lg">
                       {selectedDate.toLocaleDateString(language === 'kn' ? 'kn-IN' : 'en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                  </div>
               </div>

               {isLoading ? (
                 <div className="flex justify-center py-12">
                   <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-primary-blue"></div>
                 </div>
               ) : selectedDateEvents.length === 0 ? (
                 <div className="text-center py-16 bg-soft-bg rounded-3xl border border-dashed border-border-light">
                    <div className="text-4xl mb-4 opacity-50">👀</div>
                    <p className="text-neutral-gray font-bold text-lg">{t('eventsPage.noEvents')}</p>
                 </div>
               ) : (
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   {selectedDateEvents.map(event => (
                      <div key={event.id} className="group bg-soft-bg relative rounded-3xl p-6 border border-border-light hover:border-primary-blue/30 hover:shadow-xl transition-all duration-300 flex flex-col h-full overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary-blue/5 rounded-full blur-2xl -mr-16 -mt-16 group-hover:scale-150 transition-transform"></div>
                        
                        <div className="flex items-center gap-3 mb-4 relative z-10">
                           <span className="text-3xl bg-white w-12 h-12 flex items-center justify-center rounded-2xl shadow-sm">{categories[event.category]?.icon}</span>
                           <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${categories[event.category]?.color}`}>
                              {t(`eventsPage.categories.${event.category}`)}
                           </span>
                        </div>
                        <h4 className="text-xl font-black text-secondary-blue mb-3 group-hover:text-primary-blue transition-colors line-clamp-2 relative z-10">{event.title}</h4>
                        
                        <div className="space-y-2 mb-6 relative z-10">
                           <div className="flex items-center gap-3 text-sm font-bold text-neutral-gray">
                             <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm">
                               <svg className="w-4 h-4 text-primary-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                               </svg>
                             </div>
                             {event.time}
                           </div>
                           <div className="flex items-center gap-3 text-sm font-bold text-neutral-gray">
                             <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm">
                               <svg className="w-4 h-4 text-primary-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                               </svg>
                             </div>
                             {event.location}
                           </div>
                        </div>
                        
                        <p className="text-neutral-gray leading-relaxed font-medium mb-8 line-clamp-3 relative z-10 flex-grow">
                          {event.description}
                        </p>
                        
                        <div className="mt-auto relative z-10">
                          <Link to={`/events/${event.id}`}>
                             <Button type="secondary" text={t('home.learnMore')} className="w-full py-3 bg-white" />
                          </Link>
                        </div>
                      </div>
                   ))}
                 </div>
               )}
            </div>

          </div>

          {/* Sidebar: Upcoming Events (1 Col) */}
          <div className="xl:col-span-1 space-y-8">
             <div className="bg-white rounded-[40px] shadow-premium border border-border-soft p-8 xl:sticky top-8">
                <h3 className="text-xl font-black text-secondary-blue mb-8 pb-4 border-b-2 border-border-light flex items-center gap-3">
                  <span className="w-4 h-4 rounded-full bg-primary-blue animate-pulse"></span>
                  {t('eventsPage.upcomingThisMonth')}
                </h3>
                
                {isLoading ? (
                  <div className="space-y-6">
                    {[1,2,3].map(i => <div key={i} className="h-24 bg-soft-bg animate-pulse rounded-2xl"></div>)}
                  </div>
                ) : (
                  <div className="space-y-6">
                    {upcomingEvents.map(event => {
                      const d = new Date(event.date);
                      return (
                        <Link key={event.id} to={`/events/${event.id}`} className="flex gap-5 group items-center p-3 -mx-3 rounded-2xl hover:bg-soft-bg transition-colors">
                          <div className="flex flex-col items-center justify-center min-w-[64px] h-[64px] bg-white rounded-[20px] shadow-sm border border-border-light group-hover:border-primary-blue group-hover:shadow-md transition-all">
                            <span className="text-[10px] font-black text-primary-blue uppercase tracking-widest">{d.toLocaleDateString('en-US', { month: 'short' })}</span>
                            <span className="text-2xl font-black text-secondary-blue leading-none mt-1">{d.getDate()}</span>
                          </div>
                          <div>
                            <h4 className="text-base font-bold text-secondary-blue line-clamp-2 leading-tight group-hover:text-primary-blue transition-colors mb-1">
                              {event.title}
                            </h4>
                            <span className="text-xs font-bold text-neutral-gray flex items-center gap-1">
                              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              {event.time}
                            </span>
                          </div>
                        </Link>
                      )
                    })}
                  </div>
                )}
             </div>

             {/* Call to Action Container */}
             <div className="bg-gradient-to-br from-accent-emerald to-[#059669] rounded-[40px] p-8 text-center text-white shadow-xl relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10 group-hover:scale-150 transition-transform"></div>
                <div className="text-5xl mb-4 relative z-10 w-20 h-20 bg-white/20 mx-auto rounded-full flex items-center justify-center backdrop-blur-md">📅</div>
                <h4 className="text-2xl font-black mb-3 relative z-10">Host an Event?</h4>
                <p className="text-emerald-100 font-medium mb-8 relative z-10 leading-relaxed text-sm">Request premium space for your department workshop, seminar, or cultural meet.</p>
                <Link to="/contact" className="relative z-10">
                  <button className="w-full py-4 bg-white text-emerald-700 font-black rounded-2xl hover:scale-105 transition-transform shadow-lg">Inquire Now</button>
                </Link>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Events;
