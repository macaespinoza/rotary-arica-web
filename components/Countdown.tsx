"use client";

import { useEffect, useState } from "react";

const COUNTDOWN_TARGET_DATE = '2027-09-09T00:00:00';
const COUNTDOWN_EVENT_NAME = 'Cumplimos 100 años en:';

export default function Countdown() {
    const [timeLeft, setTimeLeft] = useState({
        days: "00",
        hours: "00",
        minutes: "00",
        seconds: "00"
    });
    const [isFinished, setIsFinished] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        const targetDate = new Date(COUNTDOWN_TARGET_DATE).getTime();

        const updateCountdown = () => {
            const now = new Date().getTime();
            const diff = targetDate - now;

            if (diff <= 0) {
                setTimeLeft({ days: "00", hours: "00", minutes: "00", seconds: "00" });
                setIsFinished(true);
                return;
            }

            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            setTimeLeft({
                days: String(days).padStart(2, '0'),
                hours: String(hours).padStart(2, '0'),
                minutes: String(minutes).padStart(2, '0'),
                seconds: String(seconds).padStart(2, '0')
            });
        };

        updateCountdown();
        const interval = setInterval(updateCountdown, 1000);
        return () => clearInterval(interval);
    }, []);

    if (!isMounted) return null; // Avoid hydration mismatch

    const eventName = isFinished ? '¡El evento ha comenzado!' : COUNTDOWN_EVENT_NAME;
    const target = new Date(COUNTDOWN_TARGET_DATE);
    const meses = [
        'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
        'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
    ];
    const fechaTexto = `${target.getDate()} de ${meses[target.getMonth()]} de ${target.getFullYear()}`;
    const horasTexto = `${String(target.getHours()).padStart(2, '0')}:${String(target.getMinutes()).padStart(2, '0')} hrs`;

    return (
        <section id="countdown" className="countdown-section">
            <div className="container text-center">
                <div className="countdown-container">
                    <h2 className="countdown-title">Próximo Gran Evento</h2>
                    <p className="countdown-event-name" style={isFinished ? { color: '#ffffff' } : {}}>
                        {eventName}
                    </p>
                    <div className={`countdown-timer ${isFinished ? 'countdown-finished' : ''}`}>
                        <div className="countdown-unit">
                            <div className="countdown-value">{timeLeft.days}</div>
                            <div className="countdown-label">Días</div>
                        </div>
                        <div className="countdown-separator">:</div>
                        <div className="countdown-unit">
                            <div className="countdown-value">{timeLeft.hours}</div>
                            <div className="countdown-label">Horas</div>
                        </div>
                        <div className="countdown-separator">:</div>
                        <div className="countdown-unit">
                            <div className="countdown-value">{timeLeft.minutes}</div>
                            <div className="countdown-label">Minutos</div>
                        </div>
                        <div className="countdown-separator">:</div>
                        <div className="countdown-unit">
                            <div className="countdown-value">{timeLeft.seconds}</div>
                            <div className="countdown-label">Segundos</div>
                        </div>
                    </div>
                    <p className="countdown-date-text">
                        <i className="bi bi-calendar3"></i> {fechaTexto} &nbsp;•&nbsp; <i className="bi bi-clock"></i> {horasTexto}
                    </p>
                </div>
            </div>
        </section>
    );
}
