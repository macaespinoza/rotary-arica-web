export default function Home() {
  return (
    <>
      

    
    
    
    <nav id="mainNavbar" className="navbar navbar-expand-lg navbar-dark fixed-top">
        <div className="container">
            <a className="navbar-brand d-flex align-items-center" href="#">
                <img src="assets/logos/RotaryMoE-R_CMYK-C.png" alt="Rotary Club Arica" id="logo-navbar" className="me-2" />
                <span className="brand-text">Rotary Club<br /><strong>Arica</strong></span>
            </a>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
                aria-controls="navbarNav" aria-expanded="false" aria-label="Menú de navegación">
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
                <ul className="navbar-nav ms-auto">
                    <li className="nav-item">
                        <a className="nav-link active" href="#hero">Inicio</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" href="#mision-vision">Nosotros</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" href="#galeria">Galería</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" href="#papelito-section">El Papelito</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" href="#calendario">Eventos</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" href="#contacto">Contacto</a>
                    </li>
                </ul>
            </div>
        </div>
    </nav>


    
    
    
    <section id="hero" className="hero-section d-flex align-items-center">
        <div className="hero-overlay"></div>
        <div className="container position-relative z-1 text-center text-white">
            <img src="assets/logos/RotaryMoE-R_CMYK-C.png" alt="Rotary" className="hero-logo mb-4" width="220" />
            <h1 className="hero-title">Rotary Club Arica</h1>
            <p className="hero-subtitle">Gente de acción creando cambios duraderos en nuestra comunidad y el mundo</p>
            <div className="hero-buttons mt-4">
                <a href="#mision-vision" className="btn btn-rotary-gold btn-lg me-2">Conócenos</a>
                <a href="#calendario" className="btn btn-outline-light btn-lg">Próximos Eventos</a>
            </div>
        </div>
    </section>

    
    
    
    <section id="countdown" className="countdown-section">
        <div className="container text-center">
            <div className="countdown-container">
                <h2 className="countdown-title">Próximo Gran Evento</h2>
                <p className="countdown-event-name" id="countdownEventName">Cena de Gala Anual</p>
                <div className="countdown-timer" id="countdownTimer">
                    <div className="countdown-unit">
                        <div className="countdown-value" id="countdownDays">00</div>
                        <div className="countdown-label">Días</div>
                    </div>
                    <div className="countdown-separator">:</div>
                    <div className="countdown-unit">
                        <div className="countdown-value" id="countdownHours">00</div>
                        <div className="countdown-label">Horas</div>
                    </div>
                    <div className="countdown-separator">:</div>
                    <div className="countdown-unit">
                        <div className="countdown-value" id="countdownMinutes">00</div>
                        <div className="countdown-label">Minutos</div>
                    </div>
                    <div className="countdown-separator">:</div>
                    <div className="countdown-unit">
                        <div className="countdown-value" id="countdownSeconds">00</div>
                        <div className="countdown-label">Segundos</div>
                    </div>
                </div>
                <p className="countdown-date-text" id="countdownDateText"></p>
            </div>
        </div>
    </section>


    
    
    
    <section id="mision-vision" className="section-padding">
        <div className="container">
            <div className="section-header text-center mb-5">
                <h2 className="section-title">Nuestra Esencia</h2>
                <div className="title-underline"></div>
                <p className="section-description mt-3">Impulsamos el servicio, la integridad y el compañerismo para crear un impacto positivo.</p>
            </div>

            <div className="row g-4">
                
                <div className="col-lg-4 col-md-6">
                    <div className="card card-rotary h-100" id="card-mision">
                        <div className="card-body text-center p-4">
                            <div className="card-icon-wrapper mb-3">
                                <i className="bi bi-bullseye"></i>
                            </div>
                            <h3 className="card-title">Misión</h3>
                            <p className="card-text">
                                Brindar servicio humanitario en Arica, promoviendo la integridad y 
                                la paz a través de proyectos locales sostenibles bajo nuestro lema 
                                fundamental: "Dar de sí antes de pensar en sí".
                            </p>
                        </div>
                        <div className="card-footer-accent"></div>
                    </div>
                </div>

                
                <div className="col-lg-4 col-md-6">
                    <div className="card card-rotary h-100" id="card-vision">
                        <div className="card-body text-center p-4">
                            <div className="card-icon-wrapper mb-3">
                                <i className="bi bi-eye"></i>
                            </div>
                            <h3 className="card-title">Visión</h3>
                            <p className="card-text">
                                Ser el referente de liderazgo y servicio en el norte de Chile, 
                                transformando realidades en nuestra región mediante una 
                                red global de personas de acción que generan un
                                 impacto positivo y duradero.
                            </p>
                        </div>
                        <div className="card-footer-accent"></div>
                    </div>
                </div>

                
                <div className="col-lg-4 col-md-12">
                    <div className="card card-rotary h-100" id="card-valores">
                        <div className="card-body text-center p-4">
                            <div className="card-icon-wrapper mb-3">
                                <i className="bi bi-heart-pulse"></i>
                            </div>
                            <h3 className="card-title">Valores</h3>
                            <p className="card-text">
                                Nos guiamos por la integridad, el compañerismo, la diversidad,
                                 el servicio y el liderazgo. Actuamos con ética y transparencia 
                                 para construir una comunidad ariqueña más fuerte y solidaria.
                            </p>
                        </div>
                        <div className="card-footer-accent"></div>
                    </div>
                </div>
            </div>
        </div>
    </section>


    
    
    
    <section id="galeria" className="section-padding bg-light-rotary">
        <div className="container">
            <div className="section-header text-center mb-5">
                <h2 className="section-title">Galería</h2>
                <div className="title-underline"></div>
                <p className="section-description mt-3">Momentos que reflejan nuestro compromiso con la comunidad.</p>
            </div>

            
            <div className="gallery-filters text-center mb-4">
                <button className="btn btn-filter active" data-filter="all">Todas</button>
                <button className="btn btn-filter" data-filter="eventos">Eventos</button>
                <button className="btn btn-filter" data-filter="proyectos">Proyectos</button>
                <button className="btn btn-filter" data-filter="comunidad">Comunidad</button>
            </div>

            
            <div className="row g-3" id="galleryGrid">
                
                <div className="col-lg-4 col-md-6 gallery-item" data-category="proyectos">
                    <div className="gallery-card" data-bs-toggle="modal" data-bs-target="#galleryModal" data-img="assets/img/gallery/20130516_GT_037.JPG" data-caption="Apoyo educativo comunitario">
                        <img src="assets/img/gallery/20130516_GT_037.JPG" alt="Apoyo educativo comunitario" loading="lazy" />
                        <div className="gallery-overlay">
                            <i className="bi bi-zoom-in"></i>
                        </div>
                    </div>
                </div>
                
                <div className="col-lg-4 col-md-6 gallery-item" data-category="comunidad">
                    <div className="gallery-card" data-bs-toggle="modal" data-bs-target="#galleryModal" data-img="assets/img/gallery/20180526_BR_1637_edit.jpg" data-caption="Servicio comunitario con adultos mayores">
                        <img src="assets/img/gallery/20180526_BR_1637_edit.jpg" alt="Servicio comunitario con adultos mayores" loading="lazy" />
                        <div className="gallery-overlay">
                            <i className="bi bi-zoom-in"></i>
                        </div>
                    </div>
                </div>
                
                <div className="col-lg-4 col-md-6 gallery-item" data-category="comunidad">
                    <div className="gallery-card" data-bs-toggle="modal" data-bs-target="#galleryModal" data-img="assets/img/gallery/20180526_BR_1727.jpg" data-caption="Voluntariado juvenil Rotary">
                        <img src="assets/img/gallery/20180526_BR_1727.jpg" alt="Voluntariado juvenil Rotary" loading="lazy" />
                        <div className="gallery-overlay">
                            <i className="bi bi-zoom-in"></i>
                        </div>
                    </div>
                </div>
                
                <div className="col-lg-4 col-md-6 gallery-item" data-category="proyectos">
                    <div className="gallery-card" data-bs-toggle="modal" data-bs-target="#galleryModal" data-img="assets/img/gallery/20150427_MX_103.jpg" data-caption="Proyecto de ayuda comunitaria">
                        <img src="assets/img/gallery/20150427_MX_103.jpg" alt="Proyecto de ayuda comunitaria" loading="lazy" />
                        <div className="gallery-overlay">
                            <i className="bi bi-zoom-in"></i>
                        </div>
                    </div>
                </div>
                
                <div className="col-lg-4 col-md-6 gallery-item" data-category="eventos">
                    <div className="gallery-card" data-bs-toggle="modal" data-bs-target="#galleryModal" data-img="assets/img/gallery/20210812_US_204.jpg" data-caption="Evento de integración Rotaria">
                        <img src="assets/img/gallery/20210812_US_204.jpg" alt="Evento de integración Rotaria" loading="lazy" />
                        <div className="gallery-overlay">
                            <i className="bi bi-zoom-in"></i>
                        </div>
                    </div>
                </div>
                
                <div className="col-lg-4 col-md-6 gallery-item" data-category="proyectos">
                    <div className="gallery-card" data-bs-toggle="modal" data-bs-target="#galleryModal" data-img="assets/img/gallery/20211114_US_182.jpg" data-caption="Trabajo comunitario Rotary">
                        <img src="assets/img/gallery/20211114_US_182.jpg" alt="Trabajo comunitario Rotary" loading="lazy" />
                        <div className="gallery-overlay">
                            <i className="bi bi-zoom-in"></i>
                        </div>
                    </div>
                </div>
                
                <div className="col-lg-4 col-md-6 gallery-item" data-category="comunidad">
                    <div className="gallery-card" data-bs-toggle="modal" data-bs-target="#galleryModal" data-img="assets/img/gallery/20220405_KR_021.jpg" data-caption="Jornada de servicio comunitario">
                        <img src="assets/img/gallery/20220405_KR_021.jpg" alt="Jornada de servicio comunitario" loading="lazy" />
                        <div className="gallery-overlay">
                            <i className="bi bi-zoom-in"></i>
                        </div>
                    </div>
                </div>
                
                <div className="col-lg-4 col-md-6 gallery-item" data-category="eventos">
                    <div className="gallery-card" data-bs-toggle="modal" data-bs-target="#galleryModal" data-img="assets/img/gallery/20240425_TR_014.jpg" data-caption="Evento Rotary Internacional">
                        <img src="assets/img/gallery/20240425_TR_014.jpg" alt="Evento Rotary Internacional" loading="lazy" />
                        <div className="gallery-overlay">
                            <i className="bi bi-zoom-in"></i>
                        </div>
                    </div>
                </div>
                
                <div className="col-lg-4 col-md-6 gallery-item" data-category="eventos">
                    <div className="gallery-card" data-bs-toggle="modal" data-bs-target="#galleryModal" data-img="assets/img/gallery/20161110_US_391.jpg" data-caption="Evento Rotary USA 2016">
                        <img src="assets/img/gallery/20161110_US_391.jpg" alt="Evento Rotary USA 2016" loading="lazy" />
                        <div className="gallery-overlay">
                            <i className="bi bi-zoom-in"></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    
    <div className="modal fade" id="galleryModal" tabindex="-1" aria-label="Vista ampliada" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content bg-dark border-0">
                <div className="modal-header border-0">
                    <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Cerrar"></button>
                </div>
                <div className="modal-body text-center p-0">
                    <img id="modalImage" src="" alt="Imagen ampliada" className="img-fluid rounded" />
                </div>
                <div className="modal-footer border-0 justify-content-center">
                    <p id="modalCaption" className="text-white mb-0"></p>
                </div>
            </div>
        </div>
    </div>


    
    
    
    <section id="papelito-section" className="section-padding">
        <div className="container">
            <div className="section-header text-center mb-5">
                <h2 className="section-title">El Papelito</h2>
                <div className="title-underline"></div>
                <p className="section-description mt-3">Nuestro boletín oficial. Mantente informado con nuestras últimas ediciones.</p>
            </div>

            <div id="papelitoCarousel" className="carousel slide" data-bs-ride="carousel">
                <div className="carousel-inner" id="papelitoCarouselInner">
                    
                    <div className="text-center py-5">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Cargando...</span>
                        </div>
                    </div>
                </div>
                <button className="carousel-control-prev" type="button" data-bs-target="#papelitoCarousel" data-bs-slide="prev">
                    <span className="carousel-control-prev-icon bg-dark rounded-circle p-3" aria-hidden="true"></span>
                    <span className="visually-hidden">Anterior</span>
                </button>
                <button className="carousel-control-next" type="button" data-bs-target="#papelitoCarousel" data-bs-slide="next">
                    <span className="carousel-control-next-icon bg-dark rounded-circle p-3" aria-hidden="true"></span>
                    <span className="visually-hidden">Siguiente</span>
                </button>
            </div>

            <div className="text-center mt-5">
                <a href="papelito.html" className="btn btn-rotary-gold btn-lg">
                    <i className="bi bi-book me-2"></i>Ir al Visor Interactivo
                </a>
            </div>
        </div>
    </section>

    
    
    
    <section id="calendario" className="section-padding">
        <div className="container">
            <div className="section-header text-center mb-5">
                <h2 className="section-title">Calendario de Eventos</h2>
                <div className="title-underline"></div>
                <p className="section-description mt-3">Descubre nuestras próximas actividades y únete a generar un impacto positivo.</p>
            </div>

            <div className="calendar-wrapper">
                
                <div className="calendar-controls d-flex justify-content-between align-items-center mb-4">
                    <button id="prevMonth" className="btn btn-rotary-outline" aria-label="Mes anterior">
                        <i className="bi bi-chevron-left"></i>
                    </button>
                    <h3 id="currentMonth" className="calendar-month-title mb-0"></h3>
                    <button id="nextMonth" className="btn btn-rotary-outline" aria-label="Mes siguiente">
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
                    <div id="calendarBody" className="calendar-body">
                        
                    </div>
                </div>

                
                <div id="eventDetail" className="event-detail mt-4" style={{ display: 'none' }}>
                    <div className="card border-0 shadow-sm">
                        <div className="card-body p-4">
                            <div className="d-flex align-items-center mb-3">
                                <div className="event-date-badge me-3">
                                    <span id="eventDay" className="event-date-day"></span>
                                    <span id="eventMonth" className="event-date-month"></span>
                                </div>
                                <div>
                                    <h4 id="eventTitle" className="mb-1"></h4>
                                    <p id="eventTime" className="text-muted mb-0"><i className="bi bi-clock me-1"></i></p>
                                </div>
                            </div>
                            <p id="eventDescription" className="mb-0"></p>
                            <p id="eventLocation" className="text-muted mt-2 mb-0"><i className="bi bi-geo-alt me-1"></i></p>
                        </div>
                    </div>
                </div>

                
                <div className="upcoming-events mt-5">
                    <h4 className="mb-3"><i className="bi bi-calendar-event me-2"></i>Próximos Eventos</h4>
                    <div id="upcomingEventsList" className="list-group">
                        
                    </div>
                </div>
            </div>
        </div>
    </section>


    
    
    
    <footer id="contacto" className="footer-section">
        <div className="container">
            <div className="row g-4">
                <div className="col-lg-4 col-md-6">
                    <div className="footer-brand mb-3">
                        <img src="assets/logos/RotaryMoE-R_CMYK-C.png" alt="Rotary Club Arica" height="60" className="mb-2" loading="lazy" />
                        <h5>Rotary Club Arica</h5>
                    </div>
                    <p className="footer-text">Somos gente de acción comprometida con el servicio a la comunidad de Arica y el mundo.</p>
                </div>
                <div className="col-lg-4 col-md-6">
                    <h5 className="footer-heading">Enlaces Rápidos</h5>
                    <ul className="footer-links">
                        <li><a href="#hero">Inicio</a></li>
                        <li><a href="#mision-vision">Nosotros</a></li>
                        <li><a href="#galeria">Galería</a></li>
                        <li><a href="#papelito-section">El Papelito</a></li>
                        <li><a href="#calendario">Eventos</a></li>
                        <li><a href="https://www.rotary.org" target="_blank" rel="noopener">Rotary Internacional</a></li>
                    </ul>
                </div>
                <div className="col-lg-4 col-md-12">
                    <h5 className="footer-heading">Contacto</h5>
                    <ul className="footer-contact">
                        <li><i className="bi bi-geo-alt me-2"></i>Arica, Chile</li>
                        <li><i className="bi bi-envelope me-2"></i>contacto@rotaryclubrica.cl</li>
                        <li><i className="bi bi-telephone me-2"></i>+56 9 XXXX XXXX</li>
                    </ul>
                    <div className="footer-social mt-3">
                        <a href="#" aria-label="Facebook"><i className="bi bi-facebook"></i></a>
                        <a href="#" aria-label="Instagram"><i className="bi bi-instagram"></i></a>
                        <a href="#" aria-label="YouTube"><i className="bi bi-youtube"></i></a>
                        <a href="#" aria-label="LinkedIn"><i className="bi bi-linkedin"></i></a>
                    </div>
                </div>
            </div>
            <hr className="footer-divider" />
            <div className="footer-bottom text-center">
                <p className="mb-0">&copy; 2026 Rotary Club Arica. Todos los derechos reservados.</p>
            </div>
        </div>
    </footer>


    
    <button id="backToTop" className="btn-back-to-top" aria-label="Volver arriba">
        <i className="bi bi-arrow-up"></i>
    </button>


    
    
    </>
  );
}