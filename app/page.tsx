import { cookies } from 'next/headers';
import Countdown from "../components/Countdown";
import Gallery from "../components/Gallery";
import Calendar from "../components/Calendar";
import { createClient } from "@/utils/supabase/server";

export default async function Home() {
  // Fetch events server-side so the calendar always shows current data from Supabase
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { data: events } = await supabase
    .from('events')
    .select('date, title, time, description, location, image_url, link')
    .order('date', { ascending: true });

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
                    <li className="nav-item ms-lg-2 d-flex align-items-center">
                        <a className="nav-link" href="/admin" aria-label="Administración" title="Administración">
                            <i className="bi bi-gear" style={{ opacity: 0.5, fontSize: '0.9rem' }}></i>
                        </a>
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

    
    
    
    <Countdown />


    
    
    
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


    
    
    
    <Gallery />



    
    
    
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

    
    
    
    <Calendar events={events ?? []} />


    
    
    
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
                        <a href="/admin" aria-label="Administración" title="Administración" className="ms-3">
                            <i className="bi bi-gear" style={{ opacity: 0.3 }}></i>
                        </a>
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