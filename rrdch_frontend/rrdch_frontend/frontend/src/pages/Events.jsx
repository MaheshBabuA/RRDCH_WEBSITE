import React, { useState, useEffect } from 'react';
import { useLanguage } from '../utils/i18n';
import apiService from '../services/api';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import SuccessModal from '../components/SuccessModal';
import { siteContent } from '../data/siteContent';

const Events = () => {
  const { t } = useLanguage();
  
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const categories = {
    academic: { icon: '📖', color: '#3b82f6' }, // blue-500
    workshop: { icon: '🔧', color: '#f97316' }, // orange-500
    cultural: { icon: '⭐', color: '#a855f7' }, // purple-500
    sports: { icon: '🏆', color: '#10b981' },   // emerald-500
    holiday: { icon: '🏖️', color: '#ef4444' },  // red-500
    exam: { icon: '✍️', color: '#6366f1' }       // indigo-500
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await apiService.events.getAll();
        // Format events for FullCalendar
        const formattedEvents = data.map(event => ({
          id: event.id,
          title: event.title,
          start: event.date,
          backgroundColor: categories[event.category]?.color || '#3b82f6',
          borderColor: 'transparent',
          extendedProps: {
            description: event.description,
            location: event.location,
            time: event.time,
            category: event.category,
            icon: categories[event.category]?.icon || '📅'
          }
        }));
        setEvents(formattedEvents);
      } catch (err) {
        console.error('Failed to load events:', err);
        // Fallback to siteContent if API fails
        const fallbackEvents = siteContent.events.map(event => ({
          id: event.id.toString(),
          title: event.title,
          start: event.date,
          backgroundColor: categories[event.category.toLowerCase()]?.color || '#3b82f6',
          borderColor: 'transparent',
          extendedProps: {
            description: event.description,
            location: event.location,
            time: event.time,
            category: event.category.toLowerCase(),
            icon: categories[event.category.toLowerCase()]?.icon || '📅'
          }
        }));
        setEvents(fallbackEvents);
      } finally {
        setIsLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const handleEventClick = (info) => {
    setSelectedEvent(info.event);
    setIsModalOpen(true);
  };

  return (
    <div className="animate-fade-in relative min-h-screen pb-20">
      {/* Dynamic Background */}
      <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-secondary-blue to-transparent -z-10 rounded-b-[60px] md:rounded-b-[100px] overflow-hidden">
         <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center opacity-20 mix-blend-overlay"></div>
         <div className="absolute inset-0 bg-gradient-to-t from-soft-bg via-transparent to-transparent"></div>
      </div>

      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="mb-16 text-center text-white space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-[12px] font-bold uppercase tracking-widest shadow-lg">
             Campus Schedule
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight drop-shadow-lg mb-2">Events Calendar</h1>
          <p className="text-xl text-blue-100/90 font-medium max-w-2xl mx-auto drop-shadow-md">
            Stay updated with exams, CDE programs, and holidays at RRDCH.
          </p>
        </div>

        <div className="bg-white/90 backdrop-blur-3xl rounded-[40px] shadow-premium-hover border border-white/50 p-8 md:p-12">
            {isLoading ? (
                <div className="flex justify-center py-40">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary-blue"></div>
                </div>
            ) : (
                <div className="full-calendar-premium-wrapper">
                    <FullCalendar
                        plugins={[dayGridPlugin, interactionPlugin]}
                        initialView="dayGridMonth"
                        events={events}
                        eventClick={handleEventClick}
                        headerToolbar={{
                            left: 'prev,next today',
                            center: 'title',
                            right: ''
                        }}
                        height="auto"
                        eventDisplay="block"
                    />
                </div>
            )}
        </div>
      </div>

      {/* Event Details Modal */}
      <SuccessModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={selectedEvent?.title}
        subtitle={`${selectedEvent?.extendedProps.icon} ${selectedEvent?.extendedProps.category.toUpperCase()}`}
      >
        <div className="space-y-6 text-left max-w-md mx-auto">
            <div className="bg-soft-bg rounded-3xl p-6 border border-border-light space-y-4 shadow-inner">
                <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm shrink-0">📍</div>
                    <div>
                        <p className="text-[10px] font-black text-neutral-gray uppercase tracking-widest mb-0.5">Venue</p>
                        <p className="text-lg font-black text-secondary-blue">{selectedEvent?.extendedProps.location}</p>
                    </div>
                </div>
                <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm shrink-0">⏰</div>
                    <div>
                        <p className="text-[10px] font-black text-neutral-gray uppercase tracking-widest mb-0.5">Time</p>
                        <p className="text-lg font-black text-secondary-blue">{selectedEvent?.extendedProps.time}</p>
                    </div>
                </div>
                <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm shrink-0">📝</div>
                    <div>
                        <p className="text-[10px] font-black text-neutral-gray uppercase tracking-widest mb-0.5">About</p>
                        <p className="text-sm font-medium text-neutral-gray leading-relaxed">{selectedEvent?.extendedProps.description}</p>
                    </div>
                </div>
            </div>
            <button 
                onClick={() => setIsModalOpen(false)}
                className="w-full py-4 bg-primary-blue text-white font-black rounded-2xl shadow-xl hover:shadow-primary-blue/30 transition-all"
            >
                Add to My Calendar
            </button>
        </div>
      </SuccessModal>

      <style dangerouslySetInnerHTML={{ __html: `
        .full-calendar-premium-wrapper .fc {
          --fc-button-bg-color: #3b82f6;
          --fc-button-border-color: #3b82f6;
          --fc-button-hover-bg-color: #1d4ed8;
          --fc-button-active-bg-color: #1d4ed8;
          --fc-today-bg-color: rgba(59, 130, 246, 0.05);
          --fc-border-color: #f1f5f9;
          font-family: inherit;
        }
        .full-calendar-premium-wrapper .fc-toolbar-title {
          font-weight: 900 !important;
          color: #0f172a;
          text-transform: uppercase;
          letter-spacing: -0.025em;
        }
        .full-calendar-premium-wrapper .fc-col-header-cell {
          padding: 12px 0 !important;
          background: #f8fafc;
          font-weight: 900 !important;
          text-transform: uppercase;
          font-size: 11px;
          letter-spacing: 0.1em;
          color: #64748b;
        }
        .full-calendar-premium-wrapper .fc-daygrid-day-number {
          font-weight: 800;
          color: #1e293b;
          padding: 12px !important;
        }
        .full-calendar-premium-wrapper .fc-event {
          padding: 4px 8px !important;
          border-radius: 8px !important;
          font-weight: 700 !important;
          font-size: 11px !important;
          margin: 2px 4px !important;
          cursor: pointer;
          transition: transform 0.2s;
        }
        .full-calendar-premium-wrapper .fc-event:hover {
          transform: translateY(-1px);
        }
      `}} />
    </div>
  );
};

export default Events;
