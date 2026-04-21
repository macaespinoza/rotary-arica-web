"use client";

import { useState, useEffect } from "react";

export type CalendarEvent = {
  date: string;        // YYYY-MM-DD
  title: string;
  time?: string | null;
  description?: string | null;
  location?: string | null;
};

const MONTH_NAMES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
const MONTH_NAMES_SHORT = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

export default function Calendar({ events }: { events: CalendarEvent[] }) {
    const [currentDate, setCurrentDate] = useState<Date | null>(null);
    const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
    const [selectedDay, setSelectedDay] = useState<{day: number, month: number} | null>(null);

    useEffect(() => {
        // Initialize on client to avoid hydration mismatch
        setCurrentDate(new Date());
    }, []);

    if (!currentDate) return null;

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const today = new Date();

    const firstDay = new Date(year, month, 1).getDay(); // 0=Sun
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    const totalCells = Math.ceil((firstDay + daysInMonth) / 7) * 7;
    const calendarDays = [];

    for (let i = 0; i < totalCells; i++) {
        let dayNumber;
        let dateStr;
        let isCurrentMonth = true;
        let classes = ["calendar-day"];

        if (i < firstDay) {
            dayNumber = daysInPrevMonth - firstDay + 1 + i;
            classes.push("other-month", "empty");
            isCurrentMonth = false;
            const pm = month === 0 ? 11 : month - 1;
            const py = month === 0 ? year - 1 : year;
            dateStr = `${py}-${String(pm + 1).padStart(2, '0')}-${String(dayNumber).padStart(2, '0')}`;
        } else if (i >= firstDay + daysInMonth) {
            dayNumber = i - firstDay - daysInMonth + 1;
            classes.push("other-month", "empty");
            isCurrentMonth = false;
            const nm = month === 11 ? 0 : month + 1;
            const ny = month === 11 ? year + 1 : year;
            dateStr = `${ny}-${String(nm + 1).padStart(2, '0')}-${String(dayNumber).padStart(2, '0')}`;
        } else {
            dayNumber = i - firstDay + 1;
            dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNumber).padStart(2, '0')}`;

            if (year === today.getFullYear() && month === today.getMonth() && dayNumber === today.getDate()) {
                classes.push("today");
            }
        }

        const dayEvents = events.filter(e => e.date === dateStr);
        let title = "";
        if (dayEvents.length > 0 && isCurrentMonth) {
            classes.push("has-event");
            title = dayEvents.map(e => e.title).join(', ');
            
            if (selectedDay?.day === dayNumber && selectedDay?.month === month) {
                classes.push("selected");
            }
        }

        calendarDays.push({
            id: `cell-${i}`,
            dayNumber,
            dateStr,
            classes: classes.join(" "),
            title,
            events: dayEvents,
            isCurrentMonth,
            month
        });
    }

    const handleNextMonth = () => {
        setCurrentDate(new Date(year, month + 1, 1));
        setSelectedEvent(null);
        setSelectedDay(null);
    };

    const handlePrevMonth = () => {
        setCurrentDate(new Date(year, month - 1, 1));
        setSelectedEvent(null);
        setSelectedDay(null);
    };

    const handleDayClick = (dayData: typeof calendarDays[0]) => {
        if (dayData.events.length > 0 && dayData.isCurrentMonth) {
            setSelectedEvent(dayData.events[0]);
            setSelectedDay({ day: dayData.dayNumber, month: dayData.month });
        }
    };

    const todayVal = new Date();
    todayVal.setHours(0,0,0,0);
    const upcomingEvents = events
        .filter(e => new Date(e.date + 'T00:00:00') >= todayVal)
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .slice(0, 5);

    return (
        <section id="calendario" className="section-padding">
            <div className="container">
                <div className="section-header text-center mb-5">
                    <h2 className="section-title">Calendario de Eventos</h2>
                    <div className="title-underline"></div>
                    <p className="section-description mt-3">Descubre nuestras próximas actividades y únete a generar un impacto positivo.</p>
                </div>

                <div className="calendar-wrapper">
                    <div className="calendar-controls d-flex justify-content-between align-items-center mb-4">
                        <button onClick={handlePrevMonth} className="btn btn-rotary-outline" aria-label="Mes anterior">
                            <i className="bi bi-chevron-left"></i>
                        </button>
                        <h3 className="calendar-month-title mb-0">{MONTH_NAMES[month]} {year}</h3>
                        <button onClick={handleNextMonth} className="btn btn-rotary-outline" aria-label="Mes siguiente">
                            <i className="bi bi-chevron-right"></i>
                        </button>
                    </div>

                    <div className="calendar-grid">
                        <div className="calendar-header">
                            <div className="calendar-day-name">Dom</div>
                            <div className="calendar-day-name">Lun</div>
                            <div className="calendar-day-name">Mar</div>
                            <div className="calendar-day-name">Mié</div>
                            <div className="calendar-day-name">Jue</div>
                            <div className="calendar-day-name">Vie</div>
                            <div className="calendar-day-name">Sáb</div>
                        </div>
                        <div className="calendar-body">
                            {calendarDays.map((d) => (
                                <div 
                                    key={d.id} 
                                    className={d.classes} 
                                    title={d.title}
                                    onClick={() => handleDayClick(d)}
                                    style={{ cursor: d.events.length > 0 ? 'pointer' : 'default' }}
                                >
                                    <span className="day-number">{d.dayNumber}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {selectedEvent && (
                        <div className="event-detail mt-4">
                            <div className="card border-0 shadow-sm">
                                <div className="card-body p-4">
                                    <div className="d-flex align-items-center mb-3">
                                        <div className="event-date-badge me-3">
                                            <span className="event-date-day">{selectedDay?.day}</span>
                                            <span className="event-date-month">{MONTH_NAMES_SHORT[selectedDay?.month || 0]}</span>
                                        </div>
                                        <div>
                                            <h4 className="mb-1">{selectedEvent.title}</h4>
                                            {selectedEvent.time && (
                                                <p className="text-muted mb-0"><i className="bi bi-clock me-1"></i>{selectedEvent.time}</p>
                                            )}
                                        </div>
                                    </div>
                                    {selectedEvent.description && (
                                        <p className="mb-0">{selectedEvent.description}</p>
                                    )}
                                    {selectedEvent.location && (
                                        <p className="text-muted mt-2 mb-0"><i className="bi bi-geo-alt me-1"></i>{selectedEvent.location}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="upcoming-events mt-5">
                        <h4 className="mb-3"><i className="bi bi-calendar-event me-2"></i>Próximos Eventos</h4>
                        <div className="list-group">
                            {upcomingEvents.length === 0 ? (
                                <p className="text-muted">No hay eventos próximos programados.</p>
                            ) : (
                                upcomingEvents.map((evento, idx) => {
                                    const d = new Date(evento.date + 'T00:00:00');
                                    const dateFormatted = `${d.getDate()} de ${MONTH_NAMES[d.getMonth()]}, ${d.getFullYear()}`;
                                    
                                    return (
                                        <div 
                                            key={idx} 
                                            className="list-group-item" 
                                            style={{ cursor: 'pointer' }}
                                            onClick={() => {
                                                setCurrentDate(new Date(d.getFullYear(), d.getMonth(), 1));
                                                setSelectedEvent(evento);
                                                setSelectedDay({ day: d.getDate(), month: d.getMonth() });
                                            }}
                                        >
                                            <div className="upcoming-event-date">{dateFormatted}</div>
                                            <p className="upcoming-event-title">{evento.title}</p>
                                            {evento.time && (
                                                <span className="upcoming-event-time"><i className="bi bi-clock me-1"></i>{evento.time}</span>
                                            )}
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
