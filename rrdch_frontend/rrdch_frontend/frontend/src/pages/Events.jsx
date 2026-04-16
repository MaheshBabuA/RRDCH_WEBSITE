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
    academic: { icon: '📖', color: 'bg-blue-100 text-blue-700' },
    workshop: { icon: '🔧', color: 'bg-orange-100 text-orange-700' },
    cultural: { icon: '⭐', color: 'bg-purple-100 text-purple-700' },
    sports: { icon: '🏆', color: 'bg-green-100 text-green-700' },
    career: { icon: '💼', color: 'bg-gray-100 text-gray-700' }
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
    // Padding for start of month
    for (let i = 0; i < startOffset; i++) {
      days.push({ day: null, date: null });
    }
    // Days of month
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
     // Simplistic upcoming logic: all events sorted by date
     return [...events].sort((a, b) => new Date(a.date) - new Date(b.date)).slice(0, 5);
  }, [events]);

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      
      <div className="mb-10 text-center lg:text-left">
        <h1 className="text-3xl md:text-4xl font-bold text-secondary-blue mb-2">
          {t('eventsPage.title')}
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
        
        {/* Main Content: Calendar & Selected Events (3 Cols) */}
        <div className="lg:col-span-3 space-y-10">
          
          {/* Calendar Header */}
          <div className="flex items-center justify-between mb-6 bg-white p-4 rounded-2xl shadow-sm border border-border-light">
             <div className="flex items-center gap-4">
               <button onClick={handlePrevMonth} className="p-2 hover:bg-light-bg rounded-lg transition-colors">
                 <svg className="w-6 h-6 text-secondary-blue font-bold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
                 </svg>
               </button>
               <h2 className="text-xl font-bold text-secondary-blue min-w-[150px] text-center">
                 {t(`eventsPage.months`)[viewDate.getMonth()]} {viewDate.getFullYear()}
               </h2>
               <button onClick={handleNextMonth} className="p-2 hover:bg-light-bg rounded-lg transition-colors">
                 <svg className="w-6 h-6 text-secondary-blue font-bold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                 </svg>
               </button>
             </div>
             
             {/* Year Selector could go here if needed */}
          </div>

          {/* Calendar Grid */}
          <div className="bg-white rounded-2xl shadow-md border border-border-light overflow-hidden">
             {/* Day Names */}
             <div className="grid grid-cols-7 bg-light-bg border-b border-border-light">
               {t('eventsPage.days').map(day => (
                 <div key={day} className="py-3 text-center text-xs font-bold text-neutral-gray uppercase tracking-wider">
                   {day}
                 </div>
               ))}
             </div>
             
             {/* Days Grid */}
             <div className="grid grid-cols-7">
               {calendarDays.map((item, idx) => (
                 <div 
                   key={idx} 
                   className={`h-24 md:h-32 p-1 border-b border-r border-border-light transition-colors relative
                     ${item.day ? 'cursor-pointer hover:bg-blue-50/50' : 'bg-gray-50/50'}
                     ${isSelected(item.date) ? 'bg-blue-50/80 ring-2 ring-primary-blue ring-inset z-10' : ''}
                   `}
                   onClick={() => item.date && setSelectedDate(item.date)}
                 >
                   {item.day && (
                     <>
                       <div className="flex justify-between items-start mb-1">
                         <span className={`text-sm font-semibold w-7 h-7 flex items-center justify-center rounded-full
                           ${isToday(item.date) ? 'bg-primary-blue text-white shadow-sm' : 'text-secondary-blue'}
                         `}>
                           {item.day}
                         </span>
                       </div>
                       
                       <div className="space-y-1">
                          {item.events.slice(0, 2).map(event => (
                            <div key={event.id} className={`text-[10px] md:text-xs px-1.5 py-0.5 rounded truncate font-medium ${categories[event.category]?.color}`}>
                              {event.title}
                            </div>
                          ))}
                          {item.events.length > 2 && (
                            <div className="text-[10px] text-neutral-gray pl-1 font-bold">
                              + {item.events.length - 2} more
                            </div>
                          )}
                       </div>
                       
                       {item.hasEvents && (
                         <div className="absolute bottom-1 right-1 w-2 h-2 bg-success-green rounded-full shadow-sm"></div>
                       )}
                     </>
                   )}
                 </div>
               ))}
             </div>
          </div>

          {/* Selected Date Events List */}
          <div className="mt-12 bg-light-bg rounded-2xl p-6 border border-border-light/50">
             <div className="flex items-center justify-between mb-8 border-b border-border-light pb-4">
                <h3 className="text-xl font-bold text-secondary-blue m-0">
                  {t('eventsPage.selectedDate')} {selectedDate.toLocaleDateString(language === 'kn' ? 'kn-IN' : 'en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                </h3>
             </div>

             {isLoading ? (
               <div className="flex justify-center py-10">
                 <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-blue"></div>
               </div>
             ) : selectedDateEvents.length === 0 ? (
               <div className="text-center py-12 text-neutral-gray italic">
                  {t('eventsPage.noEvents')}
               </div>
             ) : (
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {selectedDateEvents.map(event => (
                    <Card key={event.id} className="flex flex-col border-l-4 border-l-primary-blue">
                      <div className="flex items-center gap-2 mb-3">
                         <span className="text-2xl">{categories[event.category]?.icon}</span>
                         <span className={`text-xs font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${categories[event.category]?.color}`}>
                            {t(`eventsPage.categories.${event.category}`)}
                         </span>
                      </div>
                      <h4 className="text-lg font-bold text-secondary-blue mb-2">{event.title}</h4>
                      <div className="text-sm text-neutral-gray mb-4 space-y-1">
                         <div className="flex items-center gap-2">
                           <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                           </svg>
                           {event.time}
                         </div>
                         <div className="flex items-center gap-2">
                           <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                           </svg>
                           {event.location}
                         </div>
                      </div>
                      <p className="text-sm text-neutral-gray mb-6 line-clamp-2">
                        {event.description}
                      </p>
                      <div className="mt-auto">
                        <Link to={`/events/${event.id}`}>
                           <Button type="secondary" text={t('home.learnMore')} className="w-full py-2" />
                        </Link>
                      </div>
                    </Card>
                 ))}
               </div>
             )}
          </div>

        </div>

        {/* Sidebar: Upcoming Events (1 Col) */}
        <div className="lg:col-span-1 space-y-8">
           <div className="bg-white rounded-2xl shadow-sm border border-border-light p-6 sticky top-24">
              <h3 className="text-lg font-bold text-secondary-blue mb-6 border-b border-border-light pb-2">
                {t('eventsPage.upcomingThisMonth')}
              </h3>
              
              {isLoading ? (
                <div className="space-y-4">
                  {[1,2,3].map(i => <div key={i} className="h-16 bg-gray-50 animate-pulse rounded-lg"></div>)}
                </div>
              ) : (
                <div className="space-y-6">
                  {upcomingEvents.map(event => {
                    const d = new Date(event.date);
                    return (
                      <Link key={event.id} to={`/events/${event.id}`} className="flex gap-4 group">
                        <div className="flex flex-col items-center justify-center min-w-[50px] h-[50px] bg-light-bg rounded-lg border border-border-light group-hover:border-primary-blue transition-colors text-center">
                          <span className="text-[10px] font-bold text-neutral-gray uppercase leading-none">{d.toLocaleDateString('en-US', { month: 'short' })}</span>
                          <span className="text-lg font-bold text-secondary-blue leading-none mt-1">{d.getDate()}</span>
                        </div>
                        <div className="flex-grow">
                          <h4 className="text-sm font-bold text-secondary-blue line-clamp-1 group-hover:text-primary-blue transition-colors">
                            {event.title}
                          </h4>
                          <span className="text-xs text-neutral-gray">{event.time}</span>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              )}
           </div>

           {/* Call to Action or Quick Help */}
           <div className="bg-success-green/10 rounded-2xl p-6 border border-success-green/20 text-center">
              <div className="text-3xl mb-3">📅</div>
              <h4 className="font-bold text-secondary-blue mb-2">Host an event?</h4>
              <p className="text-xs text-neutral-gray mb-4">Request space for your department workshop or cultural meet.</p>
              <Link to="/contact">
                <Button type="primary" text="Inquire Now" className="w-full py-2 bg-success-green hover:bg-green-700 text-sm" />
              </Link>
           </div>
        </div>
      </div>

    </div>
  );
};

export default Events;
