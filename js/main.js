/* ==========================================================================
   ROTARY CLUB ARICA - JAVASCRIPT PRINCIPAL
   Funcionalidad: Navbar scroll, Galería, Calendario interactivo, Back-to-top
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function () {

    // =========================================================================
    // 0. COUNTDOWN: Cuenta regresiva para el próximo gran evento
    // =========================================================================
    // ──────────────────────────────────────────────────────────────────────────
    // ★ PARA CAMBIAR LA FECHA DESTINO, edita estas dos líneas: ★
    // ──────────────────────────────────────────────────────────────────────────
    var COUNTDOWN_TARGET_DATE = '2027-09-09T00:00:00';  // Formato: YYYY-MM-DDTHH:MM:SS
    var COUNTDOWN_EVENT_NAME = 'Cumplimos 100 años en:';     // Nombre del evento
    // ──────────────────────────────────────────────────────────────────────────

    var countdownDaysEl = document.getElementById('countdownDays');
    var countdownHoursEl = document.getElementById('countdownHours');
    var countdownMinutesEl = document.getElementById('countdownMinutes');
    var countdownSecondsEl = document.getElementById('countdownSeconds');
    var countdownEventNameEl = document.getElementById('countdownEventName');
    var countdownDateTextEl = document.getElementById('countdownDateText');
    var countdownTimerEl = document.getElementById('countdownTimer');

    if (countdownDaysEl && countdownTimerEl) {
        // Mostrar nombre del evento
        if (countdownEventNameEl) {
            countdownEventNameEl.textContent = COUNTDOWN_EVENT_NAME;
        }

        // Mostrar la fecha formateada debajo del timer
        var targetDate = new Date(COUNTDOWN_TARGET_DATE);
        var meses = [
            'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
            'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
        ];
        var fechaTexto = targetDate.getDate() + ' de ' + meses[targetDate.getMonth()] + ' de ' + targetDate.getFullYear();
        var horasTexto = String(targetDate.getHours()).padStart(2, '0') + ':' + String(targetDate.getMinutes()).padStart(2, '0') + ' hrs';

        if (countdownDateTextEl) {
            countdownDateTextEl.innerHTML = '<i class="bi bi-calendar3"></i> ' + fechaTexto + ' &nbsp;•&nbsp; <i class="bi bi-clock"></i> ' + horasTexto;
        }

        function updateCountdown() {
            var now = new Date().getTime();
            var target = new Date(COUNTDOWN_TARGET_DATE).getTime();
            var diff = target - now;

            if (diff <= 0) {
                // Evento ya pasó o está en curso
                countdownDaysEl.textContent = '00';
                countdownHoursEl.textContent = '00';
                countdownMinutesEl.textContent = '00';
                countdownSecondsEl.textContent = '00';
                countdownTimerEl.classList.add('countdown-finished');

                if (countdownEventNameEl) {
                    countdownEventNameEl.textContent = '¡El evento ha comenzado!';
                    countdownEventNameEl.style.color = '#ffffff';
                }
                return;
            }

            var days = Math.floor(diff / (1000 * 60 * 60 * 24));
            var hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            var minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            var seconds = Math.floor((diff % (1000 * 60)) / 1000);

            countdownDaysEl.textContent = String(days).padStart(2, '0');
            countdownHoursEl.textContent = String(hours).padStart(2, '0');
            countdownMinutesEl.textContent = String(minutes).padStart(2, '0');
            countdownSecondsEl.textContent = String(seconds).padStart(2, '0');
        }

        // Ejecutar inmediatamente y luego cada segundo
        updateCountdown();
        setInterval(updateCountdown, 1000);
    }

    // =========================================================================
    // 1. NAVBAR: Cambio de estilo al hacer scroll
    // =========================================================================
    const navbar = document.getElementById('mainNavbar');
    const backToTopBtn = document.getElementById('backToTop');

    window.addEventListener('scroll', function () {
        // Navbar scroll effect
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Back to top button visibility
        if (window.scrollY > 400) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });

    // Scroll suave al hacer click en "Volver arriba"
    backToTopBtn.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });


    // =========================================================================
    // 2. NAVBAR: Resaltar link activo según sección visible
    // =========================================================================
    const sections = document.querySelectorAll('section[id], footer[id]');
    const navLinks = document.querySelectorAll('#mainNavbar .nav-link');

    function activateNavLink() {
        let currentSection = '';
        sections.forEach(function (section) {
            const sectionTop = section.offsetTop - 100;
            if (window.scrollY >= sectionTop) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinks.forEach(function (link) {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + currentSection) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', activateNavLink);


    // =========================================================================
    // 3. NAVBAR: Cerrar menú móvil al hacer click en un link
    // =========================================================================
    const navbarCollapse = document.getElementById('navbarNav');
    navLinks.forEach(function (link) {
        link.addEventListener('click', function () {
            if (navbarCollapse.classList.contains('show')) {
                var bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
                if (bsCollapse) bsCollapse.hide();
            }
        });
    });


    // =========================================================================
    // 4. GALERÍA: Filtrado por categoría
    // =========================================================================
    const filterButtons = document.querySelectorAll('.btn-filter');
    const galleryItems = document.querySelectorAll('.gallery-item');

    filterButtons.forEach(function (btn) {
        btn.addEventListener('click', function () {
            // Activar botón seleccionado
            filterButtons.forEach(function (b) { b.classList.remove('active'); });
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            galleryItems.forEach(function (item) {
                if (filter === 'all' || item.getAttribute('data-category') === filter) {
                    item.classList.remove('hidden');
                    item.style.display = '';
                } else {
                    item.classList.add('hidden');
                    item.style.display = 'none';
                }
            });
        });
    });


    // =========================================================================
    // 5. GALERÍA: Modal con imagen ampliada
    // =========================================================================
    const galleryModal = document.getElementById('galleryModal');
    if (galleryModal) {
        galleryModal.addEventListener('show.bs.modal', function (event) {
            const trigger = event.relatedTarget;
            const imgSrc = trigger.getAttribute('data-img');
            const caption = trigger.getAttribute('data-caption');

            document.getElementById('modalImage').src = imgSrc;
            document.getElementById('modalCaption').textContent = caption;
        });
    }


    // =========================================================================
    // 6. CALENDARIO INTERACTIVO
    // =========================================================================

    // --- Datos de eventos de ejemplo (puedes editar/agregar aquí) ---
    const eventos = [
        {
            date: '2026-04-17',
            title: 'Reunión Semanal del Club',
            time: '19:30 - 21:00',
            description: 'Reunión semanal de los socios del Rotary Club Arica.',
            location: 'Sede Rotary Club Arica'
        },
        {
            date: '2026-04-24',
            title: 'Reunión Semanal del Club',
            time: '19:30 - 21:00',
            description: 'Reunión semanal de los socios del Rotary Club Arica.',
            location: 'Sede Rotary Club Arica'
        },
        {
            date: '2026-05-03',
            title: 'Jornada de Servicio Comunitario',
            time: '09:00 - 13:00',
            description: 'Día de limpieza y embellecimiento del Parque Centenario.',
            location: 'Parque Centenario, Arica'
        },
        {
            date: '2026-05-10',
            title: 'Charla: Liderazgo en la Comunidad',
            time: '18:00 - 19:30',
            description: 'Charla abierta sobre liderazgo y servicio comunitario.',
            location: 'Auditorio Municipal de Arica'
        },
        {
            date: '2026-05-22',
            title: 'Cena de Gala Anual',
            time: '20:00 - 23:00',
            description: 'Cena anual del club con premiación a socios destacados.',
            location: 'Hotel King, Arica'
        },
        {
            date: '2026-06-05',
            title: 'Campaña de Salud',
            time: '08:00 - 14:00',
            description: 'Campaña gratuita de chequeo médico preventivo para la comunidad.',
            location: 'Plaza Colón, Arica'
        }
    ];

    const monthNames = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];

    const monthNamesShort = [
        'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
        'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'
    ];

    let currentDate = new Date();
    let selectedDate = null;

    const calendarBody = document.getElementById('calendarBody');
    const currentMonthEl = document.getElementById('currentMonth');
    const prevMonthBtn = document.getElementById('prevMonth');
    const nextMonthBtn = document.getElementById('nextMonth');
    const eventDetail = document.getElementById('eventDetail');

    /** Genera el calendario para el mes/año indicado */
    function renderCalendar(year, month) {
        calendarBody.innerHTML = '';
        currentMonthEl.textContent = monthNames[month] + ' ' + year;

        const firstDay = new Date(year, month, 1).getDay(); // 0=Dom
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const daysInPrevMonth = new Date(year, month, 0).getDate();

        const today = new Date();
        const totalCells = Math.ceil((firstDay + daysInMonth) / 7) * 7;

        for (let i = 0; i < totalCells; i++) {
            const dayEl = document.createElement('div');
            dayEl.classList.add('calendar-day');

            let dayNumber;
            let dateStr;
            let isCurrentMonth = true;

            if (i < firstDay) {
                // Días del mes anterior
                dayNumber = daysInPrevMonth - firstDay + 1 + i;
                dayEl.classList.add('other-month', 'empty');
                isCurrentMonth = false;
                const pm = month === 0 ? 11 : month - 1;
                const py = month === 0 ? year - 1 : year;
                dateStr = py + '-' + String(pm + 1).padStart(2, '0') + '-' + String(dayNumber).padStart(2, '0');
            } else if (i >= firstDay + daysInMonth) {
                // Días del mes siguiente
                dayNumber = i - firstDay - daysInMonth + 1;
                dayEl.classList.add('other-month', 'empty');
                isCurrentMonth = false;
                const nm = month === 11 ? 0 : month + 1;
                const ny = month === 11 ? year + 1 : year;
                dateStr = ny + '-' + String(nm + 1).padStart(2, '0') + '-' + String(dayNumber).padStart(2, '0');
            } else {
                dayNumber = i - firstDay + 1;
                dateStr = year + '-' + String(month + 1).padStart(2, '0') + '-' + String(dayNumber).padStart(2, '0');

                // ¿Es hoy?
                if (year === today.getFullYear() && month === today.getMonth() && dayNumber === today.getDate()) {
                    dayEl.classList.add('today');
                }

                // ¿Tiene evento?
                const dayEvents = eventos.filter(function (e) { return e.date === dateStr; });
                if (dayEvents.length > 0) {
                    dayEl.classList.add('has-event');
                    dayEl.title = dayEvents.map(function (e) { return e.title; }).join(', ');

                    dayEl.addEventListener('click', function () {
                        // Des-seleccionar anterior
                        var prev = calendarBody.querySelector('.selected');
                        if (prev) prev.classList.remove('selected');

                        dayEl.classList.add('selected');
                        showEventDetail(dayEvents[0], dayNumber, month);
                    });
                }
            }

            const numSpan = document.createElement('span');
            numSpan.classList.add('day-number');
            numSpan.textContent = dayNumber;
            dayEl.appendChild(numSpan);

            calendarBody.appendChild(dayEl);
        }
    }

    /** Muestra el detalle de un evento seleccionado */
    function showEventDetail(evento, day, month) {
        document.getElementById('eventDay').textContent = day;
        document.getElementById('eventMonth').textContent = monthNamesShort[month];
        document.getElementById('eventTitle').textContent = evento.title;
        document.getElementById('eventTime').innerHTML = '<i class="bi bi-clock me-1"></i>' + evento.time;
        document.getElementById('eventDescription').textContent = evento.description;
        document.getElementById('eventLocation').innerHTML = '<i class="bi bi-geo-alt me-1"></i>' + evento.location;
        eventDetail.style.display = 'block';
        eventDetail.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    /** Renderiza la lista de próximos eventos */
    function renderUpcomingEvents() {
        const list = document.getElementById('upcomingEventsList');
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const upcoming = eventos
            .filter(function (e) { return new Date(e.date + 'T00:00:00') >= today; })
            .sort(function (a, b) { return new Date(a.date) - new Date(b.date); })
            .slice(0, 5);

        if (upcoming.length === 0) {
            list.innerHTML = '<p class="text-muted">No hay eventos próximos programados.</p>';
            return;
        }

        list.innerHTML = '';
        upcoming.forEach(function (evento) {
            const d = new Date(evento.date + 'T00:00:00');
            const dateFormatted = d.getDate() + ' de ' + monthNames[d.getMonth()] + ', ' + d.getFullYear();

            const item = document.createElement('div');
            item.className = 'list-group-item';
            item.innerHTML =
                '<div class="upcoming-event-date">' + dateFormatted + '</div>' +
                '<p class="upcoming-event-title">' + evento.title + '</p>' +
                '<span class="upcoming-event-time"><i class="bi bi-clock me-1"></i>' + evento.time + '</span>';

            item.style.cursor = 'pointer';
            item.addEventListener('click', function () {
                // Navegar al mes del evento
                currentDate = new Date(d.getFullYear(), d.getMonth(), 1);
                renderCalendar(d.getFullYear(), d.getMonth());

                // Seleccionar el día
                setTimeout(function () {
                    var days = calendarBody.querySelectorAll('.calendar-day.has-event');
                    days.forEach(function (dayEl) {
                        var num = dayEl.querySelector('.day-number');
                        if (num && parseInt(num.textContent) === d.getDate()) {
                            dayEl.click();
                        }
                    });
                }, 100);
            });

            list.appendChild(item);
        });
    }

    // Botones de navegación de meses
    prevMonthBtn.addEventListener('click', function () {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar(currentDate.getFullYear(), currentDate.getMonth());
        eventDetail.style.display = 'none';
    });

    nextMonthBtn.addEventListener('click', function () {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar(currentDate.getFullYear(), currentDate.getMonth());
        eventDetail.style.display = 'none';
    });

    // Render inicial
    renderCalendar(currentDate.getFullYear(), currentDate.getMonth());
    renderUpcomingEvents();


    // =========================================================================
    // 7. EL PAPELITO CARRUSEL LOGIC
    // =========================================================================
    const papelitoCarouselInner = document.getElementById('papelitoCarouselInner');
    if (papelitoCarouselInner) {
        fetch('assets/papelito/metadata.json')
            .then(response => response.json())
            .then(data => {
                // Ordenar por fecha descendente y tomar los primeros 5
                const latestDocs = data.sort((a, b) => new Date(b.fechaPublicacion) - new Date(a.fechaPublicacion)).slice(0, 5);
                
                if (latestDocs.length === 0) {
                    papelitoCarouselInner.innerHTML = '<div class="text-center py-5 text-muted">No hay documentos disponibles por ahora.</div>';
                    return;
                }

                papelitoCarouselInner.innerHTML = '';
                
                latestDocs.forEach((doc, index) => {
                    const isActive = index === 0 ? 'active' : '';
                    const imgUrl = doc.miniatura ? doc.miniatura : 'https://placehold.co/800x400/0b3c5d/ffffff?text=Edición+Papelito';
                    const dateFormatted = new Date(doc.fechaPublicacion).toLocaleDateString('es-CL', { month: 'long', year: 'numeric' });
                    
                    const itemHtml = `
                        <div class="carousel-item ${isActive}">
                            <div class="d-flex justify-content-center">
                                <div class="card bg-dark text-white text-center border-0" style="max-width: 600px;">
                                    <img src="${imgUrl}" class="card-img" alt="${doc.titulo}" style="opacity: 0.6; max-height: 400px; object-fit: cover;">
                                    <div class="card-img-overlay d-flex flex-column justify-content-center align-items-center">
                                        <h3 class="card-title fw-bold text-shadow">${doc.titulo}</h3>
                                        <p class="card-text fs-5 text-shadow">Publicado: ${dateFormatted}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `;
                    papelitoCarouselInner.insertAdjacentHTML('beforeend', itemHtml);
                });
            })
            .catch(error => {
                console.error("Error al cargar la data de El Papelito:", error);
                papelitoCarouselInner.innerHTML = '<div class="text-center py-5 text-danger">Error al cargar las ediciones recientes.</div>';
            });
    }


    // =========================================================================
    // 8. ANIMACIONES AL HACER SCROLL (Intersection Observer)
    // =========================================================================
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px 100px 0px'
    };

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Aplicar animación a elementos
    const animatedElements = document.querySelectorAll(
        '.card-rotary, .gallery-card, .section-header'
    );

    animatedElements.forEach(function (el) {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
        observer.observe(el);
    });

});
