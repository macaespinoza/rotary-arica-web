/* ==========================================================================
   ROTARY CLUB ARICA - JAVASCRIPT PRINCIPAL
   Funcionalidad: Navbar scroll, Galería, Calendario interactivo, Back-to-top
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function () {

    // =========================================================================
    // 0. COUNTDOWN: Migrated to React Component

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
    // 6. CALENDARIO INTERACTIVO: Migrated to React Component

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
